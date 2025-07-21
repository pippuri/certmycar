interface LogoProps {
  className?: string;
  size?: "sm" | "md" | "lg";
}

export function Logo({ className = "", size = "md" }: LogoProps) {
  const sizeClasses = {
    sm: "w-8 h-8",
    md: "w-10 h-10",
    lg: "w-12 h-12",
  };

  const textSizes = {
    sm: "text-lg",
    md: "text-xl",
    lg: "text-2xl",
  };

  return (
    <div className={`flex items-center space-x-3 ${className}`}>
      <div
        className={`${sizeClasses[size]} bg-gradient-to-br from-blue-600 to-blue-700 rounded-xl flex items-center justify-center shadow-lg relative overflow-hidden`}
      >
        {/* Battery outline */}
        <svg
          viewBox="0 0 24 24"
          className="w-5 h-5 text-white"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
        >
          {/* Battery body */}
          <rect x="2" y="6" width="16" height="12" rx="2" ry="2" />
          {/* Battery terminal */}
          <rect x="20" y="9" width="2" height="6" rx="1" ry="1" />
          {/* Checkmark inside battery */}
          <path
            d="M6 12l2 2 4-4"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>

        {/* Subtle glow effect */}
        <div className="absolute inset-0 bg-gradient-to-br from-white/20 to-transparent rounded-xl" />
      </div>
      <div className="flex flex-col">
        <span
          className={`font-bold ${textSizes[size]} text-gray-900 leading-tight`}
        >
          batterycert.com
        </span>
        {size === "lg" && (
          <span className="text-xs text-gray-500 font-medium tracking-wide">
            CERTIFIED RESULTS
          </span>
        )}
      </div>
    </div>
  );
}
