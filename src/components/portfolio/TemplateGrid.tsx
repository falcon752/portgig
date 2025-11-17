"use client"

import Image from "next/image"
import Link from "next/link"
import { useState, useEffect } from "react"

const templates = [
  {
    id: "writer",
    title: "Writers Portfolio",
    image: "/assets/templates/template4.png",
    previewLink: "/portfolio-4",
    editFields: ["bio", "writing-samples", "publications", "contact", "social-media"],
  },
  {
    id: "videographer",
    title: "Videographer/ Content Creator Portfolio",
    image: "/assets/templates/template2.png",
    previewLink: "/portfolio-2",
    editFields: ["bio", "video-gallery", "services", "equipment", "testimonials", "contact", "social-media"],
  },
  {
    id: "developer",
    title: "Developers/ Techies",
    image: "/assets/templates/template3.png",
    previewLink: "/portfolio-3",
    editFields: ["bio", "skills", "projects", "experience", "education", "github", "contact"],
  },
  {
    id: "photographer",
    title: "Photography/ Cinematographer",
    image: "/assets/templates/template6.png",
    previewLink: "/portfolio-6",
    editFields: ["bio", "photo-gallery", "services", "packages", "testimonials", "contact", "social-media"],
  },
  {
    id: "socialmedia",
    title: "Social Media Manager/ Virtual Assistant Template",
    image: "/assets/templates/template5.png",
    previewLink: "/portfolio-5",
    editFields: ["bio", "services", "case-studies", "tools", "testimonials", "packages", "contact"],
  },
  {
    id: "designer",
    title: "Designer Template",
    image: "/assets/templates/template1.png",
    previewLink: "/portfolio-1",
    editFields: ["bio", "portfolio", "services", "process", "testimonials", "contact", "social-media"],
  },
  {
    id: "data-analyst",
    title: "Data Analyst Template",
    image: "/assets/templates/template1.png",
    previewLink: "/portfolio-7",
    editFields: ["bio", "portfolio", "services", "process", "testimonials", "contact", "social-media"],
  },
]

const TemplatesGrid = () => {
  const [editingTemplateId, setEditingTemplateId] = useState<string | null>(null)

  useEffect(() => {
    if (typeof window !== "undefined") {
      const storedId = localStorage.getItem("editingTemplateId")
      if (storedId) {
        setEditingTemplateId(storedId)
      }
    }
  }, [])

  const handleEditClick = (templateId: string) => {
    if (typeof window !== "undefined") {
      localStorage.setItem("editingTemplateId", templateId)
    }
    setEditingTemplateId(templateId)
  }

  return (
    <div className="bg-[#F2F2F2] py-10 px-4 sm:px-6 md:px-8 lg:px-12 font-urbanist">
      <div
        className="
          grid 
          grid-cols-1 
          sm:grid-cols-2 
          md:grid-cols-2 
          lg:grid-cols-2 
          gap-x-6 sm:gap-x-8 md:gap-x-10 
          gap-y-8 md:gap-y-10 
          max-w-6xl 
          mx-auto 
          justify-center 
          place-items-center
        "
      >
        {templates.map((template, index) => {
          return (
            <div
              key={index}
              className="
                flex flex-col gap-2 
                w-full 
                max-w-[500px] 
                md:max-w-[400px] 
                lg:max-w-[519px]
              "
            >
              {/* Card */}
              <div className="bg-[#0A1F63] rounded-xl shadow-lg overflow-hidden relative transition transform hover:scale-105 hover:shadow-xl">
                {/* Image with Overlay */}
                <div className="relative w-full h-56 sm:h-64 md:h-72">
                  <Image
                    src={template.image || "/placeholder.svg"}
                    alt={template.title}
                    fill
                    className="object-cover"
                  />
                  <div className="absolute inset-0 bg-[#0A175494]" />
                </div>

                {/* Buttons */}
                <div className="absolute inset-0 flex items-center justify-center gap-4 z-10">
                  <Link href={template.previewLink}>
                    <button className="cursor-pointer bg-white text-black rounded px-6 py-2 text-sm font-semibold shadow-md hover:bg-gray-100 transition">
                      Preview
                    </button>
                  </Link>

                  <Link
                    href={`/edit-template/${template.id}`}
                    onClick={() => handleEditClick(template.id)}
                  >
                    <button
                      className="cursor-pointer bg-white text-black rounded px-6 py-2 text-sm font-semibold shadow-md transition hover:bg-gray-100"
                    >
                      Edit
                    </button>
                  </Link>
                </div>
              </div>

              {/* Title */}
              <h2 className="text-[#0A1F63] font-semibold text-center text-sm sm:text-base px-1">
                {template.title}
              </h2>
            </div>
          )
        })}
      </div>
    </div>
  )
}

export default TemplatesGrid
