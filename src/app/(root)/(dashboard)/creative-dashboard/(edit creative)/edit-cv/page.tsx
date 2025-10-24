/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { CreatorAuth } from "@/src/lib/requests/auth.new";
import { useResumeForm } from "@/src/hooks/useResumeForm";
import { FormProvider } from "react-hook-form"; 
import type { FormData } from "@/types/resume";
import type { ResumePayload } from "@/types/user";
import { TemplateRenderer } from "@/src/components/templates/TemplateRendreer";
import { SuccessModal } from "@/src/components/resume/SuccessModal";
import { PersonalInfoSection } from "@/src/components/resume/PersonalInfoSection";
import { EducationSection } from "@/src/components/resume/EducationSection";
import { ProfessionalBriefSection } from "@/src/components/resume/ProfessionalBriefSection";
import { ExperienceSection } from "@/src/components/resume/ExperienceSection";
import { SocialLinksSection } from "@/src/components/resume/SocialLinksSection";
import { SkillsSection } from "@/src/components/resume/SkillsSection";
import { generateTemplateSpecificPDF } from "@/src/components/creative-dashboard/TemplateGenerator";
import { useAppSelector } from "@/src/redux/hooks";

const getErrorMessage = (error: unknown): string => {
  if (error instanceof Error) {
    return error.message;
  }
  if (typeof error === "string") {
    return error;
  }
  return "An unexpected error occurred";
};

const transformFormDataForApi = (data: FormData) => {
  return {
    resume_info: {
      ...data,
      links: {
        linkedin: data.links.linkedin || "",
        twitter: data.links.twitter || "",
        instagram: data.links.instagram || "",
        tiktok: data.links.tiktok || "",
      },
      skills: data.skills.map((skill) => skill.value),
      other_skills: data.other_skills.map((skill) => skill.value),
      certifications: data.certifications.map((cert) => cert.value),
    },
  };
};

