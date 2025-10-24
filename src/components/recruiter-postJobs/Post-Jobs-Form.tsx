"use client";
import { useState } from "react";
import type React from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { createJobPost } from "@/src/lib/requests/jobApi";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";

const normalizeSalaryRange = (input: string): string => {
    if (!input) return "";

    const cleaned = input
        .replace(/,/g, '') // Remove commas
        .replace(/\s/g, '') // Remove spaces
        .replace(/[₦NGNnng]/g, '') // Remove currency symbols
        .replace(/-/g, '/') // Convert dashes to slashes
        .replace(/[^\d/]/g, ''); // Remove any non-digit/non-slash characters

    // Handle cases where user might have multiple slashes
    const parts = cleaned.split('/').filter(part => part !== '');

    if (parts.length === 2) {
        return `${parts[0]}/${parts[1]}`;
    } else if (parts.length === 1) {
        // If only one number provided, assume it's a single salary (not range)
        return parts[0];
    } else {
        // If more than 2 parts, take first two
        return `${parts[0]}/${parts[1]}`;
    }
};

const experienceOptions = [
    { label: 'Beginner (0-1 years)', value: '1 years' },
    { label: 'Intermediate (2 years)', value: '2 years' },
    { label: 'Mid-level (3 years)', value: '3 years' },
    { label: 'Professional (4-6 years)', value: '4 years' },
    { label: 'Expert (7-15 years)', value: '7 years' },
];

