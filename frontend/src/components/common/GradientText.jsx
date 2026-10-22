import React from "react";

export default function GradientText({
  children,
  gradient = "cyan",
  className = "",
}) {
  const gradientClass =
    gradient === "cyan"
      ? "text-gradient-cyan"
      : gradient === "pink"
      ? "text-gradient-pink"
      : "bg-gradient-to-r from-violet-400 to-pink-500 bg-clip-text text-transparent";

  return (
    <span className={`inline-block font-extrabold ${gradientClass} ${className}`}>
      {children}
    </span>
  );
}