const ResumeUpdatePage: React.FC = () => {
  const router = useRouter();
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [showSuccessModal, setShowSuccessModal] = useState<boolean>(false);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [showPreview, setShowPreview] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [username, setUsername] = useState<string>("");

  const { formMethods, downloadStatus, checkDownloadStatus } = useResumeForm();
  const {
    handleSubmit,
    register,
    control,
    formState: { errors },
    watch,
    getValues,
  } = formMethods;
  const { profile, recruiterProfile } = useAppSelector((state) => ({
    profile: state.user.profile,
    recruiterProfile: state.recruiter.recruiterProfile,
  }));

  const formData = watch();

  useEffect(() => {
    const fetchedUsername =
      profile?.bio_data?.user_name || recruiterProfile?.bio_data?.full_name || "User";
    setUsername(fetchedUsername.replace(/\s+/g, "_").toLowerCase());
    setIsLoading(false);
  }, [profile, recruiterProfile]);

  const formatFormDataDates = (data: FormData): FormData => {
    const formatDate = (dateString: string): string => {
      if (!dateString) return "";
      try {
        const date = new Date(dateString);
        if (isNaN(date.getTime())) return dateString;
        const options: Intl.DateTimeFormatOptions = { year: "numeric", month: "long" };
        return date.toLocaleDateString("en-US", options);
      } catch {
        return dateString;
      }
    };

    return {
      ...data,
      education: data.education.map((edu) => ({
        ...edu,
        started: formatDate(edu.started || ""),
        ended: formatDate(edu.ended || ""),
      })),
      experience: data.experience.map((exp) => ({
        ...exp,
        started: formatDate(exp.started || ""),
        ended: formatDate(exp.ended || ""),
      })),
    };
  };

  const onSubmit = async (data: FormData): Promise<void> => {
    if (isSubmitting) return;

    setIsSubmitting(true);
    setErrorMessage(null);

    try {
      const payload: ResumePayload = {
        resume_info: {
          brief: data.brief || "",
          full_name: data.full_name || "",
          email: data.email || "",
          phone_number: data.phone_number || "",
          location: data.location || "",
          job_title: data.job_title || "",
          education: (data.education || []).map((edu) => ({
            course: edu.course || "",
            school: edu.school || "",
            started: edu.started || "",
            ended: edu.ended || "",
          })),
          links: {
            linkedin: data.links.linkedin || "",
            twitter: data.links.twitter || "",
            instagram: data.links.instagram || "",
            tiktok: data.links.tiktok || "",
          },
          skills: (data.skills || []).map((s) => s.value || ""),
          other_skills: (data.other_skills || []).map((s) => s.value || ""),
          certifications: (data.certifications || []).map((c) => c.value || ""),
          experience: (data.experience || []).map((exp) => ({
            location: exp.location || "",
            job_title: exp.job_title || "",
            contribution: exp.contribution || "",
            started: exp.started || "",
            ended: exp.ended || "",
          })),
        },
      };

      console.log("Payload being sent to API:", JSON.stringify(payload, null, 2));

      const response = await CreatorAuth.updateResume(payload, "RESUME");

      if (response.status === 200) {
        toast.success(response.message);
        try {
          const formattedData = formatFormDataDates(data);
          await generateTemplateSpecificPDF(formattedData, username);
          toast.success("Resume saved and Professional Blue template downloaded successfully!");
        } catch {
          toast.error("Resume saved but PDF download failed. Please try again.");
        }
        setShowSuccessModal(true);
      } else {
        const errorMsg = response.message || "Failed to update profile";
        setErrorMessage(errorMsg);
        toast.error(errorMsg);
      }
    } catch (error: unknown) {
      const errorMsg = getErrorMessage(error) || "Failed to update profile";
      setErrorMessage(errorMsg);
      toast.error(errorMsg);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDownloadCV = async (): Promise<void> => {
    if (!downloadStatus.canDownload) {
      toast.error(`Download will be available in ${downloadStatus.daysUntilDownload} days`);
      return;
    }

    try {
      const currentData = getValues();
      await generateTemplateSpecificPDF(currentData, username);
      checkDownloadStatus("professional_blue");
      toast.success("Professional Blue template PDF downloaded successfully!");
      setShowSuccessModal(false);
    } catch {
      toast.error("PDF download failed. Please try again.");
    }
  };

  const handlePreviewToggle = () => {
    setShowPreview(!showPreview);
  };

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-[#0A1754] mx-auto mb-4"></div>
          <p className="text-lg text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen">
      {/* Form Section */}
      <div className={`${showPreview ? "w-1/2" : "w-full"} transition-all duration-300`}>
        <FormProvider {...formMethods}>
          <form
            onSubmit={handleSubmit(onSubmit)}
            className="max-w-2xl mx-auto font-inter gap-5"
          >
            <div className="flex items-center justify-between mb-4 p-4">
              <h2 className="text-2xl font-bold text-[#0A1754]">
                Edit CV/Resume - Professional Blue
              </h2>
              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={handlePreviewToggle}
                  className="px-4 py-2 bg-[#0A1754] text-white rounded-lg transition-colors cursor-pointer"
                >
                  {showPreview ? "Hide Preview" : "Show Preview"}
                </button>
                <button
                  type="button"
                  onClick={() => router.back()}
                  className="text-[#0A1754] hover:text-blue-700 font-semibold cursor-pointer"
                >
                  ← Back
                </button>
              </div>
            </div>

            <div className="w-full bg-[#0A1754] min-h-screen p-6 text-white">
              <PersonalInfoSection register={register} errors={errors} />
              <EducationSection register={register} control={control} />
              <ProfessionalBriefSection register={register} />
              <ExperienceSection register={register} control={control} />
              <SocialLinksSection register={register} />
              <SkillsSection
                register={register}
                control={control}
                title="Skills"
                fieldName="skills"
                placeholder="Skill"
              />
              <SkillsSection
                register={register}
                control={control}
                title="Other Skills"
                fieldName="other_skills"
                placeholder="Other Skill"
              />
              <SkillsSection
                register={register}
                control={control}
                title="Certifications"
                fieldName="certifications"
                placeholder="Certification"
              />
              {errorMessage && (
                <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
                  {errorMessage}
                </div>
              )}
              <div className="pt-6">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className={`w-full py-3 px-6 rounded-lg font-semibold transition-all duration-300 cursor-pointer ${
                    isSubmitting
                      ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                      : "bg-white text-[#0A1754] hover:bg-gray-100"
                  }`}
                >
                  {isSubmitting
                    ? "Saving & Generating PDF..."
                    : "Save Changes & Download CV"}
                </button>
              </div>
            </div>
          </form>
        </FormProvider>
      </div>

      {/* Preview Section */}
      {showPreview && (
        <div className="w-1/2 bg-gray-100 border-l border-gray-300 overflow-auto">
          <div className="sticky top-0 bg-white p-4 border-b border-gray-300 z-10">
            <h3 className="text-lg font-semibold text-gray-800">Live Preview - Professional Blue</h3>
            <p className="text-sm text-gray-600">Template: Professional Blue</p>
          </div>
          <div className="p-4">
            <div
              className="bg-white rounded-lg shadow-lg overflow-hidden"
              style={{ transform: "scale(0.6)", transformOrigin: "top left", width: "166.67%" }}
            >
              <TemplateRenderer templateName="Professional Blue" formData={formData} />
            </div>
          </div>
        </div>
      )}

      <SuccessModal
        isOpen={showSuccessModal}
        onClose={() => setShowSuccessModal(false)}
        onDownload={handleDownloadCV}
        canDownload={downloadStatus.canDownload}
        daysUntilDownload={downloadStatus.daysUntilDownload}
      />
    </div>
  );
};

export default ResumeUpdatePage;