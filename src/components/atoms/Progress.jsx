import React, { forwardRef } from "react";
import { cn } from "@/utils/cn";

const Progress = forwardRef(({ 
  value = 0, 
  max = 100, 
  className = "",
  size = "md",
  variant = "primary",
  showLabel = false,
  ...props 
}, ref) => {
  const percentage = Math.min(Math.max((value / max) * 100, 0), 100);

  const sizes = {
    sm: "h-2",
    md: "h-3",
    lg: "h-4"
  };

  const variants = {
    primary: "from-primary to-secondary",
    success: "from-accent to-emerald-600",
    warning: "from-warning to-amber-600",
    error: "from-error to-red-600"
  };

  return (
    <div className="space-y-2">
      {showLabel && (
        <div className="flex justify-between text-sm">
          <span className="text-gray-400">Progress</span>
          <span className="text-white font-medium">{Math.round(percentage)}%</span>
        </div>
      )}
      <div
        ref={ref}
        className={cn(
          "w-full bg-surface rounded-full overflow-hidden",
          sizes[size],
          className
        )}
        {...props}
      >
        <div
          className={cn(
            "h-full bg-gradient-to-r transition-all duration-300 ease-out",
            variants[variant]
          )}
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  );
});

Progress.displayName = "Progress";

export default Progress;