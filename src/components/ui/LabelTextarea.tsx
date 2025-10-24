// components/ui/LabelTextarea.tsx
'use client'

import React from 'react'

interface LabelTextareaProps
  extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string
  id: string
  required?: boolean
  error?: string
}

const LabelTextarea: React.FC<LabelTextareaProps> = ({
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
      <textarea
        id={id}
        aria-invalid={!!error}
        required={required}
        className={`px-3 py-2 rounded-lg shadow-sm text-sm transition min-h-[100px] resize-y focus:outline-none focus:ring-2 ${
          error
            ? 'border-red-500 focus:ring-red-500'
            : 'border-gray-300 focus:ring-primary-500 focus:border-primary-500 bg-white text-[#0A1754]'
        } ${className}`}
        {...props}
      />
      {error && <span className='text-xs text-red-500'>{error}</span>}
    </div>
  )
}

export default LabelTextarea
