"use client";

import type React from "react";

import Image from "next/image";
import { Buttons } from "./ui/Buttons";
import { useRouter } from "next/navigation";
import { useState } from "react";
import toast from "react-hot-toast";
import { Eye, X } from "lucide-react";
import {
    getCreatorReview,
    updateApplicantStatus,
} from "@/src/lib/requests/recruiterApi";

interface CandidateInfoPanelProps {
    candidate: {
        id: string;
        name: string;
        role: string;
        location: string;
        email: string;
        avatar: string;
        skillLevel:
        | "Beginner"
        | "Intermediate"
        | "Mid-level"
        | "Professional"
        | "Expert";
        industry?: string;
        cover_letter?: string;
        profile?: any;
        status?: string;
    } | null;
    jobId: string | null;
    recruiterId: string | null;
    onStatusUpdate: (status: string) => void;
    onViewCV: (cvUrl: string) => void;
    onChat?: () => void;
    chatLoading?: boolean;
}

const CVViewerModal = ({
    isOpen,
    onClose,
    candidateData,
}: {
    isOpen: boolean;
    onClose: () => void;
    candidateData: any;
}) => {
    if (!isOpen || !candidateData) return null;

    const formatDate = (dateString: string): string => {
        if (!dateString) return "Present";
        try {
            const date = new Date(dateString);
            if (isNaN(date.getTime())) return "Present";
            return date.toLocaleDateString("en-US", {
                year: "numeric",
                month: "long",
                day: "numeric",
            });
        } catch {
            return "Present";
        }
    };

    const transformedData = transformCreatorDataToFormData(candidateData);

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-2 sm:p-4">
            <div className="bg-white rounded-lg w-full h-[70vh] max-h-[80vh] sm:max-w-4xl sm:max-h-[90vh] overflow-hidden flex flex-col relative">

                {/* Floating Close Button */}
                <button
                    onClick={onClose}
                    className="absolute top-2 right-2 sm:top-3 sm:right-3 md:top-4 md:right-4 z-50 p-1 sm:p-2 hover:bg-gray-200 rounded-full transition-colors"
                >
                    <X size={20} className="sm:w-6 sm:h-6 md:w-7 md:h-7" />
                </button>

                <div className="flex justify-between items-center p-3 sm:p-4 md:p-5 border-b bg-gray-50 shrink-0">
                    <h2 className="text-lg sm:text-xl md:text-2xl font-bold">CV Preview</h2>
                </div>

                <div className="flex-1 bg-gray-100 p-2 sm:p-4 md:p-6 overflow-y-auto">
                    <div className="bg-white max-w-[210mm] mx-auto min-h-[297mm] shadow-lg">
                        {/* Header */}
                        <div className="bg-[#0A1754] text-white p-6 sm:p-8 md:p-10">
                            <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-center mb-2">
                                {transformedData.fullName}
                            </h1>
                            <div className="text-sm sm:text-base md:text-lg text-center">
                                {transformedData.email}{" "}
                                {transformedData.phone && `| ${transformedData.phone}`}{" "}
                                {transformedData.location && `| ${transformedData.location}`}
                            </div>
                        </div>

                        {/* Content */}
                        <div className="p-6 sm:p-8 md:p-10">
                            {transformedData.professionalBrief && (
                                <div className="mb-6">
                                    <h2 className="text-base sm:text-lg md:text-xl font-bold text-[#0A1754] mb-3 border-b-2 border-[#0A1754] pb-1 inline-block">
                                        PROFESSIONAL BRIEF
                                    </h2>
                                    <p className="text-sm md:text-base leading-relaxed text-[#0A1754]">
                                        {transformedData.professionalBrief}
                                    </p>
                                </div>
                            )}

                            {transformedData.education &&
                                transformedData.education.length > 0 && (
                                    <div className="mb-6">
                                        <h2 className="text-base sm:text-lg md:text-xl font-bold text-[#0A1754] mb-3 border-b-2 border-[#0A1754] pb-1 inline-block">
                                            EDUCATION
                                        </h2>
                                        {transformedData.education.map(
                                            (edu: any, index: number) => (
                                                <div
                                                    key={index}
                                                    className="mb-4 pb-3 border-b border-gray-200 last:border-b-0"
                                                >
                                                    <h3 className="font-semibold text-sm md:text-base text-[#0A1754]">
                                                        {edu.institution}
                                                    </h3>
                                                    <p className="text-sm md:text-base text-gray-600">{edu.degree}</p>
                                                    <p className="text-xs md:text-sm text-gray-500 italic">
                                                        {formatDate(edu.started)} - {formatDate(edu.ended)}
                                                    </p>
                                                </div>
                                            )
                                        )}
                                    </div>
                                )}

                            {transformedData.experience &&
                                transformedData.experience.length > 0 && (
                                    <div className="mb-6">
                                        <h2 className="text-base sm:text-lg md:text-xl font-bold text-[#0A1754] mb-3 border-b-2 border-[#0A1754] pb-1 inline-block">
                                            WORK EXPERIENCE
                                        </h2>
                                        {transformedData.experience.map(
                                            (exp: any, index: number) => (
                                                <div
                                                    key={index}
                                                    className="mb-4 pb-3 border-b border-gray-200 last:border-b-0"
                                                >
                                                    <h3 className="font-semibold text-sm md:text-base text-[#0A1754]">
                                                        {exp.role}
                                                    </h3>
                                                    <p className="text-sm md:text-base text-gray-600">{exp.company}</p>
                                                    <p className="text-xs md:text-sm text-gray-500 italic mb-2">
                                                        {formatDate(exp.started)} - {formatDate(exp.ended)}
                                                    </p>
                                                    {exp.description && (
                                                        <p className="text-sm md:text-base">{exp.description}</p>
                                                    )}
                                                </div>
                                            )
                                        )}
                                    </div>
                                )}

                            {transformedData.skills && transformedData.skills.length > 0 && (
                                <div className="mb-6">
                                    <h2 className="text-base sm:text-lg md:text-xl font-bold text-[#0A1754] mb-3 border-b-2 border-[#0A1754] pb-1 inline-block">
                                        SKILLS
                                    </h2>
                                    <div className="flex flex-wrap gap-2">
                                        {transformedData.skills.map(
                                            (skill: string, index: number) => (
                                                <span
                                                    key={index}
                                                    className="bg-gray-100 text-[#0A1754] px-3 py-1 rounded-full text-xs md:text-sm font-medium"
                                                >
                                                    {skill}
                                                </span>
                                            )
                                        )}
                                    </div>
                                </div>
                            )}

                            {transformedData.other_skills &&
                                transformedData.other_skills.length > 0 && (
                                    <div className="mb-6">
                                        <h2 className="text-base sm:text-lg md:text-xl font-bold text-[#0A1754] mb-3 border-b-2 border-[#0A1754] pb-1 inline-block">
                                            OTHER SKILLS
                                        </h2>
                                        <div className="flex flex-wrap gap-2">
                                            {transformedData.other_skills.map(
                                                (skill: string, index: number) => (
                                                    <span
                                                        key={index}
                                                        className="bg-gray-100 text-[#0A1754] px-3 py-1 rounded-full text-xs md:text-sm font-medium"
                                                    >
                                                        {skill}
                                                    </span>
                                                )
                                            )}
                                        </div>
                                    </div>
                                )}

                            {transformedData.certifications &&
                                transformedData.certifications.length > 0 && (
                                    <div className="mb-6">
                                        <h2 className="text-base sm:text-lg md:text-xl font-bold text-[#0A1754] mb-3 border-b-2 border-[#0A1754] pb-1 inline-block">
                                            CERTIFICATIONS
                                        </h2>
                                        {transformedData.certifications.map(
                                            (cert: string, index: number) => (
                                                <p
                                                    key={index}
                                                    className="bg-gray-100 text-[#0A1754] text-xs md:text-sm mb-1"
                                                >
                                                    • {cert}
                                                </p>
                                            )
                                        )}
                                    </div>
                                )}

                            {transformedData.links &&
                                (transformedData.links.linkedin ||
                                    transformedData.links.twitter ||
                                    transformedData.links.instagram ||
                                    transformedData.links.tiktok) && (
                                    <div className="mb-6">
                                        <h2 className="text-base sm:text-lg md:text-xl font-bold text-[#0A1754] mb-3 border-b-2 border-[#0A1754] pb-1 inline-block">
                                            SOCIAL LINKS
                                        </h2>
                                        <div className="bg-gray-100 text-[#0A1754] p-3 md:p-4 rounded">
                                            {transformedData.links.linkedin && (
                                                <p className="text-xs md:text-sm mb-1">
                                                    LinkedIn: {transformedData.links.linkedin}
                                                </p>
                                            )}
                                            {transformedData.links.twitter && (
                                                <p className="text-xs md:text-sm mb-1">
                                                    Twitter: {transformedData.links.twitter}
                                                </p>
                                            )}
                                            {transformedData.links.instagram && (
                                                <p className="text-xs md:text-sm mb-1">
                                                    Instagram: {transformedData.links.instagram}
                                                </p>
                                            )}
                                            {transformedData.links.tiktok && (
                                                <p className="text-xs md:text-sm mb-1">
                                                    TikTok: {transformedData.links.tiktok}
                                                </p>
                                            )}
                                        </div>
                                    </div>
                                )}
                        </div>
                    </div>
                </div>

                <div className="p-3 sm:p-4 md:p-5 border-t bg-gray-50 flex flex-col sm:flex-row justify-end gap-2 shrink-0">
                    <button
                        onClick={onClose}
                        className="bg-gray-300 text-gray-700 px-4 py-2 md:px-6 md:py-3 rounded-md hover:bg-gray-400 transition-colors text-sm md:text-base cursor-pointer"
                    >
                        Close
                    </button>
                </div>
            </div>
        </div>
    );
};

