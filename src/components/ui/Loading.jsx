import React from "react";
import ApperIcon from "@/components/ApperIcon";

const Loading = ({ message = "Loading gesture recognition...", className = "" }) => {
  return (
    <div className={`flex flex-col items-center justify-center p-8 ${className}`}>
      <div className="relative">
        <div className="w-16 h-16 border-4 border-surface rounded-full border-t-primary animate-spin"></div>
        <ApperIcon 
          name="Hand" 
          className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-6 h-6 text-primary"
        />
      </div>
      <div className="mt-6 text-center">
        <h3 className="text-lg font-medium text-white mb-2">Setting up camera...</h3>
        <p className="text-sm text-gray-400">{message}</p>
      </div>
      <div className="flex space-x-2 mt-4">
        <div className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: "0ms" }}></div>
        <div className="w-2 h-2 bg-secondary rounded-full animate-bounce" style={{ animationDelay: "150ms" }}></div>
        <div className="w-2 h-2 bg-accent rounded-full animate-bounce" style={{ animationDelay: "300ms" }}></div>
      </div>
    </div>
  );
};

export default Loading;