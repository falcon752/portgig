import React, { useState } from "react";
import { FaCheck, FaLock } from "react-icons/fa";
import { IoClose } from "react-icons/io5";
import { TbAlertTriangle } from "react-icons/tb";
import { LuFileText } from "react-icons/lu";
import { ImBriefcase } from "react-icons/im";
import { useRouter } from "next/navigation";
import { useAppSelector } from "../../src/redux/hooks";

interface ProfileSuccessModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const ProfileSuccessModal: React.FC<ProfileSuccessModalProps> = ({
  isOpen,
  onClose,
}) => {
  const router = useRouter();
  const { profile } = useAppSelector((state) => state.user);
  const [showCVWarning, setShowCVWarning] = useState(false);
  const [showPortfolioModal, setShowPortfolioModal] = useState(false);

  const hasPortfolio = Boolean(profile?.portfolio?.template_type);

  const handleEditCVClick = () => {
    setShowCVWarning(true);
  };

  const handleCVWarningOkay = () => {
    setShowCVWarning(false);
    onClose();
    router.push("/creative-dashboard/edit-cv");
  };

  const handleEditPortfolio = () => {
    if (hasPortfolio) {
      onClose();
      router.push(`/edit-template/${profile?.portfolio?.template_type?.toLowerCase()}`);
    } else {
      setShowPortfolioModal(true);
    }
  };

  const handlePortfolioModalCancel = () => {
    setShowPortfolioModal(false);
  };

  const handlePortfolioModalGoToMarketplace = () => {
    setShowPortfolioModal(false);
    onClose();
    router.push("/portfolio");
  };

  const handleChangePassword = () => {
    onClose();
    router.push("/creative-dashboard/change-password");
  };

  const closeModal = () => {
    setShowCVWarning(false);
    setShowPortfolioModal(false);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <>
      {/* Success Modal */}
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full mx-4 relative">
          {/* Close Button */}
          <button
            onClick={closeModal}
            className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-all duration-200 hover:scale-110 hover:rotate-90"
          >
            <IoClose size={24} />
          </button>

          {/* Modal Content */}
          <div className="p-8 text-center">
            {/* Success Icon */}
            <div className="w-40 h-40 bg-[#0A1754] rounded-full flex items-center justify-center mx-auto mb-6 hover:scale-105 transition-transform duration-300">
              <FaCheck size={80} className="text-white" />
            </div>

            <h2 className="text-2xl font-bold text-[#0A1754] font-raleway mb-2">
              Changes Saved
            </h2>
            <p className="mb-8 text-[#0A1754] font-raleway">
              Your profile has been updated successfully!
            </p>

            <div className="space-y-4">
              <button
                onClick={handleEditCVClick}
                className="w-full bg-[#0A1754] text-white py-4 rounded-xl font-semibold hover:bg-[#1a2b6b] cursor-pointer transition-all duration-300 flex items-center justify-center gap-3 hover:scale-105 hover:shadow-lg transform active:scale-95"
              >
                <LuFileText size={20} />
                Edit CV/Resume
              </button>

              <button
                onClick={handleEditPortfolio}
                className="w-full bg-[#0A1754] text-white py-4 rounded-xl font-semibold hover:bg-[#1a2b6b] cursor-pointer transition-all duration-300 flex items-center justify-center gap-3 hover:scale-105 hover:shadow-lg transform active:scale-95"
              >
                <ImBriefcase size={20} />
                Edit Portfolio
              </button>

              <button
                onClick={handleChangePassword}
                className="w-full bg-[#0A1754] text-white py-4 rounded-xl font-semibold hover:bg-[#1a2b6b] cursor-pointer transition-all duration-300 flex items-center justify-center gap-3 hover:scale-105 hover:shadow-lg transform active:scale-95"
              >
                <FaLock size={20} />
                Change Password
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* CV Warning Modal */}
      {showCVWarning && (
        <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-60 p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-lg w-full mx-4 relative">
            {/* Close Button */}
            <button
              onClick={closeModal}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-all duration-200 hover:scale-110 hover:rotate-90"
            >
              <IoClose size={24} />
            </button>

            {/* Warning Card */}
            <div className="p-8">
              {/* Warning Icon */}
              <div className="w-20 h-20 bg-amber-100 rounded-full flex items-center justify-center mx-auto mb-6 hover:scale-105 transition-transform duration-300">
                <TbAlertTriangle size={40} className="text-amber-600" />
              </div>

              {/* Warning Content */}
              <div className="text-center mb-8">
                <h2 className="text-2xl font-bold text-gray-800 mb-4">
                  Important Notice
                </h2>

                {/* Warning Card with Background */}
                <div className="bg-linear-to-r from-amber-50 to-orange-50 border-l-4 border-amber-400 p-6 rounded-lg mb-6 hover:shadow-md transition-all duration-300">
                  <div className="flex items-start gap-3">
                    <TbAlertTriangle
                      size={24}
                      className="text-amber-600 shrink-0 mt-1"
                    />
                    <div className="text-left">
                      <h3 className="font-semibold text-gray-800 mb-2">
                        CV Download Limitation
                      </h3>
                      <p className="text-gray-700 leading-relaxed">
                        <strong>Note:</strong> You only get to download your CV
                        once in 3 months. Take your time and fill in correctly
                        to ensure your CV is complete and accurate.
                      </p>
                    </div>
                  </div>
                </div>

                <p className="text-gray-600 text-sm mb-6">
                  Please make sure all your information is correct before
                  proceeding to the CV editor.
                </p>
              </div>

              <div className="flex gap-4">
                <button
                  onClick={closeModal}
                  className="flex-1 bg-gray-200 text-gray-700 py-3 px-6 rounded-xl font-semibold hover:bg-gray-300 transition-all duration-300 hover:scale-105 hover:shadow-md transform active:scale-95"
                >
                  Cancel
                </button>
                <button
                  onClick={handleCVWarningOkay}
                  className="flex-1 bg-[#0A1754] text-white py-3 px-6 rounded-xl font-semibold hover:bg-[#1a2b6b] transition-all duration-300 hover:scale-105 hover:shadow-lg transform active:scale-95"
                >
                  Okay, Continue
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Portfolio Warning Modal */}
      {showPortfolioModal && (
        <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-60 p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-lg w-full mx-4 relative">
            {/* Close Button */}
            <button
              onClick={closeModal}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-all duration-200 hover:scale-110 hover:rotate-90"
            >
              <IoClose size={24} />
            </button>

            {/* Portfolio Warning Content */}
            <div className="p-8 text-center">
              {/* Warning Icon */}
              <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-6 hover:scale-105 transition-transform duration-300">
                <ImBriefcase size={40} className="text-blue-600" />
              </div>

              <h2 className="text-2xl font-bold text-gray-800 mb-4 font-raleway">
                No Portfolio Selected
              </h2>
              <p className="text-gray-600 mb-6 font-raleway">
                You haven&rsquo;t selected a portfolio template yet. Go to the portfolio marketplace and pick one.
              </p>

              <div className="flex gap-4">
                <button
                  onClick={handlePortfolioModalCancel}
                  className="flex-1 bg-gray-200 text-gray-700 py-3 px-6 rounded-xl font-semibold hover:bg-gray-300 transition-all duration-300 hover:scale-105 hover:shadow-md transform active:scale-95"
                >
                  Cancel
                </button>
                <button
                  onClick={handlePortfolioModalGoToMarketplace}
                  className="flex-1 bg-[#0A1754] text-white py-3 px-6 rounded-xl font-semibold hover:bg-[#1a2b6b] transition-all duration-300 hover:scale-105 hover:shadow-lg transform active:scale-95"
                >
                  Go to Marketplace
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default ProfileSuccessModal;