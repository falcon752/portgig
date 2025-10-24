"use server"

import { revalidatePath } from "next/cache"

export async function revalidateTemplate4Page() {
  revalidatePath("/template-4")
}

export async function revalidateTemplateVideographerPage() {
  revalidatePath("/template-2") 
}
export async function revalidateTemplateDeveloperPage() {
  revalidatePath("/template-3") 
}
export async function revalidateTemplatePhotographerPage() {
  revalidatePath("/template-6") 
}

export async function revalidateTemplateSocialMediaManagerPage() {
    revalidatePath("/template-5")
  }
export async function revalidateTemplateDesignerPage() {
    revalidatePath("/template-1")
  }