export function PostJobForm() {
    const router = useRouter();
    const [formData, setFormData] = useState({
        jobTitle: "",
        whoLookingFor: "",
        responsibilities: "",
        salaryRange: "",
        location: "",
        workMode: "",
        experience: "",
        technicalSkills1: "",
        technicalSkills2: "",
        deadline: "",
    });
    const [loading, setLoading] = useState(false);

    const handleChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
    ) => {
        const { id, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [id]: value,
        }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            // Normalize salary range input
            const normalizedSalaryRange = normalizeSalaryRange(formData.salaryRange);

            // Convert deadline to ISO 8601 string with UTC (Z)
            let formattedDeadline = "";
            if (formData.deadline) {
                const date = new Date(formData.deadline);
                formattedDeadline = date.toISOString();
            }

            // Parse text input to arrays by splitting on newlines
            const parseTextToArray = (input: string): string[] => {
                if (!input || input.trim() === '') return [];
                return input
                    .split('\n')
                    .map(line => line.trim())
                    .filter(Boolean);
            };

            const payload = {
                title: formData.jobTitle,
                description: formData.whoLookingFor,
                responsibilities: parseTextToArray(formData.responsibilities),
                salary_range: formData.salaryRange ? normalizedSalaryRange : "",
                work_mode: formData.workMode,
                experience: formData.experience,
                location: formData.location,
                technical: parseTextToArray(formData.technicalSkills1),
                soft: parseTextToArray(formData.technicalSkills2),
                deadline: formattedDeadline,
            };


            const response = await createJobPost(payload);
            toast.success(response.message || "Job posted successfully!");
            setFormData({
                jobTitle: "",
                whoLookingFor: "",
                responsibilities: "",
                salaryRange: "",
                location: "",
                workMode: "",
                experience: "",
                technicalSkills1: "",
                technicalSkills2: "",
                deadline: "",
            });
            router.push("/recruiter-dashboard");
        } catch (err: unknown) {
            if (err instanceof Error) {
                toast.error(err.message || "Failed to post job.");
            } else {
                toast.error("An unknown error occurred.");
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <main className="w-full max-w-[1140px] mx-auto px-4 sm:px-6 py-6">
            <form
                className="flex flex-col gap-6 font-raleway"
                onSubmit={handleSubmit}
            >
                {/* Job Title */}
                <div>
                    <label
                        htmlFor="jobTitle"
                        className="block text-sm font-medium text-[#0A1754] mb-2"
                    >
                        Job Title
                    </label>
                    <Input
                        id="jobTitle"
                        placeholder="Enter job title"
                        className="w-full p-3 border rounded-md bg-[#EDEDED] text-black"
                        value={formData.jobTitle}
                        onChange={handleChange}
                        required
                    />
                </div>
                {/* Who you're looking for (description) */}
                <div>
                    <label
                        htmlFor="whoLookingFor"
                        className="block text-sm font-medium text-[#0A1754] mb-2"
                    >
                        Who you are looking for? (Description)
                    </label>
                    <textarea
                        id="whoLookingFor"
                        rows={6}
                        placeholder="Describe the ideal candidate for this position"
                        className="w-full p-3 border rounded-md bg-[#EDEDED] text-black"
                        value={formData.whoLookingFor}
                        onChange={handleChange}
                        required
                    />
                </div>
                {/* Key Responsibilities */}
                <div>
                    <label
                        htmlFor="responsibilities"
                        className="block text-sm font-medium text-[#0A1754] mb-2"
                    >
                        Key Responsibilities
                    </label>
                    <textarea
                        id="responsibilities"
                        rows={6}
                        placeholder="Enter each responsibility on a new line"
                        className="w-full p-3 border rounded-md bg-[#EDEDED] text-black"
                        value={formData.responsibilities}
                        onChange={handleChange}
                    />
                    <p className="text-sm text-gray-500 mt-1">Enter each responsibility on a separate line.</p>
                </div>
                {/* Salary */}
                <div>
                    <label
                        htmlFor="salaryRange"
                        className="block text-sm font-medium text-[#0A1754] mb-2"
                    >
                        Salary Range
                    </label>
                    <Input
                        id="salaryRange"
                        placeholder="e.g., 200,000-300,000 or 200000/300000 or NGN200,000 - NGN300,000"
                        className="w-full p-3 border rounded-md bg-[#EDEDED] text-black"
                        value={formData.salaryRange}
                        onChange={handleChange}
                    />
                    <p className="text-sm text-gray-500 mt-1">
                        Accepts formats like: 200,000-300,000, 200000/300000, NGN200,000 - NGN300,000
                    </p>
                </div>
                {/* Deadline */}
                <div>
                    <label
                        htmlFor="deadline"
                        className="block text-sm font-medium text-[#0A1754] mb-2"
                    >
                        Job Deadline
                    </label>
                    <Input
                        id="deadline"
                        type="datetime-local"
                        placeholder="Select application deadline"
                        className="w-full p-3 border rounded-md bg-[#EDEDED] text-black"
                        value={formData.deadline}
                        onChange={handleChange}
                    />
                </div>
                {/* Location */}
                <div>
                    <label
                        htmlFor="location"
                        className="block text-sm font-medium text-[#0A1754] mb-2"
                    >
                        Location
                    </label>
                    <Input
                        id="location"
                        placeholder="e.g., Lagos State, Nigeria"
                        className="w-full p-3 border rounded-md bg-[#EDEDED] text-black"
                        value={formData.location}
                        onChange={handleChange}
                    />
                </div>
                {/* Work Mode */}
                <div>
                    <label
                        htmlFor="workMode"
                        className="block text-sm font-medium text-[#0A1754] mb-2"
                    >
                        Work Mode
                    </label>
                    <Input
                        id="workMode"
                        placeholder="e.g., Remote, Hybrid, On-site"
                        className="w-full p-3 border rounded-md bg-[#EDEDED] text-black"
                        value={formData.workMode}
                        onChange={handleChange}
                    />
                </div>
                {/* Experience Level */}
                <div>
                    <label
                        htmlFor="experience"
                        className="block text-sm font-medium text-[#0A1754] mb-2"
                    >
                        Experience Level
                    </label>
                    <select
                        id="experience"
                        className="w-full p-3 border rounded-md bg-[#EDEDED] text-black"
                        value={formData.experience}
                        onChange={handleChange}
                    >
                        <option value="">Select experience level</option>
                        {experienceOptions.map((option) => (
                            <option key={option.value} value={option.label}>
                                {option.label}
                            </option>
                        ))}
                    </select>
                </div>
                {/* Technical Skills */}
                <div>
                    <label
                        htmlFor="technicalSkills1"
                        className="block text-sm font-medium text-[#0A1754] mb-2"
                    >
                        Technical / Hard Skills
                    </label>
                    <textarea
                        id="technicalSkills1"
                        placeholder="Enter each skill on a new line"
                        rows={6}
                        className="w-full p-3 border rounded-md bg-[#EDEDED] text-black"
                        value={formData.technicalSkills1}
                        onChange={handleChange}
                    />
                    <p className="text-sm text-gray-500 mt-1">Enter each skill on a separate line.</p>
                </div>
                {/* Additional Skills (Soft Skills) */}
                <div>
                    <label
                        htmlFor="technicalSkills2"
                        className="block text-sm font-medium text-[#0A1754] mb-2"
                    >
                        Soft Skills
                    </label>
                    <textarea
                        id="technicalSkills2"
                        placeholder="Enter each skill on a new line"
                        rows={6}
                        className="w-full p-3 border rounded-md bg-[#EDEDED] text-black"
                        value={formData.technicalSkills2}
                        onChange={handleChange}
                    />
                    <p className="text-sm text-gray-500 mt-1">Enter each skill on a separate line.</p>
                </div>
                {/* Submission Feedback */}
                {loading && (
                    <p className="text-center text-[#0A1754]">Posting job...</p>
                )}

                <div className="flex justify-end mt-4">
                    <Button
                        type="submit"
                        className="w-full sm:w-auto bg-[#0A1754] text-white px-6 sm:px-12 py-3 font-raleway font-bold"
                        disabled={loading}
                    >
                        {loading ? "Posting..." : "Post Job"}
                    </Button>
                </div>
            </form>
        </main>
    );
}