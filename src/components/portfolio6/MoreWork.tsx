import React from 'react';

export default function MoreWork() {
  return (
    <div className="bg-black text-white text-center py-8 sm:py-10 md:py-12">
      <div className="px-4 sm:px-6">
        <div className="text-center mb-8 sm:mb-10 md:mb-12">
          <h2 className="text-2xl sm:text-3xl md:text-3xl lg:text-4xl font-bold text-[#FFBA00]">
            MORE OF MY WORK/EVENTS
          </h2>
        </div>
        
        <div className="bg-[#1E1E1E] py-8 sm:py-10 md:py-12 px-4 sm:px-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 gap-6 sm:gap-8">
            {/* Corporate Events */}
            <div className="mb-6 sm:mb-8 md:mb-0">
              <h3 className="text-xl sm:text-2xl md:text-2xl lg:text-3xl font-bold mb-4 sm:mb-6">
                Corporate Events
              </h3>
              <button className="bg-white text-[#0A1754] py-2 px-4 sm:px-6 rounded font-extrabold text-sm sm:text-base">
                View on Google Drive
              </button>
            </div>
            
            {/* Weddings & Engagements */}
            <div className="mb-6 sm:mb-8 md:mb-0">
              <h3 className="text-xl sm:text-2xl md:text-2xl lg:text-3xl font-bold mb-4 sm:mb-6">
                Weddings & Engagements
              </h3>
              <button className="bg-white text-blue-900 py-2 px-4 sm:px-6 rounded font-extrabold text-sm sm:text-base">
                View on Google Drive
              </button>
            </div>
            
            {/* Social Media Shoots */}
            <div className="mb-6 sm:mb-8 md:mb-0">
              <h3 className="text-xl sm:text-2xl md:text-2xl lg:text-3xl font-bold mb-4 sm:mb-6">
                Social Media Shoots
              </h3>
              <button className="bg-white text-blue-900 py-2 px-4 sm:px-6 rounded font-extrabold text-sm sm:text-base">
                View on Google Drive
              </button>
            </div>
            
            {/* Content Creation */}
            <div>
              <h3 className="text-xl sm:text-2xl md:text-2xl lg:text-3xl font-bold mb-4 sm:mb-6">
                Content Creation
              </h3>
              <button className="bg-white text-blue-900 py-2 px-4 sm:px-6 rounded font-extrabold text-sm sm:text-base">
                View on Google Drive
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}