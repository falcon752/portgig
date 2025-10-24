"use client"
import Image from "next/image"
import type React from "react"

import { useState } from "react"
import toast from "react-hot-toast"
import { useRouter } from "next/navigation"
import { Buttons } from "../ui/Buttons"
import { Eye, X, Download } from "lucide-react"
import { updateApplicantStatus, getCreatorReview } from "@/src/lib/requests/recruiterApi"

interface CandidateInfoPanelProps {
    candidate: {
        id: string
        name: string
        role: string
        location: string
        email: string
        avatar: string
        skillLevel: "Beginner" | "Intermediate" | "Mid-level" | "Professional" | "Expert"
        cover_letter?: string
        profile?: any
        jobId?: string | null
        onChat?: () => void
        chatLoading?: boolean
        status?: string
    } | null
    onCandidateRemoved: (candidateId: string) => void
    onStatusUpdate?: (status: string) => void
    onChat?: () => void
}

const CVViewerModal = ({
    isOpen,
    onClose,
    candidateData,
}: {
    isOpen: boolean
    onClose: () => void
    candidateData: any
}) => {
    if (!isOpen || !candidateData) return null

    const formatDate = (dateString: string): string => {
        if (!dateString) return "Present"
        try {
            const date = new Date(dateString)
            if (isNaN(date.getTime())) return "Present"
            return date.toLocaleDateString("en-US", {
                year: "numeric",
                month: "long",
                day: "numeric",
            })
        } catch {
            return "Present"
        }
    }

    const transformedData = transformCreatorDataToFormData(candidateData)

    const handleDownload = async () => {
        try {
            const cvUrl =
                candidateData.cv_url ||
                candidateData.resume?.cv_url ||
                candidateData.profile?.cv_url ||
                candidateData.resume_url

            if (cvUrl) {
                const link = document.createElement("a")
                link.href = cvUrl
                link.download = `${transformedData.fullName}_CV.pdf`
                document.body.appendChild(link)
                link.click()
                document.body.removeChild(link)
            } else {
                const generatedUrl = await generatePDFDataURL(transformedData, formatDate)
                const link = document.createElement("a")
                link.href = generatedUrl
                link.download = `${transformedData.fullName}_CV.png`
                document.body.appendChild(link)
                link.click()
                document.body.removeChild(link)
            }
            toast.success("CV downloaded successfully!")
        } catch{
            toast.error("Failed to download CV. Please try again.")
        }
    }

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-2 sm:p-4">
            <div className="bg-white rounded-lg w-full h-full max-w-[95vw] max-h-[95vh] sm:max-w-4xl sm:max-h-[90vh] overflow-hidden flex flex-col">
                <div className="flex justify-between items-center p-3 sm:p-4 border-b bg-gray-50 shrink-0">
                    <h2 className="text-lg sm:text-xl font-bold">CV Preview</h2>
                    <button onClick={onClose} className="p-1 sm:p-2 hover:bg-gray-200 rounded-full transition-colors">
                        <X size={20} className="sm:w-6 sm:h-6" />
                    </button>
                </div>

                <div className="flex-1 bg-gray-100 p-2 sm:p-4 overflow-y-auto">
                    <div className="bg-white max-w-[210mm] mx-auto min-h-[297mm] shadow-lg">
                        {/* Header */}
                        <div className="bg-[#0A1754] text-white p-8 relative">
                            <div className="flex items-center gap-5">
                                <div className="shrink-0 w-20 h-20 flex items-center justify-center">
                                    <img
                                        src="/assets/white-logo.png"
                                        alt="PortGig Logo"
                                        className="max-w-full max-h-full object-contain"
                                    />
                                </div>
                                <div className="flex-1 text-center">
                                    <h1 className="text-4xl font-bold mb-2">{transformedData.fullName}</h1>
                                    <div className="text-sm">
                                        {transformedData.email}
                                        {transformedData.phone && ` | ${transformedData.phone}`}
                                        {transformedData.location && ` | ${transformedData.location}`}
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Content */}
                        <div className="p-6 sm:p-8">
                            {transformedData.professionalBrief && (
                                <div className="mb-6">
                                    <h2 className="text-lg font-bold text-[#0A1754] mb-3 border-b-2 border-[#0A1754] pb-1 inline-block">
                                        PROFESSIONAL BRIEF
                                    </h2>
                                    <p className="text-sm leading-relaxed text-[#0A1754]">{transformedData.professionalBrief}</p>
                                </div>
                            )}

                            {transformedData.education && transformedData.education.length > 0 && (
                                <div className="mb-6">
                                    <h2 className="text-lg font-bold text-[#0A1754] mb-3 border-b-2 border-[#0A1754] pb-1 inline-block">
                                        EDUCATION
                                    </h2>
                                    {transformedData.education.map((edu: any, index: number) => (
                                        <div key={index} className="mb-4 pb-3 border-b border-gray-200 last:border-b-0">
                                            <h3 className="font-semibold text-[#0A1754]">{edu.institution}</h3>
                                            <p className="text-sm text-gray-600">{edu.degree}</p>
                                            <p className="text-xs text-gray-500 italic">
                                                {formatDate(edu.started)} - {formatDate(edu.ended)}
                                            </p>
                                        </div>
                                    ))}
                                </div>
                            )}

                            {transformedData.experience && transformedData.experience.length > 0 && (
                                <div className="mb-6">
                                    <h2 className="text-lg font-bold text-[#0A1754] mb-3 border-b-2 border-[#0A1754] pb-1 inline-block">
                                        WORK EXPERIENCE
                                    </h2>
                                    {transformedData.experience.map((exp: any, index: number) => (
                                        <div key={index} className="mb-4 pb-3 border-b border-gray-200 last:border-b-0">
                                            <h3 className="font-semibold text-[#0A1754]">{exp.role}</h3>
                                            <p className="text-sm text-gray-600">{exp.company}</p>
                                            <p className="text-xs text-gray-500 italic mb-2">
                                                {formatDate(exp.started)} - {formatDate(exp.ended)}
                                            </p>
                                            {exp.description && <p className="text-sm">{exp.description}</p>}
                                        </div>
                                    ))}
                                </div>
                            )}

                            {transformedData.skills && transformedData.skills.length > 0 && (
                                <div className="mb-6">
                                    <h2 className="text-lg font-bold text-[#0A1754] mb-3 border-b-2 border-[#0A1754] pb-1 inline-block">
                                        SKILLS
                                    </h2>
                                    <div className="flex flex-wrap gap-2">
                                        {transformedData.skills.map((skill: string, index: number) => (
                                            <span
                                                key={index}
                                                className="bg-gray-100 text-[#0A1754] px-3 py-1 rounded-full text-sm font-medium"
                                            >
                                                {skill}
                                            </span>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {transformedData.other_skills && transformedData.other_skills.length > 0 && (
                                <div className="mb-6">
                                    <h2 className="text-lg font-bold text-[#0A1754] mb-3 border-b-2 border-[#0A1754] pb-1 inline-block">
                                        OTHER SKILLS
                                    </h2>
                                    <div className="flex flex-wrap gap-2">
                                        {transformedData.other_skills.map((skill: string, index: number) => (
                                            <span
                                                key={index}
                                                className="bg-gray-100 text-[#0A1754] px-3 py-1 rounded-full text-sm font-medium"
                                            >
                                                {skill}
                                            </span>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {transformedData.certifications && transformedData.certifications.length > 0 && (
                                <div className="mb-6">
                                    <h2 className="text-lg font-bold text-[#0A1754] mb-3 border-b-2 border-[#0A1754] pb-1 inline-block">
                                        CERTIFICATIONS
                                    </h2>
                                    {transformedData.certifications.map((cert: string, index: number) => (
                                        <p key={index} className="text-sm mb-1 text-[#0A1754]">
                                            • {cert}
                                        </p>
                                    ))}
                                </div>
                            )}

                            {transformedData.links &&
                                (transformedData.links.linkedin ||
                                    transformedData.links.twitter ||
                                    transformedData.links.instagram ||
                                    transformedData.links.tiktok) && (
                                    <div className="mb-6">
                                        <h2 className="text-lg font-bold text-[#0A1754] mb-3 border-b-2 border-[#0A1754] pb-1 inline-block">
                                            SOCIAL LINKS
                                        </h2>
                                        <div className="space-y-1">
                                            {transformedData.links.linkedin && (
                                                <p className="text-sm text-[#0A1754]">LinkedIn: {transformedData.links.linkedin}</p>
                                            )}
                                            {transformedData.links.twitter && (
                                                <p className="text-sm text-[#0A1754]">Twitter: {transformedData.links.twitter}</p>
                                            )}
                                            {transformedData.links.instagram && (
                                                <p className="text-sm text-[#0A1754]">Instagram: {transformedData.links.instagram}</p>
                                            )}
                                            {transformedData.links.tiktok && (
                                                <p className="text-sm text-[#0A1754]">TikTok: {transformedData.links.tiktok}</p>
                                            )}
                                        </div>
                                    </div>
                                )}

                            {transformedData.languages && transformedData.languages.length > 0 && (
                                <div className="mb-6">
                                    <h2 className="text-lg font-bold text-[#0A1754] mb-3 border-b-2 border-[#0A1754] pb-1 inline-block">
                                        LANGUAGES
                                    </h2>
                                    <div className="flex flex-wrap gap-2">
                                        {transformedData.languages.map((language: string, index: number) => (
                                            <span
                                                key={index}
                                                className="bg-gray-100 text-[#0A1754] px-3 py-1 rounded-full text-sm font-medium"
                                            >
                                                {language}
                                            </span>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {transformedData.projects && transformedData.projects.length > 0 && (
                                <div className="mb-6">
                                    <h2 className="text-lg font-bold text-[#0A1754] mb-3 border-b-2 border-[#0A1754] pb-1 inline-block">
                                        PROJECTS
                                    </h2>
                                    {transformedData.projects.map((project: any, index: number) => (
                                        <div key={index} className="mb-4 pb-3 border-b border-gray-200 last:border-b-0">
                                            <h3 className="font-semibold text-[#0A1754]">{project.name}</h3>
                                            <p className="text-sm text-gray-600">{project.description}</p>
                                        </div>
                                    ))}
                                </div>
                            )}

                            {transformedData.achievements && transformedData.achievements.length > 0 && (
                                <div className="mb-6">
                                    <h2 className="text-lg font-bold text-[#0A1754] mb-3 border-b-2 border-[#0A1754] pb-1 inline-block">
                                        ACHIEVEMENTS
                                    </h2>
                                    {transformedData.achievements.map((achievement: string, index: number) => (
                                        <p key={index} className="text-sm mb-1">
                                            • {achievement}
                                        </p>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                <div className="p-3 sm:p-4 border-t bg-gray-50 flex flex-col sm:flex-row justify-end gap-2 shrink-0">
                    <button
                        onClick={handleDownload}
                        className="bg-[#0A1754] text-white px-4 py-2 rounded-md hover:bg-opacity-90 transition-colors text-sm text-center cursor-pointer"
                    >
                        Download CV
                    </button>
                    <button
                        onClick={onClose}
                        className="bg-gray-300 text-gray-700 px-4 py-2 rounded-md hover:bg-gray-400 transition-colors text-sm cursor-pointer"
                    >
                        Close
                    </button>
                </div>
            </div>
        </div>
    )
}

const transformCreatorDataToFormData = (candidate: any): any => {
    const resume = candidate.resume || {}
    const profile = candidate.profile || {}

    return {
        fullName: resume.full_name || profile.full_name || candidate.full_name || "",
        email: resume.email || profile.email || candidate.email || "",
        phone: resume.phone_number || profile.phone_number || "",
        location: resume.location || (profile.location ? `${profile.location.lga}, ${profile.location.state}` : ""),
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
        languages: resume.languages || [],
        projects: resume.projects || [],
        achievements: resume.achievements || [],
    }
}

const generatePDFDataURL = async (formData: any, formatDate: (dateString: string) => string): Promise<string> => {
    try {
        const html2canvas = (await import("html2canvas")).default

        const tempContainer = document.createElement("div")
        tempContainer.style.position = "absolute"
        tempContainer.style.left = "-9999px"
        tempContainer.style.top = "0"
        tempContainer.style.width = "210mm"
        tempContainer.style.minHeight = "297mm"
        tempContainer.style.backgroundColor = "white"
        tempContainer.style.padding = "10px"
        tempContainer.style.fontFamily = "Arial, sans-serif"

        const contentDiv = document.createElement("div")
        contentDiv.innerHTML = generateCandidateHTML(formData, formatDate)
        tempContainer.appendChild(contentDiv)

        document.body.appendChild(tempContainer)
        await new Promise((resolve) => setTimeout(resolve, 1000))

        const canvas = await html2canvas(tempContainer, {
            scale: 2,
            useCORS: true,
            allowTaint: true,
            backgroundColor: "#ffffff",
            width: 794,
            height: 1123,
            logging: false,
            onclone: (clonedDoc) => {
                const allElements = clonedDoc.querySelectorAll("*")
                allElements.forEach((element) => {
                    const computedStyle = window.getComputedStyle(element as Element)
                    const htmlElement = element as HTMLElement

                    if (computedStyle.color && computedStyle.color.includes("oklch")) {
                        htmlElement.style.color = "#333333"
                    }
                    if (computedStyle.backgroundColor && computedStyle.backgroundColor.includes("oklch")) {
                        htmlElement.style.backgroundColor = "#ffffff"
                    }
                    if (computedStyle.borderColor && computedStyle.borderColor.includes("oklch")) {
                        htmlElement.style.borderColor = "#cccccc"
                    }
                })
            },
        })

        document.body.removeChild(tempContainer)
        return canvas.toDataURL("image/png")
    } catch (error) {
        console.error("PDF generation error:", error)
        throw new Error("Failed to generate PDF")
    }
}

const generateCandidateHTML = (formData: any, formatDate: (dateString: string) => string): string => {
    const {
        fullName = "",
        email = "",
        phone = "",
        location = "",
        professionalBrief = "",
        education = [],
        experience = [],
        skills = [],
        other_skills = [],
        certifications = [],
        languages = [],
        projects = [],
        achievements = [],
        // links = {},
    } = formData

    return `
    <!DOCTYPE html>
    <html>
    <head>
      <title>${fullName}_CV</title>
      <meta charset="UTF-8">
      <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;600;700&family=Raleway:wght@400;600;700&display=swap" rel="stylesheet">
      <style>
        body { 
          font-family: 'Inter', 'Arial', sans-serif; 
          background: white;
          color: #333;
          line-height: 1.4;
        }
        
        .container {
          max-width: 210mm;
          min-height: 297mm;
          margin: 0 auto;
        }
        
        .header {
          background: #0A1754 !important;
          color: white;
          padding: 15px 25px;
          position: relative;
          display: flex;
          align-items: center;
          gap: 15px;
          -webkit-print-color-adjust: exact !important;
          color-adjust: exact !important;
          print-color-adjust: exact !important;
        }
        
        .logo-container {
          flex-shrink: 0;
          width: 60px;
          height: 60px;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        
        .logo {
          max-width: 100%;
          max-height: 100%;
          object-fit: contain;
        }
        
        .header-content {
          flex: 1;
          text-align: center;
        }
        
        .name {
          font-size: 24px;
          font-weight: 700;
          margin-bottom: 5px;
        }
        
        .contact-info {
          font-size: 12px;
          margin-top: 5px;
        }
        
        .main-content {
          padding: 20px 25px;
          background: white !important;
          min-height: calc(297mm - 80px);
          -webkit-print-color-adjust: exact !important;
          color-adjust: exact !important;
          print-color-adjust: exact !important;
        }
        
        .section {
          margin-bottom: 10px;
        }
        
        .section-title {
          font-size: 18px;
          font-weight: 700;
          color: #0A1754;
          margin-bottom: 15px;
          text-transform: uppercase;
          border-bottom: 2px solid #0A1754;
          padding-bottom: 5px;
          display: inline-block;
        }
        
        .content-text {
          color: #333333;
          font-size: 14px;
          line-height: 1.6;
          margin-bottom: 10px;
        }
        
        .item {
          margin-bottom: 15px;
          padding: 10px 0;
          border-bottom: 1px solid #eee;
        }
        
        .item:last-child {
          border-bottom: none;
        }
        
        .item-title {
          font-weight: 600;
          color: #0A1754;
          font-size: 16px;
          margin-bottom: 5px;
        }
        
        .item-subtitle {
          color: #666;
          font-size: 14px;
          margin-bottom: 5px;
        }
        
        .item-date {
          color: #888;
          font-size: 12px;
          font-style: italic;
        }
        
        .skills-container {
          display: flex;
          flex-wrap: wrap;
          gap: 10px;
          margin-top: 10px;
        }
        
        .skill-tag {
          color: #0A1754;
          padding: 6px 12px;
          border-radius: 15px;
          font-size: 12px;
          font-weight: 500;
        }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <div class="logo-container">
            <img src="/assets/white-logo.png" alt="PortGig Logo" class="logo" />
          </div>
          <div class="header-content">
            <div class="name">${fullName}</div>
            <div class="contact-info">
              ${email} ${phone ? `| ${phone}` : ""} ${location ? `| ${location}` : ""}
            </div>
          </div>
        </div>

        <div class="main-content">
          ${professionalBrief
            ? `
          <div class="section">
            <div class="section-title">Professional Brief</div>
            <div class="content-text">${professionalBrief}</div>
          </div>
          `
            : ""
        }

          ${education && education.length > 0
            ? `
          <div class="section">
            <div class="section-title">Education</div>
            ${education
                .map(
                    (edu: {
                        institution: any
                        degree: any
                        started: any
                        ended: any
                    }) => `
              <div class="item">
                <div class="item-title">${edu.institution || "N/A"}</div>
                <div class="item-subtitle">${edu.degree || "N/A"}</div>
                <div class="item-date">${formatDate(edu.started)} - ${formatDate(edu.ended)}</div>
              </div>
            `,
                )
                .join("")}
          </div>
          `
            : ""
        }

          ${experience && experience.length > 0
            ? `
          <div class="section">
            <div class="section-title">Work Experience</div>
            ${experience
                .map(
                    (exp: {
                        role: any
                        company: any
                        started: any
                        ended: any
                        description: any
                    }) => `
              <div class="item">
                <div class="item-title">${exp.role || "N/A"}</div>
                <div class="item-subtitle">${exp.company || "N/A"}</div>
                <div class="item-date">${formatDate(exp.started)} - ${formatDate(exp.ended)}</div>
                ${exp.description ? `<div class="content-text">${exp.description}</div>` : ""}
              </div>
            `,
                )
                .join("")}
          </div>
          `
            : ""
        }

          ${skills && skills.length > 0
            ? `
          <div class="section">
            <div class="section-title">Skills</div>
            <div class="skills-container">
              ${skills.map((skill: any) => `<div class="skill-tag">${skill}</div>`).join("")}
            </div>
          </div>
          `
            : ""
        }

          ${other_skills && other_skills.length > 0
            ? `
          <div class="section">
            <div class="section-title">Other Skills</div>
            <div class="skills-container">
              ${other_skills.map((skill: any) => `<div class="skill-tag">${skill}</div>`).join("")}
            </div>
          </div>
          `
            : ""
        }

          ${certifications && certifications.length > 0
            ? `
          <div class="section">
            <div class="section-title">Certifications</div>
            ${certifications
                .map(
                    (cert: any) => `
              <div class="item">
                <div class="content-text">• ${cert}</div>
              </div>
            `,
                )
                .join("")}
          </div>
          `
            : ""
        }

          ${languages && languages.length > 0
            ? `
          <div class="section">
            <div class="section-title">Languages</div>
            <div class="skills-container">
              ${languages.map((language: any) => `<div class="skill-tag">${language}</div>`).join("")}
            </div>
          </div>
          `
            : ""
        }

          ${projects && projects.length > 0
            ? `
          <div class="section">
            <div class="section-title">Projects</div>
            ${projects
                .map(
                    (project: any) => `
              <div class="item">
                <div class="item-title">${project.name || "N/A"}</div>
                <div class="content-text">${project.description || "N/A"}</div>
              </div>
            `,
                )
                .join("")}
          </div>
          `
            : ""
        }

          ${achievements && achievements.length > 0
            ? `
          <div class="section">
            <div class="section-title">Achievements</div>
            ${achievements
                .map(
                    (achievement: any) => `
              <div class="item">
                <div class="content-text">• ${achievement}</div>
              </div>
            `,
                )
                .join("")}
          </div>
          `
            : ""
        }
        </div>
      </div>
    </body>
    </html>
  `
}

export function CandidateInfo({ candidate, onCandidateRemoved, onStatusUpdate, onChat }: CandidateInfoPanelProps) {
    const [isUpdatingStatus, setIsUpdatingStatus] = useState(false)
    const [isDownloading, setIsDownloading] = useState(false)
    const [isCVModalOpen, setIsCVModalOpen] = useState(false)
    const [selectedCandidateData, setSelectedCandidateData] = useState<any>(null)
    const [currentStatus, setCurrentStatus] = useState(candidate?.status || "PENDING")
    const [isDownloadingCV, setIsDownloadingCV] = useState(false)
    const router = useRouter()

    const formatDate = (dateString: string): string => {
        if (!dateString) return "Present"

        try {
            const date = new Date(dateString)
            if (isNaN(date.getTime())) return "Present"

            return date.toLocaleDateString("en-US", {
                year: "numeric",
                month: "long",
                day: "numeric",
            })
        } catch (error) {
            console.error("Error formatting date:", error)
            return "Present"
        }
    }

    const handleStatusChange = async (status: string) => {
        if (!candidate || !candidate.jobId) return

        setIsUpdatingStatus(true)
        try {
            const result = await updateApplicantStatus({
                job_id: candidate.jobId,
                creator_id: candidate.id,
                status: status as "PENDING" | "SHORTLISTED" | "NOT_QUALIFIED" | "SELECTED",
            })

            setCurrentStatus(status)
            toast.success(result.message || "Status updated successfully!")

            if (status === "NOT_QUALIFIED") {
                onCandidateRemoved(candidate.id)
            }

            if (onStatusUpdate) {
                onStatusUpdate(status)
            }
        } catch (error: any) {
            console.error("Error updating status:", error)
            toast.error(error.message || "Error updating status. Please try again.")
        } finally {
            setIsUpdatingStatus(false)
        }
    }

    const handleViewCV = async (candidateId: string, e: React.MouseEvent) => {
        e.stopPropagation()

        if (isDownloading) return

        setIsDownloading(true)
        try {
            const creatorData = await getCreatorReview(candidateId)

            if (!creatorData.data.page_data || creatorData.data.page_data.length === 0) {
                throw new Error("Candidate not found")
            }

            const candidateData = creatorData.data.page_data[0]
            setSelectedCandidateData(candidateData)
            setIsCVModalOpen(true)
        } catch (error) {
            toast.error(error instanceof Error ? error.message : "Failed to view CV. Please try again.")
        } finally {
            setIsDownloading(false)
        }
    }

    const handleDownloadCV = async (candidateId: string, e: React.MouseEvent) => {
        e.stopPropagation()

        if (isDownloadingCV) return

        setIsDownloadingCV(true)
        try {
            const creatorData = await getCreatorReview(candidateId)

            if (!creatorData.data.page_data || creatorData.data.page_data.length === 0) {
                throw new Error("Candidate not found")
            }

            const candidateData = creatorData.data.page_data[0]
            const transformedData = transformCreatorDataToFormData(candidateData)

            // First try to use existing CV URL
            const cvUrl =
                candidateData.cv_url ||
                candidateData.resume?.cv_url ||
                candidateData.profile?.cv_url ||
                candidateData.resume_url

            if (cvUrl) {
                // Create download link for existing CV
                const link = document.createElement("a")
                link.href = cvUrl
                link.download = `${transformedData.fullName}_CV.pdf`
                document.body.appendChild(link)
                link.click()
                document.body.removeChild(link)
            } else {
                // Generate PDF if no CV URL exists
                const generatedUrl = await generatePDFDataURL(transformedData, formatDate)
                const link = document.createElement("a")
                link.href = generatedUrl
                link.download = `${transformedData.fullName}_CV.png`
                document.body.appendChild(link)
                link.click()
                document.body.removeChild(link)
            }

            toast.success("CV downloaded successfully!")
        } catch (error) {
            console.error("Download error:", error)
            toast.error(error instanceof Error ? error.message : "Failed to download CV. Please try again.")
        } finally {
            setIsDownloadingCV(false)
        }
    }

    const getStatusMessage = () => {
        switch (currentStatus) {
            case "SHORTLISTED":
                return {
                    message: "Applicant has been shortlisted",
                    bgColor: "bg-green-100",
                    borderColor: "border-green-400",
                    textColor: "text-green-700",
                }
            case "NOT_QUALIFIED":
                return {
                    message: "Applicant has been marked as not qualified",
                    bgColor: "bg-red-100",
                    borderColor: "border-red-400",
                    textColor: "text-red-700",
                }
            case "SELECTED":
                return {
                    message: "Applicant has been selected",
                    bgColor: "bg-green-100",
                    borderColor: "border-green-400",
                    textColor: "text-green-700",
                }
            case "PENDING":
            default:
                return null
        }
    }

    const handleViewProfile = () => {
        if (!candidate) return
        router.push(`/recruiter-profile-card/${candidate.id}`)
    }

    const handleChatClick = () => {
        if (!candidate) return

        if (onChat) {
            onChat()
        } else if (candidate.onChat) {
            candidate.onChat()
        } else {
            toast.success("Chat feature coming soon!")
        }
    }

    if (!candidate) {
        return (
            <div className="w-full bg-white border-l border-gray-200 p-6 flex items-center justify-center h-full">
                <div className="text-center text-gray-500">Select a candidate to view details</div>
            </div>
        )
    }

    const statusMessage = getStatusMessage()
    const isFinalStatus = ["SHORTLISTED", "NOT_QUALIFIED", "SELECTED"].includes(currentStatus)

    return (
        <div className="w-full bg-white lg:border-l border-gray-200 flex flex-col h-full">
            <CVViewerModal
                isOpen={isCVModalOpen}
                onClose={() => setIsCVModalOpen(false)}
                candidateData={selectedCandidateData}
            />

            {/* Header */}
            <div className="bg-[#0A1754] text-white p-3 sm:p-4 lg:max-w-xs mb-2 sm:mb-4">
                <h2 className="text-base sm:text-lg font-semibold font-raleway">Candidate Information</h2>
            </div>

            {/* Candidate Details */}
            <div className="p-3 sm:p-4 lg:p-6 bg-gray-100 grow lg:max-w-lg flex flex-col">
                <div className="flex flex-col sm:flex-row items-center mb-4 sm:mb-6 relative">
                    <div className="relative mb-4 sm:mb-0 sm:mr-4">
                        <Image
                            src={candidate.avatar || "/assets/creative.svg"}
                            alt={candidate.name}
                            width={120}
                            height={120}
                            className="rounded-full object-cover w-14 h-14 md:w-20 md:h-20 lg:w-24 lg:h-24"
                            onError={(e) => {
                                e.currentTarget.src = "/assets/creative.svg"
                            }}
                        />
                    </div>
                    <div className="flex-1 font-raleway text-center sm:text-left">
                        <h3 className="text-xl xl:text-3xl font-semibold text-gray-900">{candidate.name}</h3>
                        <p className="text-xs sm:text-sm text-gray-600 font-light">
                            {candidate.role}/{candidate.location}
                        </p>
                    </div>
                    <span className="absolute top-0 right-0 sm:static sm:ml-2 text-white bg-[#0A1754] inline-flex items-center justify-center px-2 py-1 sm:px-4 sm:py-2 lg:w-20 lg:px-6 lg:py-1 text-sm sm:text-base lg:text-xl font-ramaraja font-medium rounded sm:rounded-none">
                        <span className="hidden sm:inline">{candidate.skillLevel}</span>
                        <span className="sm:hidden">{candidate.skillLevel}</span>
                    </span>
                </div>
                <div className="border-b-2 sm:border-b-4 border-black"></div>

                <div className="mb-4 sm:mb-6 mt-2 sm:mt-3">
                    <div className="flex flex-col sm:flex-row sm:gap-10 sm:items-center mb-2 font-raleway">
                        <span className="text-sm sm:text-base font-bold text-gray-700">Email:</span>
                        <span className="text-sm sm:text-base text-gray-900 font-medium break-all sm:break-normal">
                            {candidate.email}
                        </span>
                    </div>
                    <div className="border-b border-black" />
                </div>

                <div className="grid grid-cols-2 gap-3 sm:gap-6 lg:gap-10 mb-4 sm:mb-8">
                    <Buttons variant="primary" size="lg" onClick={handleViewProfile} className="cursor-pointer">
                        View Profile
                    </Buttons>
                    <Buttons
                        variant="primary"
                        size="lg"
                        onClick={(e) => handleViewCV(candidate.id, e)}
                        className="cursor-pointer flex items-center justify-center"
                    >
                        <Eye size={16} className="mr-2" />
                        {isDownloading ? "Loading..." : "View CV"}
                    </Buttons>
                </div>

                <div className="grow flex flex-col min-h-0">
                    <div className="mb-3 sm:mb-4 flex items-center justify-center shrink-0">
                        <h4 className="text-base sm:text-lg md:text-xl lg:text-2xl font-bold text-[#0A1754] font-raleway">
                            Cover Letter
                        </h4>
                    </div>

                    <div className="grow min-h-[120px] sm:min-h-[150px] md:min-h-[180px] lg:min-h-[200px] mb-4 sm:mb-6 md:mb-8 p-3 sm:p-4 bg-white rounded-lg border border-gray-300 overflow-y-auto">
                        {candidate.cover_letter ? (
                            <p className="text-xs sm:text-sm md:text-base text-gray-800 whitespace-pre-wrap leading-relaxed">
                                {candidate.cover_letter}
                            </p>
                        ) : (
                            <div className="flex items-center justify-center h-full">
                                <p className="text-xs sm:text-sm md:text-base text-gray-500 text-center">No cover letter provided</p>
                            </div>
                        )}
                    </div>

                    {isFinalStatus && statusMessage ? (
                        <div
                            className={`${statusMessage.bgColor} ${statusMessage.borderColor} ${statusMessage.textColor} px-4 py-3 rounded mb-4 sm:mb-6`}
                        >
                            <p className="text-center font-semibold">{statusMessage.message}</p>
                        </div>
                    ) : (
                        <div className="grid grid-cols-2 gap-3 sm:gap-4 mb-4 sm:mb-6">
                            <Buttons variant="primary" size="lg" onClick={() => handleStatusChange("NOT_QUALIFIED")} className="bg-red-500 hover:bg-red-600 text-white font-semibold">
                                {isUpdatingStatus ? "Updating..." : "Not Qualified"}
                            </Buttons>
                            <Buttons variant="primary" size="lg" onClick={() => handleStatusChange("SHORTLISTED")} className="bg-green-500 hover:bg-green-600 text-white font-semibold">
                                {isUpdatingStatus ? "Updating..." : "Shortlist"}
                            </Buttons>
                        </div>
                    )}
                </div>

                <div className="grid grid-cols-2 gap-3 sm:gap-4 mt-4 sm:mt-6 lg:mt-10 max-md:mb-20">
                    <Buttons
                        variant="primary"
                        size="lg"
                        onClick={(e) => handleDownloadCV(candidate.id, e)}
                        className="cursor-pointer flex items-center justify-center"
                    >
                        <Download size={16} className="mr-2" />
                        {isDownloadingCV ? "Downloading..." : "Download CV"}
                    </Buttons>
                    <Buttons variant="primary" size="lg" onClick={handleChatClick}>
                        {candidate.chatLoading ? "Starting Chat..." : "Chat"}
                    </Buttons>
                </div>
            </div>
        </div>
    )
}
