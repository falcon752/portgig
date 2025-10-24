"use client";
import { experienceLevels } from "@/src/constants";
import { useAppDispatch, useAppSelector } from "@/src/redux/hooks";
import {
  setError,
  setLgas,
  setLoading,
  setSelectedField,
  setSelectedState,
} from "@/src/redux/features/authSlice";
import { Field, industryOptions } from "@/src/utils/industryData";
import NaijaStates from "naija-state-local-government";
import React, { useState, useEffect } from "react";
import { z } from "zod";
import { FilterData } from "@/src/app/(root)/(creative)/creatives-hub/page";

const nigerianStates = NaijaStates.states();

// const creativeFilterSchema = z.object({
//   field: z.string().min(1, "Please select a field"),
//   industry: z.string().min(1, "Please select an industry"),
//   state: z.string().min(1, "Please select a state"),
//   localGovernment: z.string().min(1, "Please select a local government"),
// });

interface CreativeFilterProps {
  onFilterChange: (filters: FilterData) => void;
  activeFilters: FilterData;
}

const CreativeFilter: React.FC<CreativeFilterProps> = ({
  onFilterChange,
  activeFilters,
}) => {
  const dispatch = useAppDispatch();
  const {
    selectedField,
    selectedState,
    lgas,
    loading: loadingLgas,
  } = useAppSelector((state) => state.auth);

  const [formData, setFormData] = useState<FilterData>(activeFilters);

  const [errors, setErrors] = useState<
    Partial<Record<keyof FilterData, string>>
  >({});

  useEffect(() => {
    setFormData(activeFilters);
  }, [activeFilters]);

  useEffect(() => {
    const fetchLgas = async () => {
      if (!selectedState) return;

      dispatch(setLoading(true));
      dispatch(setError(null));
      dispatch(setLgas([]));

      try {
        const lgaResult = NaijaStates.lgas(selectedState);
        if (
          lgaResult &&
          Array.isArray(lgaResult.lgas) &&
          lgaResult.lgas.length > 0
        ) {
          dispatch(setLgas(lgaResult.lgas));
        } else {
          dispatch(setError("No LGAs found for this state."));
        }
      } catch (error) {
        console.error("Failed to fetch LGAs:", error);
        dispatch(setError("Failed to load LGAs. Please try again."));
      } finally {
        dispatch(setLoading(false));
      }
    };

    fetchLgas();
  }, [selectedState, dispatch]);

  const stateOptions = nigerianStates.map((state) => ({
    label: state,
    value: state,
  }));

  const lgaOptions = lgas.map((lga) => ({
    label: lga,
    value: lga,
  }));

  const fields = Object.keys(industryOptions).map((field) => ({
    label: field,
    value: field,
  })) as { label: string; value: Field }[];

  const industries = selectedField
    ? industryOptions[selectedField as Field].map((industry: string) => ({
        label: industry,
        value: industry,
      }))
    : [];

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: undefined }));
  };

  const handleFieldChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value;
    setFormData((prev) => ({ ...prev, field: value, industry: "" }));
    dispatch(setSelectedField(value));
    setErrors((prev) => ({ ...prev, field: undefined, industry: undefined }));
  };

  const handleStateChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value;
    setFormData((prev) => ({ ...prev, state: value, localGovernment: "" }));
    dispatch(setSelectedState(value));
    setErrors((prev) => ({
      ...prev,
      state: undefined,
      localGovernment: undefined,
    }));
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

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const { field, industry, state, localGovernment, experienceLevels } =
      formData;

    const hasRequiredFields = field || industry || state || localGovernment;

    if (hasRequiredFields) {
      const fieldsToValidate: any = {};
      if (field) fieldsToValidate.field = field;
      if (industry) fieldsToValidate.industry = industry;
      if (state) fieldsToValidate.state = state;
      if (localGovernment) fieldsToValidate.localGovernment = localGovernment;

      const partialSchema = z.object({
        ...(field && { field: z.string().min(1, "Please select a field") }),
        ...(industry && {
          industry: z.string().min(1, "Please select an industry"),
        }),
        ...(state && { state: z.string().min(1, "Please select a state") }),
        ...(localGovernment && {
          localGovernment: z
            .string()
            .min(1, "Please select a local government"),
        }),
      });

      const result = partialSchema.safeParse(fieldsToValidate);

      if (!result.success) {
        const fieldErrors: Partial<Record<keyof FilterData, string>> = {};
        result.error.issues.forEach((issue) => {
          const fieldName = issue.path[0] as keyof FilterData;
          fieldErrors[fieldName] = issue.message;
        });
        setErrors(fieldErrors);
        return;
      }
    }

    onFilterChange({
      field,
      industry,
      state,
      localGovernment,
      experienceLevels,
    });

    setErrors({});
  };

  const handleClearFilters = () => {
    const clearedFilters = {
      field: "",
      industry: "",
      state: "",
      localGovernment: "",
      experienceLevels: [],
    };

    setFormData(clearedFilters);
    dispatch(setSelectedField(""));
    dispatch(setSelectedState(""));
    dispatch(setLgas([]));
    setErrors({});
    onFilterChange(clearedFilters);
  };

  const labelStyles = "block text-sm md:text-xl font-medium text-textColor";
  const inputStyles =
    "text-secondary mt-2 py-3 px-2 w-52 bg-white border border-gray100 focus:outline-none focus:ring-0";

  return (
    <aside className="p-5 md:hidden lg:block">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-semibold text-textColor">
          Filter Creatives
        </h3>
        <button
          type="button"
          onClick={handleClearFilters}
          className="text-sm text-red-500 hover:text-red-700 underline cursor-pointer"
        >
          Clear All
        </button>
      </div>

      <form
        onSubmit={handleSubmit}
        className="flex flex-col gap-10 font-raleway"
      >
        <div className="text-white">
          <label htmlFor="field" className={`${labelStyles}`}>
            Field
          </label>
          <select
            id="field"
            name="field"
            value={formData.field}
            onChange={handleFieldChange}
            className={`${inputStyles}`}
          >
            <option value="">Select your field</option>
            {fields.map((field) => (
              <option key={field.value} value={field.value}>
                {field.label}
              </option>
            ))}
          </select>
          {errors.field && (
            <p className="text-red-500 text-sm mt-3">{errors.field}</p>
          )}
        </div>

        <div className="text-white">
          <label htmlFor="industry" className={`${labelStyles}`}>
            Industry
          </label>
          <select
            id="industry"
            name="industry"
            value={formData.industry}
            onChange={handleChange}
            className={`${inputStyles}`}
            disabled={!selectedField}
          >
            <option value="">Select your industry</option>
            {industries.map((industry) => (
              <option key={industry.value} value={industry.value}>
                {industry.label}
              </option>
            ))}
          </select>
          {errors.industry && (
            <p className="text-red-500 text-sm mt-3">{errors.industry}</p>
          )}
        </div>

        <div className="text-white">
          <label htmlFor="state" className={`${labelStyles}`}>
            State
          </label>
          <select
            id="state"
            name="state"
            value={formData.state}
            onChange={handleStateChange}
            className={`${inputStyles}`}
          >
            <option value="">Select your state</option>
            {stateOptions.map((state) => (
              <option key={state.value} value={state.value}>
                {state.label}
              </option>
            ))}
          </select>
          {errors.state && (
            <p className="text-red-500 text-sm mt-3">{errors.state}</p>
          )}
        </div>

        <div className="text-white">
          <label htmlFor="localGovernment" className={`${labelStyles}`}>
            Local Government
          </label>
          <select
            id="localGovernment"
            name="localGovernment"
            value={formData.localGovernment}
            onChange={handleChange}
            className={`${inputStyles}`}
            disabled={loadingLgas || !selectedState}
          >
            <option value="">
              {loadingLgas ? "Loading LGAs..." : "Select your LGA"}
            </option>
            {lgaOptions.map((lga) => (
              <option key={lga.value} value={lga.value}>
                {lga.label}
              </option>
            ))}
          </select>
          {errors.localGovernment && (
            <p className="text-red-500 text-sm mt-3">
              {errors.localGovernment}
            </p>
          )}
        </div>

        <div className="flex flex-col gap-5">
          <p className={`${labelStyles}`}>Experience Level</p>
          <div className="flex flex-col gap-5 ">
            {experienceLevels.map((levels) => (
              <div
                key={levels.id}
                className="flex items-center space-x-2 text-textColor"
              >
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

        <button
          type="submit"
          className="border border-gray-400 text-[#0A1754] py-3 px-6 rounded-lg hover:bg-[#0A1754] hover:text-white 
          transition-colors duration-300 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Apply Filters
        </button>
      </form>
    </aside>
  );
};

export default CreativeFilter;
