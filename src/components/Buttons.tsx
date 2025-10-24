"use client"

import type React from "react"

// Props for when the component renders a <button> element
interface BaseButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  label: string | React.ReactNode
  className?: string
  href?: never // Exclude href for button type
  target?: never // Exclude target for button type
  rel?: never // Exclude rel for button type
}

// Props for when the component renders an <a> element
interface LinkButtonProps extends React.AnchorHTMLAttributes<HTMLAnchorElement> {
  label: string | React.ReactNode
  className?: string
  href: string // href is required for anchor type
  type?: never // Exclude type for anchor type
  onClick?: never // Exclude onClick for anchor type (handled by href)
  disabled?: boolean // Allow disabled for links, but handle it visually/behaviorally
}

// Discriminated union type for the Buttons component props
type ButtonsProps = BaseButtonProps | LinkButtonProps

const Buttons: React.FC<ButtonsProps> = ({ label, className, ...props }) => {
  // Check if 'href' exists in props to determine if it's a link or a button
  if ("href" in props && props.href !== undefined) {
    // If href is present, render an <a> tag
    const { href, target, rel, disabled, ...rest } = props as LinkButtonProps // Destructure disabled

    const linkClasses = `rounded-full py-3 px-5 cursor-pointer ${className || ""} ${
      disabled ? "pointer-events-none opacity-50" : ""
    }`

    return (
      <a
        href={disabled ? "#" : href} // If disabled, set href to # to prevent navigation
        target={target}
        rel={rel}
        className={linkClasses}
        {...rest} // Spread any other valid anchor props
      >
        {label}
      </a>
    )
  } else {
    // If href is not present, render a <button> tag
    const { type = "button", onClick, ...rest } = props as BaseButtonProps
    return (
      <button
        type={type}
        className={`rounded-full py-3 px-5 cursor-pointer ${className || ""}`}
        onClick={onClick}
        {...rest} // Spread any other valid button props (like disabled)
      >
        {label}
      </button>
    )
  }
}

export default Buttons
