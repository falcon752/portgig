import React from "react";

interface AuthButtoProbs {
  children: React.ReactNode;
  className?: string;
  type?: "submit" | "button" | "reset";
	onClick?: () => void;
	disabled?: boolean
}
const AuthButton = ({ children, className, type, onClick , disabled}: AuthButtoProbs) => {
  return (
    <button type={type} disabled={disabled} onClick={onClick} className={`${className}`}>
      {children}
    </button>
  );
};

export default AuthButton;
