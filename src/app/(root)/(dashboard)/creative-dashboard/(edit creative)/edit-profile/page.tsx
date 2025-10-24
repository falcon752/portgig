/* eslint-disable @typescript-eslint/no-unused-expressions */
/* eslint-disable @typescript-eslint/no-unused-vars */
"use client"
import { Buttons } from "@/src/components/export_components"
import type React from "react"

import { CreatorAuth } from "@/src/lib/requests/auth.new"
import { useAppSelector } from "@/src/redux/hooks"
import { industryOptions } from "@/src/utils/industryData"
import { zodResolver } from "@hookform/resolvers/zod"
import Image from "next/image"
import { useEffect, useState, useRef } from "react"
import { useForm } from "react-hook-form"
import toast from "react-hot-toast"
import NaijaStates from "naija-state-local-government"
import * as z from "zod"
import { FiChevronDown } from "react-icons/fi"
import ProfileSuccessModal from "@/src/components/ProfileSuccessModal"
import { uploadAllMedia } from "@/src/api/upload-media"
import Cookies from "universal-cookie";

const cookies = new Cookies();

const formSchema = z.object({
  full_name: z.string().optional(),
  email: z.string().optional(),
  phone: z.string().optional(),
  state: z.string().optional(),
  lga: z.string().optional(),
  industry: z.string().optional(),
  bio: z.string().optional(),
})  

type FormData = z.infer<typeof formSchema>

type FieldType = keyof typeof industryOptions

interface LGAResult {
  state: string
  lgas: string[]
}

