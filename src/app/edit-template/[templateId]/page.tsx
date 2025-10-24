import { notFound } from "next/navigation"
import EditTemplateForm from "@/src/components/portfolio/Edit-template-form"

const templates = [
  {
    id: "writer",
    title: "Writers Portfolio",
    editFields: ["bio", "writing-samples", "publications", "contact", "social-media"],
  },
  {
    id: "videographer",
    title: "Videographer/ Content Creator Portfolio",
    editFields: ["bio", "video-gallery", "services", "equipment", "testimonials", "contact", "social-media"],
  },
  {
    id: "developer",
    title: "Developers/ Techies",
    editFields: ["bio", "skills", "projects", "experience", "education", "github", "contact"],
  },
  {
    id: "photographer",
    title: "Photography/ Cinematographer",
    editFields: ["bio", "photo-gallery", "services", "packages", "testimonials", "contact", "social-media"],
  },
  {
    id: "social-media",
    title: "Social Media Manager/ Virtual Assistant Template",
    editFields: ["bio", "services", "case-studies", "tools", "testimonials", "packages", "contact"],
  },
  {
    id: "designer",
    title: "Designer Template",
    editFields: ["bio", "portfolio", "services", "process", "testimonials", "contact", "social-media"],
  },
]

interface PageProps {
  params: Promise<{
    templateId: string
  }>
}

export default async function EditTemplatePage({ params }: PageProps) {
  const { templateId } = await params
  
  const template = templates.find((t) => t.id === templateId)
  
  if (!template) {
    notFound()
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto py-8 px-4">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Edit {template.title}</h1>
          <p className="text-gray-600">Customize your portfolio template with your personal information and content.</p>
        </div>
        <EditTemplateForm templateId={template.id} templateTitle={template.title} editFields={template.editFields} />
      </div>
    </div>
  )
}