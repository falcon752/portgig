/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";

import { useState, useEffect, useRef, type ChangeEvent } from "react";
import { useRouter } from "next/navigation";
import { Upload, X, Share2 } from "lucide-react";
import Image from "next/image";
import { getImageUrl } from "@/src/utils/image-url";
import {
    saveVideographerPortfolio,
    getPortfolio,
    uploadAllMedia,
} from "@/src/api/portfolio";
import toast from "react-hot-toast";
import { revalidateTemplateVideographerPage } from "@/src/app/Actions";
import Cookies from "universal-cookie";
import { useDraft } from "@/src/hooks/useDraft";
import DraftBanner from "@/src/components/DraftBanner";
import type {
    VideographerFormData,
    PortfolioApiPayload,
    GetPortfolioResponse,
} from "@/types/portfolio";
import { isVideographerTemplateSpecific } from "@/types/portfolio";

export default function VideographerForm() {
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(true);
    const [isSavingForm, setIsSavingForm] = useState(false);
    const [isUploadingMedia, setIsUploadingMedia] = useState(false);
    const [isPreviewing, setIsPreviewing] = useState(false);
    const [isSharing, setIsSharing] = useState(false);
    const [username, setUsername] = useState<string | null>(null);

    const [formData, setFormData] = useState<VideographerFormData>({
        displayName: "",
        jobTitles: "",
        location: "",
        headShot: { previewUrl: null, file: null },
        additionalImages: Array(3).fill({ previewUrl: null, file: null }),
        aboutMe: "",
        otherServices: Array(6).fill(""),
        genericPortfolioFiles: Array(6).fill({
            image: { previewUrl: null, file: null },
            name: "",
            link: "",
        }),
        types: Array(6).fill(""),
        videographySkills: [],
        videoEditingSkills: [],
        jobsOpenTo: "",
        portfolioGoogleDrive: "",
        whatYouGetWorkingWithMe: "",
    });

    const isAnyLoading =
        isLoading || isSavingForm || isUploadingMedia || isPreviewing || isSharing;

    const [showDraftBanner, setShowDraftBanner] = useState(false);
    const apiLoadedRef = useRef(false);
    const { saveDraft, saveServerSnapshot, loadDraft, clearDraft, hasMeaningfulDraft } =
        useDraft<VideographerFormData>("portgig_draft_videographer");

    const headShotInputRef = useRef<HTMLInputElement | null>(null);
    const additionalImagesInputRefs = useRef<(HTMLInputElement | null)[]>(
        Array(3).fill(null)
    );
    const portfolioInputRefs = useRef<(HTMLInputElement | null)[]>(
        Array(6).fill(null)
    );

    useEffect(() => {
        const loadPortfolioData = async () => {
            try {
                const cookies = new Cookies();
                const clientAccessToken = cookies.get("access_token");
                const userId = cookies.get("userId") || cookies.get("userid");

                if (!clientAccessToken) {
                    toast.error("Please log in to load your portfolio.");
                    return;
                }

                if (!userId) {
                    toast.error("User ID not found. Please log in.");
                    return;
                }

                const responseData: GetPortfolioResponse = await getPortfolio(
                    clientAccessToken,
                    userId
                );

                const portfolio =
                    responseData?.data?.user?.data?.portfolio ||
                    responseData?.data?.portfolio ||
                    null;

                const fetchedUsername = responseData?.data?.user?.data?.bio_data?.user_name || null;
                setUsername(fetchedUsername);

                if (portfolio && portfolio.template_type === "VIDEOGRAPHER") {
                    const templateSpecific = portfolio.template_specific;

                    if (isVideographerTemplateSpecific(templateSpecific)) {
                        setFormData({
                            displayName: portfolio.display_name || "",
                            jobTitles: portfolio.job_titles?.join(", ") || "",
                            location: portfolio.location || "",
                            headShot: { previewUrl: getImageUrl(portfolio.head_shot) || null, file: null },
                            additionalImages: [
                                ...(portfolio.files?.slice(0, 3).map((file) => ({
                                    previewUrl: getImageUrl(file.image) || null,
                                    file: null,
                                })) || []),
                                ...Array(Math.max(0, 3 - (portfolio.files?.length || 0))).fill({
                                    previewUrl: null,
                                    file: null,
                                }),
                            ].slice(0, 3),
                            aboutMe: portfolio.about_me || "",
                            otherServices: [
                                ...(portfolio.other_services || []),
                                ...Array(
                                    Math.max(0, 6 - (portfolio.other_services?.length || 0))
                                ).fill(""),
                            ].slice(0, 6),
                            genericPortfolioFiles: [
                                ...(portfolio.files?.slice(3).map((file) => ({
                                    image: { previewUrl: getImageUrl(file.image) || null, file: null },
                                    name: file.title || "",
                                    link: file.link || "",
                                })) || []),
                                ...Array(
                                    Math.max(
                                        0,
                                        6 - Math.max(0, (portfolio.files?.length ?? 0) - 3)
                                    )
                                ).fill({
                                    image: { previewUrl: null, file: null },
                                    name: "",
                                    link: "",
                                }),
                            ].slice(0, 6),
                            types: [
                                ...(templateSpecific.videographer?.types || []),
                                ...Array(
                                    Math.max(
                                        0,
                                        6 - (templateSpecific.videographer?.types?.length || 0)
                                    )
                                ).fill(""),
                            ].slice(0, 6),
                            videographySkills:
                                templateSpecific.videographer?.videography_skills || [],
                            videoEditingSkills:
                                templateSpecific.videographer?.video_editing_skills || [],
                            jobsOpenTo: templateSpecific.videographer?.jobs_open_to || "",
                            portfolioGoogleDrive: portfolio.social?.google_drive_link || "",
                            whatYouGetWorkingWithMe:
                                portfolio.what_you_get_working_with_me || "",
                        });
                    } else {
                        toast.error("Invalid portfolio data structure.");
                    }
                } else {
                    toast("No existing videographer portfolio found. Starting fresh.");
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

    // Detect API load completion → compare with any saved draft
    useEffect(() => {
        if (!isLoading && !apiLoadedRef.current) {
            apiLoadedRef.current = true;
            saveServerSnapshot(formData);
            if (hasMeaningfulDraft()) setShowDraftBanner(true);
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [isLoading]);

    // Auto-save draft 1.5 s after the user stops editing
    useEffect(() => {
        if (!apiLoadedRef.current) return;
        const timer = setTimeout(() => saveDraft(formData), 1500);
        return () => clearTimeout(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [formData]);

    const handleInputChange = (
        field: keyof VideographerFormData,
        value: string
    ) => {
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

    const handleTypesChange = (index: number, value: string) => {
        setFormData((prev) => ({
            ...prev,
            types: prev.types.map((type, i) => (i === index ? value : type)),
        }));
    };

    const handleSkillsChange = (
        field: "videographySkills" | "videoEditingSkills",
        value: string
    ) => {
        setFormData((prev) => ({
            ...prev,
            [field]: value
                .split(",")
                .map((s) => s)
                .filter(Boolean),
        }));
    };

    const handleImageFileChange = (
        event: ChangeEvent<HTMLInputElement>,
        type: "headShot" | "portfolio" | "additionalImages",
        index?: number
    ) => {
        const file = event.target.files?.[0];
        if (file && file.size > 10 * 1024 * 1024) {
            toast.error("Image must be 10MB or less.");
            event.target.value = "";
            return;
        }
        if (file && file.type.startsWith("image/")) {
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
                    } else if (type === "additionalImages" && index !== undefined) {
                        return {
                            ...prev,
                            additionalImages: prev.additionalImages.map((item, i) =>
                                i === index ? { previewUrl, file } : item
                            ),
                        };
                    }
                    return prev;
                });
            };
            reader.readAsDataURL(file);
        } else if (file) {
            toast.error("Please upload an image file.");
        }
    };

    const handleRemoveImage = (
        type: "headShot" | "portfolio" | "additionalImages",
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
            } else if (type === "additionalImages" && index !== undefined) {
                return {
                    ...prev,
                    additionalImages: prev.additionalImages.map((item, i) =>
                        i === index ? { previewUrl: null, file: null } : item
                    ),
                };
            }
            return prev;
        });
        toast(
            `${type === "headShot"
                ? "Headshot"
                : type === "portfolio"
                    ? `Portfolio image ${index! + 1}`
                    : `Additional image ${index! + 1}`
            } removed.`,
            { icon: "🗑️" }
        );
    };

    const handleFontColorClick = () => {
        router.push("/edit-font");
    };

    const handleShare = async () => {
        setIsSharing(true);
        try {
            const cookies = new Cookies();
            const userId = cookies.get("userId") || cookies.get("userid");
            let portfolioUrl: string;
            
            const displayNameSlug = formData.displayName
                ? formData.displayName.trim().toLowerCase().replace(/\s+/g, "-")
                : (username || "portfolio");
            portfolioUrl = `${window.location.origin}/videographer-portfolio/${encodeURIComponent(displayNameSlug)}/${encodeURIComponent(userId)}`;
            
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
            formData.additionalImages.forEach((item) => {
                if (item.file) {
                    filesToUpload.push(item.file);
                }
            });
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
                const userId = cookies.get("userId") || cookies.get("userid");
                const responseData = await getPortfolio(authToken, userId);
                existingPortfolio =
                    responseData?.data?.user?.data?.portfolio ||
                    responseData?.data?.portfolio ||
                    {};
            } catch {
            }

            const payload: PortfolioApiPayload = {
                portfolio: {
                    template_type: "VIDEOGRAPHER",
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
                    files: [
                        ...formData.additionalImages
                            .filter((item) => item.previewUrl)
                            .map((item) => ({
                                image: item.file
                                    ? fileMap.get(item.file) || ""
                                    : item.previewUrl || "",
                                title: "",
                                link: "",
                            })),
                        ...formData.genericPortfolioFiles
                            .filter((item) => item.image.previewUrl || item.name || item.link)
                            .map((item) => ({
                                image: item.image.file
                                    ? fileMap.get(item.image.file) || ""
                                    : item.image.previewUrl || "",
                                title: item.name,
                                link: item.link,
                            })),
                    ],
                    social: {
                        google_drive_link: formData.portfolioGoogleDrive,
                    },
                    what_you_get_working_with_me: formData.whatYouGetWorkingWithMe,
                    template_specific: {
                        types: formData.types.filter(Boolean),
                        videography_skills: formData.videographySkills,
                        video_editing_skills: formData.videoEditingSkills,
                        jobs_open_to: formData.jobsOpenTo,
                    } as any,
                    profile_image: "",
                    services: [],
                },
            };

            await saveVideographerPortfolio(payload);
            toast.success("Portfolio saved successfully!", { id: "saveToast" });
            await revalidateTemplateVideographerPage();
            const _vidNavUserId = cookies.get("userId") || cookies.get("userid") || "";
            const _vidNavSlug = formData.displayName ? formData.displayName.trim().toLowerCase().replace(/\s+/g, "-") : "portfolio";
            router.push(`/videographer-portfolio/${encodeURIComponent(_vidNavSlug)}/${encodeURIComponent(_vidNavUserId)}`);
            clearDraft();
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
                template_type: "VIDEOGRAPHER",
                display_name: formData.displayName,
                job_titles: formData.jobTitles
                    .split(",")
                    .map((s) => s.trim())
                    .filter(Boolean),
                location: formData.location,
                head_shot: formData.headShot.previewUrl,
                about_me: formData.aboutMe,
                other_services: (formData.otherServices ?? []).filter(Boolean),
                files: [
                    ...formData.additionalImages
                        .filter((item) => item.previewUrl)
                        .map((item) => ({
                            image: item.previewUrl || "",
                            title: "",
                            link: "",
                        })),
                    ...formData.genericPortfolioFiles
                        .filter((item) => item.image.previewUrl || item.name || item.link)
                        .map((item) => ({
                            image: item.image.previewUrl || "",
                            title: item.name,
                            link: item.link,
                        })),
                ],
                social: {
                    google_drive_link: formData.portfolioGoogleDrive,
                },
                what_you_get_working_with_me: formData.whatYouGetWorkingWithMe,
                template_specific: {
                    videographer: {
                        types: formData.types.filter(Boolean),
                        videography_skills: formData.videographySkills,
                        video_editing_skills: formData.videoEditingSkills,
                        jobs_open_to: formData.jobsOpenTo,
                    },
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

            router.push("/videographer-portfolio/2?preview=true");
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
            {showDraftBanner && (
                <DraftBanner
                    onRestore={() => { const d = loadDraft(); if (d) setFormData(d); setShowDraftBanner(false); }}
                    onDiscard={() => { clearDraft(); setShowDraftBanner(false); }}
                />
            )}
            <div className="bg-[#0A1754] text-white px-6 py-4 flex justify-between items-center">
                <h1 className="text-base lg:text-2xl font-semibold font-inter">
                    Edit Videographer Portfolio
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
                        <div className="aspect-square bg-gray-100 rounded-lg flex flex-col items-center justify-center border-2 border-dashed border-gray-300 hover:border-[#0A1754] transition cursor-pointer relative overflow-hidden">
                            {formData.headShot.previewUrl ? (
                                <div className="relative w-full h-full">
                                    <Image
                                        src={formData.headShot.previewUrl || "/placeholder.svg"}
                                        alt="Head shot"
                                        className="w-full h-full object-cover rounded-lg"
                                        width={200}
                                        height={200}
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
                                                    Upload PNG
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
                    <label className="block text-[#0A1754] font-semibold text-xl mb-3 text-center">
                        Additional Images
                    </label>
                    <div className="flex justify-center">
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            {formData.additionalImages.map((item, index) => (
                                <div key={index} className="space-y-3">
                                    <div className="aspect-square w-48 h-48 bg-gray-100 rounded-lg flex flex-col border-2 border-dashed border-gray-300 hover:border-[#1e3a8a] transition cursor-pointer relative overflow-hidden">
                                        {item.previewUrl ? (
                                            <div className="relative w-full h-full">
                                                <Image
                                                    src={item.previewUrl || "/placeholder.svg"}
                                                    alt={`Additional image ${index + 1}`}
                                                    className="w-full h-full object-cover rounded-lg"
                                                    width={200}
                                                    height={200}
                                                />
                                                <button
                                                    onClick={() =>
                                                        handleRemoveImage("additionalImages", index)
                                                    }
                                                    className="absolute top-2 right-2 p-1 bg-red-500 text-white rounded-full hover:bg-red-600"
                                                    disabled={isAnyLoading}
                                                >
                                                    <X size={16} />
                                                </button>
                                            </div>
                                        ) : (
                                            <label
                                                htmlFor={`additional-image-upload-${index}`}
                                                className="cursor-pointer w-full h-full flex flex-col items-center justify-center"
                                            >
                                                <input
                                                    id={`additional-image-upload-${index}`}
                                                    type="file"
                                                    accept="image/*"
                                                    ref={(el) => {
                                                        additionalImagesInputRefs.current[index] = el;
                                                    }}
                                                    onChange={(e) =>
                                                        handleImageFileChange(e, "additionalImages", index)
                                                    }
                                                    className="hidden"
                                                    disabled={isAnyLoading}
                                                />
                                                <div className="text-center">
                                                    {isUploadingMedia && item.file ? (
                                                        <span className="text-[#0A1754] font-medium">
                                                            Uploading...
                                                        </span>
                                                    ) : (
                                                        <>
                                                            <Upload
                                                                className="mx-auto mb-2 text-[#0A1754]"
                                                                size={24}
                                                            />
                                                            <span className="text-[#0A1754] font-medium text-lg">
                                                                Upload PNG
                                                            </span>
                                                        </>
                                                    )}
                                                </div>
                                            </label>
                                        )}
                                    </div>
                                </div>
                            ))}
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
                                placeholder="Skill (e.g., Video Editing)"
                                disabled={isAnyLoading}
                            />
                        ))}
                    </div>
                </div>

                <div>
                    <label className="block text-[#0A1754] font-semibold text-xl mb-3">
                        Types of Videography
                    </label>
                    <div className="space-y-4">
                        {formData.types.map((type, index) => (
                            <textarea
                                key={index}
                                value={type}
                                onChange={(e) => handleTypesChange(index, e.target.value)}
                                rows={3}
                                className="w-full p-4 bg-gray-100 rounded-lg border-0 focus:ring-2 focus:ring-[#0A1754] focus:bg-white transition resize-none"
                                placeholder="e.g., Corporate, Event, Documentary"
                                disabled={isAnyLoading}
                            />
                        ))}
                    </div>
                </div>

                <div>
                    <label className="block text-[#0A1754] font-semibold text-xl mb-3">
                        Videography Skills
                    </label>
                    <textarea
                        value={formData.videographySkills}
                        onChange={(e) =>
                            handleSkillsChange("videographySkills", e.target.value)
                        }
                        rows={4}
                        className="w-full p-4 bg-gray-100 rounded-lg border-0 focus:ring-2 focus:ring-[#0A1754] focus:bg-white transition resize-none"
                        placeholder="e.g., Cinematography, Lighting, Drone Operation (separate with commas)"
                        disabled={isAnyLoading}
                    />
                </div>

                <div>
                    <label className="block text-[#0A1754] font-semibold text-xl mb-3">
                        Video Editing Skills
                    </label>
                    <textarea
                        value={formData.videoEditingSkills.join(", ")}
                        onChange={(e) =>
                            handleSkillsChange("videoEditingSkills", e.target.value)
                        }
                        rows={4}
                        className="w-full p-4 bg-gray-100 rounded-lg border-0 focus:ring-2 focus:ring-[#0A1754] focus:bg-white transition resize-none"
                        placeholder="e.g., Premiere Pro, After Effects, DaVinci Resolve (separate with commas)"
                        disabled={isAnyLoading}
                    />
                </div>

                <div>
                    <label className="block text-[#0A1754] font-semibold text-xl mb-6 text-center">
                        My Portfolio
                    </label>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {formData.genericPortfolioFiles.map((item, index) => (
                            <div key={index} className="space-y-3">
                                <div className="aspect-square bg-gray-100 rounded-lg flex flex-col items-center justify-center border-2 border-dashed border-gray-300 hover:border-[#1e3a8a] transition cursor-pointer relative overflow-hidden">
                                    {item.image.previewUrl ? (
                                        <div className="relative w-full h-full">
                                            <Image
                                                src={item.image.previewUrl || "/placeholder.svg"}
                                                alt={`Portfolio image ${index + 1}`}
                                                className="w-full h-full object-cover rounded-lg"
                                                width={200}
                                                height={200}
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
                                                        Upload PNG
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
                                    placeholder="Name of video/project"
                                    className="w-full p-3 bg-gray-100 rounded-lg border-0 focus:ring-2 focus:ring-[#1e3a8a] focus:bg-white transition text-center text-sm"
                                    disabled={isAnyLoading}
                                />
                                <input
                                    type="url"
                                    value={item.link}
                                    onChange={(e) =>
                                        handlePortfolioChange(index, "link", e.target.value)
                                    }
                                    placeholder="Paste link to video"
                                    className="w-full p-3 bg-gray-100 rounded-lg border-0 focus:ring-2 focus:ring-[#1e3a8a] focus:bg-white transition text-center text-sm"
                                    disabled={isAnyLoading}
                                />
                            </div>
                        ))}
                    </div>
                </div>

                <div>
                    <label className="block text-[#0A1754] font-semibold text-xl mb-3">
                        Portfolio Link on Google Drive
                    </label>
                    <input
                        type="url"
                        value={formData.portfolioGoogleDrive}
                        onChange={(e) =>
                            handleInputChange("portfolioGoogleDrive", e.target.value)
                        }
                        placeholder="Paste link"
                        className="w-full p-4 bg-gray-100 rounded-lg border-0 focus:ring-2 focus:ring-[#1e3a8a] focus:bg-white transition"
                        disabled={isAnyLoading}
                    />
                </div>

                <div>
                    <label className="block text-[#0A1754] font-semibold text-xl mb-3">
                        Jobs Open To
                    </label>
                    <textarea
                        value={formData.jobsOpenTo}
                        onChange={(e) => handleInputChange("jobsOpenTo", e.target.value)}
                        rows={6}
                        className="w-full p-4 bg-gray-100 rounded-lg border-0 focus:ring-2 focus:ring-[#0A1754] focus:bg-white transition resize-none"
                        placeholder="Describe the types of jobs you are open to"
                        disabled={isAnyLoading}
                    />
                </div>

                <div>
                    <label className="block text-[#0A1754] font-semibold text-xl mb-3">
                        Why You Should Work With Me
                    </label>
                    <textarea
                        value={formData.whatYouGetWorkingWithMe}
                        onChange={(e) =>
                            handleInputChange("whatYouGetWorkingWithMe", e.target.value)
                        }
                        rows={6}
                        className="w-full p-4 bg-gray-100 rounded-lg border-0 focus:ring-2 focus:ring-[#0A1754] focus:bg-white transition resize-none"
                        placeholder="Tell potential clients why they should choose you"
                        disabled={isAnyLoading}
                    />
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