const CreatorProfilePage = () => {
  const [isLoading, setIsLoading] = useState(false)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)
  const [selectedState, setSelectedState] = useState("")
  const [showSuccessModal, setShowSuccessModal] = useState(false)
  const [profilePicture, setProfilePicture] = useState<string>("")
  const [isUploadingPicture, setIsUploadingPicture] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const { profile } = useAppSelector((state) => state.user)

  const options = {
      path: "/",
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict" as const,
      maxAge: 24 * 60 * 60,
    };

  const states = NaijaStates.states()
  const lgas = selectedState ? (NaijaStates.lgas(selectedState) as unknown as LGAResult).lgas : []

  const userType = cookies.get("userType");
  console.log('usertype', userType)

  // Use profile.profile directly for clarity
  const userProfile = profile?.profile;

  const { register, handleSubmit, setValue, reset, watch } = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      full_name: "",
      email: "",
      phone: "",
      state: "",
      lga: "",
      industry: "",
      bio: "",
    },
  })

  // Watch form values for controlled inputs
  const watchedState = watch("state")
  const watchedLga = watch("lga")
  const watchedIndustry = watch("industry")

  useEffect(() => {
    if (profile && userProfile) {
      const newFormData = {
        full_name: userProfile.full_name || "",
        email: userProfile.email || profile.auth?.email || "",
        phone: userProfile.phone_number || "",
        state: userProfile.location?.state || "",
        lga: userProfile.location?.lga || "",
        industry: userProfile.industry || "",
        bio: userProfile.bio || "",
      }

      setProfilePicture(userProfile.profile_picture || "")
      setSelectedState(userProfile.location?.state || "")

      // Use reset to properly populate the form
      reset(newFormData)
    }
  }, [profile, userProfile, reset])

  // Update selectedState when state field changes
  useEffect(() => {
    if (watchedState) {
      setSelectedState(watchedState)
    }
  }, [watchedState])

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

        const updatedData = {
          profile: {
            profile_picture: imageUrl,
          },
        }

        const response = await CreatorAuth.updateProfile(updatedData, "PROFILE")

        if (response.status === 200) {
          setProfilePicture(imageUrl)
          toast.success("Profile picture updated successfully!")
        } else {
          toast.error(response.message || "Failed to update profile picture")
        }
      }
    } catch {
      toast.error("Failed to upload profile picture")
    } finally {
      setIsUploadingPicture(false)
      if (fileInputRef.current) {
        fileInputRef.current.value = ""
      }
    }
  }

  const handleUploadClick = () => {
    fileInputRef.current?.click()
  }

  const handleStateChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newState = e.target.value
    setValue("state", newState, { shouldDirty: true })
    setSelectedState(newState)
    // Reset LGA when state changes
    setValue("lga", "", { shouldDirty: true })
  }

  const handleLgaChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setValue("lga", e.target.value, { shouldDirty: true })
  }

  const handleIndustryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setValue("industry", e.target.value, { shouldDirty: true })
  }

  const updateProfile = async (data: FormData) => {
    try {
      const updatedData = {
        profile: {
          full_name: data.full_name || "",
          email: data.email || "",
          phone_number: data.phone || "",
          bio: data.bio || "",
          location: {
            state: data.state || "",
            lga: data.lga || "",
          },
          industry: data.industry || "",
          field: "",
          years_of_experience: "",
          social_links: {
            linkedin: "",
            twitter: "",
            instagram: "",
            tiktok: "",
          },
        },
      }

      const response = await CreatorAuth.updateProfile(updatedData, "PROFILE")

      if (response.status === 200) {
        toast.success(response.message)
        setShowSuccessModal(true)
      } else {
        const errorMsg = response.message || "Failed to update profile"
        setErrorMessage(errorMsg)
        toast.error(errorMsg)
      }
    } catch (error) {
      const errorMsg = (error as Error).message || "Failed to update profile"
      setErrorMessage(errorMsg)
      throw new Error(errorMsg)
    }
  }

  const onSubmit = async (data: FormData) => {
    try {
      setIsLoading(true)
      setErrorMessage(null)
      await updateProfile(data)
    } catch {
    } finally {
      setIsLoading(false)
    }
  }

  const handleCloseModal = () => {
    setShowSuccessModal(false)
  }

  return (
    <>
      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col text-black gap-5 font-inter">
        <h4 className="text-2xl font-bold text-[#0A1754]">Edit Profile</h4>

        {/* Profile image */}
        <div className="w-full bg-white p-3 rounded-lg shadow">
          <div className="flex items-center gap-5 px-3 py-3">
            <div className="relative h-24 w-24 lg:h-36 lg:w-36 rounded-lg overflow-hidden">
              <Image src={profilePicture || "/assets/creative.svg"} alt="profile image" fill className="object-cover" />
            </div>
            <div className="flex flex-col gap-2 items-start">
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
              <p className="text-xs text-black font-light">At least 800x800 px is recommended JPG or PNG</p>
            </div>
          </div>
        </div>

        {/* Personal info container */}
        <div className="bg-white shadow rounded-lg p-5 flex flex-col gap-5">
          <header className="w-full flex justify-between items-center">
            <h2 className="text-sm lg:text-lg font-medium font-inter">Personal info</h2>
            <Buttons
              label="Edit"
              className="bg-white text-center rounded-lg h-10 px-4 text-base border"
              onClick={() => {}}
            />
          </header>

          <div className="flex flex-col gap-5 w-full">
            {/* First Row: Full Name, Email, Phone Number */}
            <div
              className="grid grid-cols-1 lg:grid-cols-3 gap-5 w-full p-4 rounded-lg"
              style={{ backgroundColor: "#F2F2F2" }}
            >
              <div className="flex flex-col gap-2">
                <label htmlFor="full_name" className="font-light font-inter">
                  Full Name
                </label>
                <input
                  {...register("full_name")}
                  type="text"
                  className="text-sm bg-white p-3 border border-gray-300 rounded h-12"
                  placeholder="Full Name"
                />
              </div>
              <div className="flex flex-col gap-2">
                <label htmlFor="email" className="font-light font-inter">
                  Email
                </label>
                <input
                  {...register("email")}
                  type="email"
                  className="text-sm bg-white p-3 border border-gray-300 rounded h-12"
                  placeholder="Email"
                />
              </div>
              <div className="flex flex-col gap-2">
                <label htmlFor="phone" className="font-light font-inter">
                  Phone Number
                </label>
                <input
                  {...register("phone")}
                  type="text"
                  className="text-sm bg-white p-3 border border-gray-300 rounded h-12"
                  placeholder="Phone Number"
                />
              </div>
            </div>

            {/* Second Row: State, LGA, Niche/Industry */}
            <div
              className="grid grid-cols-1 lg:grid-cols-3 gap-5 w-full p-4 rounded"
              style={{ backgroundColor: "#F2F2F2" }}
            >
              <div className="relative flex flex-col gap-2">
                <label htmlFor="state" className="font-light font-inter">
                  State
                </label>
                <select
                  {...register("state")}
                  className="appearance-none text-sm bg-white p-3 border border-gray-300 rounded h-12"
                  onChange={handleStateChange}
                  value={watchedState || ""}
                >
                  <option value="">Select State</option>
                  {states.map((state) => (
                    <option key={state} value={state}>
                      {state}
                    </option>
                  ))}
                </select>
                <FiChevronDown className="absolute right-3 top-12 pointer-events-none text-gray-400" size={20} />
              </div>
              <div className="relative flex flex-col gap-2">
                <label htmlFor="lga" className="font-light font-inter">
                  Local Government
                </label>
                <select
                  {...register("lga")}
                  className="appearance-none text-sm bg-white p-3 border border-gray-300 rounded h-12"
                  onChange={handleLgaChange}
                  value={watchedLga || ""}
                  disabled={!selectedState}
                >
                  <option value="">{selectedState ? "Select LGA" : "Please select a state first"}</option>
                  {lgas.map((lga) => (
                    <option key={lga} value={lga}>
                      {lga}
                    </option>
                  ))}
                </select>
                <FiChevronDown className="absolute right-3 top-12 pointer-events-none text-gray-400" size={20} />
              </div>
              <div className="relative flex flex-col gap-2">
                <label htmlFor="industry" className="font-light font-inter">
                  Niche / Industry
                </label>
                <select
                  {...register("industry")}
                  className="appearance-none text-sm bg-white p-3 border border-gray-300 rounded h-12"
                  onChange={handleIndustryChange}
                  value={watchedIndustry || ""}
                >
                  <option value="">Select Industry</option>
                  {Object.keys(industryOptions).map((field) =>
                    industryOptions[field as FieldType]?.map((industry) => (
                      <option key={industry} value={industry}>
                        {industry}
                      </option>
                    )),
                  )}
                </select>
                <FiChevronDown className="absolute right-3 top-12 pointer-events-none text-gray-400" size={20} />
              </div>
            </div>

            <div className="w-full p-4 rounded-lg" style={{ backgroundColor: "#F2F2F2" }}>
              <div className="flex flex-col gap-2">
                <label htmlFor="bio" className="font-medium font-inter">
                  Bio
                </label>
                <textarea
                  {...register("bio")}
                  className="text-sm bg-white p-3 border border-gray-300 rounded min-h-32 resize-vertical"
                  placeholder="Tell us about yourself..."
                  rows={6}
                />
              </div>
            </div>

            <div className="flex flex-col items-end">
              {errorMessage && <p className="text-sm text-red-500 mb-2">{errorMessage}</p>}
              <Buttons
                type="submit"
                label={isLoading ? "Saving..." : "Save Changes"}
                className="bg-primary! w-fit text-white self-end rounded-lg h-12 px-6 font-raleway font-semibold"
              />
            </div>
          </div>
        </div>
      </form>

      {/* Success Modal Component */}
      <ProfileSuccessModal isOpen={showSuccessModal} onClose={handleCloseModal} />
    </>
  )
}

export default CreatorProfilePage