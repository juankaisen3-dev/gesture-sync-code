import React from "react";
import { cn } from "@/utils/cn";

const ConfidenceMeter = ({ 
  confidence = 0, 
  size = "md", 
  showLabel = true,
  className = ""
}) => {
  const percentage = Math.min(Math.max(confidence * 100, 0), 100);
  const radius = size === "sm" ? 30 : size === "lg" ? 50 : 40;
  const strokeWidth = size === "sm" ? 4 : size === "lg" ? 6 : 5;
  const circumference = 2 * Math.PI * radius;
  const strokeDasharray = circumference;
  const strokeDashoffset = circumference - (percentage / 100) * circumference;

  const getConfidenceColor = () => {
    if (confidence >= 0.8) return "#10B981"; // Success
    if (confidence >= 0.6) return "#F59E0B"; // Warning
    return "#EF4444"; // Error
  };

  const getConfidenceLabel = () => {
    if (confidence >= 0.8) return "High";
    if (confidence >= 0.6) return "Medium";
    return "Low";
  };

  return (
    <div className={cn("flex flex-col items-center", className)}>
      <div className="relative">
        <svg
          width={radius * 2 + strokeWidth * 2}
          height={radius * 2 + strokeWidth * 2}
          className="transform -rotate-90"
        >
          {/* Background circle */}
          <circle
            cx={radius + strokeWidth}
            cy={radius + strokeWidth}
            r={radius}
            stroke="rgb(30 41 59)"
            strokeWidth={strokeWidth}
            fill="none"
          />
          {/* Progress circle */}
          <circle
            cx={radius + strokeWidth}
            cy={radius + strokeWidth}
            r={radius}
            stroke={getConfidenceColor()}
            strokeWidth={strokeWidth}
            fill="none"
            strokeDasharray={strokeDasharray}
            strokeDashoffset={strokeDashoffset}
            strokeLinecap="round"
            className="transition-all duration-300 ease-out confidence-ring"
            style={{
              filter: `drop-shadow(0 0 8px ${getConfidenceColor()}40)`
            }}
          />
        </svg>
        
        {/* Center text */}
        <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
          <span className={cn(
            "font-bold gradient-text",
            size === "sm" ? "text-sm" : size === "lg" ? "text-xl" : "text-lg"
          )}>
            {Math.round(percentage)}%
          </span>
        </div>
      </div>

      {showLabel && (
        <div className="mt-2 text-center">
          <div className={cn(
            "font-medium",
            size === "sm" ? "text-xs" : "text-sm"
          )} style={{ color: getConfidenceColor() }}>
            {getConfidenceLabel()} Confidence
          </div>
        </div>
      )}
    </div>
  );
};

export default ConfidenceMeter;