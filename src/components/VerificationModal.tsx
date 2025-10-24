import React from 'react';

interface VerificationModalProps {
  isOpen: boolean;
  onClose: () => void;
  recruiterName: string;
}

export default function VerificationModal({ 
  isOpen, 
  onClose, 
  recruiterName 
}: VerificationModalProps) {
  if (!isOpen) return null;

  const supportEmail = "info@portgig.com";

  const handleEmailClick = () => {
    const subject = encodeURIComponent("Account Verification - Company Documents");
    const body = encodeURIComponent(
      `Dear Portgig Team,

I am writing to submit my company documents for account verification.

Recruiter Name: ${recruiterName}
Business Name: [Please enter your business name here]

Please find attached:
- Corporate Affairs Commission (CAC) document
- Business Incorporation Document

Thank you for your time and consideration.

Best regards,
${recruiterName}`
    );
    
    const gmailUrl = `https://mail.google.com/mail/?view=cm&to=${supportEmail}&su=${subject}&body=${body}`;
    window.open(gmailUrl, '_blank');
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full mx-4 relative">
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-500 hover:text-gray-700 text-2xl font-light cursor-pointer"
        >
          ×
        </button>

        <div className="p-6 pt-12">
          {/* Header */}
          <div className="text-center mb-6">
            <h2 className="text-xl font-semibold text-gray-800 mb-2">
              Account pending verification
            </h2>
          </div>

          {/* Content */}
          <div className="text-gray-600 text-sm leading-relaxed mb-6">
            <p className="mb-4">
              Hello <span className="font-medium">{recruiterName}</span>, for you to be able to proceed and post a job, you 
              need to submit your company details to enable us verify your account. Please 
              send an email to{' '}
              <button
                onClick={handleEmailClick}
                className="text-blue-600 hover:underline font-medium"
              >
                {supportEmail}
              </button>{' '}
              with company document(s) attached and the team will get in touch shortly. Thank you.
            </p>

            <div className="mb-4">
              <h3 className="font-medium text-gray-800 mb-3">Documents that we need (any of this)</h3>
              <ul className="space-y-2 text-sm">
                <li className="flex items-start">
                  <span className="w-1.5 h-1.5 bg-gray-400 rounded-full mt-2 mr-3 shrink-0"></span>
                  Corporate Affairs Commission (CAC) document or
                </li>
                <li className="flex items-start">
                  <span className="w-1.5 h-1.5 bg-gray-400 rounded-full mt-2 mr-3 shrink-0"></span>
                  Business Incorporation Document, proof of business registration with the government
                </li>
              </ul>
            </div>
          </div>

          {/* Action buttons */}
          <div className="flex flex-col gap-3">
            <button
              onClick={handleEmailClick}
              className="w-full bg-primary text-white py-3 px-4 rounded-md transition-colors font-medium cursor-pointer"
            >
              Send Email
            </button>
            <button
              onClick={onClose}
              className="w-full bg-gray-100 text-gray-700 py-3 px-4 rounded-md hover:bg-gray-200 transition-colors font-medium cursor-pointer"
            >
              Okay
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}