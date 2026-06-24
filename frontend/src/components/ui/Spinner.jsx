/**
 * Loading Component
 * Spinner and skeleton loaders
 */

import React from "react";

export const Spinner = ({ size = "md", className = "" }) => {
  const sizeClasses = {
    sm: "w-4 h-4",
    md: "w-8 h-8",
    lg: "w-12 h-12",
    xl: "w-16 h-16",
  };

  return (
    <svg
      className={`animate-spin text-primary-600 dark:text-primary-400 ${sizeClasses[size] || sizeClasses.md} ${className}`}
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
    >
      <circle
        className="opacity-25"
        cx="12"
        cy="12"
        r="10"
        stroke="currentColor"
        strokeWidth="4"
      ></circle>
      <path
        className="opacity-75"
        fill="currentColor"
        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
      ></path>
    </svg>
  );
};

export const SkeletonLoader = ({
  count = 1,
  height = "h-4",
  className = "",
  circle = false,
}) => {
  return (
    <div className="space-y-2 animate-pulse">
      {Array(count)
        .fill(0)
        .map((_, i) => (
          <div
            key={i}
            className={`
              bg-neutral-200 dark:bg-neutral-700
              ${circle ? "rounded-full w-10 h-10" : `rounded-lg ${height} w-full`}
              ${className}
            `}
          />
        ))}
    </div>
  );
};

export const LoadingOverlay = ({ message = "Loading..." }) => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 dark:bg-black/50 backdrop-blur-sm">
      <div className="bg-white dark:bg-gray-800 rounded-lg p-8 flex flex-col items-center gap-4 shadow-lg">
        <Spinner size="lg" />
        <p className="text-gray-700 dark:text-gray-300 font-medium">
          {message}
        </p>
      </div>
    </div>
  );
};

export default Spinner;
