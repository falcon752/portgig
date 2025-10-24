import { cn } from '@/src/utils/cn'
import React from 'react'

interface AppButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'danger' | 'outline'
  loading?: boolean
  fullWidth?: boolean
  icon?: React.ReactNode
}

const variantStyles: Record<string, string> = {
  primary: 'bg-white text-[#0A1754] font-bold text-xl font-raleway',
  secondary:
    'bg-gray-100 text-gray-900 dark:bg-gray-700 dark:text-[#0A1754]',
  danger: 'bg-red-600 text-white hover:bg-red-700',
  outline:
    'border border-gray-300 text-gray-700 border-white text-white',
}

const AppButton: React.FC<AppButtonProps> = ({
  variant = 'primary',
  loading = false,
  fullWidth = false,
  icon,
  children,
  className,
  disabled,
  ...props
}) => {
  return (
    <button
      disabled={disabled || loading}
      className={cn(
        'inline-flex cursor-pointer items-center justify-center px-4 h-12 rounded-lg text-sm font-medium transition-all duration-150 focus:outline-none focus:ring-1 focus:ring-offset-1',
        variantStyles[variant],
        fullWidth ? 'w-full' : '',
        (disabled || loading) && 'opacity-60 cursor-not-allowed',
        className
      )}
      {...props}
    >
      {loading ? (
        <span className='animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full mr-2' />
      ) : (
        icon && <span className='mr-2'>{icon}</span>
      )}
      {children}
    </button>
  )
}

export default AppButton
