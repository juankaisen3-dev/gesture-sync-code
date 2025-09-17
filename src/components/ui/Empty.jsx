import React from "react";
import ApperIcon from "@/components/ApperIcon";
import Button from "@/components/atoms/Button";

const Empty = ({ 
  title = "No gestures detected", 
  message = "Make a gesture in front of the camera to see real-time recognition results.",
  actionLabel = "Start Camera",
  onAction,
  className = ""
}) => {
  return (
    <div className={`flex flex-col items-center justify-center p-8 text-center ${className}`}>
      <div className="relative mb-6">
        <div className="w-24 h-24 bg-gradient-to-br from-surface to-slate-700 rounded-full flex items-center justify-center">
          <ApperIcon name="Hand" className="w-12 h-12 text-gray-400" />
        </div>
        <div className="absolute -top-2 -right-2 w-8 h-8 bg-gradient-to-br from-accent to-emerald-600 rounded-full flex items-center justify-center">
          <ApperIcon name="Search" className="w-4 h-4 text-white" />
        </div>
      </div>
      
      <h3 className="text-xl font-semibold text-white mb-3 font-display">{title}</h3>
      
      <p className="text-gray-400 mb-6 max-w-md leading-relaxed">
        {message}
      </p>
      
      {onAction && (
        <Button 
          onClick={onAction}
          className="bg-gradient-to-r from-primary to-secondary hover:from-primary/80 hover:to-secondary/80"
        >
          <ApperIcon name="Camera" className="w-4 h-4 mr-2" />
          {actionLabel}
        </Button>
      )}
      
      <div className="mt-8 grid grid-cols-3 gap-4 opacity-50">
        <div className="flex flex-col items-center">
          <div className="w-8 h-8 bg-surface rounded-full flex items-center justify-center mb-2">
            <ApperIcon name="ThumbsUp" className="w-4 h-4 text-gray-500" />
          </div>
          <span className="text-xs text-gray-600">Thumbs Up</span>
        </div>
        <div className="flex flex-col items-center">
          <div className="w-8 h-8 bg-surface rounded-full flex items-center justify-center mb-2">
            <ApperIcon name="Hand" className="w-4 h-4 text-gray-500" />
          </div>
          <span className="text-xs text-gray-600">Peace Sign</span>
        </div>
        <div className="flex flex-col items-center">
          <div className="w-8 h-8 bg-surface rounded-full flex items-center justify-center mb-2">
            <ApperIcon name="Zap" className="w-4 h-4 text-gray-500" />
          </div>
          <span className="text-xs text-gray-600">OK Sign</span>
        </div>
      </div>
    </div>
  );
};

export default Empty;