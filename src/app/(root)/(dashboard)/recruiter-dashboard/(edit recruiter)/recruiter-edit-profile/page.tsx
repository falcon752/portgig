"use client"

import { Buttons } from "@/src/components/export_components"
import { RecruiterAuth } from "@/src/lib/requests/auth.new"
import { useAppSelector } from "@/src/redux/hooks"
import { zodResolver } from "@hookform/resolvers/zod"
import Image from "next/image"
import { useEffect, useState, useRef } from "react"
import { useForm } from "react-hook-form"
import toast from "react-hot-toast"
import * as z from "zod"
import { LoadingSpinner } from "@/src/utils/util_component"
import { uploadAllMedia } from "@/src/api/upload-media"
import ProfileSuccessModal from "@/src/components/ProfileSuccessModal"

const optionalUrlSchema = z
    .string()
    .optional()
    .refine((val) => !val || z.string().url().safeParse(val).success, {
        message: "Invalid URL",
    })

const formSchema = z.object({
    fullName: z.string().min(1, "Full name is required"),
    email: z.string().email("Invalid email address"),
    phone_number: z.string().min(1, "Phone number is required"),
    location: z.string().min(1, "Location is required"),
    industry: z.string().min(1, "Industry is required"),
    instagram: optionalUrlSchema,
    linkedin: optionalUrlSchema,
    website: optionalUrlSchema,
    twitter: z.string().optional(),
    about_us: z.string().optional(),
    company_name: z.string().optional(),
})

type FormData = z.infer<typeof formSchema>

