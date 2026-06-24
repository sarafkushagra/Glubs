/**
 * Modal Component
 * Reusable modal/dialog with overlay
 */

import React from "react";
import { useTheme } from "../../context/AppProvider";

export const Modal = ({
  isOpen = false,
  onClose,
  title = "",
  children,
  footer = null,
  size = "md",
  closeButton = true,
  className = "",
}) => {
  const { theme } = useTheme();

  if (!isOpen) return null;

  const sizeClasses = {
    sm: "max-w-sm",
    md: "max-w-md",
    lg: "max-w-lg",
    xl: "max-w-2xl",
    "2xl": "max-w-4xl",
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/50 dark:bg-black/70 transition-opacity"
        onClick={onClose}
      />

      {/* Modal Container */}
      <div
        className={`
          relative bg-white dark:bg-gray-800 rounded-lg shadow-xl
          ${sizeClasses[size] || sizeClasses.md}
          w-full max-h-[90vh] overflow-y-auto
          ${className}
        `}
      >
        {/* Header */}
        <div className="sticky top-0 flex items-center justify-between p-6 border-b border-neutral-200 dark:border-neutral-700 bg-white dark:bg-gray-800">
          {title && (
            <h2 className="text-xl font-bold text-gray-900 dark:text-white">
              {title}
            </h2>
          )}
          {closeButton && (
            <button
              onClick={onClose}
              className="ml-auto text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 transition-colors"
            >
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          )}
        </div>

        {/* Body */}
        <div className="p-6">{children}</div>

        {/* Footer */}
        {footer && (
          <div className="sticky bottom-0 p-6 border-t border-neutral-200 dark:border-neutral-700 bg-white dark:bg-gray-800 flex gap-3 justify-end">
            {footer}
          </div>
        )}
      </div>
    </div>
  );
};

export default Modal;
