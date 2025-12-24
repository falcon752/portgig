"use client";

import React, { useEffect, useMemo, useState } from "react";
import NaijaStates from "naija-state-local-government";
import { experienceLevels } from "@/src/constants";
import { Field, industryOptions } from "@/src/utils/industryData";
import { FilterData } from "@/src/app/(root)/(creative)/creatives-hub/page";

const nigerianStates = NaijaStates.states();

interface CreativeFilterProps {
  onFilterChange: (filters: FilterData) => void;
  activeFilters?: FilterData;
}

const EMPTY_FILTERS: FilterData = {
  field: "",
  industry: "",
  state: "",
  localGovernment: "",
  experienceLevels: [],
};

const CreativeFilter: React.FC<CreativeFilterProps> = ({
  onFilterChange,
  activeFilters,
}) => {
  const [formData, setFormData] = useState<FilterData>(
    activeFilters ?? EMPTY_FILTERS
  );

  const [errors, setErrors] = useState<
    Partial<Record<keyof FilterData, string>>
  >({});
  const [lgas, setLgas] = useState<string[]>([]);
  const [loadingLgas, setLoadingLgas] = useState(false);
  const [showMobileFilters, setShowMobileFilters] = useState(false);

  /* -------------------- Sync external filters -------------------- */
  useEffect(() => {
    if (activeFilters) setFormData(activeFilters);
  }, [activeFilters]);

  /* -------------------- Fetch LGAs -------------------- */
  useEffect(() => {
    if (!formData.state) {
      setLgas([]);
      return;
    }
    setLoadingLgas(true);
    try {
      const result = NaijaStates.lgas(formData.state);
      setLgas(result?.lgas ?? []);
    } finally {
      setLoadingLgas(false);
    }
  }, [formData.state]);

  /* -------------------- Options -------------------- */
  const fieldOptions = useMemo(
    () =>
      Object.keys(industryOptions).map((field) => ({
        label: field,
        value: field,
      })) as { label: string; value: Field }[],
    []
  );

  const industryOptionsForField = useMemo(() => {
    if (!formData.field) return [];
    return industryOptions[formData.field as Field].map((industry) => ({
      label: industry,
      value: industry,
    }));
  }, [formData.field]);

  /* -------------------- Handlers -------------------- */
  const handleFieldChange = (value: string) => {
    setFormData((prev) => {
      const next = { ...prev, field: value, industry: "" };
      onFilterChange(next);
      return next;
    });
    setErrors((prev) => ({ ...prev, field: undefined }));
  };

  const handleStateChange = (value: string) => {
    setFormData((prev) => {
      const next = { ...prev, state: value, localGovernment: "" };
      onFilterChange(next);
      return next;
    });
    setErrors((prev) => ({ ...prev, state: undefined }));
  };

  const handleChange = (name: keyof FilterData, value: any) => {
    setFormData((prev) => {
      const next = { ...prev, [name]: value };
      onFilterChange(next);
      return next;
    });
  };

  const toggleExperience = (level: string) => {
    setFormData((prev) => {
      const next = {
        ...prev,
        experienceLevels: prev.experienceLevels.includes(level)
          ? prev.experienceLevels.filter((l) => l !== level)
          : [...prev.experienceLevels, level],
      };
      onFilterChange(next);
      return next;
    });
  };

  const clearFilters = () => {
    setFormData(EMPTY_FILTERS);
    setErrors({});
    onFilterChange(EMPTY_FILTERS);
  };

  /* -------------------- Validation -------------------- */
  const validateIndustry = () => {
    if (formData.industry && !formData.field) {
      setErrors((prev) => ({
        ...prev,
        field: "Field is required before selecting an industry",
      }));
      return false;
    }
    setErrors((prev) => ({ ...prev, field: undefined }));
    return true;
  };

  const validateLga = () => {
    if (formData.localGovernment && !formData.state) {
      setErrors((prev) => ({
        ...prev,
        state: "State is required before selecting an LGA",
      }));
      return false;
    }
    setErrors((prev) => ({ ...prev, state: undefined }));
    return true;
  };

  /* -------------------- Styles -------------------- */
  const labelStyles = "block text-sm md:text-xl font-medium text-textColor";
  const inputStyles =
    "text-secondary mt-2 py-3 px-3 w-full max-w-xs bg-white border border-gray100 focus:outline-none rounded-md";

  /* -------------------- Render -------------------- */
  return (
    <aside className="p-5 relative">
      {/* Desktop header */}
      <div className="hidden lg:flex justify-between items-center mb-4">
        <h3 className="text-lg font-semibold text-textColor">
          Filter Creatives
        </h3>
        <button
          type="button"
          onClick={clearFilters}
          className="text-sm text-red-500 underline"
        >
          Clear All
        </button>
      </div>

      {/* Mobile toggle button */}
      <button
        className="flex items-center justify-between lg:hidden w-full mb-4 bg-white border border-gray100 px-3 py-3 rounded-md"
        onClick={() => setShowMobileFilters((prev) => !prev)}
      >
        <span className="font-medium text-textColor">Filters</span>
        <svg
          className={`w-5 h-5 transform transition-transform ${
            showMobileFilters ? "rotate-180" : ""
          }`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M19 9l-7 7-7-7"
          />
        </svg>
      </button>

      <div
        className={`flex flex-col gap-6 font-raleway ${
          showMobileFilters ? "block" : "hidden"
        } lg:block`}
      >
        {/* Field */}
        <div>
          <label className={labelStyles}>Field</label>
          <select
            value={formData.field}
            onChange={(e) => handleFieldChange(e.target.value)}
            className={`${inputStyles} ${errors.field ? "border-red-500" : ""}`}
          >
            <option value="">Select field</option>
            {fieldOptions.map((f) => (
              <option key={f.value} value={f.value}>
                {f.label}
              </option>
            ))}
          </select>
          {errors.field && (
            <p className="text-red-500 text-sm mt-1">{errors.field}</p>
          )}
        </div>

        {/* Industry */}
        <div>
          <label className={labelStyles}>Industry</label>
          <select
            value={formData.industry}
            onClick={() => {
              if (!formData.field) {
                setErrors((prev) => ({
                  ...prev,
                  field: "Field is required before selecting an industry",
                }));
              } else {
                setErrors((prev) => ({ ...prev, field: undefined }));
              }
            }}
            onChange={(e) => {
              if (!formData.field) return; // prevent selection
              handleChange("industry", e.target.value);
            }}
            className={`${inputStyles} ${errors.field ? "border-red-500" : ""}`}
          >
            <option value="">Select industry</option>
            {industryOptionsForField.map((i) => (
              <option key={i.value} value={i.value}>
                {i.label}
              </option>
            ))}
          </select>
          {errors.field && (
            <p className="text-red-500 text-sm mt-1">{errors.field}</p>
          )}
        </div>

        {/* State */}
        <div>
          <label className={labelStyles}>State</label>
          <select
            value={formData.state}
            onChange={(e) => handleStateChange(e.target.value)}
            className={`${inputStyles} ${errors.state ? "border-red-500" : ""}`}
          >
            <option value="">Select state</option>
            {nigerianStates.map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </select>
          {errors.state && (
            <p className="text-red-500 text-sm mt-1">{errors.state}</p>
          )}
        </div>

        {/* Local Government */}
        <div>
          <label className={labelStyles}>Local Government</label>
          <select
            value={formData.localGovernment}
            onClick={() => {
              if (!formData.state) {
                setErrors((prev) => ({
                  ...prev,
                  state: "State is required before selecting an LGA",
                }));
              } else {
                setErrors((prev) => ({ ...prev, state: undefined }));
              }
            }}
            onChange={(e) => {
              if (!formData.state) return; // prevent selection
              handleChange("localGovernment", e.target.value);
            }}
            className={`${inputStyles} ${errors.state ? "border-red-500" : ""}`}
          >
            <option value="">
              {loadingLgas ? "Loading..." : "Select LGA"}
            </option>
            {lgas.map((lga) => (
              <option key={lga} value={lga}>
                {lga}
              </option>
            ))}
          </select>
          {errors.state && (
            <p className="text-red-500 text-sm mt-1">{errors.state}</p>
          )}
        </div>

        {/* Experience */}
        <div>
          <p className={labelStyles}>Years of Experience</p>
          <div className="flex flex-col gap-2 mt-2">
            {experienceLevels.map((lvl) => (
              <label
                key={lvl.id}
                className="flex items-center gap-2 text-textColor"
              >
                <input
                  type="checkbox"
                  checked={formData.experienceLevels.includes(lvl.level)}
                  onChange={() => toggleExperience(lvl.level)}
                />
                {lvl.level}
              </label>
            ))}
          </div>
        </div>

        {/* Clear All Button for Mobile */}
        <button
          type="button"
          onClick={clearFilters}
          className="lg:hidden text-sm text-red-500 underline mt-2"
        >
          Clear All
        </button>
      </div>
    </aside>
  );
};

export default CreativeFilter;
