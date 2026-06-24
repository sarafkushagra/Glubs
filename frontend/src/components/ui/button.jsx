import React, { useRef } from "react";
import { useTheme } from "../../context/AppProvider";

/**
 * Enhanced Button Component with multiple variants and sizes
 * Includes ripple effect and theme support
 */
const Button = ({
  children,
  onClick,
  className = "",
  type = "button",
  disabled = false,
  variant = "primary",
  size = "md",
  fullWidth = false,
  loading = false,
  ...props
}) => {
  const btnRef = useRef();
  const { theme } = useTheme();

  const handleClick = (e) => {
    if (onClick && !loading) onClick(e);
    
    // Ripple effect
    const button = btnRef.current;
    if (!button) return;
    const circle = document.createElement("span");
    const diameter = Math.max(button.clientWidth, button.clientHeight);
    const radius = diameter / 2;
    circle.style.width = circle.style.height = `${diameter}px`;
    circle.style.left = `${e.clientX - button.getBoundingClientRect().left - radius}px`;
    circle.style.top = `${e.clientY - button.getBoundingClientRect().top - radius}px`;
    circle.classList.add("ripple");
    const ripple = button.getElementsByClassName("ripple")[0];
    if (ripple) ripple.remove();
    button.appendChild(circle);
  };

  // Base classes
  const baseClasses = `relative overflow-hidden font-semibold rounded-lg transition-all duration-200 flex items-center justify-center gap-2 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500`;

  // Variant styles
  const variantClasses = {
    primary: `bg-primary-600 dark:bg-primary-500 text-white hover:bg-primary-700 dark:hover:bg-primary-400 active:bg-primary-800 disabled:bg-neutral-400 dark:disabled:bg-neutral-600 focus:ring-offset-white dark:focus:ring-offset-gray-900`,
    secondary: `bg-neutral-200 dark:bg-neutral-700 text-gray-900 dark:text-white hover:bg-neutral-300 dark:hover:bg-neutral-600 active:bg-neutral-400 disabled:bg-neutral-300 dark:disabled:bg-neutral-700`,
    accent: `bg-accent-500 dark:bg-accent-400 text-white hover:bg-accent-600 dark:hover:bg-accent-300 active:bg-accent-700 disabled:bg-neutral-400`,
    outline: `border-2 border-primary-600 dark:border-primary-400 text-primary-600 dark:text-primary-400 hover:bg-primary-50 dark:hover:bg-primary-900/20 active:bg-primary-100 dark:active:bg-primary-800/30 disabled:border-neutral-400 disabled:text-neutral-400`,
    ghost: `text-primary-600 dark:text-primary-400 hover:bg-primary-50 dark:hover:bg-primary-900/20 active:bg-primary-100 dark:active:bg-primary-800/30 disabled:text-neutral-400`,
    success: `bg-success-600 dark:bg-success-500 text-white hover:bg-success-700 dark:hover:bg-success-400 active:bg-success-800 disabled:bg-neutral-400`,
    error: `bg-error-600 dark:bg-error-500 text-white hover:bg-error-700 dark:hover:bg-error-400 active:bg-error-800 disabled:bg-neutral-400`,
    warning: `bg-warning-600 dark:bg-warning-500 text-white hover:bg-warning-700 dark:hover:bg-warning-400 active:bg-warning-800 disabled:bg-neutral-400`,
  };

  // Size classes
  const sizeClasses = {
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-4 py-2 text-base',
    lg: 'px-6 py-3 text-lg',
    xl: 'px-8 py-4 text-xl',
  };

  const isDisabled = disabled || loading;

  return (
    <button
      ref={btnRef}
      type={type}
      onClick={handleClick}
      disabled={isDisabled}
      className={`
        ${baseClasses}
        ${variantClasses[variant] || variantClasses.primary}
        ${sizeClasses[size] || sizeClasses.md}
        ${fullWidth ? 'w-full' : ''}
        ${isDisabled ? 'cursor-not-allowed opacity-60' : 'cursor-pointer'}
        ${className}
      `}
      {...props}
    >
      {loading && (
        <svg className="animate-spin h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        </svg>
      )}
      {children}

      <style>{`
        .ripple {
          position: absolute;
          border-radius: 50%;
          transform: scale(0);
          animation: ripple 600ms linear;
          background-color: rgba(255,255,255,0.5);
          pointer-events: none;
          z-index: 10;
        }
        @keyframes ripple {
          to {
            transform: scale(2.5);
            opacity: 0;
          }
        }
      `}</style>
    </button>
  );
};

export { Button };

