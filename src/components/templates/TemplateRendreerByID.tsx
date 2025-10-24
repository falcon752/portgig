
import type React from "react"
  import type { FormData } from "@/types/resume"
  import { ProfessionalTemplate } from "./ProfessionalTemplate"
  import { ExecutiveTemplate } from "./ExecutiveTemplate"
  import { CreativeTemplate } from "./CreativeTemplate"
 import { CorperateTemplate } from "./CorperateTemplate"
  import { MinimalistTemplate } from "./MinimalistTemplate"

interface TemplateRendererProps {
  templateName?: string
  templateId?: string
  formData: FormData
}

export const TemplateRenderer: React.FC<TemplateRendererProps> = ({ templateName, templateId, formData }) => {
  console.log("TemplateRenderer received:", { templateName, templateId })

  const renderTemplateById = (id: string) => {
    switch (id) {
      case "1":
        console.log("✅ Rendering Template1 (ID: 1) - Professional Blue")
        return <ProfessionalTemplate formData={formData} />

      case "2":
        console.log("✅ Rendering Template2 (ID: 2) - Modern Executive")
        return <ExecutiveTemplate formData={formData} />

      case "3":
        console.log("✅ Rendering Template3 (ID: 3) - Creative Professional")
        return <CreativeTemplate formData={formData} />

      case "4":
        console.log("✅ Rendering Template4 (ID: 4) - Corporate Classic")
        return <CorperateTemplate formData={formData} />

      case "5":
        console.log("✅ Rendering Template5 (ID: 5) - Minimalist Pro")
        return <MinimalistTemplate formData={formData} />

      default:
        console.error("❌ Unknown template ID:", id)
        return <ProfessionalTemplate formData={formData} />
    }
  }

  const renderTemplateByName = (name: string) => {
    switch (name) {
      case "Professional Blue":
        return <ProfessionalTemplate formData={formData} />
      case "Modern Executive":
        return <ExecutiveTemplate formData={formData} />
      case "Creative Professional":
        return <CreativeTemplate formData={formData} />
      case "Corporate Classic":
        return <CorperateTemplate formData={formData} />
      case "Minimalist Pro":
        return <MinimalistTemplate formData={formData} />
      default:
        console.error("❌ Unknown template name:", name)
        return <ProfessionalTemplate formData={formData} />
    }
  }

  // Prefer templateId over templateName for more reliable matching
  if (templateId) {
    return renderTemplateById(templateId)
  } else if (templateName) {
    return renderTemplateByName(templateName)
  } else {
    console.error("❌ No template ID or name provided")
    return <ProfessionalTemplate formData={formData} />
  }
}
