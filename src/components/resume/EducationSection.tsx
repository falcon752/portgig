import React from 'react';
import { UseFormRegister, Control, useFieldArray } from 'react-hook-form';
import { FormData } from '@/types/resume';

interface EducationSectionProps {
  register: UseFormRegister<FormData>;
  control: Control<FormData>;
}

export const EducationSection: React.FC<EducationSectionProps> = ({
  register,
  control,
}) => {
  const {
    fields: educationFields,
    append: appendEducation,
    remove: removeEducation,
  } = useFieldArray({
    control,
    name: "education",
  });

  return (
    <>
      <div className="bg-[#1E3A8A] text-white p-4 mb-4 rounded-lg">
        <h2 className="text-lg font-semibold">Education</h2>
      </div>
      
      {educationFields.map((field, index) => (
        <div key={field.id} className="space-y-4 mb-6">
          <div>
            <label className="block text-lg font-normal text-white">Course</label>
            <input
              {...register(`education.${index}.course`)}
              className="w-full p-2 bg-white text-black"
              placeholder="Course"
            />
          </div>
          
          <div>
            <label className="block text-lg font-normal text-white">School</label>
            <input
              {...register(`education.${index}.school`)}
              className="w-full p-2 bg-white text-black"
              placeholder="School"
            />
          </div>
          
          <div>
            <label className="block text-lg font-normal text-white">Started</label>
            <input
              {...register(`education.${index}.started`)}
              type="date"
              className="w-full p-2 bg-white text-black"
            />
          </div>
          
          <div>
            <label className="block text-lg font-normal text-white">Ended</label>
            <input
              {...register(`education.${index}.ended`)}
              type="date"
              className="w-full p-2 bg-white text-black"
            />
          </div>
          
          {educationFields.length > 1 && (
            <button
              type="button"
              onClick={() => removeEducation(index)}
              className="text-red-500 hover:text-red-700"
            >
              Remove Education
            </button>
          )}
        </div>
      ))}
      
      <button
        type="button"
        onClick={() =>
          appendEducation({ course: "", school: "", started: "", ended: "" })
        }
        className="text-blue-300 hover:text-blue-100 mb-6"
      >
        Add Education
      </button>
    </>
  );
};
