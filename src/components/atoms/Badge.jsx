import React, { forwardRef } from "react";
import { cn } from "@/utils/cn";

const Badge = forwardRef(({ 
  children, 
  variant = "default", 
  className = "",
  ...props 
}, ref) => {
  const variants = {
    default: "bg-surface text-gray-300 border border-gray-700",
    success: "bg-gradient-to-r from-accent/20 to-emerald-600/20 text-accent border border-accent/30",
    warning: "bg-gradient-to-r from-warning/20 to-amber-600/20 text-warning border border-warning/30",
    error: "bg-gradient-to-r from-error/20 to-red-600/20 text-error border border-error/30",
    info: "bg-gradient-to-r from-info/20 to-blue-600/20 text-info border border-info/30",
    primary: "bg-gradient-to-r from-primary/20 to-secondary/20 text-primary border border-primary/30"
  };

  return (
    <span
      ref={ref}
      className={cn(
        "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium transition-colors",
        variants[variant],
        className
      )}
      {...props}
    >
      {children}
    </span>
  );
});

Badge.displayName = "Badge";

export default Badge;