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
    setErrors({});
  };

  const handleChange = (name: keyof FilterData, value: any) => {
    setFormData((prev) => {
      const next = { ...prev, [name]: value };
      onFilterChange(next);
      return next;
    });
  };

  const handleStateChange = (value: string) => {
    setFormData((prev) => {
      const next = { ...prev, state: value, localGovernment: "" };
      onFilterChange(next);
      return next;
    });
    setErrors({});
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
  useEffect(() => {
    const nextErrors: typeof errors = {};
    if (formData.industry && !formData.field) {
      nextErrors.field = "Field is required when industry is selected";
    }
    if (formData.localGovernment && !formData.state) {
      nextErrors.state = "State is required when LGA is selected";
    }
    setErrors(nextErrors);
  }, [formData]);

  /* -------------------- Styles -------------------- */
  const labelStyles = "block text-sm md:text-xl font-medium text-textColor";
  const inputStyles =
    "text-secondary mt-2 py-3 px-2 w-52 bg-white border border-gray100 focus:outline-none";

  /* -------------------- Render -------------------- */
  return (
    <aside className="p-5 md:hidden lg:block">
      <div className="flex justify-between items-center mb-4">
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

      <div className="flex flex-col gap-10 font-raleway">
        {/* Field */}
        <div>
          <label className={labelStyles}>Field</label>
          <select
            value={formData.field}
            onChange={(e) => handleFieldChange(e.target.value)}
            className={inputStyles}
          >
            <option value="">Select field</option>
            {fieldOptions.map((f) => (
              <option key={f.value} value={f.value}>
                {f.label}
              </option>
            ))}
          </select>
          {errors.field && (
            <p className="text-red-500 text-sm mt-2">{errors.field}</p>
          )}
        </div>

        {/* Industry */}
        <div>
          <label className={labelStyles}>Industry</label>
          <select
            value={formData.industry}
            onChange={(e) => handleChange("industry", e.target.value)}
            disabled={!formData.field}
            className={inputStyles}
          >
            <option value="">Select industry</option>
            {industryOptionsForField.map((i) => (
              <option key={i.value} value={i.value}>
                {i.label}
              </option>
            ))}
          </select>
        </div>

        {/* State */}
        <div>
          <label className={labelStyles}>State</label>
          <select
            value={formData.state}
            onChange={(e) => handleStateChange(e.target.value)}
            className={inputStyles}
          >
            <option value="">Select state</option>
            {nigerianStates.map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </select>
          {errors.state && (
            <p className="text-red-500 text-sm mt-2">{errors.state}</p>
          )}
        </div>

        {/* LGA */}
        <div>
          <label className={labelStyles}>Local Government</label>
          <select
            value={formData.localGovernment}
            onChange={(e) => handleChange("localGovernment", e.target.value)}
            disabled={!formData.state || loadingLgas}
            className={inputStyles}
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
        </div>

        {/* Experience */}
        <div>
          <p className={labelStyles}>Experience Level</p>
          <div className="flex flex-col gap-3 mt-2">
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
      </div>
    </aside>
  );
};

export default CreativeFilter;
