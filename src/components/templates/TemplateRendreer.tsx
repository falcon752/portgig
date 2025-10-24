import type React from "react"
 import type { FormData } from "@/types/resume"
 import { ProfessionalTemplate } from "./ProfessionalTemplate"
 import { ExecutiveTemplate } from "./ExecutiveTemplate"
 import { CreativeTemplate } from "./CreativeTemplate"
 import { CorperateTemplate } from "./CorperateTemplate"
 import { MinimalistTemplate } from "./MinimalistTemplate"

interface TemplateRendererProps {
  templateName: string
  formData: FormData
}

export const TemplateRenderer: React.FC<TemplateRendererProps> = ({ templateName, formData }) => {
  console.log("TemplateRenderer received templateName:", templateName)
  console.log("Available templates:", [
    "Professional Blue",
    "Modern Executive",
    "Creative Professional",
    "Corporate Classic",
    "Minimalist Pro",
  ])

  const renderTemplate = () => {
    switch (templateName) {
      case "Professional Blue":
        console.log("✅ Rendering Template1 - Professional Blue")
        return <ProfessionalTemplate formData={formData} />

      case "Modern Executive":
        console.log("✅ Rendering Template2 - Modern Executive")
        return <ExecutiveTemplate formData={formData} />

      case "Creative Professional":
        console.log("✅ Rendering Template3 - Creative Professional")
        return <CreativeTemplate formData={formData} />

      case "Corporate Classic":
        console.log("✅ Rendering Template4 - Corporate Classic")
        return <CorperateTemplate formData={formData} />

      case "Minimalist Pro":
        console.log("✅ Rendering Template5 - Minimalist Pro")
        return <MinimalistTemplate formData={formData} />

      default:
        console.error("❌ Unknown template name:", templateName)
        console.log("Available template names:", [
          "Professional Blue",
          "Modern Executive",
          "Creative Professional",
          "Corporate Classic",
          "Minimalist Pro",
        ])
        // Fallback to Template1 instead of Template2
        return (
          <div>
            <div
              style={{
                padding: "10px",
                backgroundColor: "#ffebee",
                border: "1px solid #f44336",
                marginBottom: "10px",
                color: "#d32f2f",
              }}
            >
            </div>
            <ProfessionalTemplate formData={formData} />
          </div>
        )
    }
  }

  return (
    <div>
     
      {renderTemplate()}
    </div>
  )
}