const RecruiterEditProfile = () => {
    const { recruiterProfile, loading } = useAppSelector((state) => state.recruiter)
    const [errorMessage, setErrorMessage] = useState<string | null>(null)
    const [isLoading, setIsLoading] = useState(false)
    const [profilePicture, setProfilePicture] = useState<string>("")
    const [isUploadingPicture, setIsUploadingPicture] = useState(false)
    const [showSuccessModal, setShowSuccessModal] = useState(false)
    const fileInputRef = useRef<HTMLInputElement>(null)

    const {
        register,
        handleSubmit,
        formState: { errors },
        reset,
        watch,
    } = useForm<FormData>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            fullName: "",
            email: "",
            phone_number: "",
            location: "",
            industry: "",
            instagram: "",
            linkedin: "",
            website: "",
            twitter: "",
            about_us: "",
            company_name: "",
        },
    })

    const formValues = watch()

    useEffect(() => {
        if (recruiterProfile) {
            const defaultValues = {
                fullName: recruiterProfile.bio_data?.full_name || "",
                email: recruiterProfile.auth?.email || "",
                phone_number: recruiterProfile.profile?.phone_number || "",
                location: recruiterProfile.profile?.location || "",
                industry: recruiterProfile.profile?.industry || "",
                instagram: recruiterProfile.profile?.social_links?.instagram || "",
                linkedin: recruiterProfile.profile?.social_links?.linkedin || "",
                website: recruiterProfile.profile?.social_links?.website || "",
                twitter: recruiterProfile.profile?.social_links?.twitter || "",
                about_us: recruiterProfile.company_info?.about_us || "",
                company_name: recruiterProfile.company_info?.company_name || "",
            }

            reset(defaultValues)

            setProfilePicture(recruiterProfile.profile?.profile_picture || "")

            console.log("Recruiter profile data loaded:", defaultValues)
        }
    }, [recruiterProfile, reset])

    const handleProfilePictureUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0]
        if (!file) return

        if (!file.type.startsWith("image/")) {
            toast.error("Please select an image file")
            return
        }

        if (file.size > 5 * 1024 * 1024) {
            toast.error("File size must be less than 5MB")
            return
        }

        try {
            setIsUploadingPicture(true)

            const uploadedUrls = await uploadAllMedia([file])

            if (uploadedUrls && uploadedUrls.length > 0) {
                const imageUrl = uploadedUrls[0]
                setProfilePicture(imageUrl)
                toast.success("Profile picture uploaded successfully!")

                await updateProfileWithPicture(imageUrl)
            }
        } catch (error) {
            console.error("Profile picture upload error:", error)
            toast.error("Failed to upload profile picture")
        } finally {
            setIsUploadingPicture(false)
            if (fileInputRef.current) {
                fileInputRef.current.value = ""
            }
        }
    }

    const updateProfileWithPicture = async (imageUrl: string) => {
        try {
            const updatedData = {
                profile: {
                    full_name: formValues.fullName,
                    email: formValues.email,
                    phone_number: formValues.phone_number,
                    location: formValues.location,
                    industry: formValues.industry,
                    profile_picture: imageUrl,
                    social_links: {
                        instagram: formValues.instagram || "",
                        linkedin: formValues.linkedin || "",
                        website: formValues.website || "",
                        twitter: formValues.twitter || "",
                    },
                },
                company_info: {
                    company_name: formValues.company_name || "",
                    about_us: formValues.about_us || "",
                },
            }

            console.log("Updating profile with:", updatedData)

            const response = await RecruiterAuth.updateProfile(updatedData, "PROFILE")

            if (response.status === 200) {
                toast.success("Profile updated successfully!")
            } else {
                console.error("Profile update failed:", response)
                toast.error(response.message || "Failed to update profile")
            }
        } catch (error) {
            console.error("Profile update error:", error)
            toast.error("Failed to update profile")
        }
    }

    const handleUploadClick = () => {
        fileInputRef.current?.click()
    }

    const onSubmit = async (data: FormData) => {
        setIsLoading(true)
        setErrorMessage(null)

        try {
            const payload = {
                profile: {
                    full_name: data.fullName,
                    email: data.email,
                    phone_number: data.phone_number,
                    location: data.location,
                    industry: data.industry,
                    profile_picture: profilePicture || "",
                    social_links: {
                        instagram: data.instagram || "",
                        linkedin: data.linkedin || "",
                        website: data.website || "",
                        twitter: data.twitter || "",
                    },
                },
                company_info: {
                    company_name: data.company_name || "",
                    about_us: data.about_us || "",
                },
            }

            console.log("Submitting profile data:", payload)

            const res = await RecruiterAuth.updateProfile(payload, "PROFILE")

            if (res.status === 200) {
                toast.success(res.message)
                setShowSuccessModal(true)
            } else {
                const errorMsg = res.message || "Failed to update profile"
                setErrorMessage(errorMsg)
                toast.error(errorMsg)

                console.error("Profile update error response:", res)
            }
        } catch (error: any) {
            console.error("Profile submission error:", error)

            let errorMsg = "An error occurred while updating profile"
            if (error.response) {
                errorMsg = error.response.data?.message || `Server error: ${error.response.status}`
                console.error("Error response data:", error.response.data)
            } else if (error.request) {
                errorMsg = "No response received from server"
                console.error("Error request:", error.request)
            } else {
                errorMsg = error.message || "Request setup error"
            }

            setErrorMessage(errorMsg)
            toast.error(errorMsg)
        } finally {
            setIsLoading(false)
        }
    }

    const handleCloseModal = () => {
        setShowSuccessModal(false)
    }

    if (loading) {
        return (
            <div className="flex justify-center items-center h-full my-5">
                <LoadingSpinner className="border-primary w-16 h-16" />
            </div>
        )
    }

    const formFields: Array<{
        label: string
        field: keyof FormData
        type?: string
        required?: boolean
    }> = [
            { label: "Full Name", field: "fullName", required: true },
            { label: "Email", field: "email", type: "email", required: true },
            { label: "Phone Number", field: "phone_number", required: true },
            { label: "Location", field: "location", required: true },
            { label: "Industry", field: "industry", required: true },
            { label: "Company Name", field: "company_name" },
            { label: "Instagram Handle", field: "instagram", type: "url" },
            { label: "LinkedIn Handle", field: "linkedin", type: "url" },
            { label: "Website Link", field: "website", type: "url" },
            { label: "X Handle", field: "twitter" },
        ]

    return (
        <>
            <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col text-black gap-5 font-inter">
                <h2 className="max-md:hidden text-base md:text-xl font-bold font-inter text-[#0A1754]">Edit profile</h2>

                {/* Profile Image */}
                <div className="w-full lg:bg-white p-3 lg:rounded-lg lg:shadow ">
                    <div className="flex flex-col md:flex-row items-center md:items-start gap-5 px-3 py-3">
                        <div className="relative h-32 w-32 md:h-24 md:w-24 lg:h-36 lg:w-36 rounded-full md:rounded-lg overflow-hidden">
                            <Image
                                src={profilePicture || "/assets/creative.svg"}
                                alt="profile image"
                                fill
                                className="object-cover"
                            />
                        </div>
                        <div className="flex flex-col gap-2 items-center md:items-start">
                            <input
                                ref={fileInputRef}
                                type="file"
                                accept="image/*"
                                onChange={handleProfilePictureUpload}
                                className="hidden"
                            />
                            <Buttons
                                label={isUploadingPicture ? "Uploading..." : "Upload New Photo"}
                                className="rounded-3xl h-12 px-6 text-black font-light text-sm border border-[rgba(10,23,84,0.7)] hover:border-[rgba(10,23,84,1)] transition"
                                onClick={handleUploadClick}
                                disabled={isUploadingPicture}
                            />
                            <p className="text-xs text-black font-light text-center md:text-left">At least 800x800 px is recommended JPG or PNG</p>
                        </div>
                    </div>
                </div>

                {/* Debug information */}
                {errorMessage && (
                    <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative">
                        <strong className="font-bold">Error: </strong>
                        <span className="block sm:inline">{errorMessage}</span>
                    </div>
                )}

                {/* Form Fields */}
                <div className="bg-white rounded-lg p-3 flex flex-col gap-5">
                    <div className="p-3 w-full rounded-lg flex flex-col gap-5 lg:bg-gray-100">
                        <div className="w-full flex justify-between items-center">
                            <h2 className="text-lg font-inter">Personal info</h2>
                            <Buttons
                                label="Edit"
                                className="bg-white text-center rounded-lg h-10 px-4 text-base border hidden md:block"
                                onClick={() => { }}
                            />
                        </div>
                        <div className="flex flex-col md:grid md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-4">
                            {formFields.map(({ label, field, type, required }) => (
                                <div key={field} className="flex flex-col gap-2">
                                    <h2 className="text-sm md:text-[10px] lg:text-sm font-normal md:font-extralight">
                                        {label} {required && <span className="text-red-500">*</span>}
                                    </h2>
                                    <input
                                        {...register(field)}
                                        type={type || "text"}
                                        className="text-sm bg-white p-3 border border-gray-300 rounded h-12"
                                        placeholder={label}
                                        disabled={loading || isLoading}
                                        required={required}
                                    />
                                    {errors[field] && <p className="text-red-500 text-xs">{errors[field]?.message}</p>}
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="p-3 w-full rounded-lg flex flex-col gap-5 lg:bg-gray100">
                        <h2 className="text-sm lg:text-base font-normal">About Us</h2>
                        <textarea
                            {...register("about_us")}
                            maxLength={1000}
                            className="resize-none min-h-32 md:min-h-20 w-full p-3 md:p-2 border border-gray-300 md:border-primary rounded-lg md:rounded-xl outline-none text-sm"
                            placeholder="Tell us about your company (1000 characters max)"
                            disabled={loading || isLoading}
                        />
                        {errors.about_us && (
                            <p className="text-red-500 text-xs">{errors.about_us.message}</p>
                        )}
                    </div>

                    <div className="flex flex-col items-center md:items-end gap-2 px-3 md:px-0">
                        {errorMessage && <p className="text-red-500 text-xs">{errorMessage}</p>}
                        <Buttons
                            type="submit"
                            label={isLoading ? "Saving..." : "Save Changes"}
                            className="bg-primary! w-full md:w-fit text-white rounded-lg md:rounded-sm font-raleway h-12 md:h-auto"
                            disabled={isLoading}
                        />
                    </div>
                </div>
            </form>

            <ProfileSuccessModal isOpen={showSuccessModal} onClose={handleCloseModal} />
        </>
    )
}

export default RecruiterEditProfile