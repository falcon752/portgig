"use client";
import { useState, useEffect } from "react";
import { AiOutlineEye, AiOutlineEdit } from "react-icons/ai";
import { useRouter } from "next/navigation";
import Image from "next/image";

interface EditStatus {
  canEdit: boolean;
  editsUsed: number;
  editsRemaining: number;
  lastResetDate: Date | null;
  nextResetDate: Date | null;
  editHistory: Date[];
}

const CVTemplateSelector = () => {
  const router = useRouter();
  const [editStatus, setEditStatus] = useState<EditStatus>({
    canEdit: true,
    editsUsed: 0,
    editsRemaining: 3,
    lastResetDate: null,
    nextResetDate: null,
    editHistory: [],
  });

  const cvTemplate = {
    id: 1,
    name: "Professional CV",
    description: "Edit and customize your professional CV with our easy-to-use editor",
    preview: "/resume/cv.png",
  };

  const checkEditEligibility = () => {
    const key = `cv_edit_tracking`;
    const trackingData = localStorage.getItem(key);
    
    if (trackingData) {
      const data = JSON.parse(trackingData);
      const editHistory: Date[] = data.editHistory.map((date: string) => new Date(date));
      const now = new Date();
      
      // Check if 60 days have passed since the last reset
      const lastResetDate = data.lastResetDate ? new Date(data.lastResetDate) : null;
      const sixtyDaysAgo = new Date(now.getTime() - (60 * 24 * 60 * 60 * 1000)); // 60 days ago
      
      let editsUsed = data.editsUsed || 0;
      let nextResetDate = data.nextResetDate ? new Date(data.nextResetDate) : null;
      
      // Reset edits if 60 days have passed since last reset
      if (lastResetDate && now >= new Date(lastResetDate.getTime() + (60 * 24 * 60 * 60 * 1000))) {
        editsUsed = 0;
        nextResetDate = null;
      }
      
      // Filter out edits older than 60 days
      const recentEdits = editHistory.filter(editDate => editDate > sixtyDaysAgo);
      
      // If we have recent edits but no reset tracking, use the count of recent edits
      if (recentEdits.length > 0 && !lastResetDate) {
        editsUsed = recentEdits.length;
        if (editsUsed >= 3) {
          // Set next reset date to 60 days after the oldest recent edit
          const oldestRecentEdit = new Date(Math.min(...recentEdits.map(d => d.getTime())));
          nextResetDate = new Date(oldestRecentEdit.getTime() + (60 * 24 * 60 * 60 * 1000));
        }
      }
      
      const editsRemaining = Math.max(0, 3 - editsUsed);
      const canEdit = editsUsed < 3;
      
      setEditStatus({
        canEdit,
        editsUsed,
        editsRemaining,
        lastResetDate,
        nextResetDate,
        editHistory: recentEdits,
      });
    } else {
      setEditStatus({
        canEdit: true,
        editsUsed: 0,
        editsRemaining: 3,
        lastResetDate: null,
        nextResetDate: null,
        editHistory: [],
      });
    }
  };

  useEffect(() => {
    checkEditEligibility();
  }, []);

  const handleEditCV = () => {
    if (!editStatus.canEdit) {
      return;
    }

    // Clear any previous template data
    localStorage.removeItem("selectedTemplate");
    localStorage.removeItem("selectedTemplateId");

    console.log("Editing CV Template");

    const now = new Date();
    const newEditsUsed = editStatus.editsUsed + 1;
    const newEditHistory = [...editStatus.editHistory, now];
    
    let nextResetDate = editStatus.nextResetDate;
    let lastResetDate = editStatus.lastResetDate;
    
    // If this is the 3rd edit, set the reset date
    if (newEditsUsed >= 3 && !nextResetDate) {
      nextResetDate = new Date(now.getTime() + (60 * 24 * 60 * 60 * 1000));
      lastResetDate = now;
    }

    // Update tracking data
    const trackingData = {
      editsUsed: newEditsUsed,
      lastResetDate: lastResetDate?.toISOString(),
      nextResetDate: nextResetDate?.toISOString(),
      editHistory: newEditHistory.map(date => date.toISOString()),
    };
    
    localStorage.setItem(`cv_edit_tracking`, JSON.stringify(trackingData));

    // Store the CV template data
    localStorage.setItem("selectedTemplate", JSON.stringify(cvTemplate));
    localStorage.setItem("selectedTemplateId", cvTemplate.id.toString());

    setTimeout(() => {
      router.push(`/creative-dashboard/edit-cv?templateId=${cvTemplate.id}`);
    }, 100);

    checkEditEligibility();
  };


  const getDaysUntilNextReset = (): number | null => {
    if (!editStatus || editStatus.canEdit || !editStatus.nextResetDate) return null;
    const now = new Date();
    const nextDate = editStatus.nextResetDate;
    const diff = nextDate.getTime() - now.getTime();
    const days = Math.ceil(diff / (1000 * 60 * 60 * 24));
    return days > 0 ? days : 0;
  };

  const daysUntilReset = getDaysUntilNextReset();

  const getStatusMessage = () => {
    if (editStatus.canEdit) {
      return `${editStatus.editsRemaining} edit${editStatus.editsRemaining !== 1 ? 's' : ''} remaining`;
    } else {
      return `Wait ${daysUntilReset} days for reset`;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-[#0A1754] mb-4 font-raleway">
            Edit Your CV
          </h1>
          <p className="text-xl text-black max-w-2xl mx-auto">
            Create and customize your professional CV with our intuitive editor
          </p>
          <p className="text-sm text-gray-600 mt-2">
            * You can edit your CV 3 times every 60 days
          </p>
        </div>

        {/* Single CV Card */}
        <div className="max-w-lg mx-auto">
          <div className="group relative bg-white rounded-lg shadow-md overflow-hidden transform transition-all duration-300 hover:scale-105 hover:shadow-xl border border-gray-200">
            {/* Image Preview */}
            <div className="relative overflow-hidden h-96 bg-gray-100">
              <Image
                src={cvTemplate.preview}
                alt={cvTemplate.name}
                width={400}
                height={500}
                className="object-cover w-full h-full transition-transform duration-300 group-hover:scale-105"
              />

              {/* Overlay Actions */}
              <div className="absolute inset-0 bg-black/70 opacity-0 group-hover:opacity-100 transition-all duration-300 flex items-center justify-center">
                <div className="transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300 text-center">
                  <button
                    onClick={handleEditCV}
                    disabled={!editStatus.canEdit}
                    className={`px-8 py-3 rounded-lg font-semibold text-lg mb-4 cursor-pointer flex items-center gap-2 mx-auto ${
                      editStatus.canEdit
                        ? "bg-[#0A1754] hover:bg-blue-800 text-white"
                        : "bg-gray-400 text-gray-200 cursor-not-allowed"
                    }`}
                  >
                    <AiOutlineEdit className="w-5 h-5" />
                    {editStatus.canEdit ? "Edit CV" : "Edit Not Available"}
                  </button>
                  <div className="flex gap-3 justify-center">
                    <button
                        onClick={handleEditCV}
                      className="bg-white/20 text-white p-3 rounded-lg hover:bg-white/30 transition-all cursor-pointer"
                      title="Preview CV"
                    >
                      <AiOutlineEye className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              </div>

              {/* Status Badge */}
              <div className="absolute top-3 right-3">
                <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                  editStatus.canEdit 
                    ? "bg-green-500 text-white" 
                    : "bg-red-500 text-white"
                }`}>
                  {editStatus.canEdit ? `${editStatus.editsRemaining} left` : "Limit reached"}
                </span>
              </div>
            </div>

            {/* Info */}
            <div className="p-6">
              <h3 className="text-xl font-bold text-gray-900 mb-3 group-hover:text-[#0A1754] transition-colors">
                {cvTemplate.name}
              </h3>
              <p className="text-gray-600 mb-4 text-sm">
                {cvTemplate.description}
              </p>

              {/* Edit Status Info */}
              <div className={`mb-4 p-3 border rounded text-sm ${
                editStatus.canEdit 
                  ? "bg-green-50 border-green-200 text-green-700"
                  : "bg-yellow-50 border-yellow-200 text-yellow-700"
              }`}>
                <strong>Edit Status:</strong> {getStatusMessage()}
                {editStatus.editsUsed > 0 && (
                  <div className="mt-1">
                    Used: {editStatus.editsUsed}/3 edits
                  </div>
                )}
              </div>

              <div className="flex justify-between items-center">
                <button
                  onClick={handleEditCV}
                  disabled={!editStatus.canEdit}
                  className={`font-semibold hover:underline flex items-center gap-2 cursor-pointer ${
                    editStatus.canEdit
                      ? "text-[#0A1754] hover:text-blue-700"
                      : "text-gray-400 cursor-not-allowed"
                  }`}
                >
                  <AiOutlineEdit className="w-4 h-4" />
                  Edit CV
                </button>
                <div className="text-sm text-gray-500">
                  {editStatus.canEdit ? "✓ Available" : "⏳ Wait Period"}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Call to Action */}
        <div className="text-center mt-16 py-12 bg-[#0A1754] rounded-xl text-white">
          <h2 className="text-3xl font-bold mb-4">
            Ready to Update Your Professional CV?
          </h2>
          <p className="text-xl mb-8 opacity-90">
            Keep your CV current and showcase your latest achievements
          </p>
          <button
            className={`px-8 py-3 rounded-lg font-semibold transition cursor-pointer flex items-center gap-2 mx-auto ${
              editStatus.canEdit
                ? "bg-white text-[#0A1754] hover:bg-gray-100"
                : "bg-gray-400 text-gray-200 cursor-not-allowed"
            }`}
            onClick={editStatus.canEdit ? handleEditCV : undefined}
            disabled={!editStatus.canEdit}
          >
            <AiOutlineEdit className="w-5 h-5" />
            {editStatus.canEdit 
              ? `Start Editing (${editStatus.editsRemaining} left)` 
              : `Available in ${daysUntilReset} days`}
          </button>
        </div>
      </div>
    </div>
  );
};

export default CVTemplateSelector;