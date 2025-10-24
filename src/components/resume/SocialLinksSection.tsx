import React from 'react';
import { UseFormRegister } from 'react-hook-form';
import { FormData } from '@/types/resume';

interface SocialLinksSectionProps {
  register: UseFormRegister<FormData>;
}

export const SocialLinksSection: React.FC<SocialLinksSectionProps> = ({
  register,
}) => {
  return (
    <>
      <div className="bg-[#1E3A8A] text-white p-4 mb-4 rounded-lg">
        <h2 className="text-lg font-semibold">Social Links</h2>
      </div>
      
      <div className="space-y-4 mb-6">
        <div>
          <label className="block text-lg font-normal text-white">LinkedIn</label>
          <input
            {...register("links.linkedin")}
            className="w-full p-2 bg-white text-black"
            placeholder="LinkedIn URL"
          />
        </div>
        
        <div>
          <label className="block text-lg font-normal text-white">Twitter</label>
          <input
            {...register("links.twitter")}
            className="w-full p-2 bg-white text-black"
            placeholder="Twitter URL"
          />
        </div>
        
        <div>
          <label className="block text-lg font-normal text-white">Instagram</label>
          <input
            {...register("links.instagram")}
            className="w-full p-2 bg-white text-black"
            placeholder="Instagram URL"
          />
        </div>
        
        <div>
          <label className="block text-lg font-normal text-white">TikTok</label>
          <input
            {...register("links.tiktok")}
            className="w-full p-2 bg-white text-black"
            placeholder="TikTok URL"
          />
        </div>
      </div>
    </>
  );
};