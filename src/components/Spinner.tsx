"use client";

import React from "react";

interface SpinnerProps {
  children?: React.ReactNode;
}

const Spinner: React.FC<SpinnerProps> = ({ children }) => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
      <div className="w-full h-screen flex items-center justify-center">
        <div className="flex flex-col items-center justify-center gap-3">
          <div className="w-10 h-10 border-4 border-t-transparent border-[#0a1754] rounded-full animate-spin"></div>
          {children && (
            <p className="text-white font-medium text-sm text-center">
              {children}
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default Spinner;
