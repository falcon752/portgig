import React from 'react';
import { FiChevronDown } from "react-icons/fi";

interface Option {
  label: string
  value: string
}

interface LabelSelectProps
  extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label?: string
  id: string
  options: Option[]
  error?: string
  required?: boolean
  loading?: boolean 
}

const LabelSelect: React.FC<LabelSelectProps> = ({
  label,
  id,
  options,
  error,
  required = false,
  loading = false,
  className = '',
  ...props
}) => {
  return (
    <div className='relative flex flex-col gap-1 w-full'>
      {label && (
        <label
          htmlFor={id}
          className='text-lg font-bold text-white font-raleway capitalize'
        >
          {label}
          {required && <span className='text-red-500 ml-0.5'>*</span>}
        </label>
      )}
      <select
        id={id}
        aria-invalid={!!error}
        disabled={loading} 
        className={`appearance-none px-3 h-12 border rounded-lg shadow-sm text-sm transition focus:outline-none focus:ring-2 ${
          error
            ? 'border-red-500 focus:ring-red-500'
            : 'border-gray-300 focus:ring-primary-500 focus:border-primary-500 bg-white text-[#0A1754]'
        } ${loading ? 'opacity-50 cursor-not-allowed' : ''} ${className}`}
        {...props}
      >
        <option value='' disabled hidden>
          {loading ? 'Loading options...' : '-- Select an option --'}
        </option>
        {!loading &&
          options.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
          </select>
          <FiChevronDown className="absolute right-3 top-12 pointer-events-none text-gray-400" size={20} />
      {error && <span className='text-xs text-red-500'>{error}</span>}
    </div>
  )
}

export default LabelSelect
