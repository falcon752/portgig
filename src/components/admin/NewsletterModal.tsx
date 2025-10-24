import React, { useState, useEffect } from "react";
import { X, Send, Plus, Trash2, Upload } from "lucide-react";
import { getDashboardStats } from "@/src/lib/requests/admin";

interface NewsletterSection {
  title: string;
  content: string;
  image: string;
}

interface NewsletterFormData {
  topic: string;
  description: string;
  mainImage: string;
  content: string;
  ctaLink: string;
  ctaText: string;
  recipientType: string;
  sections: NewsletterSection[];
}

interface NewsletterModalProps {
  showNewsletterModal: boolean;
  setShowNewsletterModal: (show: boolean) => void;
  newsletterData: NewsletterFormData;
  setNewsletterData: React.Dispatch<React.SetStateAction<NewsletterFormData>>;
  handleNewsletterSubmit: () => Promise<void>;
  addNewsletterSection: () => void;
  updateNewsletterSection: (
    index: number,
    field: keyof NewsletterSection,
    value: string
  ) => void;
  removeNewsletterSection: (index: number) => void;
}

interface DashboardStats {
  totalUsers: number;
  totalJobs: number;
  totalRecruiters: number;
  totalCreators: number;
}

const NewsletterModal: React.FC<NewsletterModalProps> = ({
  showNewsletterModal,
  setShowNewsletterModal,
  newsletterData,
  setNewsletterData,
  handleNewsletterSubmit,
  addNewsletterSection,
  updateNewsletterSection,
  removeNewsletterSection,
}) => {
  const [sending, setSending] = useState(false);
  const [recipientCount, setRecipientCount] = useState<number | null>(null);

  // Helper function to get recipient count based on type
  const getRecipientCount = async (
    recipientType: string
  ): Promise<number | null> => {
    try {
      const stats: DashboardStats = await getDashboardStats();
      switch (recipientType) {
        case "ALL_CREATORS":
          return stats.totalCreators;
        case "ALL_RECRUITERS":
          return stats.totalRecruiters;
        case "ALL":
        default:
          return stats.totalCreators + stats.totalRecruiters;
      }
    } catch (error) {
      console.error("Error fetching recipient count:", error);
      return null;
    }
  };

  // Update recipient count when recipient type changes
  const handleRecipientTypeChange = async (
    e: React.ChangeEvent<HTMLSelectElement>
  ) => {
    const newType = e.target.value;
    setNewsletterData((prev) => ({ ...prev, recipientType: newType }));

    // Fetch fresh count for the new recipient type
    const count = await getRecipientCount(newType);
    setRecipientCount(count);
  };

  // Enhanced submit handler with fresh stats
  const handleSubmitWithFreshStats = async () => {
    setSending(true);
    try {
      // Get fresh recipient count before sending
      const freshCount = await getRecipientCount(newsletterData.recipientType);
      setRecipientCount(freshCount);

      // Proceed with the original submit handler
      await handleNewsletterSubmit();
    } catch (error) {
      console.error("Error in newsletter submission:", error);
    } finally {
      setSending(false);
    }
  };

  // Calculate recipient count when modal opens or recipient type changes
  useEffect(() => {
    if (showNewsletterModal) {
      getRecipientCount(newsletterData.recipientType).then(setRecipientCount);
    }
  }, [showNewsletterModal, newsletterData.recipientType]);

  if (!showNewsletterModal) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg w-full max-w-4xl max-h-[90vh] overflow-y-auto">
        <div className="p-6 border-b border-gray-200">
          <div className="flex justify-between items-center">
            <h3 className="text-xl font-bold text-gray-900">
              Create Newsletter
            </h3>
            <button
              onClick={() => setShowNewsletterModal(false)}
              className="text-gray-400 hover:text-gray-600"
            >
              <X size={24} />
            </button>
          </div>
        </div>

        <div className="p-6 space-y-6">
          {/* Recipient Info Banner */}
          {recipientCount !== null && (
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <div className="flex items-center space-x-2">
                <div className="text-primary">📊</div>
                <div>
                  <p className="text-sm text-blue-800">
                    This newsletter will be sent to{" "}
                    <strong>{recipientCount.toLocaleString()}</strong>{" "}
                    recipients
                    {newsletterData.recipientType === "ALL_CREATORS" &&
                      " (All Creators)"}
                    {newsletterData.recipientType === "ALL_RECRUITERS" &&
                      " (All Recruiters)"}
                    {newsletterData.recipientType === "ALL" && " (All Users)"}
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Basic Info */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Newsletter Topic
              </label>
              <input
                type="text"
                value={newsletterData.topic}
                onChange={(e) =>
                  setNewsletterData((prev) => ({
                    ...prev,
                    topic: e.target.value,
                  }))
                }
                className="w-full text-primary px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="June Updates"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Description
              </label>
              <input
                type="text"
                value={newsletterData.description}
                onChange={(e) =>
                  setNewsletterData((prev) => ({
                    ...prev,
                    description: e.target.value,
                  }))
                }
                className="w-full text-primary px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Our latest news and updates!"
              />
            </div>
          </div>

          {/* Main Image */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Main Image URL
            </label>
            <div className="flex gap-2">
              <input
                type="url"
                value={newsletterData.mainImage}
                onChange={(e) =>
                  setNewsletterData((prev) => ({
                    ...prev,
                    mainImage: e.target.value,
                  }))
                }
                className="flex-1 text-primary px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="https://example.com/image.jpg"
              />
              <button className="px-3 text-primary py-2 border border-gray-300 rounded-m flex items-center cursor-pointer">
                <Upload size={16} className="mr-1" />
                Upload
              </button>
            </div>
          </div>

          {/* Content */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Main Content
            </label>
            <textarea
              value={newsletterData.content}
              onChange={(e) =>
                setNewsletterData((prev) => ({
                  ...prev,
                  content: e.target.value,
                }))
              }
              rows={4}
              className="w-full text-primary px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Newsletter content here..."
            />
          </div>

          {/* CTA */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                CTA Text
              </label>
              <input
                type="text"
                value={newsletterData.ctaText}
                onChange={(e) =>
                  setNewsletterData((prev) => ({
                    ...prev,
                    ctaText: e.target.value,
                  }))
                }
                className="w-full px-3 text-primary py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Learn More"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                CTA Link
              </label>
              <input
                type="url"
                value={newsletterData.ctaLink}
                onChange={(e) =>
                  setNewsletterData((prev) => ({
                    ...prev,
                    ctaLink: e.target.value,
                  }))
                }
                className="w-full text-primary px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="https://example.com/discover"
              />
            </div>
          </div>

          {/* Recipient Type */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Send To
            </label>
            <select
              value={newsletterData.recipientType}
              onChange={handleRecipientTypeChange}
              className="w-full text-primary px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="ALL">All Users</option>
              <option value="ALL_CREATORS">All Creators</option>
              <option value="ALL_RECRUITERS">All Recruiters</option>
            </select>
          </div>

          {/* Sections */}
          <div>
            <div className="flex justify-between items-center mb-4">
              <label className="block text-sm font-medium text-gray-700">
                Newsletter Sections
              </label>
              <button
                onClick={addNewsletterSection}
                className="bg-primary text-white px-3 py-1 rounded-md flex items-center text-sm"
              >
                <Plus size={16} className="mr-1" />
                Add Section
              </button>
            </div>

            {newsletterData.sections.map((section, index) => (
              <div
                key={index}
                className="border border-gray-200 rounded-lg p-4 mb-4"
              >
                <div className="flex justify-between items-center mb-3">
                  <h4 className="font-medium text-gray-700">
                    Section {index + 1}
                  </h4>
                  <button
                    onClick={() => removeNewsletterSection(index)}
                    className="text-red-600 hover:text-red-700"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
                <div className="space-y-3">
                  <input
                    type="text"
                    value={section.title}
                    onChange={(e) =>
                      updateNewsletterSection(index, "title", e.target.value)
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Section title"
                  />
                  <textarea
                    value={section.content}
                    onChange={(e) =>
                      updateNewsletterSection(index, "content", e.target.value)
                    }
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Section content"
                  />
                  <input
                    type="url"
                    value={section.image}
                    onChange={(e) =>
                      updateNewsletterSection(index, "image", e.target.value)
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Section image URL"
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="p-6 border-t border-gray-200">
          <div className="flex space-x-3">
            <button
              onClick={() => setShowNewsletterModal(false)}
              className="flex-1 px-4 py-2 text-gray-600 border border-gray-300 rounded-md hover:bg-gray-50 cursor-pointer"
            >
              Cancel
            </button>
            <button
              onClick={handleSubmitWithFreshStats}
              disabled={sending}
              className="flex-1 px-4 py-2 bg-primary text-white rounded-md flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
            >
              <Send size={16} className="mr-2" />
              {sending ? "Sending..." : "Send Newsletter"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NewsletterModal;
