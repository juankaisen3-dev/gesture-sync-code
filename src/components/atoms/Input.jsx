import React, { forwardRef } from "react";
import { cn } from "@/utils/cn";

const Input = forwardRef(({ 
  className = "",
  type = "text",
  ...props 
}, ref) => {
  return (
    <input
      type={type}
      ref={ref}
      className={cn(
        "flex w-full rounded-lg border border-gray-700 bg-surface/50 px-3 py-2 text-sm text-white placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary/50 disabled:cursor-not-allowed disabled:opacity-50 transition-colors duration-200",
        className
      )}
      {...props}
    />
  );
});

Input.displayName = "Input";

export default Input;