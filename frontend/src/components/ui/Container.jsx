/**
 * Container Component
 * Flexible container for layouts with consistent spacing
 */

import { useTheme } from "../../context/AppProvider";

export const Container = ({
  children,
  className = "",
  maxWidth = "7xl",
  px = "4",
  py = "8",
}) => {
  const maxWidthMap = {
    sm: "max-w-sm",
    md: "max-w-md",
    lg: "max-w-lg",
    xl: "max-w-xl",
    "2xl": "max-w-2xl",
    "3xl": "max-w-3xl",
    "4xl": "max-w-4xl",
    "5xl": "max-w-5xl",
    "6xl": "max-w-6xl",
    "7xl": "max-w-7xl",
    full: "max-w-full",
  };

  return (
    <div
      className={`
        mx-auto w-full
        ${maxWidthMap[maxWidth] || maxWidthMap["7xl"]}
        px-${px} py-${py}
        ${className}
      `}
    >
      {children}
    </div>
  );
};

export default Container;
