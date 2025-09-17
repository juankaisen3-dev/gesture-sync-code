import React from "react";
import Button from "@/components/atoms/Button";
import ApperIcon from "@/components/ApperIcon";

const CameraControls = ({
  isRecording = false,
  isLoading = false,
  onStart,
  onStop,
  onSettings,
  onCapture,
  className = ""
}) => {
  return (
    <div className={`flex items-center justify-center gap-3 ${className}`}>
      {!isRecording ? (
        <Button 
          onClick={onStart}
          disabled={isLoading}
          className="bg-gradient-to-r from-accent to-emerald-600 hover:from-accent/90 hover:to-emerald-600/90"
        >
          <ApperIcon name="Camera" className="w-4 h-4 mr-2" />
          {isLoading ? "Starting..." : "Start Camera"}
        </Button>
      ) : (
        <Button 
          onClick={onStop}
          variant="danger"
        >
          <ApperIcon name="CameraOff" className="w-4 h-4 mr-2" />
          Stop Camera
        </Button>
      )}

      {isRecording && onCapture && (
        <Button 
          onClick={onCapture}
          variant="secondary"
        >
          <ApperIcon name="Image" className="w-4 h-4 mr-2" />
          Capture
        </Button>
      )}

      <Button 
        onClick={onSettings}
        variant="ghost"
      >
        <ApperIcon name="Settings" className="w-4 h-4 mr-2" />
        Settings
      </Button>
    </div>
  );
};

export default CameraControls;