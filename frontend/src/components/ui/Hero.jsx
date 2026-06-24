/**
 * Hero Component
 * Large banner section for landing pages and sections
 */

import React from "react";
import { useTheme } from "../../context/AppProvider";

export const Hero = ({
  title = "",
  subtitle = "",
  description = "",
  image = null,
  buttons = [],
  backgroundGradient = true,
  minHeight = "min-h-[500px]",
  className = "",
  children = null,
}) => {
  const { theme } = useTheme();

  return (
    <section
      className={`
        relative w-full overflow-hidden
        ${minHeight}
        flex items-center justify-center
        ${backgroundGradient ? (
          theme === "dark"
            ? "bg-gradient-to-br from-gray-900 via-primary-900 to-gray-900"
            : "bg-gradient-to-br from-white via-primary-50 to-accent-50"
        ) : ""}
        ${className}
      `}
    >
      {/* Animated background blobs */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-primary-400/20 dark:bg-primary-600/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-accent-400/20 dark:bg-accent-600/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
      </div>

      {/* Content Container */}
      <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-20 text-center">
        {/* Image */}
        {image && (
          <div className="mb-8 flex justify-center">
            <img
              src={image}
              alt={title}
              className="max-w-md w-full h-auto rounded-xl shadow-2xl"
            />
          </div>
        )}

        {/* Title */}
        {title && (
          <h1
            className={`
              text-4xl sm:text-5xl lg:text-6xl font-bold mb-4
              bg-clip-text text-transparent
              bg-gradient-to-r from-primary-600 via-accent-500 to-primary-600
              dark:from-primary-400 dark:via-accent-400 dark:to-primary-300
              animate-fade-in
            `}
          >
            {title}
          </h1>
        )}

        {/* Subtitle */}
        {subtitle && (
          <h2
            className={`
              text-2xl sm:text-3xl font-semibold mb-4
              text-gray-700 dark:text-gray-200
            `}
          >
            {subtitle}
          </h2>
        )}

        {/* Description */}
        {description && (
          <p
            className={`
              text-lg sm:text-xl mb-8 max-w-2xl mx-auto
              text-gray-600 dark:text-gray-400
            `}
          >
            {description}
          </p>
        )}

        {/* Buttons */}
        {buttons.length > 0 && (
          <div className="flex flex-wrap gap-4 justify-center mt-8">
            {buttons.map((button, index) => (
              <button
                key={index}
                onClick={button.onClick}
                className={`
                  px-8 py-3 rounded-lg font-semibold transition-all duration-200
                  ${button.variant === "primary"
                    ? "bg-primary-600 dark:bg-primary-500 text-white hover:bg-primary-700 dark:hover:bg-primary-400 shadow-lg hover:shadow-xl"
                    : "bg-white dark:bg-gray-800 text-primary-600 dark:text-primary-400 border-2 border-primary-600 dark:border-primary-400 hover:bg-primary-50 dark:hover:bg-gray-700"
                  }
                `}
              >
                {button.label}
              </button>
            ))}
          </div>
        )}

        {/* Children */}
        {children && <div className="mt-8">{children}</div>}
      </div>
    </section>
  );
};

export default Hero;
