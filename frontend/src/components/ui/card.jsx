import React from "react";
import { useTheme } from "../../context/AppProvider";

/**
 * Card Component with theme support
 * Reusable container with consistent styling
 */
const Card = ({
  children,
  className = "",
  variant = "default",
  hoverable = false,
  shadow = "md",
}) => {
  const { theme } = useTheme();

  const variantClasses = {
    default: `bg-white dark:bg-gray-800 border border-neutral-200 dark:border-neutral-700`,
    elevated: `bg-white dark:bg-gray-800 shadow-lg border border-neutral-100 dark:border-neutral-700`,
    outlined: `bg-transparent border-2 border-primary-200 dark:border-primary-800`,
    filled: `bg-neutral-50 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-700`,
  };

  const shadowClasses = {
    none: "shadow-none",
    sm: "shadow-sm",
    md: "shadow-md",
    lg: "shadow-lg",
    xl: "shadow-xl",
  };

  return (
    <div
      className={`
        rounded-lg p-6 transition-all duration-200
        ${variantClasses[variant] || variantClasses.default}
        ${shadowClasses[shadow] || shadowClasses.md}
        ${hoverable ? "hover:shadow-lg dark:hover:shadow-2xl cursor-pointer" : ""}
        ${className}
      `}
    >
      {children}
    </div>
  );
};

export { Card };

