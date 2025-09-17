import React from "react";
import ApperIcon from "@/components/ApperIcon";
import Button from "@/components/atoms/Button";

const Error = ({ 
  message = "Unable to access camera", 
  onRetry, 
  className = "",
  title = "Camera Error"
}) => {
  const handleCopyError = () => {
    navigator.clipboard.writeText(message).catch(() => {
      // Fallback for older browsers
      console.log('Error details:', message);
    });
  };

  return (
    <div className={`flex flex-col items-center justify-center p-8 text-center ${className}`}>
      <div className="w-16 h-16 bg-gradient-to-br from-error to-red-600 rounded-full flex items-center justify-center mb-6">
        <ApperIcon name="AlertTriangle" className="w-8 h-8 text-white" />
      </div>
      
      <h3 className="text-xl font-semibold text-white mb-3">{title}</h3>
      
      <div className="text-gray-400 mb-6 max-w-md leading-relaxed">
        <p className="mb-3">{message}</p>
        {message.length > 50 && (
          <button 
            onClick={handleCopyError}
            className="text-xs text-primary hover:text-secondary transition-colors"
            title="Copy error details"
          >
            Click to copy error details
          </button>
        )}
      </div>
      
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
          <p>• Try refreshing the page or restarting your browser</p>
          <p>• Ensure no other apps are using your camera</p>
        </div>
      </div>
    </div>
  );
};

export default Error;