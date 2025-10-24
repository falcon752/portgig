import React from 'react'

interface LabelInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string
  id: string
  required?: boolean
  error?: string
}

const LabelInput: React.FC<LabelInputProps> = ({
  label,
  id,
  required = false,
  error,
  className = '',
  ...props
}) => {
  return (
    <div className='flex flex-col gap-1 w-full'>
      {label && (
        <label
          htmlFor={id}
          className='text-lg font-bold text-white font-raleway capitalize'
        >
          {label}
          {required && <span className='text-red-500 ml-0.5'>*</span>}
        </label>
      )}
      <input
        id={id}
        required={required}
        aria-invalid={!!error}
        className={`px-3 h-12 border rounded-lg shadow-sm text-sm focus:outline-none focus:ring-2 transition 
          ${
            error
              ? 'border-red-500 focus:ring-red-500'
              : 'border-gray-300 focus:ring-primary-500 focus:border-primary-500 bg-white text-[#0A1754]'
          } ${className}`}
        {...props}
      />{' '}
      {error && <span className='text-xs text-red-500 mt-1'>{error}</span>}
    </div>
  )
}

export default LabelInput
