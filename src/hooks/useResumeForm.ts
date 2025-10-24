"use client"

import { useState, useEffect, useCallback } from "react"
import { useForm } from "react-hook-form"
import { useAppSelector } from "@/src/redux/hooks"
import type { FormData, Template, DownloadStatus } from "@/types/resume"

interface RawTemplateData {
  id: string | number
  name?: string
  description?: string
  preview?: string
  category?: string
}

const isValidTemplateData = (data: unknown): data is RawTemplateData => {
  return (
    typeof data === "object" &&
    data !== null &&
    "id" in data &&
    (typeof (data as RawTemplateData).id === "string" || typeof (data as RawTemplateData).id === "number")
  )
}

export const useResumeForm = () => {
  const { profile } = useAppSelector((state) => state.user)
  const [selectedTemplate, setSelectedTemplate] = useState<Template | null>(null)
  const [downloadStatus, setDownloadStatus] = useState<DownloadStatus>({
    canDownload: true,
    daysUntilDownload: 0,
  })

  const formMethods = useForm<FormData>({
    defaultValues: {
      brief: "",
      full_name: "",
      email: "",
      phone_number: "",
      location: "",
      job_title: "",
      education: [{ course: "", school: "", started: "", ended: "" }],
      links: { linkedin: "", twitter: "", instagram: "", tiktok: "" },
      skills: [{ value: "" }],
      experience: [{ location: "", job_title: "", contribution: "", ended: "" }],
      other_skills: [{ value: "" }],
      certifications: [{ value: "" }],
    },
    mode: "onChange",
  })

  const checkDownloadStatus = useCallback((templateId: string): void => {
    try {
      const lastDownloadKey = `cv_download_${templateId}`
      const lastDownload = localStorage.getItem(lastDownloadKey)

      console.log(`Checking download status for template ${templateId}:`, lastDownload)

      if (lastDownload) {
        const lastDownloadDate = new Date(lastDownload)
        const now = new Date()
        const threeMonthsFromLastDownload = new Date(lastDownloadDate)
        threeMonthsFromLastDownload.setMonth(threeMonthsFromLastDownload.getMonth() + 3)
        
        const canDownload = now >= threeMonthsFromLastDownload

        if (!canDownload) {
          const diffTime = threeMonthsFromLastDownload.getTime() - now.getTime()
          const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))

          setDownloadStatus({
            canDownload: false,
            daysUntilDownload: diffDays > 0 ? diffDays : 0,
          })
        } else {
          setDownloadStatus({ canDownload: true, daysUntilDownload: 0 })
        }
      } else {
        setDownloadStatus({ canDownload: true, daysUntilDownload: 0 })
      }
    } catch (error) {
      console.error("Error checking download status:", error)
      setDownloadStatus({ canDownload: true, daysUntilDownload: 0 })
    }
  }, [])

  // Load template from localStorage
  useEffect(() => {
    const loadSelectedTemplate = () => {
      try {
        const template = localStorage.getItem("selectedTemplate")
        const templateId = localStorage.getItem("selectedTemplateId")

        console.log("Loading template from localStorage:", { template, templateId })

        if (template) {
          const parsedData: unknown = JSON.parse(template)
          console.log("Parsed template data:", parsedData)

          if (isValidTemplateData(parsedData)) {
            const parsedTemplate: Template = {
              id: typeof parsedData.id === "number" ? parsedData.id.toString() : parsedData.id,
              name: parsedData.name || `Template ${parsedData.id}`,
              description: parsedData.description,
              preview: parsedData.preview,
              category: parsedData.category,
            }

            console.log("Final parsed template:", parsedTemplate)
            setSelectedTemplate(parsedTemplate)
            checkDownloadStatus(parsedTemplate.id)
          } else {
            console.error("Invalid template data structure:", parsedData)
            setSelectedTemplate(null)
          }
        } else if (templateId) {
          console.log("Creating fallback template from ID:", templateId)
          const fallbackTemplate: Template = {
            id: templateId,
            name: `Template ${templateId}`,
          }
          setSelectedTemplate(fallbackTemplate)
          checkDownloadStatus(templateId)
        } else {
          console.warn("No template found in localStorage")
          setSelectedTemplate(null)
        }
      } catch (error) {
        console.error("Error loading template from localStorage:", error)
        setSelectedTemplate(null)
      }
    }

    // Only run on client side
    if (typeof window !== "undefined") {
      loadSelectedTemplate()

      const handleStorageChange = (e: StorageEvent) => {
        if (e.key === "selectedTemplate" || e.key === "selectedTemplateId") {
          console.log("Storage changed, reloading template")
          loadSelectedTemplate()
        }
      }

      window.addEventListener("storage", handleStorageChange)

      return () => {
        window.removeEventListener("storage", handleStorageChange)
      }
    }
  }, [checkDownloadStatus])

  // Load profile data into form
  useEffect(() => {
    if (profile?.resume) {
      console.log("Loading profile data into form")
      const { setValue } = formMethods

      setValue("brief", profile.resume.brief || "")
      setValue("full_name", profile.bio_data?.full_name || profile.resume.full_name || "")
      setValue("email", profile.resume.email || "")
      setValue("phone_number", profile.resume.phone_number || "")
      setValue("location", profile.resume.location || "")
      setValue("job_title", profile.resume.job_title || "")

      if (profile.resume.education && profile.resume.education.length > 0) {
        const educationArray = profile.resume.education.map((edu) => ({
          course: edu.course || "",
          school: edu.school || "",
          started: edu.started || "",
          ended: edu.ended || ""
        }))
        setValue("education", educationArray)
      }

      if (profile.resume.links) {
        setValue("links", {
          linkedin: profile.resume.links.linkedin || "",
          twitter: profile.resume.links.twitter || "",
          instagram: profile.resume.links.instagram || "",
          tiktok: profile.resume.links.tiktok || ""
        })
      }

      // Set skills data
      if (profile.resume.skills && profile.resume.skills.length > 0) {
        const skillsArray = profile.resume.skills.map((skill: string) => ({ value: skill }))
        setValue("skills", skillsArray)
      }

      // Set experience data
      if (profile.resume.experience && profile.resume.experience.length > 0) {
        const experienceArray = profile.resume.experience.map((exp) => ({
          location: exp.location || "",
          job_title: exp.job_title || "",
          contribution: exp.contribution || "",
          started: exp.started || "",
          ended: exp.ended || ""
        }))
        setValue("experience", experienceArray)
      }

      // Set other skills data
      if (profile.resume.other_skills && profile.resume.other_skills.length > 0) {
        const otherSkillsArray = profile.resume.other_skills.map((skill: string) => ({ value: skill }))
        setValue("other_skills", otherSkillsArray)
      }

      // Set certifications data
      if (profile.resume.certifications && profile.resume.certifications.length > 0) {
        const certificationsArray = profile.resume.certifications.map((cert: string) => ({ value: cert }))
        setValue("certifications", certificationsArray)
      }
    }
  }, [profile, formMethods])

  return {
    formMethods,
    selectedTemplate,
    downloadStatus,
    checkDownloadStatus,
  }
}