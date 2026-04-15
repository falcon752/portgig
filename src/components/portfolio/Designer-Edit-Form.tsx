/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";
import type React from "react";
import { useState, useRef, useEffect } from "react";
import { X, Upload } from "lucide-react";
import Image from "next/image";
import toast from "react-hot-toast";
import Cookies from "universal-cookie";
import { useRouter } from "next/navigation";
import {
  saveDesignerPortfolio,
  getPortfolio,
  uploadAllMedia,
} from "../../api/portfolio";
import { revalidateTemplateDesignerPage } from "@/src/app/Actions";
import { useDraft } from "@/src/hooks/useDraft";
import DraftBanner from "@/src/components/DraftBanner";
import type {
  DesignerFormData,
  GetPortfolioResponse,
  PortfolioApiPayload,
} from "@/types/portfolio";
import { getImageUrl } from "@/src/utils/image-url";

interface DesignerFormDataInput
  extends Omit<DesignerFormData, "tools" | "otherServices" | "jobsOpenTo"> {
  tools: string;
  otherServices: string;
  jobsOpenTo: string;
}

const DesignerForm: React.FC = () => {
  const router = useRouter();
  const cookies = new Cookies(null, { path: "/" });
  const [formData, setFormData] = useState<DesignerFormDataInput>({
    displayName: "",
    jobTitles: "",
    location: "",
    headShot: { previewUrl: null, file: null },
    aboutMe: "",
    missionAndDesignPhilosophy: "",
    skills: Array(4).fill({
      image: { previewUrl: null, file: null },
      name: "",
    }),
    tools: "",
    genericPortfolioFiles: Array(6).fill({
      image: { previewUrl: null, file: null },
      name: "",
      link: "",
    }),
    behance: "",
    otherServices: "",
    jobsOpenTo: "",
    whyWorkWithMe: "",
  });
  const [isLoading, setIsLoading] = useState(false);
  const [isFetching, setIsFetching] = useState(true);
  const [isUploadingMedia, setIsUploadingMedia] = useState(false);
  const [userId, setUserId] = useState<string | null>(null);
  const [userName, setUserName] = useState<string | null>(null);
  const [authToken, setAuthToken] = useState<string | null>(null);
  const [existingFonts, setExistingFonts] = useState<any>(null);

  const headShotInputRef = useRef<HTMLInputElement>(null);
  const skillImageInputRefs = useRef<(HTMLInputElement | null)[]>([]);
  const portfolioImageInputRefs = useRef<(HTMLInputElement | null)[]>([]);

  const [showDraftBanner, setShowDraftBanner] = useState(false);
  const apiLoadedRef = useRef(false);
  const { saveDraft, saveServerSnapshot, loadDraft, clearDraft, hasMeaningfulDraft } =
    useDraft<DesignerFormDataInput>("portgig_draft_designer");

  useEffect(() => {
    const fetchedAuthToken = cookies.get("access_token");
    const fetchedUserId = cookies.get("userId") || cookies.get("userid");

    if (!fetchedAuthToken || !fetchedUserId) {
      toast.error("Authentication required. Please log in again.");
      router.push("/login");
      return;
    }

    setAuthToken(fetchedAuthToken);
    setUserId(fetchedUserId);

    const fetchExistingPortfolio = async () => {
      setIsFetching(true);
      try {
        const fullProfileData: GetPortfolioResponse = await getPortfolio(
          fetchedAuthToken,
          fetchedUserId
        );
        
        // Get username from bio_data
        const username = fullProfileData.data?.user?.data?.bio_data?.user_name;
        if (username) {
          setUserName(username);
        }
        
        const portfolioData =
          fullProfileData.data?.user?.data?.portfolio ??
          fullProfileData.data?.portfolio;

        if (portfolioData && portfolioData.template_type === "DESIGNER") {
          // Preserve existing fonts/template_fonts so save doesn't overwrite customizations
          if (portfolioData.fonts) setExistingFonts(portfolioData.fonts);

          // Type-safe access to template_specific for designer
          const designerSpecific =
            portfolioData.template_specific &&
            typeof portfolioData.template_specific === "object" &&
            "designer" in portfolioData.template_specific
              ? portfolioData.template_specific.designer
              : null;

          const skills = designerSpecific?.skills
            ? designerSpecific.skills.map(
                (s: { image: string; name: string }) => ({
                  image: { previewUrl: getImageUrl(s.image) || null, file: null },
                  name: s.name || "",
                })
              )
            : [];

          const paddedSkills =
            skills.length >= 4
              ? skills.slice(0, 4)
              : [
                  ...skills,
                  ...Array(4 - skills.length).fill({
                    image: { previewUrl: null, file: null },
                    name: "",
                  }),
                ];

          const portfolioFiles = (portfolioData.files ?? []).map((f) => ({
            image: { previewUrl: getImageUrl(f.image) || null, file: null },
            name: f.title || "",
            link: f.link || "",
          }));
          const paddedPortfolioFiles =
            portfolioFiles.length >= 6
              ? portfolioFiles.slice(0, 6)
              : [
                  ...portfolioFiles,
                  ...Array(6 - portfolioFiles.length).fill({
                    image: { previewUrl: null, file: null },
                    name: "",
                    link: "",
                  }),
                ];

          const toolsValue = designerSpecific?.tools
            ? Array.isArray(designerSpecific.tools)
              ? designerSpecific.tools.join(", ")
              : designerSpecific.tools || ""
            : "";

          const behance = designerSpecific?.behance || "";
          const jobsOpenToValue = designerSpecific?.job_open_to || "";

          const whyWorkWithMeValue =
            designerSpecific?.why_you_should_work_with_me ??
            portfolioData.what_you_get_working_with_me ??
            "";

          setFormData({
            displayName: portfolioData.display_name ?? "",
            jobTitles: (portfolioData.job_titles ?? []).join(", ") || "",
            location: portfolioData.location ?? "",
            headShot: {
              previewUrl: getImageUrl(portfolioData.head_shot) || null,
              file: null,
            },
            aboutMe: portfolioData.about_me ?? "",
            missionAndDesignPhilosophy: portfolioData.mission ?? "",
            skills: paddedSkills,
            tools: toolsValue,
            genericPortfolioFiles: paddedPortfolioFiles,
            behance: behance,
            otherServices:
              (portfolioData.other_services ?? []).join(", ") || "",
            jobsOpenTo: jobsOpenToValue,
            whyWorkWithMe: whyWorkWithMeValue,
          });
        } else {
          console.log(
            "[v0] DesignerForm: No existing designer portfolio found or template type mismatch. Using default form values."
          );
          toast("No existing designer portfolio found. Starting fresh.", {
            icon: "ℹ️",
          });
        }
      } catch (error) {
        console.error("[v0] DesignerForm: Error fetching portfolio:", error);
        toast.error(
          `Failed to load portfolio: ${
            error instanceof Error ? error.message : String(error)
          }`
        );
      } finally {
        setIsFetching(false);
      }
    };

    fetchExistingPortfolio();
  }, [router]); // eslint-disable-line react-hooks/exhaustive-deps

  // Detect API load completion → compare with any saved draft
  useEffect(() => {
    if (!isFetching && !apiLoadedRef.current) {
      apiLoadedRef.current = true;
      saveServerSnapshot(formData);
      if (hasMeaningfulDraft()) setShowDraftBanner(true);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isFetching]);

  // Auto-save draft 1.5 s after the user stops editing
  useEffect(() => {
    if (!apiLoadedRef.current) return;
    const timer = setTimeout(() => saveDraft(formData), 1500);
    return () => clearTimeout(timer);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [formData]);

  const handleInputChange = (
    key: keyof DesignerFormDataInput,
    value: string
  ) => {
    setFormData((prev) => ({ ...prev, [key]: value }));
  };

  const handlePortfolioFileChange = (
    index: number,
    key: "image" | "name" | "link",
    value: string
  ) => {
    setFormData((prev) => ({
      ...prev,
      genericPortfolioFiles: prev.genericPortfolioFiles.map((item, i) =>
        i === index
          ? {
              ...item,
              ...(key === "image"
                ? { image: { ...item.image, previewUrl: value } }
                : { [key]: value }),
            }
          : item
      ),
    }));
  };

  const handleSkillsChange = (
    index: number,
    key: "image" | "name",
    value: string
  ) => {
    setFormData((prev) => ({
      ...prev,
      skills: prev.skills.map((item, i) =>
        i === index
          ? {
              ...item,
              ...(key === "image"
                ? { image: { ...item.image, previewUrl: value } }
                : { [key]: value }),
            }
          : item
      ),
    }));
  };

  const handleImageFileChange = (
    event: React.ChangeEvent<HTMLInputElement>,
    type: "headShot" | "skill" | "portfolio",
    index?: number
  ) => {
    const file = event.target.files?.[0];
    if (file && file.size > 10 * 1024 * 1024) {
      toast.error("Image must be 10MB or less.");
      event.target.value = "";
      return;
    }
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const previewUrl = reader.result as string;
        if (type === "headShot") {
          setFormData((prev) => ({ ...prev, headShot: { previewUrl, file } }));
        } else if (type === "skill" && index !== undefined) {
          setFormData((prev) => ({
            ...prev,
            skills: prev.skills.map((item, i) =>
              i === index ? { ...item, image: { previewUrl, file } } : item
            ),
          }));
        } else if (type === "portfolio" && index !== undefined) {
          setFormData((prev) => ({
            ...prev,
            genericPortfolioFiles: prev.genericPortfolioFiles.map((item, i) =>
              i === index ? { ...item, image: { previewUrl, file } } : item
            ),
          }));
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const stringToArray = (str: string): string[] => {
    return str
      .split(",")
      .map((s) => s.trim())
      .filter(Boolean);
  };

  const handleSave = async () => {
    if (!authToken || !userId) {
      toast.error("Authentication required. Please log in again.", {
        id: "saveToast",
      });
      router.push("/login");
      return;
    }

    console.log("[v0] DesignerForm: Starting save process");
    console.log(
      "[v0] DesignerForm: formData.skills before processing:",
      JSON.stringify(formData.skills, null, 2)
    );

    setIsLoading(true);
    setIsUploadingMedia(true);
    toast.loading("Saving portfolio...", { id: "saveToast" });
    try {
      const filesToUpload: File[] = [];
      if (formData.headShot.file instanceof File) {
        filesToUpload.push(formData.headShot.file);
      }
      formData.skills.forEach((s) => {
        if (s.image.file instanceof File) {
          filesToUpload.push(s.image.file);
        }
      });
      formData.genericPortfolioFiles.forEach((p) => {
        if (p.image.file instanceof File) {
          filesToUpload.push(p.image.file);
        }
      });

      let uploadedUrls: Array<string | { path?: string; url?: string }> = [];
      if (filesToUpload.length > 0) {
        uploadedUrls = await uploadAllMedia(filesToUpload);
        toast.success("All media uploaded successfully!", { id: "saveToast" });
      } else {
        toast("No new media to upload.", { icon: "ℹ️", id: "saveToast" });
      }

      setIsUploadingMedia(false);

      const getNextUploadedUrl = (
        file: File | null,
        currentPreviewUrl: string | null
      ) => {
        if (file instanceof File) {
          const fileIndex = filesToUpload.indexOf(file);
          if (fileIndex !== -1 && uploadedUrls[fileIndex]) {
            const uploaded = uploadedUrls[fileIndex];
            return typeof uploaded === "string"
              ? uploaded
              : (uploaded.path || uploaded.url || "").replace(
                  "/api.portgig.com/portgig",
                  ""
                );
          }
        }
        // Never send a base64 data URL to the backend — only return real server/CDN URLs
        if (currentPreviewUrl && currentPreviewUrl.startsWith("data:")) return "";
        return currentPreviewUrl || "";
      };

      const finalHeadShotUrl = getNextUploadedUrl(
        formData.headShot.file,
        formData.headShot.previewUrl
      );

      const finalSkills = formData.skills
        .map((s) => ({
          name: typeof s.name === "string" ? s.name.trim() : "",
          image: getNextUploadedUrl(s.image.file, s.image.previewUrl),
        }))
        .filter((s) => s.name.length > 0 || s.image);

      const finalPortfolioFiles = formData.genericPortfolioFiles
        .map((p) => ({
          title: p.name,
          link: p.link,
          image: getNextUploadedUrl(p.image.file, p.image.previewUrl),
        }))
        .filter((p) => p.title || p.link || p.image); // remove completely empty files

      const payload: PortfolioApiPayload = {
        portfolio: {
          template_type: "DESIGNER" as const,
          display_name: formData.displayName,
          job_titles: stringToArray(formData.jobTitles),
          location: formData.location,
          about_me: formData.aboutMe,
          mission: formData.missionAndDesignPhilosophy,
          head_shot: finalHeadShotUrl || "",
          files: finalPortfolioFiles,
          // Preserve any existing font/color customizations — do not overwrite them
          ...(existingFonts ? { fonts: existingFonts } : {}),
          other_services: stringToArray(formData.otherServices),
          what_you_get_working_with_me: formData.whyWorkWithMe,

          template_specific: {
            skills: finalSkills,
            tools: stringToArray(formData.tools),
            job_open_to: formData.jobsOpenTo,
            why_you_should_work_with_me: formData.whyWorkWithMe,
            behance: formData.behance || undefined,
          } as any,
          profile_image: "",
          services: [],
        },
      };

      await saveDesignerPortfolio(payload);
      toast.success("Portfolio updated successfully!", { id: "saveToast" });

      await revalidateTemplateDesignerPage();
      const _designerNavSlug = formData.displayName ? formData.displayName.trim().toLowerCase().replace(/\s+/g, "-") : "portfolio";
      router.push(`/designer-portfolio/${encodeURIComponent(_designerNavSlug)}/${encodeURIComponent(userId || "")}`);
      clearDraft();
    } catch (error) {
      console.error("DesignerForm: Error updating portfolio:", error);
      toast.error(
        `Failed to update portfolio: ${
          error instanceof Error ? error.message : String(error)
        }`,
        {
          id: "saveToast",
        }
      );
    } finally {
      setIsLoading(false);
      setIsUploadingMedia(false);
    }
  };

  const handleFontColorClick = () => {
    router.push("/edit-font");
  };

  const handleCancel = () => {
    router.back();
  };

  const isAnyLoading = isLoading || isFetching || isUploadingMedia;

  if (isFetching) {
    return (
      <div className="w-full max-w-4xl mx-auto bg-white shadow-md overflow-hidden p-6 text-center text-lg text-[#0A1754]">
        Loading portfolio data...
      </div>
    );
  }

  return (
    <div className="w-full max-w-4xl mx-auto bg-white shadow-md overflow-hidden">
      {showDraftBanner && (
        <DraftBanner
          onRestore={() => { const d = loadDraft(); if (d) setFormData(d); setShowDraftBanner(false); }}
          onDiscard={() => { clearDraft(); setShowDraftBanner(false); }}
        />
      )}
      {/* Header */}
      <div className="bg-[#0A1754] text-white px-6 py-4 flex justify-between items-center">
        <h1 className="text-base lg:text-2xl font-semibold font-inter">
          Edit Profile
        </h1>
        <div className="flex gap-3">
          <button
            onClick={handleCancel}
            className="py-1 px-2 lg:px-4 lg:py-2 border text-white border-white rounded text-sm hover:bg-white/10 transition cursor-pointer"
            disabled={isAnyLoading}
          >
            Cancel
          </button>
          <button
            onClick={handleFontColorClick}
            className="py-1 px-2 lg:px-4 lg:py-2 border text-white border-white rounded text-sm transition cursor-pointer"
            disabled={isAnyLoading}
          >
            Font & Colour
          </button>
          <button
            onClick={handleSave}
            className="px-4 py-1 lg:px-10 lg:py-3 bg-white text-[#1e3a8a] rounded font-medium hover:bg-gray-100 transition cursor-pointer"
            disabled={isAnyLoading}
          >
            {isLoading
              ? "Saving..."
              : isUploadingMedia
              ? "Uploading Media..."
              : "Save"}
          </button>
        </div>
      </div>
      <div className="p-6 space-y-8">
        {/* Display Name, Job Titles and Head Shot */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="space-y-6">
            {/* Display Name */}
            <div>
              <label className="block text-[#0A1754] font-semibold text-xl mb-3">
                Display Name
              </label>
              <input
                type="text"
                value={formData.displayName}
                onChange={(e) =>
                  handleInputChange("displayName", e.target.value)
                }
                className="w-full p-4 bg-gray-100 rounded-lg border-0 focus:ring-2 focus:ring-[#1e3a8a] focus:bg-white transition"
                placeholder="Enter your display name"
                disabled={isAnyLoading}
              />
            </div>
            {/* Job Titles */}
            <div>
              <label className="block text-[#0A1754] font-semibold text-xl mb-3">
                Job Titles
              </label>
              <textarea
                value={formData.jobTitles}
                onChange={(e) => handleInputChange("jobTitles", e.target.value)}
                rows={4}
                className="w-full p-4 bg-gray-100 rounded-lg border-0 focus:ring-2 focus:ring-[#0A1754] focus:bg-white transition resize-none"
                placeholder="Enter your job titles (comma-separated)"
                disabled={isAnyLoading}
              />
            </div>
          </div>
          {/* Head Shot */}
          <div>
            <label className="block text-[#0A1754] font-semibold text-xl mb-3 text-center">
              Head shot
            </label>
            <div
              className="aspect-square bg-gray-100 rounded-lg flex flex-col items-center justify-center border-2 border-dashed border-gray-300 hover:border-[#0A1754] transition cursor-pointer overflow-hidden"
              onClick={() => headShotInputRef.current?.click()}
            >
              {formData.headShot.previewUrl ? (
                <div className="relative w-full h-full">
                  <Image
                    src={formData.headShot.previewUrl || "/placeholder.svg"}
                    alt="Head shot"
                    className="w-full h-full object-cover rounded-lg"
                    fill
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                  />
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setFormData((prev) => ({
                        ...prev,
                        headShot: { previewUrl: null, file: null },
                      }));
                    }}
                    className="absolute top-2 right-2 p-1 bg-red-500 text-white rounded-full hover:bg-red-600"
                    disabled={isAnyLoading}
                  >
                    <X size={16} />
                  </button>
                </div>
              ) : (
                <div className="text-center">
                  <Upload className="mx-auto mb-2 text-[#0A1754]" size={24} />
                  <span className="text-[#0A1754] font-medium">
                    Upload Image
                  </span>
                </div>
              )}
              <input
                type="file"
                ref={headShotInputRef}
                className="hidden"
                accept="image/*"
                onChange={(e) => handleImageFileChange(e, "headShot")}
                disabled={isAnyLoading}
              />
            </div>
          </div>
        </div>
        {/* About Me */}
        <div>
          <label className="block text-[#0A1754] font-semibold text-xl mb-3">
            About Me
          </label>
          <textarea
            value={formData.aboutMe}
            onChange={(e) => handleInputChange("aboutMe", e.target.value)}
            rows={6}
            className="w-full p-4 bg-gray-100 rounded-lg border-0 focus:ring-2 focus:ring-[#0A1754] focus:bg-white transition resize-none"
            placeholder="Tell us about yourself"
            disabled={isAnyLoading}
          />
        </div>
        {/* Mission and Design Philosophy */}
        <div>
          <label className="block text-[#0A1754] font-semibold text-xl mb-3">
            Mission and Design Philosophy
          </label>
          <textarea
            value={formData.missionAndDesignPhilosophy}
            onChange={(e) =>
              handleInputChange("missionAndDesignPhilosophy", e.target.value)
            }
            rows={6}
            className="w-full p-4 bg-gray-100 rounded-lg border-0 focus:ring-2 focus:ring-[#0A1754] focus:bg-white transition resize-none"
            placeholder="Write here"
            disabled={isAnyLoading}
          />
        </div>
        {/* Skills */}
        <div>
          <label className="block text-[#0A1754] font-semibold text-xl mb-6">
            Skills
          </label>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {formData.skills.map((skill, index) => (
              <div key={index} className="space-y-3">
                <div
                  className="aspect-square bg-gray-100 rounded-lg flex flex-col items-center justify-center border-2 border-dashed border-gray-300 hover:border-[#1e3a8a] transition cursor-pointer overflow-hidden"
                  onClick={() => skillImageInputRefs.current[index]?.click()}
                >
                  {skill.image.previewUrl ? (
                    <div className="relative w-full h-full">
                      <Image
                        src={skill.image.previewUrl || "/placeholder.svg"}
                        alt="Skill"
                        className="w-full h-full object-cover rounded-lg"
                        fill
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                      />
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setFormData((prev) => ({
                            ...prev,
                            skills: prev.skills.map((item, i) =>
                              i === index
                                ? {
                                    ...item,
                                    image: { previewUrl: null, file: null },
                                  }
                                : item
                            ),
                          }));
                        }}
                        className="absolute top-2 right-2 p-1 bg-red-500 text-white rounded-full hover:bg-red-600"
                        disabled={isAnyLoading}
                      >
                        <X size={16} />
                      </button>
                    </div>
                  ) : (
                    <div className="text-center">
                      <span className="text-[#0A1754] font-medium text-lg">
                        Upload Png
                      </span>
                    </div>
                  )}
                  <input
                    type="file"
                    ref={(el) => {
                      skillImageInputRefs.current[index] = el;
                    }}
                    className="hidden"
                    accept="image/*"
                    onChange={(e) => handleImageFileChange(e, "skill", index)}
                    disabled={isAnyLoading}
                  />
                </div>
                <input
                  type="text"
                  value={skill.name}
                  onChange={(e) =>
                    handleSkillsChange(index, "name", e.target.value)
                  }
                  placeholder="Name of skill"
                  className="w-full p-3 bg-gray-100 rounded-lg border-0, focus:ring-2 focus:ring-[#1e3a8a] focus:bg-white transition text-center text-sm"
                  disabled={isAnyLoading}
                />
              </div>
            ))}
          </div>
        </div>
        {/* Tools/Software */}
        <div>
          <label className="block text-[#0A1754] font-semibold text-xl mb-3">
            Tools/Software
          </label>
          <textarea
            value={formData.tools}
            onChange={(e) => handleInputChange("tools", e.target.value)}
            rows={6}
            className="w-full p-4 bg-gray-100 rounded-lg border-0 focus:ring-2 focus:ring-[#1e3a8a] focus:bg-white transition resize-none"
            placeholder="Enter tools and software (comma-separated, e.g., Adobe Photoshop, Figma)"
            disabled={isAnyLoading}
          />
        </div>
        {/* My Portfolio */}
        <div>
          <label className="block text-black font-semibold text-xl mb-6 text-center">
            My portfolio
          </label>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {formData.genericPortfolioFiles.map((item, index) => (
              <div key={index}>
                <div
                  className="aspect-square bg-gray-100 rounded-lg flex flex-col items-center justify-center border-2 border-dashed border-gray-300 hover:border-[#1e3a8a] transition cursor-pointer overflow-hidden"
                  onClick={() =>
                    portfolioImageInputRefs.current[index]?.click()
                  }
                >
                  {item.image.previewUrl ? (
                    <div className="relative w-full h-full">
                      <Image
                        src={item.image.previewUrl || "/placeholder.svg"}
                        alt="Portfolio"
                        className="w-full h-full object-cover rounded-lg"
                        fill
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                      />
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setFormData((prev) => ({
                            ...prev,
                            genericPortfolioFiles:
                              prev.genericPortfolioFiles.map((item, i) =>
                                i === index
                                  ? {
                                      ...item,
                                      image: { previewUrl: null, file: null },
                                    }
                                  : item
                              ),
                          }));
                        }}
                        className="absolute top-2 right-2 p-1 bg-red-500 text-white rounded-full hover:bg-red-600"
                        disabled={isAnyLoading}
                      >
                        <X size={16} />
                      </button>
                    </div>
                  ) : (
                    <div className="text-center">
                      <span className="text-[#0A1754] font-medium text-lg">
                        Upload Image
                      </span>
                    </div>
                  )}
                  <input
                    type="file"
                    ref={(el) => {
                      portfolioImageInputRefs.current[index] = el;
                    }}
                    className="hidden"
                    accept="image/*"
                    onChange={(e) =>
                      handleImageFileChange(e, "portfolio", index)
                    }
                    disabled={isAnyLoading}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
        {/* Social Links */}
        <div>
          <label className="block text-[#0A1754] font-semibold text-xl mb-3">
            Pintrest/ Behance Profile liink
          </label>
          <input
            type="url"
            value={formData.behance}
            onChange={(e) => handleInputChange("behance", e.target.value)}
            className="w-full p-4 bg-gray-100 rounded-lg border-0 focus:ring-2 focus:ring-[#1e3a8a] focus:bg-white transition"
            placeholder="https://behance.net"
            disabled={isAnyLoading}
          />
        </div>
        {/* Other Services/Skills */}
        <div>
          <label className="block text-black font-semibold text-xl mb-3">
            Other Services/Skills
          </label>
          <textarea
            value={formData.otherServices}
            onChange={(e) => handleInputChange("otherServices", e.target.value)}
            rows={4}
            className="w-full p-4 bg-gray-100 rounded-lg border-0 focus:ring-2 focus:ring-[#0A1754] focus:bg-white transition resize-none"
            placeholder="Enter other services/skills (comma-separated)"
            disabled={isAnyLoading}
          />
        </div>
        {/* Jobs Open To */}
        <div>
          <label className="block text-black font-semibold text-xl mb-3">
            Jobs Open To
          </label>
          <input
            type="text"
            value={formData.jobsOpenTo}
            onChange={(e) => handleInputChange("jobsOpenTo", e.target.value)}
            placeholder="e.g., Freelance, Full-time, Contract (comma-separated)"
            className="w-full p-4 bg-gray-100 rounded-lg border-0 focus:ring-2 focus:ring-[#1e3a8a] focus:bg-white transition"
            disabled={isAnyLoading}
          />
        </div>
        {/* Why you should work with me */}
        <div>
          <label className="block text-black font-semibold text-xl mb-3">
            Why you should work with me
          </label>
          <textarea
            value={formData.whyWorkWithMe}
            onChange={(e) => handleInputChange("whyWorkWithMe", e.target.value)}
            rows={6}
            className="w-full p-4 bg-gray-100 rounded-lg border-0 focus:ring-2 focus:ring-[#0A1754] focus:bg-white transition resize-none"
            placeholder="Write here"
            disabled={isAnyLoading}
          />
        </div>
      </div>
      {/* Bottom Actions */}
      <div className="bg-[#0A1754] px-6 py-4 flex justify-end gap-4 max-md:mb-18">
        <button
          onClick={handleCancel}
          className="py-1 px-2 lg:px-4 lg:py-2 bg-white text-[#1e3a8a] border border-white rounded text-sm transition cursor-pointer"
          disabled={isAnyLoading}
        >
          Cancel
        </button>
        <button
          onClick={handleFontColorClick}
          className="py-1 px-2 lg:px-4 lg:py-2 bg-white text-[#1e3a8a] border border-white rounded text-sm transition cursor-pointer"
          disabled={isAnyLoading}
        >
          Font & Colour
        </button>
        <button
          onClick={handleSave}
          className="px-4 py-1 lg:px-10 lg:py-3 bg-white text-[#1e3a8a] rounded font-medium hover:bg-gray-100 transition cursor-pointer"
          disabled={isAnyLoading}
        >
          {isLoading
            ? "Saving..."
            : isUploadingMedia
            ? "Uploading Media..."
            : "Save"}
        </button>
      </div>
    </div>
  );
};

export default DesignerForm;
