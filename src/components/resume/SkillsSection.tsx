import React from 'react';
import { UseFormRegister, Control, useFieldArray } from 'react-hook-form';
import { FormData } from '@/types/resume';

interface SkillsSectionProps {
  register: UseFormRegister<FormData>;
  control: Control<FormData>;
  title: string;
  fieldName: keyof Pick<FormData, 'skills' | 'other_skills' | 'certifications'>;
  placeholder: string;
}

export const SkillsSection: React.FC<SkillsSectionProps> = ({
  register,
  control,
  title,
  fieldName,
  placeholder,
}) => {
  const {
    fields,
    append,
    remove,
  } = useFieldArray({
    control,
    name: fieldName,
  });

  return (
    <>
      <div className="bg-[#1E3A8A] text-white p-4 mb-4 rounded-lg">
        <h2 className="text-lg font-semibold">{title}</h2>
      </div>

      {fields.map((field, index) => (
        <div key={field.id} className="space-y-4 mb-4">
          <div>
            <input
              {...register(`${fieldName}.${index}.value` as `${typeof fieldName}.${number}.value`)}
              className="w-full p-2 bg-white text-black"
              placeholder={placeholder}
            />
          </div>
          {fields.length > 1 && (
            <button
              type="button"
              onClick={() => remove(index)}
              className="text-red-500 hover:text-red-700"
            >
              Remove {placeholder}
            </button>
          )}
        </div>
      ))}

      <button
        type="button"
        onClick={() => append({ value: '' })}
        className="text-blue-300 hover:text-blue-100 mb-6"
      >
        Add {placeholder}
      </button>
    </>
  );
};
