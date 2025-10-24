import React from 'react';
import { UseFormRegister } from 'react-hook-form';
import { FormData } from '@/types/resume';

interface ProfessionalBriefSectionProps {
  register: UseFormRegister<FormData>;
}

export const ProfessionalBriefSection: React.FC<ProfessionalBriefSectionProps> = ({
  register,
}) => {
  return (
    <>
      <div className="bg-[#1E3A8A] text-white p-4 mb-4 rounded-lg">
        <h2 className="text-lg font-semibold">Professional Brief</h2>
      </div>
      <div className="mb-6">
        <textarea
          {...register("brief")}
          className="w-full p-2 bg-white text-black h-24"
          placeholder="Write your professional brief here..."
        />
      </div>
    </>
  );
};