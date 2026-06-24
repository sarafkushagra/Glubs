import React from "react";
import { useTheme } from "../../context/AppProvider";

/**
 * Input Component with theme support
 * Supports multiple variants and validation states
 */
const Input = ({
  type = "text",
  placeholder = "",
  value,
  onChange,
  className = "",
  variant = "default",
  size = "md",
  error = false,
  errorMessage = "",
  label = "",
  required = false,
  disabled = false,
  icon = null,
  ...rest
}) => {
  const { theme } = useTheme();

  const variantClasses = {
    default: `border border-neutral-300 dark:border-neutral-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 focus:border-primary-500 dark:focus:border-primary-400`,
    outline: `border-2 border-neutral-200 dark:border-neutral-700 bg-transparent text-gray-900 dark:text-white focus:border-primary-500 dark:focus:border-primary-400`,
    filled: `border-b-2 border-neutral-300 dark:border-neutral-600 bg-neutral-50 dark:bg-neutral-900 text-gray-900 dark:text-white focus:border-primary-500 dark:focus:border-primary-400`,
  };

  const sizeClasses = {
    sm: 'px-2 py-1 text-sm',
    md: 'px-3 py-2 text-base',
    lg: 'px-4 py-3 text-lg',
  };

  const errorClasses = error ? 'border-error-500 dark:border-error-400 focus:ring-error-200 dark:focus:ring-error-900/20' : '';

  return (
    <div className="w-full">
      {label && (
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          {label}
          {required && <span className="text-error-500 ml-1">*</span>}
        </label>
      )}

      <div className="relative">
        {icon && (
          <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 dark:text-gray-400">
            {icon}
          </div>
        )}

        <input
          type={type}
          placeholder={placeholder}
          value={value}
          onChange={onChange}
          disabled={disabled}
          className={`
            w-full rounded-lg transition-all duration-200
            focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500
            dark:focus:ring-offset-gray-900
            disabled:bg-neutral-100 dark:disabled:bg-neutral-800 disabled:cursor-not-allowed disabled:opacity-50
            ${variantClasses[variant] || variantClasses.default}
            ${sizeClasses[size] || sizeClasses.md}
            ${errorClasses}
            ${icon ? 'pl-10' : ''}
            ${className}
          `}
          {...rest}
        />
      </div>

      {error && errorMessage && (
        <p className="text-sm text-error-600 dark:text-error-400 mt-1">
          {errorMessage}
        </p>
      )}
    </div>
  );
};

export { Input };

