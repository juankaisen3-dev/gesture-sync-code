import React, { forwardRef } from "react";
import { cn } from "@/utils/cn";

const Card = forwardRef(({ 
  children, 
  className = "",
  variant = "default",
  ...props 
}, ref) => {
  const variants = {
    default: "bg-surface border border-gray-700/50 shadow-lg",
    gradient: "bg-gradient-to-br from-surface to-slate-700 border border-gray-600/50 shadow-xl",
    glass: "bg-surface/80 backdrop-blur border border-gray-600/30 shadow-2xl",
    glow: "bg-surface border border-gray-700/50 shadow-lg hover:shadow-primary/10 hover:border-primary/30"
  };

  return (
    <div
      ref={ref}
      className={cn(
        "rounded-xl p-6 transition-all duration-200",
        variants[variant],
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
});

Card.displayName = "Card";

export default Card;