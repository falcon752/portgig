"use client";
import { experienceLevels } from "@/src/constants";
import React, { useState } from "react";
import { z } from "zod";

const creativeFilterSchema = z.object({
  industry: z.string().min(1, "Please select an industry"),
  category: z.string().min(1, "Please select a category"),
  location: z.string().min(1, "Please select a location"),
});
type FormData = {
  industry: string;
  category: string;
  location: string;
  experienceLevels: string[];
};

const RecruiterCreativeFilter = () => {
  const [formData, setFormData] = useState<FormData>({
    industry: "",
    category: "",
    location: "",
    experienceLevels: [],
  });
  const [errors, setErrors] = useState<Partial<Record<keyof FormData, string>>>(
    {}
  );
  //   handle input chnage
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    // Clear error for this field on change
    setErrors((prev) => ({ ...prev, [name]: undefined }));
  };
  const handleCheckboxChange = (level: string) => {
    setFormData((prev) => {
      const alreadySelected = prev.experienceLevels.includes(level);
      const updatedLevels = alreadySelected
        ? prev.experienceLevels.filter((l) => l !== level)
        : [...prev.experienceLevels, level];

      return { ...prev, experienceLevels: updatedLevels };
    });
  };

  //handle submit
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const { industry, category, location, experienceLevels } = formData;

    const schema = creativeFilterSchema;
    const result = schema.safeParse({ industry, category, location });

    if (!result.success) {
      const fieldErrors: Partial<Record<keyof FormData, string>> = {};
      result.error.issues.forEach((issue) => {
        const field = issue.path[0] as keyof FormData;
        fieldErrors[field] = issue.message;
      });
      setErrors(fieldErrors);
      return;
    }

    // filter logic goes here
    console.log("Selected filters:", {
      industry,
      category,
      location,
      experienceLevels,
    });

    // Reset
    setFormData({
      industry: "",
      category: "",
      location: "",
      experienceLevels: [],
    });
    setErrors({});
  };

  const labelStyles = "block text-sm md:text-xl font-medium text-textColor";
  const inputStyles =
    "text-secondary mt-2 py-3 px-2 w-52 bg-white border border-gray100  focus:outline-none focus:ring-0";

  return (
    <aside className="p-5">
      <form onSubmit={handleSubmit} className="flex flex-col gap-10">
        <div className="text-white">
          <label htmlFor="name" className={`${labelStyles}`}>
            Industry
          </label>
          <select
            id="industry"
            name="industry"
            value={formData.industry}
            onChange={handleChange}
            className={`${inputStyles}`}>
            {" "}
            <option value="">Select your field</option>
            <option value="user">1</option>
            <option value="recruiter">2</option>o
            <option value="admin">3</option>
          </select>
          {errors.industry && (
            <p className="text-red-500 text-sm mt-3">{errors.industry}</p>
          )}
        </div>
        <div className="text-white">
          <label htmlFor="name" className={`${labelStyles}`}>
            Category
          </label>
          <select
            id="category"
            name="category"
            value={formData.category}
            onChange={handleChange}
            className={`${inputStyles}`}>
            {" "}
            <option value="">Select your field</option>
            <option value="user">1</option>
            <option value="recruiter">2</option>o
            <option value="admin">3</option>
          </select>
          {errors.category && (
            <p className="text-red-500 text-sm mt-3">{errors.category}</p>
          )}
        </div>
        <div className="text-white">
          <label htmlFor="name" className={`${labelStyles}`}>
            Location
          </label>
          <select
            id="location"
            name="location"
            value={formData.location}
            onChange={handleChange}
            className={`${inputStyles}`}>
            {" "}
            <option value="">Select your field</option>
            <option value="user">1</option>
            <option value="recruiter">2</option>o
            <option value="admin">3</option>
          </select>
          {errors.location && (
            <p className="text-red-500 text-sm mt-3">{errors.location}</p>
          )}
        </div>

        <div className="flex flex-col gap-5">
          <p className={`${labelStyles}`}>Experience Level</p>
          <div className="flex flex-col gap-5 ">
            {experienceLevels.map((levels) => (
              <div
                key={levels.id}
                className="flex items-center space-x-2 text-textColor">
                <input
                  type="checkbox"
                  id={levels.level}
                  name="experience"
                  checked={formData.experienceLevels.includes(levels.level)}
                  onChange={() => handleCheckboxChange(levels.level)}
                  className="w-4 h-4 text-secondary focus:ring-white rounded"
                />
                <label htmlFor={levels.level} className="text-sm font-medium">
                  {levels.level}
                </label>
              </div>
            ))}
          </div>
        </div>
      </form>
    </aside>
  );
};

export default RecruiterCreativeFilter;
