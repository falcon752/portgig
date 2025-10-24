/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";

import { useState, useEffect, useRef, type ChangeEvent } from "react";
import { useRouter } from "next/navigation";
import { Upload, X, Share2 } from "lucide-react";
import Image from "next/image";
import {
    savePhotographerPortfolio,
    getPortfolio,
    uploadAllMedia,
} from "../../api/portfolio";
import toast from "react-hot-toast";
import { revalidateTemplatePhotographerPage } from "@/src/app/Actions";
import Cookies from "universal-cookie";
import type {
    PhotographerFormData,
    PortfolioApiPayload,
    GetPortfolioResponse,
} from "@/types/portfolio";
import { isPhotographerTemplateSpecific } from "@/types/portfolio";

export default function PhotographerForm() {
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(true);
    const [isSavingForm, setIsSavingForm] = useState(false);
    const [isUploadingMedia, setIsUploadingMedia] = useState(false);
    const [isPreviewing, setIsPreviewing] = useState(false);
    const [isSharing, setIsSharing] = useState(false);

    const [formData, setFormData] = useState<PhotographerFormData>({
        displayName: "",
        jobTitles: "",
        location: "",
        headShot: { previewUrl: null, file: null },
        aboutMe: "",
        otherServices: Array(6).fill(""),
        myServices: Array(3).fill({
            image: { previewUrl: null, file: null },
            name: "",
            link: "",
        }),
        latestWork: Array(4).fill({
            image: { previewUrl: null, file: null },
            title: "",
            link: "",
        }),
        jobsOpenTo: [],
        whyWorkWithMe: "",
        moreWork: Array(4).fill({ name: "", link: "" }),
    });

    const isAnyLoading =
        isLoading || isSavingForm || isUploadingMedia || isPreviewing || isSharing;

    const headShotInputRef = useRef<HTMLInputElement | null>(null);
    const myServicesInputRefs = useRef<(HTMLInputElement | null)[]>(
        Array(3).fill(null)
    );
    const latestWorkInputRefs = useRef<(HTMLInputElement | null)[]>(
        Array(4).fill(null)
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

                if (portfolio && portfolio.template_type === "PHOTOGRAPHER") {
                    const templateSpecific = portfolio.template_specific;

                    if (isPhotographerTemplateSpecific(templateSpecific)) {
                        setFormData({
                            displayName: portfolio.display_name || "",
                            jobTitles: portfolio.job_titles?.join(", ") || "",
                            location: portfolio.location || "",
                            headShot: { previewUrl: portfolio.head_shot || null, file: null },
                            aboutMe: portfolio.about_me || "",
                            otherServices: [
                                ...(portfolio.other_services || []),
                                ...Array(
                                    Math.max(0, 6 - (portfolio.other_services?.length || 0))
                                ).fill(""),
                            ].slice(0, 6),
                            myServices: [
                                ...(templateSpecific.photographer?.my_services?.map((item) => ({
                                    image: { previewUrl: item.image || null, file: null },
                                    name: item.name || "",
                                    link: item.link || "",
                                })) || []),
                                ...Array(
                                    Math.max(0, 3 - (templateSpecific.photographer?.my_services?.length || 0))
                                ).fill({
                                    image: { previewUrl: null, file: null },
                                    name: "",
                                    link: "",
                                }),
                            ].slice(0, 3),
                            latestWork: [
                                ...(templateSpecific.photographer?.latest_work?.map((item) => ({
                                    image: { previewUrl: item.image || null, file: null },
                                    title: item.title || "",
                                    link: item.link || "",
                                })) || []),
                                ...Array(
                                    Math.max(0, 4 - (templateSpecific.photographer?.latest_work?.length || 0))
                                ).fill({
                                    image: { previewUrl: null, file: null },
                                    title: "",
                                    link: "",
                                }),
                            ].slice(0, 4),
                            jobsOpenTo: templateSpecific.photographer?.jobs_open_to || [],
                            whyWorkWithMe: portfolio.what_you_get_working_with_me || "",
                            moreWork: [
                                ...(templateSpecific.photographer?.more_work || []),
                                ...Array(
                                    Math.max(0, 4 - (templateSpecific.photographer?.more_work?.length || 0))
                                ).fill({ name: "", link: "" }),
                            ].slice(0, 4),
                        });
                    } else {
                        toast.error("Invalid photographer portfolio data structure.");
                    }
                } else {
                    toast("No existing photographer portfolio found. Starting fresh.");
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

    const handleInputChange = (
        field: keyof PhotographerFormData,
        value: string | string[]
    ) => {
        if (field === "jobsOpenTo") {
            const arrayValue =
                typeof value === "string"
                    ? value.split(",")
                    : Array.isArray(value)
                        ? value
                        : [];

            setFormData((prev) => ({ ...prev, jobsOpenTo: arrayValue }));
            return;
        }

        setFormData((prev) => ({ ...prev, [field]: value }));
    };


    const handleMyServiceChange = (
        index: number,
        field: "name" | "link",
        value: string
    ) => {
        setFormData((prev) => ({
            ...prev,
            myServices: prev.myServices.map((service, i) =>
                i === index ? { ...service, [field]: value } : service
            ),
        }));
    };

    const handleLatestWorkChange = (
        index: number,
        field: "title" | "link",
        value: string
    ) => {
        setFormData((prev) => ({
            ...prev,
            latestWork: prev.latestWork.map((item, i) =>
                i === index ? { ...item, [field]: value } : item
            ),
        }));
    };

    const handleMoreWorkChange = (
        index: number,
        field: "name" | "link",
        value: string
    ) => {
        setFormData((prev) => ({
            ...prev,
            moreWork: prev.moreWork.map((item, i) =>
                i === index ? { ...item, [field]: value } : item
            ),
        }));
    };

    const handleOtherServiceChange = (index: number, value: string) => {
        setFormData((prev) => ({
            ...prev,
            otherServices: (prev.otherServices ?? []).map((service, i) =>
                i === index ? value : service
            ),
        }));
    };

    const handleImageFileChange = (
        event: ChangeEvent<HTMLInputElement>,
        type: "headShot" | "myServices" | "latestWork",
        index?: number
    ) => {
        const file = event.target.files?.[0];
        if (file && file.type === "image/png") {
            const reader = new FileReader();
            reader.onloadend = () => {
                const previewUrl = reader.result as string;
                setFormData((prev) => {
                    if (type === "headShot") {
                        return { ...prev, headShot: { previewUrl, file } };
                    } else if (type === "myServices" && index !== undefined) {
                        return {
                            ...prev,
                            myServices: prev.myServices.map((item, i) =>
                                i === index ? { ...item, image: { previewUrl, file } } : item
                            ),
                        };
                    } else if (type === "latestWork" && index !== undefined) {
                        return {
                            ...prev,
                            latestWork: prev.latestWork.map((item, i) =>
                                i === index ? { ...item, image: { previewUrl, file } } : item
                            ),
                        };
                    }
                    return prev;
                });
            };
            reader.readAsDataURL(file);
        } else if (file) {
            toast.error("Please upload a PNG image.");
        }
    };

    const handleRemoveImage = (
        type: "headShot" | "myServices" | "latestWork",
        index?: number
    ) => {
        setFormData((prev) => {
            if (type === "headShot") {
                return { ...prev, headShot: { previewUrl: null, file: null } };
            } else if (type === "myServices" && index !== undefined) {
                return {
                    ...prev,
                    myServices: prev.myServices.map((item, i) =>
                        i === index ? { ...item, image: { previewUrl: null, file: null } } : item
                    ),
                };
            } else if (type === "latestWork" && index !== undefined) {
                return {
                    ...prev,
                    latestWork: prev.latestWork.map((item, i) =>
                        i === index ? { ...item, image: { previewUrl: null, file: null } } : item
                    ),
                };
            }
            return prev;
        });
        toast(
            `${type === "headShot"
                ? "Headshot"
                : type === "myServices"
                    ? `Service image ${index! + 1}`
                    : `Latest Work image ${index! + 1}`
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
            const portfolioUrl = `${window.location.origin}/photographer-portfolio/6?creatorId=${userId}`;
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
            const userId = cookies.get("userId") || cookies.get("userid");
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
            formData.myServices.forEach((item) => {
                if (item.image.file) {
                    filesToUpload.push(item.image.file);
                }
            });
            formData.latestWork.forEach((item) => {
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
                const responseData = await getPortfolio(authToken, userId);
                existingPortfolio =
                    responseData?.data?.user?.data?.portfolio ||
                    responseData?.data?.portfolio ||
                    {};
            } catch {
            }

            const finalHeadShotUrl = formData.headShot.file
                ? fileMap.get(formData.headShot.file) || ""
                : formData.headShot.previewUrl || "";

            const finalMyServices = formData.myServices
                .filter((item) => item.image.previewUrl || item.name || item.link)
                .map((item) => ({
                    image: item.image.file
                        ? fileMap.get(item.image.file) || ""
                        : item.image.previewUrl || "",
                    name: item.name,
                    link: item.link,
                }));

            const finalLatestWork = formData.latestWork
                .filter((item) => item.image.previewUrl || item.title || item.link)
                .map((item) => ({
                    image: item.image.file
                        ? fileMap.get(item.image.file) || ""
                        : item.image.previewUrl || "",
                    title: item.title,
                    link: item.link,
                }));

            const finalMoreWork = formData.moreWork.filter(
                (item) => item.name || item.link
            );

            const payload: PortfolioApiPayload = {
                portfolio: {
                    template_type: "PHOTOGRAPHER",
                    display_name: formData.displayName,
                    job_titles: formData.jobTitles
                        .split(",")
                        .map((s) => s.trim())
                        .filter(Boolean),
                    location: formData.location,
                    about_me: formData.aboutMe,
                    head_shot: finalHeadShotUrl,
                    other_services: (formData.otherServices ?? []).filter(Boolean),
                    what_you_get_working_with_me: formData.whyWorkWithMe,
                    social: {},
                    template_specific: {
                        my_services: finalMyServices,
                        latest_work: finalLatestWork,
                        jobs_open_to: formData.jobsOpenTo,
                        more_work: finalMoreWork,
                    } as any,
                    profile_image: "",
                    services: [],
                },
            };

            await savePhotographerPortfolio(payload);
            toast.success("Portfolio saved successfully!", { id: "saveToast" });
            await revalidateTemplatePhotographerPage();
            router.push("/photographer-portfolio/6");
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
                template_type: "PHOTOGRAPHER",
                display_name: formData.displayName,
                job_titles: formData.jobTitles
                    .split(",")
                    .map((s) => s.trim())
                    .filter(Boolean),
                location: formData.location,
                about_me: formData.aboutMe,
                head_shot: formData.headShot.previewUrl || "",
                other_services: (formData.otherServices ?? []).filter(Boolean),
                what_you_get_working_with_me: formData.whyWorkWithMe,
                social: {},
                template_specific: {
                    photographer: {
                        my_services: formData.myServices
                            .filter((item) => item.image.previewUrl || item.name || item.link)
                            .map((item) => ({
                                image: item.image.previewUrl || "",
                                name: item.name,
                                link: item.link,
                            })),
                        latest_work: formData.latestWork
                            .filter((item) => item.image.previewUrl || item.title || item.link)
                            .map((item) => ({
                                image: item.image.previewUrl || "",
                                title: item.title,
                                link: item.link,
                            })),
                        jobs_open_to: formData.jobsOpenTo,
                        more_work: formData.moreWork.filter((item) => item.name || item.link),
                    },
                },
                profile_image: "",
                services: [],
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

            router.push("/photographer-portfolio/6?preview=true");
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
                    Edit Photographer Portfolio
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
                                onChange={(e) => handleInputChange("displayName", e.target.value)}
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
                                        style={{ width: "auto", height: "auto" }}
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
                                        accept="image/png"
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
                        Skills
                    </label>
                    <div className="space-y-4">
                        {(formData.otherServices ?? []).map((service, index) => (
                            <input
                                key={index}
                                type="text"
                                value={service}
                                onChange={(e) => handleOtherServiceChange(index, e.target.value)}
                                className="w-full p-4 bg-gray-100 rounded-lg border-0 focus:ring-2 focus:ring-[#0A1754] focus:bg-white transition"
                                placeholder="Skill (e.g., Photo Retouching)"
                                disabled={isAnyLoading}
                            />
                        ))}
                    </div>
                </div>

                <div>
                    <label className="block text-[#0A1754] font-semibold text-xl mb-6">
                        My Services
                    </label>
                    <div className="space-y-6">
                        {formData.myServices.map((service, index) => (
                            <div
                                key={index}
                                className="grid grid-cols-1 md:grid-cols-2 gap-6"
                            >
                                <div className="aspect-video bg-gray-100 rounded-lg flex flex-col items-center justify-center border-2 border-dashed border-gray-300 hover:border-[#0A1754] transition cursor-pointer relative">
                                    {service.image.previewUrl ? (
                                        <div className="relative w-full h-full">
                                            <Image
                                                src={service.image.previewUrl || "/placeholder.svg"}
                                                alt={`Service ${index + 1}`}
                                                className="w-full h-full object-cover rounded-lg"
                                                width={200}
                                                height={200}
                                                style={{ width: "auto", height: "auto" }}
                                            />
                                            <button
                                                onClick={() => handleRemoveImage("myServices", index)}
                                                className="absolute top-2 right-2 p-1 bg-red-500 text-white rounded-full hover:bg-red-600"
                                                disabled={isAnyLoading}
                                            >
                                                <X size={16} />
                                            </button>
                                        </div>
                                    ) : (
                                        <label
                                            htmlFor={`my-services-upload-${index}`}
                                            className="cursor-pointer w-full h-full flex flex-col items-center justify-center"
                                        >
                                            <input
                                                id={`my-services-upload-${index}`}
                                                type="file"
                                                accept="image/png"
                                                ref={(el) => {
                                                    myServicesInputRefs.current[index] = el;
                                                }}
                                                onChange={(e) => handleImageFileChange(e, "myServices", index)}
                                                className="hidden"
                                                disabled={isAnyLoading}
                                            />
                                            <div className="text-center">
                                                {isUploadingMedia && service.image.file ? (
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
                                <div className="space-y-3">
                                    <input
                                        type="text"
                                        value={service.name}
                                        onChange={(e) =>
                                            handleMyServiceChange(index, "name", e.target.value)
                                        }
                                        placeholder="Name of service (e.g., Event Photography)"
                                        className="w-full p-3 bg-gray-100 rounded-lg border-0 focus:ring-2 focus:ring-[#0A1754] focus:bg-white transition text-sm"
                                        disabled={isAnyLoading}
                                    />
                                    <input
                                        type="url"
                                        value={service.link}
                                        onChange={(e) =>
                                            handleMyServiceChange(index, "link", e.target.value)
                                        }
                                        placeholder="Paste link to examples"
                                        className="w-full p-3 bg-gray-100 rounded-lg border-0 focus:ring-2 focus:ring-[#0A1754] focus:bg-white transition text-sm"
                                        disabled={isAnyLoading}
                                    />
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                <div>
                    <label className="block text-[#0A1754] font-semibold text-xl mb-6">
                        Latest Work
                    </label>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {formData.latestWork.map((item, index) => (
                            <div key={index} className="space-y-3">
                                <div className="aspect-video bg-gray-100 rounded-lg flex flex-col items-center justify-center border-2 border-dashed border-gray-300 hover:border-[#0A1754] transition cursor-pointer relative">
                                    {item.image.previewUrl ? (
                                        <div className="relative w-full h-full">
                                            <Image
                                                src={item.image.previewUrl || "/placeholder.svg"}
                                                alt={`Latest work ${index + 1}`}
                                                className="w-full h-full object-cover rounded-lg"
                                                width={200}
                                                height={200}
                                                style={{ width: "auto", height: "auto" }}
                                            />
                                            <button
                                                onClick={() => handleRemoveImage("latestWork", index)}
                                                className="absolute top-2 right-2 p-1 bg-red-500 text-white rounded-full hover:bg-red-600"
                                                disabled={isAnyLoading}
                                            >
                                                <X size={16} />
                                            </button>
                                        </div>
                                    ) : (
                                        <label
                                            htmlFor={`latest-work-upload-${index}`}
                                            className="cursor-pointer w-full h-full flex flex-col items-center justify-center"
                                        >
                                            <input
                                                id={`latest-work-upload-${index}`}
                                                type="file"
                                                accept="image/png"
                                                ref={(el) => {
                                                    latestWorkInputRefs.current[index] = el;
                                                }}
                                                onChange={(e) => handleImageFileChange(e, "latestWork", index)}
                                                className="hidden"
                                                disabled={isAnyLoading}
                                            />
                                            <div className="text-center">
                                                {isUploadingMedia && item.image.file ? (
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
                                <input
                                    type="text"
                                    value={item.title}
                                    onChange={(e) =>
                                        handleLatestWorkChange(index, "title", e.target.value)
                                    }
                                    placeholder="Title of work (e.g., Wedding at Sunset)"
                                    className="w-full p-3 bg-gray-100 rounded-lg border-0 focus:ring-2 focus:ring-[#0A1754] focus:bg-white transition text-sm"
                                    disabled={isAnyLoading}
                                />
                                <input
                                    type="url"
                                    value={item.link}
                                    onChange={(e) =>
                                        handleLatestWorkChange(index, "link", e.target.value)
                                    }
                                    placeholder="Link to project/gallery"
                                    className="w-full p-3 bg-gray-100 rounded-lg border-0 focus:ring-2 focus:ring-[#0A1754] focus:bg-white transition text-sm"
                                    disabled={isAnyLoading}
                                />
                            </div>
                        ))}
                    </div>
                </div>

                <div>
                    <label className="block text-[#0A1754] font-semibold text-xl mb-6 text-center">
                        More Work
                    </label>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {formData.moreWork.map((item, index) => (
                            <div key={index} className="space-y-3">
                                <input
                                    type="text"
                                    value={item.name}
                                    onChange={(e) =>
                                        handleMoreWorkChange(index, "name", e.target.value)
                                    }
                                    placeholder="Name of project/event"
                                    className="w-full p-3 bg-gray-100 rounded-lg border-0 focus:ring-2 focus:ring-[#0A1754] focus:bg-white transition text-sm"
                                    disabled={isAnyLoading}
                                />
                                <input
                                    type="url"
                                    value={item.link}
                                    onChange={(e) =>
                                        handleMoreWorkChange(index, "link", e.target.value)
                                    }
                                    placeholder="Paste link to project/gallery"
                                    className="w-full p-3 bg-gray-100 rounded-lg border-0 focus:ring-2 focus:ring-[#0A1754] focus:bg-white transition text-sm"
                                    disabled={isAnyLoading}
                                />
                            </div>
                        ))}
                    </div>
                </div>

                <div>
                    <label className="block text-[#0A1754] font-semibold text-xl mb-3">
                        Jobs Open To
                    </label>
                    <textarea
                        value={formData.jobsOpenTo}
                        onChange={(e) => handleInputChange("jobsOpenTo", e.target.value)}
                        rows={4}
                        className="w-full p-4 bg-gray-100 rounded-lg border-0 focus:ring-2 focus:ring-[#0A1754] focus:bg-white transition resize-none"
                        placeholder="Describe the types of jobs you're open to (separate with commas)"
                        disabled={isAnyLoading}
                    />
                </div>

                <div>
                    <label className="block text-[#0A1754] font-semibold text-xl mb-3">
                        Why You Should Work With Me
                    </label>
                    <textarea
                        value={formData.whyWorkWithMe}
                        onChange={(e) => handleInputChange("whyWorkWithMe", e.target.value)}
                        rows={8}
                        className="w-full p-4 bg-gray-100 rounded-lg border-0 focus:ring-2 focus:ring-[#0A1754] focus:bg-white transition resize-none"
                        placeholder="Explain why clients should choose to work with you"
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