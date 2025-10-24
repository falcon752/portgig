import React from 'react';
import { UseFormRegister, Control, useFieldArray, useFormContext, useWatch } from 'react-hook-form';
import { FormData } from '@/types/resume';

interface ExperienceSectionProps {
  register: UseFormRegister<FormData>;
  control: Control<FormData>;
}

export const ExperienceSection: React.FC<ExperienceSectionProps> = ({ register, control }) => {
  const { fields: experienceFields, append: appendExperience, remove: removeExperience } = useFieldArray({
    control,
    name: 'experience',
  });

  const { formState: { errors } } = useFormContext<FormData>();
  const experienceValues = useWatch({ control, name: 'experience' });

  return (
    <>
      <div className="bg-[#1E3A8A] text-white p-4 mb-4 rounded-lg">
        <h2 className="text-lg font-semibold">Work Experience</h2>
      </div>

      {experienceFields.map((field, index) => (
        <div key={field.id} className="space-y-4 mb-6">
          <div>
            <label className="block text-lg font-normal text-white">Job Title</label>
            <input
              {...register(`experience.${index}.job_title`, {
                required: 'Job title is required',
              })}
              className="w-full p-2 bg-white text-black"
              placeholder="Job Title"
            />
            {errors.experience?.[index]?.job_title?.message && (
              <p className="text-red-500 text-sm">{errors.experience[index].job_title!.message}</p>
            )}
          </div>

          <div>
            <label className="block text-lg font-normal text-white">Location</label>
            <input
              {...register(`experience.${index}.location`, {
                required: 'Location is required',
              })}
              className="w-full p-2 bg-white text-black"
              placeholder="Location"
            />
            {errors.experience?.[index]?.location?.message && (
              <p className="text-red-500 text-sm">{errors.experience[index].location!.message}</p>
            )}
          </div>

          <div>
            <label className="block text-lg font-normal text-white">How did you help/What did you do</label>
            <textarea
              {...register(`experience.${index}.contribution`, {
                required: 'Contribution is required',
              })}
              className="w-full p-2 bg-white text-black h-20"
              placeholder="How did you help/What did you do"
            />
            {errors.experience?.[index]?.contribution?.message && (
              <p className="text-red-500 text-sm">{errors.experience[index].contribution!.message}</p>
            )}
          </div>

          <div>
            <label className="block text-lg font-normal text-white">Started</label>
            <input
              {...register(`experience.${index}.started`, {
                required: 'Start date is required',
                validate: {
                  validDate: (value) => {
                    if (!value || isNaN(new Date(value).getTime())) {
                      return 'Please enter a valid start date';
                    }
                    return true;
                  },
                  beforeEndDate: (value) => {
                    const ended = experienceValues?.[index]?.ended;
                    if (value && ended && !isNaN(new Date(ended).getTime()) && new Date(value) > new Date(ended)) {
                      return 'Start date must be before end date';
                    }
                    return true;
                  },
                },
              })}
              type="date"
              className="w-full p-2 bg-white text-black"
            />
            {errors.experience?.[index]?.started?.message && (
              <p className="text-red-500 text-sm">{errors.experience[index].started!.message}</p>
            )}
          </div>

          <div>
            <label className="block text-lg font-normal text-white">Ended</label>
            <input
              {...register(`experience.${index}.ended`, {
                required: 'End date is required',
                validate: {
                  validDate: (value) => {
                    if (!value || isNaN(new Date(value).getTime())) {
                      return 'Please enter a valid end date';
                    }
                    return true;
                  },
                  afterStartDate: (value) => {
                    const started = experienceValues?.[index]?.started;
                    if (started && value && !isNaN(new Date(started).getTime()) && new Date(value) < new Date(started)) {
                      return 'End date must be after start date';
                    }
                    return true;
                  },
                },
              })}
              type="date"
              className="w-full p-2 bg-white text-black"
            />
            {errors.experience?.[index]?.ended?.message && (
              <p className="text-red-500 text-sm">{errors.experience[index].ended!.message}</p>
            )}
          </div>

          {experienceFields.length > 1 && (
            <button
              type="button"
              onClick={() => removeExperience(index)}
              className="text-red-500 hover:text-red-700"
            >
              Remove Experience
            </button>
          )}
        </div>
      ))}

      <button
        type="button"
        onClick={() =>
          appendExperience({
            location: '',
            job_title: '',
            contribution: '',
            started: '',
            ended: '',
          })
        }
        className="text-blue-300 hover:text-blue-100 mb-6"
      >
        Add Experience
      </button>
    </>
  );
};