const transformCreatorDataToFormData = (candidate: any): any => {
    const resume = candidate.resume || {};
    const profile = candidate.profile || {};

    return {
        fullName: resume.full_name || profile.full_name || "",
        email: resume.email || profile.email || "",
        phone: resume.phone_number || profile.phone_number || "",
        location:
            resume.location ||
            (profile.location
                ? `${profile.location.lga}, ${profile.location.state}`
                : ""),
        professionalBrief: resume.brief || profile.bio || "",
        education: (resume.education || []).map((edu: any) => ({
            institution: edu.school || "",
            degree: edu.course || "",
            field: "",
            started: edu.started || "",
            ended: edu.ended || "",
        })),
        experience: (resume.experience || []).map((exp: any) => ({
            role: exp.job_title || "",
            company: exp.location || "",
            description: exp.contribution || "",
            started: exp.started || "",
            ended: exp.ended || "",
        })),
        links: resume.links || {
            linkedin: "",
            twitter: "",
            instagram: "",
            tiktok: "",
        },
        skills: resume.skills || [],
        other_skills: resume.other_skills || [],
        certifications: resume.certifications || [],
    };
};

export function CandidateInfoPanel({
    candidate,
    jobId,
    onStatusUpdate,
    onChat,
    chatLoading = false,
}: CandidateInfoPanelProps) {
    const router = useRouter();
    const [isDownloading, setIsDownloading] = useState(false);
    const [isUpdatingStatus, setIsUpdatingStatus] = useState(false);
    const [currentStatus, setCurrentStatus] = useState(
        candidate?.status || "PENDING"
    );
    const [isCVModalOpen, setIsCVModalOpen] = useState(false);
    const [selectedCandidateData, setSelectedCandidateData] = useState<any>(null);

    const handleViewProfile = (candidateId: string, e: React.MouseEvent) => {
        e.stopPropagation();
        router.push(`/recruiter-profile-card/${candidateId}`);
    };

    const handleViewCV = async (candidateId: string, e: React.MouseEvent) => {
        e.stopPropagation();

        if (isDownloading) return;

        setIsDownloading(true);
        try {
            const creatorData = await getCreatorReview(candidateId);

            if (
                !creatorData.data.page_data ||
                creatorData.data.page_data.length === 0
            ) {
                throw new Error("Candidate not found");
            }

            const candidateData = creatorData.data.page_data[0];
            setSelectedCandidateData(candidateData);
            setIsCVModalOpen(true);
        } catch (error) {
            toast.error(
                error instanceof Error
                    ? error.message
                    : "Failed to view CV. Please try again."
            );
        } finally {
            setIsDownloading(false);
        }
    };

    const handleStatusUpdate = async (status: string) => {
        if (!candidate || !jobId) return;

        setIsUpdatingStatus(true);
        try {
            const result = await updateApplicantStatus({
                job_id: jobId,
                creator_id: candidate.id,
                status: status as
                    | "PENDING"
                    | "SHORTLISTED"
                    | "NOT_QUALIFIED"
                    | "SELECTED",
            });

            setCurrentStatus(status);
            onStatusUpdate(status);
            toast.success(result.message || "Status updated successfully!");
        } catch (error) {
            console.error("Error updating status:", error);
            toast.error(
                error instanceof Error
                    ? error.message
                    : "Error updating status. Please try again."
            );
        } finally {
            setIsUpdatingStatus(false);
        }
    };

    const getStatusMessage = () => {
        switch (currentStatus) {
            case "SHORTLISTED":
                return {
                    message: "Applicant has been shortlisted",
                    bgColor: "bg-green-100",
                    borderColor: "border-green-400",
                    textColor: "text-green-700",
                };
            case "NOT_QUALIFIED":
                return {
                    message: "Applicant has been marked as not qualified",
                    bgColor: "bg-red-100",
                    borderColor: "border-red-400",
                    textColor: "text-red-700",
                };
            case "SELECTED":
                return {
                    message: "Applicant has been selected",
                    bgColor: "bg-green-100",
                    borderColor: "border-green-400",
                    textColor: "text-green-700",
                };
            case "PENDING":
            default:
                return null;
        }
    };

    const isFinalStatus = ["SHORTLISTED", "NOT_QUALIFIED", "SELECTED"].includes(
        currentStatus
    );

    if (!candidate) {
        return (
            <div className="w-full bg-white border-l border-gray-200 p-6 flex items-center justify-center h-full">
                <div className="text-center text-gray-500 text-sm md:text-base lg:text-lg">
                    Select a candidate to view details
                </div>
            </div>
        );
    }

    const statusMessage = getStatusMessage();

    return (
        <div className="w-full bg-white lg:border-l border-gray-200 flex flex-col h-full max-md:my-10">
            <CVViewerModal
                isOpen={isCVModalOpen}
                onClose={() => setIsCVModalOpen(false)}
                candidateData={selectedCandidateData}
            />

            <div className="bg-[#0A1754] text-white p-3 sm:p-4 md:p-5 lg:max-w-md mb-2 sm:mb-4">
                <h2 className="text-base sm:text-lg md:text-xl font-semibold font-raleway">
                    Candidate Information
                </h2>
            </div>

            <div className="p-3 sm:p-4 md:p-5 lg:p-6 bg-gray-100 grow lg:max-w-2xl flex flex-col">
                <div className="flex flex-col sm:flex-row items-center mb-4 sm:mb-6 md:mb-8 relative">
                    <div className="relative mb-4 sm:mb-0 sm:mr-4">
                        <Image
                            src={candidate.avatar || "/assets/creative.svg"}
                            alt={candidate.name}
                            width={120}
                            height={120}
                            className="rounded-full object-cover w-14 h-14 md:w-20 md:h-20 lg:w-24 lg:h-24"
                            onError={(e) => {
                                e.currentTarget.src = "/assets/creative.svg";
                            }}
                        />
                    </div>
                    <div className="flex-1 font-raleway text-center sm:text-left">
                        <h3 className="text-xl lg:text-2xl xl:text-3xl font-semibold text-gray-900">
                            {candidate.name}
                        </h3>
                        <p className="text-xs sm:text-sm md:text-base lg:text-lg text-gray-600 font-light">
                            {candidate.role}/{candidate.location}
                        </p>
                        {candidate.industry && (
                            <p className="text-xs sm:text-sm md:text-base text-gray-600 font-light mt-1">
                                Industry: {candidate.industry}
                            </p>
                        )}
                    </div>
                    <span className="absolute top-0 right-0 sm:static sm:ml-2 md:ml-4 text-white bg-[#0A1754] inline-flex items-center justify-center px-2 py-1 sm:px-4 sm:py-2 md:px-5 md:py-2 lg:w-24 lg:px-6 lg:py-1 text-sm sm:text-base md:text-lg lg:text-xl font-ramaraja font-medium rounded sm:rounded-none">
                        <span className="hidden sm:inline">{candidate.skillLevel}</span>
                        <span className="sm:hidden">{candidate.skillLevel}</span>
                    </span>
                </div>
                <div className="border-b-2 sm:border-b-4 border-black"></div>

                <div className="mb-4 sm:mb-6 md:mb-8 mt-2 sm:mt-3 md:mt-4">
                    <div className="flex flex-col sm:flex-row sm:gap-10 md:gap-12 sm:items-center mb-2 font-raleway">
                        <span className="text-sm sm:text-base md:text-lg font-bold text-gray-700">
                            Email:
                        </span>
                        <span className="text-sm sm:text-base md:text-lg text-gray-900 font-medium break-all sm:break-normal">
                            {candidate.email}
                        </span>
                    </div>
                    <div className="border-b border-black" />
                </div>

                <div className="grid grid-cols-2 gap-3 sm:gap-4 md:gap-6 lg:gap-10 mb-4 sm:mb-6">
                    <Buttons
                        variant="primary"
                        size="lg"
                        onClick={(e) => handleViewProfile(candidate.id, e)}
                        className="cursor-pointer text-xs sm:text-sm md:text-base"
                    >
                        View Profile
                    </Buttons>
                    <Buttons
                        variant="primary"
                        size="lg"
                        onClick={(e) => handleViewCV(candidate.id, e)}
                        className="cursor-pointer flex items-center justify-center text-xs sm:text-sm md:text-base"
                    >
                        <Eye size={16} className="mr-1 sm:mr-2 md:w-5 md:h-5" />
                        {isDownloading ? "Loading..." : "View CV"}
                    </Buttons>
                </div>

                <div className="grow flex flex-col min-h-0">
                    <div className="mb-3 sm:mb-4 md:mb-5 flex items-center justify-center shrink-0">
                        <h4 className="text-base sm:text-lg md:text-xl lg:text-2xl font-bold text-[#0A1754] font-raleway">
                            Cover Letter
                        </h4>
                    </div>

                    <div className="grow min-h-[120px] sm:min-h-[150px] md:min-h-[180px] lg:min-h-[220px] mb-4 sm:mb-6 md:mb-8 p-3 sm:p-4 md:p-5 bg-white rounded-lg border border-gray-300 overflow-y-auto">
                        {candidate.cover_letter ? (
                            <p className="text-xs sm:text-sm md:text-base lg:text-lg text-gray-800 whitespace-pre-wrap leading-relaxed">
                                {candidate.cover_letter}
                            </p>
                        ) : (
                            <div className="flex items-center justify-center h-full">
                                <p className="text-xs sm:text-sm md:text-base text-gray-500 text-center">
                                    No cover letter provided
                                </p>
                            </div>
                        )}
                    </div>

                    {isFinalStatus && statusMessage ? (
                        <div
                            className={`${statusMessage.bgColor} ${statusMessage.borderColor} ${statusMessage.textColor} px-4 py-3 md:px-5 md:py-4 rounded mb-4 sm:mb-6`}
                        >
                            <p className="text-center font-semibold text-sm md:text-base">
                                {statusMessage.message}
                            </p>
                        </div>
                    ) : (
                        <div className="grid grid-cols-2 gap-3 sm:gap-4 md:gap-6 mb-4 sm:mb-6">
                            <Buttons
                                variant="primary"
                                size="lg"
                                onClick={() => handleStatusUpdate("NOT_QUALIFIED")}
                                className="bg-red-500 hover:bg-red-600 text-white font-semibold text-xs sm:text-sm md:text-base"
                            >
                                {isUpdatingStatus ? "Updating..." : "Not Qualified"}
                            </Buttons>
                            <Buttons
                                variant="primary"
                                size="lg"
                                onClick={() => handleStatusUpdate("SHORTLISTED")}
                                className="bg-green-500 hover:bg-green-600 text-white font-semibold text-xs sm:text-sm md:text-base"
                            >
                                {isUpdatingStatus ? "Updating..." : "Shortlist"}
                            </Buttons>
                        </div>
                    )}
                </div>

                <div className="mt-4 sm:mt-6 md:mt-8 lg:mt-10 mx-auto w-full sm:w-auto max-sm:mb-10 flex justify-center">
                    <Buttons variant="primary" size="fullWidth" onClick={onChat} className="text-center text-sm md:text-base">
                        {chatLoading ? "Starting Chat..." : "Chat Up"}
                    </Buttons>
                </div>
            </div>
        </div>
    );
}
