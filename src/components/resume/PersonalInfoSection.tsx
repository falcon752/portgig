import React from 'react';
import { UseFormRegister, FieldErrors } from 'react-hook-form';
import { FormData } from '@/types/resume';

interface PersonalInfoSectionProps {
  register: UseFormRegister<FormData>;
  errors: FieldErrors<FormData>;
}

export const PersonalInfoSection: React.FC<PersonalInfoSectionProps> = ({
  register,
  errors,
}) => {
  return (
    <div className="space-y-4 mb-6">
      <div>
        <label className="block text-lg font-normal pb-2 text-white">
          Full Name
        </label>
        <input
          {...register("full_name", { required: "Full Name is required" })}
          className="w-full p-2 bg-white text-black"
          placeholder="Full Name"
        />
        {errors.full_name && (
          <p className="text-red-500 text-lg">{errors.full_name.message}</p>
        )}
      </div>

      <div>
        <label className="block text-lg font-normal pb-2 text-white">Email</label>
        <input
          {...register("email")}
          type="email"
          className="w-full p-2 bg-white text-black"
          placeholder="Email"
        />
      </div>

      <div>
        <label className="block text-lg font-normal pb-2 text-white">
          Location
        </label>
        <input
          {...register("location", { required: "Location is required" })}
          className="w-full p-2 bg-white text-black"
          placeholder="Location"
        />
        {errors.location && (
          <p className="text-red-500 text-lg">{errors.location.message}</p>
        )}
      </div>

      <div>
        <label className="block text-lg font-normal pb-2 text-white">
          Job Title
        </label>
        <input
          {...register("job_title", { required: "Job Title is required" })}
          className="w-full p-2 bg-white text-black"
          placeholder="Job Title"
        />
        {errors.job_title && (
          <p className="text-red-500 text-lg">{errors.job_title.message}</p>
        )}
      </div>

      <div>
        <label className="block text-lg font-normal pb-2 text-white">
          Phone Number
        </label>
        <input
          {...register("phone_number")}
          type="text"
          className="w-full p-2 bg-white text-black"
          placeholder="Phone Number"
        />
      </div>
    </div>
  );
};