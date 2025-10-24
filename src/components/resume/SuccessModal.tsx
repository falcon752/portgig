import React from 'react';

interface SuccessModalProps {
  isOpen: boolean;
  onClose: () => void;
  onDownload: () => void;
  canDownload: boolean;
  daysUntilDownload: number;
}

export const SuccessModal: React.FC<SuccessModalProps> = ({
  isOpen,
  onDownload,
  canDownload,
  daysUntilDownload,
}) => {
  if (!isOpen) return null;

  const handleDownloadClick = () => {
    if (canDownload) {
      onDownload();
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
        <div className="text-center">
          <div className="mb-4">
            <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-green-100">
              <svg
                className="h-6 w-6 text-green-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M5 13l4 4L19 7"
                />
              </svg>
            </div>
          </div>

          <h3 className="text-lg font-medium text-gray-900 mb-2">
            CV / Resume
          </h3>

          <div className="mb-6">
            <div className="flex justify-center items-center mb-4">
              <div className="bg-blue-100 p-3 rounded-full">
                <svg
                  className="h-8 w-8 text-blue-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                  />
                </svg>
              </div>
            </div>
          </div>

          <p className="text-2xl font-semibold text-gray-900 mb-6">
            Changes Saved
          </p>

          <div className="space-y-4">
            <button
              onClick={handleDownloadClick}
              disabled={!canDownload}
              className={`w-full py-3 px-6 rounded-lg font-semibold transition-all duration-300 ${
                canDownload
                  ? "bg-[#0A1754] text-white hover:bg-[#0A1754]/90 cursor-pointer"
                  : "bg-gray-300 text-gray-500 cursor-not-allowed"
              }`}
            >
              {canDownload
                ? "Download CV"
                : `Download available in ${daysUntilDownload} days`}
            </button>

            <button
              onClick={() => (window.location.href = "/creative-dashboard")}
              className="w-full py-3 px-6 bg-[#0A1754] text-white rounded-lg font-semibold transition-all duration-300 cursor-pointer hover:bg-[#0A1754]/90"
            >
              Go back to Dashboard
            </button>

            <button
              onClick={() => (window.location.href = "/creative-homepage")}
              className="w-full py-3 px-6 bg-[#0A1754] text-white rounded-lg font-semibold transition-all duration-300 cursor-pointer hover:bg-[#0A1754]/90"
            >
              Go back to Homepage
            </button>
          </div>

          {!canDownload && (
            <div className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
              <p className="text-sm text-yellow-800">
                You can only download a CV once every 3 months. Your last download
                restricts the next one.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};