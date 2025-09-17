import React from "react";
import ApperIcon from "@/components/ApperIcon";
import Button from "@/components/atoms/Button";

const Error = ({ 
  message = "Unable to access camera", 
  onRetry, 
  className = "",
  title = "Camera Error"
}) => {
  return (
    <div className={`flex flex-col items-center justify-center p-8 text-center ${className}`}>
      <div className="w-16 h-16 bg-gradient-to-br from-error to-red-600 rounded-full flex items-center justify-center mb-6">
        <ApperIcon name="AlertTriangle" className="w-8 h-8 text-white" />
      </div>
      
      <h3 className="text-xl font-semibold text-white mb-3">{title}</h3>
      
      <p className="text-gray-400 mb-6 max-w-md leading-relaxed">
        {message}
      </p>
      
      <div className="space-y-3">
        {onRetry && (
          <Button 
            onClick={onRetry}
            className="bg-gradient-to-r from-primary to-secondary hover:from-primary/80 hover:to-secondary/80"
          >
            <ApperIcon name="RefreshCw" className="w-4 h-4 mr-2" />
            Try Again
          </Button>
        )}
        
        <div className="text-xs text-gray-500 space-y-1">
          <p>• Make sure your camera is connected and working</p>
          <p>• Check browser permissions for camera access</p>
          <p>• Refresh the page and try again</p>
        </div>
      </div>
    </div>
  );
};

export default Error;