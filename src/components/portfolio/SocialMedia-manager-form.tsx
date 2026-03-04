"use client"

import { useState, useEffect, useRef, type ChangeEvent } from "react"
import { useRouter } from "next/navigation"
import { Upload, X, Share2 } from "lucide-react"
import Image from "next/image"
import { getImageUrl } from "@/src/utils/image-url"
import { saveSocialMediaManagerPortfolio, getPortfolio, uploadAllMedia } from "../../api/portfolio"
import toast from "react-hot-toast"
import { revalidateTemplateSocialMediaManagerPage } from "@/src/app/Actions"
import Cookies from "universal-cookie"
import { useDraft } from "@/src/hooks/useDraft"
import DraftBanner from "@/src/components/DraftBanner"
import {
    type SocialMediaManagerFormData,
    type PortfolioApiPayload,
    type GetPortfolioResponse,
} from "@/types/portfolio"

export default function SocialMediaForm() {
    const router = useRouter()
    const [isLoading, setIsLoading] = useState(true)
    const [isSavingForm, setIsSavingForm] = useState(false)
    const [isUploadingMedia, setIsUploadingMedia] = useState(false)
    const [isPreviewing, setIsPreviewing] = useState(false)
    const [isSharing, setIsSharing] = useState(false)
    const [username, setUsername] = useState<string | null>(null)

    const [formData, setFormData] = useState<SocialMediaManagerFormData>({
        displayName: "",
        jobTitles: "",
        location: "",
        headShot: { previewUrl: null, file: null },
        aboutMe: "",
        otherServices: Array(6).fill(""),
        genericPortfolioFiles: Array(5).fill({
            image: { previewUrl: null, file: null },
            name: "",
        }),
        describeExperienceYears: "",
        myApproachToStrategyContent: "",
        mission: "",
        skills: Array(6).fill(""),
        caseStudy: [
            {
                brandName: "",
                contribution: "",
                before: { previewUrl: null, file: null },
                after: { previewUrl: null, file: null },
            },
        ],
        graphicDesign: Array(3).fill({ image: { previewUrl: null, file: null } }),
        videoEditing: Array(3).fill(""),
        tools: Array(6).fill(""),
        whyWorkWithMe: "",
    })

    const isAnyLoading = isLoading || isSavingForm || isUploadingMedia || isPreviewing || isSharing

    const [showDraftBanner, setShowDraftBanner] = useState(false);
    const apiLoadedRef = useRef(false);
    const { saveDraft, saveServerSnapshot, loadDraft, clearDraft, hasMeaningfulDraft } =
        useDraft<SocialMediaManagerFormData>("portgig_draft_social_media");

    const headShotInputRef = useRef<HTMLInputElement | null>(null)
    const caseStudyBeforeInputRef = useRef<HTMLInputElement | null>(null)
    const caseStudyAfterInputRef = useRef<HTMLInputElement | null>(null)
    const graphicDesignInputRefs = useRef<(HTMLInputElement | null)[]>(Array(3).fill(null))
    const genericPortfolioInputRefs = useRef<(HTMLInputElement | null)[]>(Array(5).fill(null))

    useEffect(() => {
        const loadPortfolioData = async () => {
            try {
                const cookies = new Cookies()
                const clientAccessToken = cookies.get("access_token")
                const userId = cookies.get("userId") || cookies.get("userid")

                if (!clientAccessToken) {
                    toast.error("Please log in to load your portfolio.")
                    return
                }

                if (!userId) {
                    toast.error("User ID not found. Please log in.")
                    return
                }

                const responseData: GetPortfolioResponse = await getPortfolio(clientAccessToken, userId)

                const portfolio = responseData?.data?.user?.data?.portfolio || responseData?.data?.portfolio || null

                const fetchedUsername = responseData?.data?.user?.data?.bio_data?.user_name || null
                setUsername(fetchedUsername)

                if (portfolio && portfolio.template_type === "SOCIAL_MEDIA_MANAGER") {
                    // Type-safe access to template_specific for social media manager
                    const socialMediaSpecific = portfolio.template_specific &&
                        typeof portfolio.template_specific === "object" &&
                        "social_media_manager" in portfolio.template_specific
                        ? portfolio.template_specific.social_media_manager
                        : null
                    setFormData({
                        displayName: portfolio.display_name || "",
                        jobTitles: portfolio.job_titles?.join(", ") || "",
                        location: portfolio.location || "",
                        headShot: { previewUrl: getImageUrl(portfolio.head_shot) || null, file: null },
                        aboutMe: portfolio.about_me || "",
                        otherServices: [
                            ...(portfolio.other_services || []),
                            ...Array(Math.max(0, 6 - (portfolio.other_services?.length || 0))).fill(""),
                        ].slice(0, 6),
                        genericPortfolioFiles: [
                            ...(portfolio.files?.map((file) => ({
                                image: { previewUrl: getImageUrl(file.image) || null, file: null },
                                name: file.title || "",
                            })) || []),
                            ...Array(Math.max(0, 5 - (portfolio.files?.length || 0))).fill({
                                image: { previewUrl: null, file: null },
                                name: "",
                            }),
                        ].slice(0, 5),
                        describeExperienceYears: socialMediaSpecific?.describe_experience_years || "",
                        myApproachToStrategyContent: socialMediaSpecific?.my_approach_to_strategy_content || "",
                        mission: portfolio.mission || "",
                        skills: socialMediaSpecific?.skills || Array(6).fill(""),
                        caseStudy: socialMediaSpecific?.case_study?.length
                            ? socialMediaSpecific.case_study.map((study: any) => ({
                                brandName: study.brand_name || "",
                                contribution: study.contribution || "",
                                before: { previewUrl: getImageUrl(study.before) || null, file: null },
                                after: { previewUrl: getImageUrl(study.after) || null, file: null },
                            }))
                            : [
                                {
                                    brandName: "",
                                    contribution: "",
                                    before: { previewUrl: null, file: null },
                                    after: { previewUrl: null, file: null },
                                },
                            ],
                        graphicDesign: [
                            ...(socialMediaSpecific?.graphic_design?.map((img: string) => ({
                                image: { previewUrl: getImageUrl(img) || null, file: null },
                            })) || []),
                            ...Array(Math.max(0, 3 - (socialMediaSpecific?.graphic_design?.length || 0))).fill({
                                image: { previewUrl: null, file: null },
                            }),
                        ].slice(0, 3),
                        videoEditing: [
                            ...(socialMediaSpecific?.video_editing || []),
                            ...Array(Math.max(0, 3 - (socialMediaSpecific?.video_editing?.length || 0))).fill(""),
                        ].slice(0, 3),
                        tools: socialMediaSpecific?.tools || Array(6).fill(""),
                        whyWorkWithMe: portfolio.what_you_get_working_with_me || "",
                    })
                } else {
                    toast("No existing social media manager portfolio found. Starting fresh.")
                }
            } catch (error: unknown) {
                if (error instanceof Error) {
                    toast.error(`Failed to load portfolio: ${error.message}`)
                } else {
                    toast.error("Failed to load existing portfolio data.")
                }
            } finally {
                setIsLoading(false)
            }
        }
        loadPortfolioData()
    }, [])

    // Detect API load completion → compare with any saved draft
    useEffect(() => {
        if (!isLoading && !apiLoadedRef.current) {
            apiLoadedRef.current = true;
            saveServerSnapshot(formData);
            if (hasMeaningfulDraft()) setShowDraftBanner(true);
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [isLoading])

    // Auto-save draft 1.5 s after the user stops editing
    useEffect(() => {
        if (!apiLoadedRef.current) return;
        const timer = setTimeout(() => saveDraft(formData), 1500);
        return () => clearTimeout(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [formData])

    const handleInputChange = (field: keyof SocialMediaManagerFormData, value: string | string[]) => {
        setFormData((prev) => ({ ...prev, [field]: value }))
    }

    const handleOtherServiceChange = (index: number, value: string) => {
        setFormData((prev) => ({
            ...prev,
            otherServices: (prev.otherServices ?? []).map((service, i) => (i === index ? value : service)),
        }))
    }

    const handleGenericPortfolioTextChange = (index: number, field: "name", value: string) => {
        setFormData((prev) => ({
            ...prev,
            genericPortfolioFiles: prev.genericPortfolioFiles.map((item, i) =>
                i === index ? { ...item, [field]: value } : item,
            ),
        }))
    }

    const handleCaseStudyChange = (field: keyof SocialMediaManagerFormData["caseStudy"][0], value: string) => {
        setFormData((prev) => ({
            ...prev,
            caseStudy: prev.caseStudy.map((study, i) => (i === 0 ? { ...study, [field]: value } : study)),
        }))
    }

    const handleVideoEditingChange = (index: number, value: string) => {
        setFormData((prev) => ({
            ...prev,
            videoEditing: prev.videoEditing.map((link, i) => (i === index ? value : link)),
        }))
    }

    const handleImageFileChange = (
        event: ChangeEvent<HTMLInputElement>,
        type: "headShot" | "caseStudyBefore" | "caseStudyAfter" | "graphicDesign" | "genericPortfolio",
        index?: number,
    ) => {
        const file = event.target.files?.[0]
        if (file && file.type === "image/png") {
            const reader = new FileReader()
            reader.onloadend = () => {
                const previewUrl = reader.result as string
                setFormData((prev) => {
                    if (type === "headShot") {
                        return { ...prev, headShot: { previewUrl, file } }
                    } else if (type === "caseStudyBefore") {
                        return {
                            ...prev,
                            caseStudy: prev.caseStudy.map((study, i) =>
                                i === 0 ? { ...study, before: { previewUrl, file } } : study,
                            ),
                        }
                    } else if (type === "caseStudyAfter") {
                        return {
                            ...prev,
                            caseStudy: prev.caseStudy.map((study, i) =>
                                i === 0 ? { ...study, after: { previewUrl, file } } : study,
                            ),
                        }
                    } else if (type === "graphicDesign" && index !== undefined) {
                        return {
                            ...prev,
                            graphicDesign: prev.graphicDesign.map((item, i) =>
                                i === index ? { ...item, image: { previewUrl, file } } : item,
                            ),
                        }
                    } else if (type === "genericPortfolio" && index !== undefined) {
                        return {
                            ...prev,
                            genericPortfolioFiles: prev.genericPortfolioFiles.map((item, i) =>
                                i === index ? { ...item, image: { previewUrl, file } } : item,
                            ),
                        }
                    }
                    return prev
                })
            }
            reader.readAsDataURL(file)
        } else if (file) {
            toast.error("Please upload a PNG image.")
        }
    }

    const handleRemoveImage = (
        type: "headShot" | "caseStudyBefore" | "caseStudyAfter" | "graphicDesign" | "genericPortfolio",
        index?: number,
    ) => {
        setFormData((prev) => {
            if (type === "headShot") {
                return { ...prev, headShot: { previewUrl: null, file: null } }
            } else if (type === "caseStudyBefore") {
                return {
                    ...prev,
                    caseStudy: prev.caseStudy.map((study, i) =>
                        i === 0 ? { ...study, before: { previewUrl: null, file: null } } : study,
                    ),
                }
            } else if (type === "caseStudyAfter") {
                return {
                    ...prev,
                    caseStudy: prev.caseStudy.map((study, i) =>
                        i === 0 ? { ...study, after: { previewUrl: null, file: null } } : study,
                    ),
                }
            } else if (type === "graphicDesign" && index !== undefined) {
                return {
                    ...prev,
                    graphicDesign: prev.graphicDesign.map((item, i) =>
                        i === index ? { ...item, image: { previewUrl: null, file: null } } : item,
                    ),
                }
            } else if (type === "genericPortfolio" && index !== undefined) {
                return {
                    ...prev,
                    genericPortfolioFiles: prev.genericPortfolioFiles.map((item, i) =>
                        i === index ? { ...item, image: { previewUrl: null, file: null } } : item,
                    ),
                }
            }
            return prev
        })
        toast(
            `${type === "headShot"
                ? "Headshot"
                : type === "caseStudyBefore"
                    ? "Case Study Before"
                    : type === "caseStudyAfter"
                        ? "Case Study After"
                        : type === "graphicDesign"
                            ? `Graphic Design image ${index! + 1}`
                            : `Portfolio image ${index! + 1}`
            } removed.`,
            { icon: "🗑️" },
        )
    }

    const handleFontColorClick = () => {
        router.push("/edit-font")
    }

    const handleShare = async () => {
        setIsSharing(true)
        try {
            const cookies = new Cookies()
            const userId = cookies.get("userId") || cookies.get("userid")
            let portfolioUrl: string
            
            const displayNameSlug = formData.displayName
                ? formData.displayName.trim().toLowerCase().replace(/\s+/g, "-")
                : (username || "portfolio");
            portfolioUrl = `${window.location.origin}/social-media-portfolio/${encodeURIComponent(displayNameSlug)}/${encodeURIComponent(userId)}`;
            
            await navigator.clipboard.writeText(portfolioUrl)
            toast.success("Portfolio URL copied to clipboard!")
        } catch {
            toast.error("Failed to copy portfolio URL.")
        } finally {
            setIsSharing(false)
        }
    }

    const handleSave = async () => {
        setIsSavingForm(true)
        setIsUploadingMedia(true)
        toast.loading("Saving portfolio...", { id: "saveToast" })
        try {
            const cookies = new Cookies()
            const authToken = cookies.get("access_token")
            const userId = cookies.get("userId") || cookies.get("userid")
            if (!authToken || !userId) {
                toast.error("Authentication required. Please log in.", { id: "saveToast" })
                return
            }

            if (!formData.describeExperienceYears || !formData.myApproachToStrategyContent) {
                toast.error("Please fill in Years of Experience and My Approach to Strategy Content.", { id: "saveToast" })
                return
            }

            const filesToUpload: File[] = []
            const fileMap = new Map<File, string>()
            if (formData.headShot.file) filesToUpload.push(formData.headShot.file)
            if (formData.caseStudy[0].before.file) filesToUpload.push(formData.caseStudy[0].before.file)
            if (formData.caseStudy[0].after.file) filesToUpload.push(formData.caseStudy[0].after.file)
            formData.graphicDesign.forEach((item) => {
                if (item.image.file) filesToUpload.push(item.image.file)
            })
            formData.genericPortfolioFiles.forEach((item) => {
                if (item.image.file) filesToUpload.push(item.image.file)
            })

            let uploadedUrls: string[] = []
            if (filesToUpload.length > 0) {
                uploadedUrls = await uploadAllMedia(filesToUpload)
                filesToUpload.forEach((file, index) => fileMap.set(file, uploadedUrls[index]))
            }

            const payload: PortfolioApiPayload = {
                portfolio: {
                    template_type: "SOCIAL_MEDIA_MANAGER",
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
                    mission: formData.mission,
                    other_services: (formData.otherServices ?? []).filter(Boolean),
                    files: formData.genericPortfolioFiles
                        .filter((item) => item.image.previewUrl || item.name)
                        .map((item) => ({
                            image: item.image.file ? fileMap.get(item.image.file) || "" : item.image.previewUrl || "",
                            title: item.name,
                        })),
                    what_you_get_working_with_me: formData.whyWorkWithMe,
                    template_specific: {
                        describe_experience_years: formData.describeExperienceYears,
                        my_approach_to_strategy_content: formData.myApproachToStrategyContent,
                        skills: Array.isArray(formData.skills)
                            ? formData.skills.filter(Boolean)
                            : (formData.skills as string)
                                .split(",")
                                .map((s: any) => s.trim())
                                .filter(Boolean),
                        case_study: formData.caseStudy
                            .filter(
                                (study) => study.brandName || study.contribution || study.before.previewUrl || study.after.previewUrl,
                            )
                            .map((study) => ({
                                brand_name: study.brandName,
                                contribution: study.contribution,
                                before: study.before.file ? fileMap.get(study.before.file) || "" : study.before.previewUrl || "",
                                after: study.after.file ? fileMap.get(study.after.file) || "" : study.after.previewUrl || "",
                            })),
                        graphic_design: formData.graphicDesign
                            .filter((item) => item.image.previewUrl)
                            .map((item) => (item.image.file ? fileMap.get(item.image.file) || "" : item.image.previewUrl || "")),
                        video_editing: formData.videoEditing.filter(Boolean),
                        tools: Array.isArray(formData.tools)
                            ? formData.tools.filter(Boolean)
                            : (formData.tools as string)
                                .split(",")
                                .map((s: any) => s.trim())
                                .filter(Boolean),
                    } as any,
                    profile_image: "",
                    services: [],
                },
            }

            await saveSocialMediaManagerPortfolio(payload)
            toast.success("Portfolio saved successfully!", { id: "saveToast" })
            await revalidateTemplateSocialMediaManagerPage()
            const _smNavUserId = cookies.get("userId") || cookies.get("userid") || ""
            const _smNavSlug = formData.displayName ? formData.displayName.trim().toLowerCase().replace(/\s+/g, "-") : "portfolio"
            router.push(`/social-media-portfolio/${encodeURIComponent(_smNavSlug)}/${encodeURIComponent(_smNavUserId)}`)
            clearDraft()
        } catch (error: unknown) {
            toast.error(`Failed to save portfolio: ${error instanceof Error ? error.message : String(error)}`, {
                id: "saveToast",
            })
        } finally {
            setIsSavingForm(false)
            setIsUploadingMedia(false)
        }
    }

    const handlePreview = async () => {
        setIsPreviewing(true)
        try {
            const previewData = {
                template_type: "SOCIAL_MEDIA_MANAGER",
                display_name: formData.displayName,
                job_titles: formData.jobTitles
                    .split(",")
                    .map((s) => s.trim())
                    .filter(Boolean),
                location: formData.location,
                head_shot: formData.headShot.previewUrl || "",
                about_me: formData.aboutMe,
                mission: formData.mission,
                other_services: (formData.otherServices ?? []).filter(Boolean),
                files: formData.genericPortfolioFiles
                    .filter((item) => item.image.previewUrl || item.name)
                    .map((item) => ({
                        image: item.image.previewUrl || "",
                        title: item.name,
                    })),
                what_you_get_working_with_me: formData.whyWorkWithMe,
                template_specific: {
                    social_media_manager: {
                        describe_experience_years: formData.describeExperienceYears,
                        my_approach_to_strategy_content: formData.myApproachToStrategyContent,
                        skills: Array.isArray(formData.skills)
                            ? formData.skills.filter(Boolean)
                            : (formData.skills as string)
                                .split(",")
                                .map((s: any) => s.trim())
                                .filter(Boolean),
                        case_study: formData.caseStudy.map((study) => ({
                            brand_name: study.brandName,
                            contribution: study.contribution,
                            before: study.before.previewUrl || "",
                            after: study.after.previewUrl || "",
                        })),
                        graphic_design: formData.graphicDesign
                            .filter((item) => item.image.previewUrl)
                            .map((item) => item.image.previewUrl || ""),
                        video_editing: formData.videoEditing.filter(Boolean),
                        tools: Array.isArray(formData.tools)
                            ? formData.tools.filter(Boolean)
                            : (formData.tools as string)
                                .split(",")
                                .map((s: any) => s.trim())
                                .filter(Boolean),
                    },
                },
                profile_image: "",
                services: [],
            }

            const previewPayload = {
                data: previewData,
                timestamp: Date.now(),
                isPreview: true,
            }

            sessionStorage.setItem("portfolioPreviewData", JSON.stringify(previewPayload))

            router.push("/social-media-portfolio/5?preview=true")
        } catch {
            toast.error("Failed to open preview. Please try again.")
        } finally {
            setIsPreviewing(false)
        }
    }

    const handleCancel = () => {
        router.back()
    }

    if (isLoading) {
        return (
            <div className="w-full max-w-4xl mx-auto bg-white font-inter mb-5 lg:mb-10 flex items-center justify-center min-h-96">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#0A1754] mx-auto mb-4"></div>
                    <p className="text-[#0A1754] font-medium">Loading profile...</p>
                </div>
            </div>
        )
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
                <h1 className="text-base lg:text-2xl font-semibold font-inter">Edit Social Media Manager Portfolio</h1>
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
                        {isSavingForm ? "Saving..." : isUploadingMedia ? "Uploading Media..." : "Save"}
                    </button>
                </div>
            </div>

            <div className="p-6 space-y-8">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <div className="space-y-6">
                        <div>
                            <label className="block text-[#0A1754] font-semibold text-xl mb-3">Display Name</label>
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
                            <label className="block text-[#0A1754] font-semibold text-xl mb-3">Job Titles</label>
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
                            <label className="block text-[#0A1754] font-semibold text-xl mb-3">Location</label>
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
                        <label className="block text-[#0A1754] font-semibold text-xl mb-3 text-center">Head Shot</label>
                        <div className="aspect-4/5 bg-gray-100 rounded-lg flex flex-col items-center justify-center border-2 border-dashed border-gray-300 hover:border-[#0A1754] transition cursor-pointer relative">
                            {formData.headShot.previewUrl ? (
                                <div className="relative w-full h-full">
                                    <Image
                                        src={formData.headShot.previewUrl || "/placeholder.svg"}
                                        alt="Head shot"
                                        className="w-full h-full object-cover rounded-lg"
                                        width={200}
                                        height={250}
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
                                        ref={headShotInputRef}
                                        onChange={(e) => handleImageFileChange(e, "headShot")}
                                        className="hidden"
                                        disabled={isAnyLoading}
                                    />
                                    <div className="text-center">
                                        {isUploadingMedia && formData.headShot.file ? (
                                            <span className="text-[#0A1754] font-medium">Uploading...</span>
                                        ) : (
                                            <>
                                                <Upload className="mx-auto mb-2 text-[#0A1754]" size={24} />
                                                <span className="text-[#0A1754] font-medium">Upload PNG</span>
                                            </>
                                        )}
                                    </div>
                                </label>
                            )}
                        </div>
                    </div>
                </div>

                <div>
                    <label className="block text-[#0A1754] font-semibold text-xl mb-3">About Me</label>
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
                    <label className="block text-[#0A1754] font-semibold text-xl mb-3">Years of Experience</label>
                    <input
                        type="text"
                        value={formData.describeExperienceYears}
                        onChange={(e) => handleInputChange("describeExperienceYears", e.target.value)}
                        className="w-full p-4 bg-gray-100 rounded-lg border-0 focus:ring-2 focus:ring-[#0A1754] focus:bg-white transition"
                        placeholder="e.g., 5+ years in social media management"
                        disabled={isAnyLoading}
                    />
                </div>

                <div>
                    <label className="block text-[#0A1754] font-semibold text-xl mb-3">My Approach to Strategy Content</label>
                    <textarea
                        value={formData.myApproachToStrategyContent}
                        onChange={(e) => handleInputChange("myApproachToStrategyContent", e.target.value)}
                        rows={8}
                        className="w-full p-4 bg-gray-100 rounded-lg border-0 focus:ring-2 focus:ring-[#0A1754] focus:bg-white transition resize-none"
                        placeholder="Describe your approach to strategy content"
                        disabled={isAnyLoading}
                    />
                </div>

                <div>
                    <label className="block text-[#0A1754] font-semibold text-xl mb-3">Mission & Vision</label>
                    <textarea
                        value={formData.mission}
                        onChange={(e) => handleInputChange("mission", e.target.value)}
                        rows={6}
                        className="w-full p-4 bg-gray-100 rounded-lg border-0 focus:ring-2 focus:ring-[#0A1754] focus:bg-white transition resize-none"
                        placeholder="Describe your mission and vision"
                        disabled={isAnyLoading}
                    />
                </div>

                <div>
                    <label className="block text-[#0A1754] font-semibold text-xl mb-3">My Skill Set</label>
                    <textarea
                        value={formData.skills}
                        onChange={(e) => handleInputChange("skills", e.target.value)}
                        rows={4}
                        className="w-full p-4 bg-gray-100 rounded-lg border-0 focus:ring-2 focus:ring-[#0A1754] focus:bg-white transition resize-none"
                        placeholder="e.g., Content Strategy, Community Management, Analytics & Reporting (separate with commas)"
                        disabled={isAnyLoading}
                    />
                    <p className="text-sm text-gray-500 mt-2">
                        Enter skills separated by commas. Include spaces within skill names like &quot;Community Management&quot;.
                    </p>
                </div>

                <div>
                    <label className="block text-[#0A1754] font-semibold text-xl mb-3">Services I Offer</label>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
                    <label className="block text-[#0A1754] font-semibold text-xl mb-6">Case Study</label>
                    <div className="space-y-6">
                        <input
                            type="text"
                            value={formData.caseStudy[0].brandName}
                            onChange={(e) => handleCaseStudyChange("brandName", e.target.value)}
                            placeholder="Name of brand"
                            className="w-full p-4 bg-gray-100 rounded-lg border-0 focus:ring-2 focus:ring-[#0A1754] focus:bg-white transition"
                            disabled={isAnyLoading}
                        />
                        <textarea
                            value={formData.caseStudy[0].contribution}
                            onChange={(e) => handleCaseStudyChange("contribution", e.target.value)}
                            rows={6}
                            className="w-full p-4 bg-gray-100 rounded-lg border-0 focus:ring-2 focus:ring-[#0A1754] focus:bg-white transition resize-none"
                            placeholder="How you helped this brand"
                            disabled={isAnyLoading}
                        />
                        <div className="grid grid-cols-2 gap-6">
                            <div>
                                <h3 className="text-[#0A1754] font-semibold text-lg mb-3 text-center">Before</h3>
                                <div className="aspect-square bg-gray-100 rounded-lg flex flex-col items-center justify-center border-2 border-dashed border-gray-300 hover:border-[#0A1754] transition cursor-pointer relative">
                                    {formData.caseStudy[0].before.previewUrl ? (
                                        <div className="relative w-full h-full">
                                            <Image
                                                src={formData.caseStudy[0].before.previewUrl || "/placeholder.svg" || "/placeholder.svg"}
                                                alt="Case Study Before"
                                                className="w-full h-full object-cover rounded-lg"
                                                width={200}
                                                height={200}
                                            />
                                            <button
                                                onClick={() => handleRemoveImage("caseStudyBefore")}
                                                className="absolute top-2 right-2 p-1 bg-red-500 text-white rounded-full hover:bg-red-600"
                                                disabled={isAnyLoading}
                                            >
                                                <X size={16} />
                                            </button>
                                        </div>
                                    ) : (
                                        <label
                                            htmlFor="case-study-before-upload"
                                            className="cursor-pointer w-full h-full flex flex-col items-center justify-center"
                                        >
                                            <input
                                                id="case-study-before-upload"
                                                type="file"
                                                accept="image/png"
                                                ref={caseStudyBeforeInputRef}
                                                onChange={(e) => handleImageFileChange(e, "caseStudyBefore")}
                                                className="hidden"
                                                disabled={isAnyLoading}
                                            />
                                            <div className="text-center">
                                                {isUploadingMedia && formData.caseStudy[0].before.file ? (
                                                    <span className="text-[#0A1754] font-medium">Uploading...</span>
                                                ) : (
                                                    <>
                                                        <Upload className="mx-auto mb-2 text-[#0A1754]" size={24} />
                                                        <span className="text-[#0A1754] font-medium">Upload PNG</span>
                                                    </>
                                                )}
                                            </div>
                                        </label>
                                    )}
                                </div>
                            </div>
                            <div>
                                <h3 className="text-[#0A1754] font-semibold text-lg mb-3 text-center">After</h3>
                                <div className="aspect-square bg-gray-100 rounded-lg flex flex-col items-center justify-center border-2 border-dashed border-gray-300 hover:border-[#0A1754] transition cursor-pointer relative">
                                    {formData.caseStudy[0].after.previewUrl ? (
                                        <div className="relative w-full h-full">
                                            <Image
                                                src={formData.caseStudy[0].after.previewUrl || "/placeholder.svg" || "/placeholder.svg"}
                                                alt="Case Study After"
                                                className="w-full h-full object-cover rounded-lg"
                                                width={200}
                                                height={200}
                                            />
                                            <button
                                                onClick={() => handleRemoveImage("caseStudyAfter")}
                                                className="absolute top-2 right-2 p-1 bg-red-500 text-white rounded-full hover:bg-red-600"
                                                disabled={isAnyLoading}
                                            >
                                                <X size={16} />
                                            </button>
                                        </div>
                                    ) : (
                                        <label
                                            htmlFor="case-study-after-upload"
                                            className="cursor-pointer w-full h-full flex flex-col items-center justify-center"
                                        >
                                            <input
                                                id="case-study-after-upload"
                                                type="file"
                                                accept="image/png"
                                                ref={caseStudyAfterInputRef}
                                                onChange={(e) => handleImageFileChange(e, "caseStudyAfter")}
                                                className="hidden"
                                                disabled={isAnyLoading}
                                            />
                                            <div className="text-center">
                                                {isUploadingMedia && formData.caseStudy[0].after.file ? (
                                                    <span className="text-[#0A1754] font-medium">Uploading...</span>
                                                ) : (
                                                    <>
                                                        <Upload className="mx-auto mb-2 text-[#0A1754]" size={24} />
                                                        <span className="text-[#0A1754] font-medium">Upload PNG</span>
                                                    </>
                                                )}
                                            </div>
                                        </label>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div>
                    <label className="block text-[#0A1754] font-semibold text-xl mb-6">Graphic Design</label>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {formData.graphicDesign.map((item, index) => (
                            <div
                                key={index}
                                className="aspect-square bg-gray-100 rounded-lg flex flex-col items-center justify-center border-2 border-dashed border-gray-300 hover:border-[#0A1754] transition cursor-pointer relative"
                            >
                                {item.image.previewUrl ? (
                                    <div className="relative w-full h-full">
                                        <Image
                                            src={item.image.previewUrl || "/placeholder.svg"}
                                            alt={`Graphic Design ${index + 1}`}
                                            className="w-full h-full object-cover rounded-lg"
                                            width={200}
                                            height={200}
                                        />
                                        <button
                                            onClick={() => handleRemoveImage("graphicDesign", index)}
                                            className="absolute top-2 right-2 p-1 bg-red-500 text-white rounded-full hover:bg-red-600"
                                            disabled={isAnyLoading}
                                        >
                                            <X size={16} />
                                        </button>
                                    </div>
                                ) : (
                                    <label
                                        htmlFor={`graphic-design-upload-${index}`}
                                        className="cursor-pointer w-full h-full flex flex-col items-center justify-center"
                                    >
                                        <input
                                            id={`graphic-design-upload-${index}`}
                                            type="file"
                                            accept="image/png"
                                            ref={(el) => {
                                                graphicDesignInputRefs.current[index] = el
                                            }}
                                            onChange={(e) => handleImageFileChange(e, "graphicDesign", index)}
                                            className="hidden"
                                            disabled={isAnyLoading}
                                        />
                                        <div className="text-center">
                                            {isUploadingMedia && item.image.file ? (
                                                <span className="text-[#0A1754] font-medium">Uploading...</span>
                                            ) : (
                                                <>
                                                    <Upload className="mx-auto mb-2 text-[#0A1754]" size={24} />
                                                    <span className="text-[#0A1754] font-medium">Upload PNG</span>
                                                </>
                                            )}
                                        </div>
                                    </label>
                                )}
                            </div>
                        ))}
                    </div>
                </div>

                <div>
                    <label className="block text-[#0A1754] font-semibold text-xl mb-6">My Portfolio</label>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {formData.genericPortfolioFiles.map((item, index) => (
                            <div key={index} className="space-y-3">
                                <div className="aspect-square bg-gray-100 rounded-lg flex flex-col items-center justify-center border-2 border-dashed border-gray-300 hover:border-[#0A1754] transition cursor-pointer relative">
                                    {item.image.previewUrl ? (
                                        <div className="relative w-full h-full">
                                            <Image
                                                src={item.image.previewUrl || "/placeholder.svg"}
                                                alt={`Portfolio ${index + 1}`}
                                                className="w-full h-full object-cover rounded-lg"
                                                width={200}
                                                height={200}
                                            />
                                            <button
                                                onClick={() => handleRemoveImage("genericPortfolio", index)}
                                                className="absolute top-2 right-2 p-1 bg-red-500 text-white rounded-full hover:bg-red-600"
                                                disabled={isAnyLoading}
                                            >
                                                <X size={16} />
                                            </button>
                                        </div>
                                    ) : (
                                        <label
                                            htmlFor={`generic-portfolio-upload-${index}`}
                                            className="cursor-pointer w-full h-full flex flex-col items-center justify-center"
                                        >
                                            <input
                                                id={`generic-portfolio-upload-${index}`}
                                                type="file"
                                                accept="image/png"
                                                ref={(el) => {
                                                    genericPortfolioInputRefs.current[index] = el
                                                }}
                                                onChange={(e) => handleImageFileChange(e, "genericPortfolio", index)}
                                                className="hidden"
                                                disabled={isAnyLoading}
                                            />
                                            <div className="text-center">
                                                {isUploadingMedia && item.image.file ? (
                                                    <span className="text-[#0A1754] font-medium">Uploading...</span>
                                                ) : (
                                                    <>
                                                        <Upload className="mx-auto mb-2 text-[#0A1754]" size={24} />
                                                        <span className="text-[#0A1754] font-medium">Upload PNG</span>
                                                    </>
                                                )}
                                            </div>
                                        </label>
                                    )}
                                </div>
                                <input
                                    type="text"
                                    value={item.name}
                                    onChange={(e) => handleGenericPortfolioTextChange(index, "name", e.target.value)}
                                    placeholder="Name of project"
                                    className="w-full p-3 bg-gray-100 rounded-lg border-0 focus:ring-2 focus:ring-[#0A1754] focus:bg-white transition text-center text-sm"
                                    disabled={isAnyLoading}
                                />
                            </div>
                        ))}
                    </div>
                </div>

                <div>
                    <label className="block text-[#0A1754] font-semibold text-xl mb-6">Video Editing (Links)</label>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {formData.videoEditing.map((link, index) => (
                            <div
                                key={index}
                                className="aspect-video bg-gray-100 rounded-lg flex flex-col items-center justify-center border-2 border-dashed border-gray-300"
                            >
                                <input
                                    type="url"
                                    value={link}
                                    onChange={(e) => handleVideoEditingChange(index, e.target.value)}
                                    placeholder="Paste video link"
                                    className="w-full h-full bg-transparent text-center text-[#0A1754] font-medium text-lg border-0 focus:outline-none"
                                    disabled={isAnyLoading}
                                />
                            </div>
                        ))}
                    </div>
                </div>

                <div>
                    <label className="block text-[#0A1754] font-semibold text-xl mb-3">Tools I Use</label>
                    <textarea
                        value={formData.tools}
                        onChange={(e) => handleInputChange("tools", e.target.value)}
                        rows={3}
                        className="w-full p-4 bg-gray-100 rounded-lg border-0 focus:ring-2 focus:ring-[#0A1754] focus:bg-white transition resize-none"
                        placeholder="e.g., Canva, Adobe Photoshop, Hootsuite (separate each tool with a comma)"
                        disabled={isAnyLoading}
                    />
                    <p className="text-sm text-gray-500 mt-2">
                        Enter tools separated by commas. You can include spaces within tool names like &quot;Adobe Photoshop&quot;
                        or &quot;Final Cut Pro&quot;.
                    </p>
                </div>

                <div>
                    <label className="block text-[#0A1754] font-semibold text-xl mb-3">Why You Should Work With Me</label>
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
                    className="px-3 py-1 lg:px-8 lg:py-3 border border-white text-white rounded text-sm hover:bg-white/10 transition cursor-pointer"
                    disabled={isAnyLoading}
                >
                    Cancel
                </button>
                <button
                    onClick={handlePreview}
                    className="px-3 py-1 lg:px-8 lg:py-3 border border-white text-white rounded text-sm hover:bg-white/10 transition cursor-pointer disabled:opacity-50"
                    disabled={isAnyLoading}
                >
                    {isPreviewing ? "Loading..." : "Preview"}
                </button>
                <button
                    onClick={handleSave}
                    className="px-4 py-1 lg:px-10 lg:py-3 bg-white text-[#1e3a8a] rounded font-medium hover:bg-gray-100 transition cursor-pointer disabled:opacity-50"
                    disabled={isAnyLoading}
                >
                    {isSavingForm ? "Saving..." : isUploadingMedia ? "Uploading Media..." : "Save"}
                </button>
            </div>
        </div>
    )
}
