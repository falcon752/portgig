/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";

import { useState, useEffect, useRef, type ChangeEvent } from "react";
import { useRouter } from "next/navigation";
import { Upload, X, Share2 } from "lucide-react";
import Image from "next/image";
import { getImageUrl } from "@/src/utils/image-url";
import {
    saveWriterPortfolio,
    getPortfolio,
    uploadAllMedia,
} from "@/src/api/portfolio";
import toast from "react-hot-toast";
import { revalidateTemplate4Page } from "@/src/app/Actions";
import Cookies from "universal-cookie";
import type {
    WriterFormData,
    PortfolioApiPayload,
    GetPortfolioResponse,
    WriterTemplateSpecific,
} from "@/types/portfolio";

// Local type guard for WriterTemplateSpecific
function isWriterTemplateSpecific(
    templateSpecific: any,
    templateType: string
): templateSpecific is WriterTemplateSpecific {
    return templateType === "WRITER" && templateSpecific != null;
}

export default function WriterFormFixed() {
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(true);
    const [isSavingForm, setIsSavingForm] = useState(false);
    const [isUploadingMedia, setIsUploadingMedia] = useState(false);
    const [isPreviewing, setIsPreviewing] = useState(false);
    const [isSharing, setIsSharing] = useState(false);

    const [formData, setFormData] = useState<WriterFormData>({
        displayName: "",
        jobTitles: "",
        location: "",
        headShot: { previewUrl: null, file: null },
        aboutMe: "",
        otherServices: Array(6).fill(""),
        genericPortfolioFiles: Array(6).fill({
            image: { previewUrl: null, file: null },
            name: "",
            link: "",
        }),
        case_study: "",
        whatYouGet: "",
        linkedinLink: "",
        mediumLink: "",
    });

    const isAnyLoading =
        isLoading || isSavingForm || isUploadingMedia || isPreviewing || isSharing;

    // Refs for file inputs
    const headShotInputRef = useRef<HTMLInputElement | null>(null);
    const portfolioInputRefs = useRef<(HTMLInputElement | null)[]>(
        Array(6).fill(null)
    );

    useEffect(() => {
        const loadPortfolioData = async () => {
            try {
                const cookies = new Cookies();
                const clientAccessToken = cookies.get("access_token");
                const userid = cookies.get("userId");

                if (!clientAccessToken) {
                    toast.error("Please log in to load your portfolio.");
                    return;
                }

                if (!userid) {
                    toast.error("User ID not found. Please log in.");
                    return;
                }

                const responseData: GetPortfolioResponse = await getPortfolio(
                    clientAccessToken,
                    userid
                );

                const portfolio =
                    responseData?.data?.user?.data?.portfolio ||
                    responseData?.data?.portfolio ||
                    null;

                if (portfolio && portfolio.template_type === "WRITER") {
                    const templateSpecific = portfolio.template_specific;

                    if (
                        isWriterTemplateSpecific(templateSpecific, portfolio.template_type)
                    ) {
                        setFormData({
                            displayName: portfolio.display_name || "",
                            jobTitles: portfolio.job_titles?.join(", ") || "",
                            location: portfolio.location || "",
                            headShot: { previewUrl: getImageUrl(portfolio.head_shot) || null, file: null },
                            aboutMe: portfolio.about_me || "",
                            otherServices: [
                                ...(portfolio.other_services || []),
                                ...Array(
                                    Math.max(0, 6 - (portfolio.other_services?.length || 0))
                                ).fill(""),
                            ].slice(0, 6),
                            genericPortfolioFiles: [
                                ...(portfolio.files?.map((file) => ({
                                    image: { previewUrl: getImageUrl(file.image) || null, file: null },
                                    name: file.title || "",
                                    link: file.link || "",
                                })) || []),
                                ...Array(Math.max(0, 6 - (portfolio.files?.length || 0))).fill({
                                    image: { previewUrl: null, file: null },
                                    name: "",
                                    link: "",
                                }),
                            ].slice(0, 6),
                            case_study:
                                templateSpecific.writer?.case_study || portfolio.mission || "",
                            whatYouGet: portfolio.what_you_get_working_with_me || "",
                            linkedinLink: portfolio.social?.linkedin || "",
                            mediumLink: portfolio.social?.medium || "",
                        });
                    } else {
                        toast.error("Invalid portfolio data structure.");
                    }
                } else {
                    toast("No existing writer portfolio found. Starting fresh.");
                }
            } catch (error: unknown) {
                if (error instanceof Error) {
                    toast.error(`Failed to load portfolio: ${error.message}`);
                } else {
                    toast.error("Failed to load existing portfolio data.");
                }
            } finally {
                setIsLoading(false);
            }
        };
        loadPortfolioData();
    }, []);

    const handleInputChange = (field: keyof WriterFormData, value: string) => {
        setFormData((prev) => ({ ...prev, [field]: value }));
    };

    const handleServiceChange = (index: number, value: string) => {
        setFormData((prev) => ({
            ...prev,
            otherServices: (prev.otherServices ?? []).map((service, i) =>
                i === index ? value : service
            ),
        }));
    };

    const handlePortfolioChange = (
        index: number,
        field: "name" | "link",
        value: string
    ) => {
        setFormData((prev) => ({
            ...prev,
            genericPortfolioFiles: prev.genericPortfolioFiles.map((item, i) =>
                i === index ? { ...item, [field]: value } : item
            ),
        }));
    };

    const handleImageFileChange = (
        event: ChangeEvent<HTMLInputElement>,
        type: "headShot" | "portfolio",
        index?: number
    ) => {
        const file = event.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                const previewUrl = reader.result as string;
                setFormData((prev) => {
                    if (type === "headShot") {
                        return { ...prev, headShot: { previewUrl, file } };
                    } else if (type === "portfolio" && index !== undefined) {
                        return {
                            ...prev,
                            genericPortfolioFiles: prev.genericPortfolioFiles.map((item, i) =>
                                i === index ? { ...item, image: { previewUrl, file } } : item
                            ),
                        };
                    }
                    return prev;
                });
            };
            reader.readAsDataURL(file);
        }
    };

    const handleRemoveImage = (
        type: "headShot" | "portfolio",
        index?: number
    ) => {
        setFormData((prev) => {
            if (type === "headShot") {
                return { ...prev, headShot: { previewUrl: null, file: null } };
            } else if (type === "portfolio" && index !== undefined) {
                return {
                    ...prev,
                    genericPortfolioFiles: prev.genericPortfolioFiles.map((item, i) =>
                        i === index
                            ? { ...item, image: { previewUrl: null, file: null } }
                            : item
                    ),
                };
            }
            return prev;
        });
        toast(
            `${type === "headShot" ? "Headshot" : `Portfolio image ${index! + 1}`
            } removed.`,
            {
                icon: "🗑️",
            }
        );
    };

    const handleFontColorClick = () => {
        router.push("/edit-font");
    };

    const handleShare = async () => {
        setIsSharing(true);
        try {
            const cookies = new Cookies();
            const userId = cookies.get("userId");
            const portfolioUrl = `${window.location.origin}/writer-portfolio/4?creatorId=${userId}`;
            await navigator.clipboard.writeText(portfolioUrl);
            toast.success("Portfolio URL copied to clipboard!");
        } catch {
            toast.error("Failed to copy portfolio URL.");
        } finally {
            setIsSharing(false);
        }
    };

    const handleSave = async () => {
        setIsSavingForm(true);
        setIsUploadingMedia(true);
        toast.loading("Saving portfolio...", { id: "saveToast" });
        try {
            const cookies = new Cookies();
            const authToken = cookies.get("access_token");
            if (!authToken) {
                toast.error("Authentication token not found. Please log in.", {
                    id: "saveToast",
                });
                return;
            }

            const filesToUpload: File[] = [];
            const fileMap = new Map<File, string>();

            if (formData.headShot.file) {
                filesToUpload.push(formData.headShot.file);
            }
            formData.genericPortfolioFiles.forEach((item) => {
                if (item.image.file) {
                    filesToUpload.push(item.image.file);
                }
            });

            let uploadedUrls: string[] = [];
            if (filesToUpload.length > 0) {
                uploadedUrls = await uploadAllMedia(filesToUpload);
                filesToUpload.forEach((file, index) => {
                    fileMap.set(file, uploadedUrls[index]);
                });
                toast.success("All media uploaded successfully!", { id: "saveToast" });
            } else {
                toast("No new media to upload.", { icon: "ℹ️", id: "saveToast" });
            }
            setIsUploadingMedia(false);

            let existingPortfolio: any = {};
            try {
                const responseData = await getPortfolio(
                    authToken,
                    cookies.get("userId")
                );
                existingPortfolio =
                    responseData?.data?.user?.data?.portfolio ||
                    responseData?.data?.portfolio ||
                    {};
            } catch {
            }

            const payload: PortfolioApiPayload = {
                portfolio: {
                    template_type: "WRITER",
                    display_name: formData.displayName,
                    job_titles: formData.jobTitles
                        .split(",")
                        .map((s) => s.trim())
                        .filter(Boolean),
                    location: formData.location,
                    head_shot: formData.headShot.file
                        ? fileMap.get(formData.headShot.file) || ""
                        : formData.headShot.previewUrl || "",
                    about_me: formData.aboutMe,
                    other_services: (formData.otherServices ?? []).filter(Boolean),
                    files: formData.genericPortfolioFiles
                        .filter((item) => item.image.previewUrl || item.name || item.link)
                        .map((item) => ({
                            image: item.image.file
                                ? fileMap.get(item.image.file) || ""
                                : item.image.previewUrl || "",
                            title: item.name,
                            link: item.link,
                        })),
                    social: {
                        linkedin: formData.linkedinLink,
                        medium: formData.mediumLink,
                    },
                    what_you_get_working_with_me: formData.whatYouGet,
                    template_specific: {
                        case_study: formData.case_study,
                    } as any,
                    profile_image: "",
                    services: [],
                },
            };

            await saveWriterPortfolio(payload);
            toast.success("Portfolio saved successfully!", { id: "saveToast" });
            await revalidateTemplate4Page();
            router.push("/writer-portfolio/4");
        } catch (error: unknown) {
            if (error instanceof Error) {
                toast.error(`Failed to save portfolio: ${error.message}`, {
                    id: "saveToast",
                });
            } else {
                toast.error("Failed to save portfolio.", { id: "saveToast" });
            }
        } finally {
            setIsSavingForm(false);
            setIsUploadingMedia(false);
        }
    };

    const handlePreview = async () => {
        setIsPreviewing(true);
        try {
            const previewData = {
                template_type: "WRITER",
                display_name: formData.displayName,
                job_titles: formData.jobTitles
                    .split(",")
                    .map((s) => s.trim())
                    .filter(Boolean),
                location: formData.location,
                head_shot: formData.headShot.previewUrl,
                about_me: formData.aboutMe,
                other_services: (formData.otherServices ?? []).filter(Boolean),
                files: formData.genericPortfolioFiles
                    .filter((item) => item.image.previewUrl || item.name || item.link)
                    .map((item) => ({
                        image: item.image.previewUrl,
                        title: item.name,
                        link: item.link,
                    })),
                social: {
                    linkedin: formData.linkedinLink,
                    medium: formData.mediumLink,
                },
                what_you_get_working_with_me: formData.whatYouGet,
                template_specific: {
                    writer: { case_study: formData.case_study },
                },
            };

            const previewPayload = {
                data: previewData,
                timestamp: Date.now(),
                isPreview: true,
            };

            sessionStorage.setItem(
                "portfolioPreviewData",
                JSON.stringify(previewPayload)
            );

            router.push("/writer-portfolio/4?preview=true");
        } catch {
            toast.error("Failed to open preview. Please try again.");
        } finally {
            setIsPreviewing(false);
        }
    };

    const handleCancel = () => {
        router.back();
    };

    if (isLoading) {
        return (
            <div className="w-full max-w-4xl mx-auto bg-white font-inter mb-5 lg:mb-10 flex items-center justify-center min-h-96">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#0A1754] mx-auto mb-4"></div>
                    <p className="text-[#0A1754] font-medium">Loading profile...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="w-full max-w-4xl mx-auto bg-white font-inter mb-5 lg:mb-10">
            <div className="bg-[#0A1754] text-white px-6 py-4 flex justify-between items-center">
                <h1 className="text-base lg:text-2xl font-semibold font-inter">
                    Edit Writer Portfolio
                </h1>
                <div className="flex gap-3">
                    <button
                        onClick={handleCancel}
                        className="py-1 px-2 lg:px-4 lg:py-2 border border-white rounded text-sm hover:bg-white/10 transition cursor-pointer"
                        disabled={isAnyLoading}
                    >
                        Cancel
                    </button>
                    <button
                        onClick={handleFontColorClick}
                        className="py-1 px-2 lg:px-4 lg:py-2 border border-white rounded text-sm hover:bg-white/10 transition cursor-pointer"
                        disabled={isAnyLoading}
                    >
                        Font & Color
                    </button>
                    <button
                        onClick={handleShare}
                        className="py-1 px-2 lg:px-4 lg:py-2 border border-white rounded text-sm hover:bg-white/10 transition cursor-pointer disabled:opacity-50"
                        disabled={isAnyLoading}
                    >
                        {isSharing ? "Sharing..." : <Share2 size={16} />}
                    </button>
                    <button
                        onClick={handleSave}
                        className="px-4 py-1 lg:px-10 lg:py-3 bg-white text-[#1e3a8a] rounded font-medium hover:bg-gray-100 transition cursor-pointer disabled:opacity-50"
                        disabled={isAnyLoading}
                    >
                        {isSavingForm
                            ? "Saving..."
                            : isUploadingMedia
                                ? "Uploading Media..."
                                : "Save"}
                    </button>
                </div>
            </div>

            <div className="p-6 space-y-8">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <div className="space-y-6">
                        <div>
                            <label className="block text-[#0A1754] font-semibold text-xl mb-3">
                                Display Name
                            </label>
                            <input
                                type="text"
                                value={formData.displayName}
                                onChange={(e) =>
                                    handleInputChange("displayName", e.target.value)
                                }
                                className="w-full p-4 bg-gray-100 rounded-lg border-0 focus:ring-2 focus:ring-[#1e3a8a] focus:bg-white transition"
                                placeholder="Enter your display name"
                                disabled={isAnyLoading}
                            />
                        </div>

                        <div>
                            <label className="block text-[#0A1754] font-semibold text-xl mb-3">
                                Job Titles
                            </label>
                            <textarea
                                value={formData.jobTitles}
                                onChange={(e) => handleInputChange("jobTitles", e.target.value)}
                                rows={4}
                                className="w-full p-4 bg-gray-100 rounded-lg border-0 focus:ring-2 focus:ring-[#0A1754] focus:bg-white transition resize-none"
                                placeholder="Enter your job titles (separate with commas)"
                                disabled={isAnyLoading}
                            />
                        </div>

                        <div>
                            <label className="block text-[#0A1754] font-semibold text-xl mb-3">
                                Location
                            </label>
                            <input
                                type="text"
                                value={formData.location}
                                onChange={(e) => handleInputChange("location", e.target.value)}
                                className="w-full p-4 bg-gray-100 rounded-lg border-0 focus:ring-2 focus:ring-[#0A1754] focus:bg-white transition"
                                placeholder="Enter your location"
                                disabled={isAnyLoading}
                            />
                        </div>
                    </div>

                    <div>
                        <label className="block text-[#0A1754] font-semibold text-xl mb-3 text-center">
                            Head Shot
                        </label>
                        <div className="aspect-square bg-gray-100 rounded-lg flex flex-col items-center justify-center border-2 border-dashed border-gray-300 hover:border-[#0A1754] transition cursor-pointer relative">
                            {formData.headShot.previewUrl ? (
                                <div className="relative w-full h-full">
                                    <Image
                                        src={formData.headShot.previewUrl || "/placeholder.svg"}
                                        alt="Head shot"
                                        className="w-full h-full object-cover rounded-lg"
                                        width={200}
                                        height={200}
                                        style={{ width: "auto", height: "auto" }} // Fix aspect ratio warning
                                    />
                                    <button
                                        onClick={() => handleRemoveImage("headShot")}
                                        className="absolute top-2 right-2 p-1 bg-red-500 text-white rounded-full hover:bg-red-600"
                                        disabled={isAnyLoading}
                                    >
                                        <X size={16} />
                                    </button>
                                </div>
                            ) : (
                                <label
                                    htmlFor="headshot-upload"
                                    className="cursor-pointer w-full h-full flex flex-col items-center justify-center"
                                >
                                    <input
                                        id="headshot-upload"
                                        type="file"
                                        accept="image/*"
                                        ref={(el) => {
                                            headShotInputRef.current = el;
                                        }}
                                        onChange={(e) => handleImageFileChange(e, "headShot")}
                                        className="hidden"
                                        disabled={isAnyLoading}
                                    />
                                    <div className="text-center">
                                        {isUploadingMedia && formData.headShot.file ? (
                                            <span className="text-[#0A1754] font-medium">
                                                Uploading...
                                            </span>
                                        ) : (
                                            <>
                                                <Upload
                                                    className="mx-auto mb-2 text-[#0A1754]"
                                                    size={24}
                                                />
                                                <span className="text-[#0A1754] font-medium">
                                                    Upload Image
                                                </span>
                                            </>
                                        )}
                                    </div>
                                </label>
                            )}
                        </div>
                    </div>
                </div>

                <div>
                    <label className="block text-[#0A1754] font-semibold text-xl mb-3">
                        About Me
                    </label>
                    <textarea
                        value={formData.aboutMe}
                        onChange={(e) => handleInputChange("aboutMe", e.target.value)}
                        rows={6}
                        className="w-full p-4 bg-gray-100 rounded-lg border-0 focus:ring-2 focus:ring-[#0A1754] focus:bg-white transition resize-none"
                        placeholder="Tell us about yourself"
                        disabled={isAnyLoading}
                    />
                </div>

                <div>
                    <label className="block text-[#0A1754] font-semibold text-xl mb-3">
                        My Services
                    </label>
                    <div className="space-y-4">
                        {(formData.otherServices ?? []).map((service, index) => (
                            <input
                                key={index}
                                type="text"
                                value={service}
                                onChange={(e) => handleServiceChange(index, e.target.value)}
                                className="w-full p-4 bg-gray-100 rounded-lg border-0 focus:ring-2 focus:ring-[#0A1754] focus:bg-white transition"
                                placeholder="Skill (e.g., Content Writing)"
                                disabled={isAnyLoading}
                            />
                        ))}
                    </div>
                </div>

                <div>
                    <label className="block text-black font-semibold text-xl mb-6 text-center">
                        My Portfolio
                    </label>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {formData.genericPortfolioFiles.map((item, index) => (
                            <div key={index} className="space-y-3">
                                <div className="aspect-square bg-gray-100 rounded-lg flex flex-col items-center justify-center border-2 border-dashed border-gray-300 hover:border-[#1e3a8a] transition cursor-pointer relative">
                                    {item.image.previewUrl ? (
                                        <div className="relative w-full h-full">
                                            <Image
                                                src={item.image.previewUrl || "/placeholder.svg"}
                                                alt="Portfolio"
                                                className="w-full h-full object-cover rounded-lg"
                                                width={200}
                                                height={200}
                                                style={{ width: "auto", height: "auto" }} // Fix aspect ratio warning
                                            />
                                            <button
                                                onClick={() => handleRemoveImage("portfolio", index)}
                                                className="absolute top-2 right-2 p-1 bg-red-500 text-white rounded-full hover:bg-red-600"
                                                disabled={isAnyLoading}
                                            >
                                                <X size={16} />
                                            </button>
                                        </div>
                                    ) : (
                                        <label
                                            htmlFor={`portfolio-upload-${index}`}
                                            className="cursor-pointer w-full h-full flex flex-col items-center justify-center"
                                        >
                                            <input
                                                id={`portfolio-upload-${index}`}
                                                type="file"
                                                accept="image/*"
                                                ref={(el) => {
                                                    portfolioInputRefs.current[index] = el;
                                                }}
                                                onChange={(e) =>
                                                    handleImageFileChange(e, "portfolio", index)
                                                }
                                                className="hidden"
                                                disabled={isAnyLoading}
                                            />
                                            <div className="text-center">
                                                {isUploadingMedia && item.image.file ? (
                                                    <span className="text-[#0A1754] font-medium">
                                                        Uploading...
                                                    </span>
                                                ) : (
                                                    <span className="text-[#0A1754] font-medium text-lg">
                                                        Upload Png
                                                    </span>
                                                )}
                                            </div>
                                        </label>
                                    )}
                                </div>
                                <input
                                    type="text"
                                    value={item.name}
                                    onChange={(e) =>
                                        handlePortfolioChange(index, "name", e.target.value)
                                    }
                                    placeholder="Name of write up"
                                    className="w-full p-3 bg-gray-100 rounded-lg border-0 focus:ring-2 focus:ring-[#1e3a8a] focus:bg-white transition text-center text-sm"
                                    disabled={isAnyLoading}
                                />
                                <input
                                    type="url"
                                    value={item.link}
                                    onChange={(e) =>
                                        handlePortfolioChange(index, "link", e.target.value)
                                    }
                                    placeholder="Paste link"
                                    className="w-full p-3 bg-gray-100 rounded-lg border-0 focus:ring-2 focus:ring-[#1e3a8a] focus:bg-white transition text-center text-sm"
                                    disabled={isAnyLoading}
                                />
                            </div>
                        ))}
                    </div>
                </div>

                <div>
                    <label className="block text-[#0A1754] font-semibold text-xl mb-3">
                        Case Study
                    </label>
                    <textarea
                        value={formData.case_study}
                        onChange={(e) => handleInputChange("case_study", e.target.value)}
                        rows={6}
                        className="w-full p-4 bg-gray-100 rounded-lg border-0 focus:ring-2 focus:ring-[#1e3a8a] focus:bg-white transition resize-none"
                        placeholder="Write your case study content here"
                        disabled={isAnyLoading}
                    />
                </div>

                <div>
                    <label className="block text-[#0A1754] font-semibold text-xl mb-3">
                        What You Get Working With Me
                    </label>
                    <textarea
                        value={formData.whatYouGet}
                        onChange={(e) => handleInputChange("whatYouGet", e.target.value)}
                        rows={4}
                        className="w-full p-4 bg-gray-100 rounded-lg border-0 focus:ring-2 focus:ring-[#1e3a8a] focus:bg-white transition resize-none"
                        placeholder="Describe what clients get when working with you"
                        disabled={isAnyLoading}
                    />
                </div>

                <div>
                    <label className="block text-[#0A1754] font-semibold text-xl mb-6">
                        Social & Writing Platform Links
                    </label>
                    <div className="space-y-6">
                        <div>
                            <label className="block text-black font-semibold text-lg mb-3">
                                LinkedIn
                            </label>
                            <input
                                type="url"
                                value={formData.linkedinLink}
                                onChange={(e) =>
                                    handleInputChange("linkedinLink", e.target.value)
                                }
                                placeholder="Paste link"
                                className="w-full p-4 bg-gray-100 rounded-lg border-0 focus:ring-2 focus:ring-[#1e3a8a] focus:bg-white transition"
                                disabled={isAnyLoading}
                            />
                        </div>
                        <div>
                            <label className="block text-black font-semibold text-lg mb-3">
                                Medium
                            </label>
                            <input
                                type="url"
                                value={formData.mediumLink}
                                onChange={(e) =>
                                    handleInputChange("mediumLink", e.target.value)
                                }
                                placeholder="Paste link"
                                className="w-full p-4 bg-gray-100 rounded-lg border-0 focus:ring-2 focus:ring-[#1e3a8a] focus:bg-white transition"
                                disabled={isAnyLoading}
                            />
                        </div>
                    </div>
                </div>
            </div>

            <div className="bg-[#0A1754] px-6 py-4 flex justify-end gap-4 max-md:mb-18">
                <button
                    onClick={handleCancel}
                    className="px-3 py-1 lg:px-8 lg:py-3 border border-white text-white rounded hover:bg-white/10 transition cursor-pointer"
                    disabled={isAnyLoading}
                >
                    Cancel
                </button>
                <button
                    onClick={handlePreview}
                    className="px-3 py-1 lg:px-8 lg:py-3 border border-white text-white rounded hover:bg-white/10 transition cursor-pointer disabled:opacity-50"
                    disabled={isAnyLoading}
                >
                    {isPreviewing ? "Loading..." : "Preview"}
                </button>
                <button
                    onClick={handleSave}
                    className="px-4 py-1 lg:px-10 lg:py-3 bg-white text-[#1e3a8a] rounded font-medium hover:bg-gray-100 transition cursor-pointer disabled:opacity-50"
                    disabled={isAnyLoading}
                >
                    {isSavingForm
                        ? "Saving..."
                        : isUploadingMedia
                            ? "Uploading Media..."
                            : "Save"}
                </button>
            </div>
        </div>
    );
}
