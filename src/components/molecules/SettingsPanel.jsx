import React from "react";
import Card from "@/components/atoms/Card";
import Button from "@/components/atoms/Button";
import Input from "@/components/atoms/Input";
import ApperIcon from "@/components/ApperIcon";

const SettingsPanel = ({
  settings = {},
  onUpdateSettings,
  onClose,
  className = ""
}) => {
  const handleSliderChange = (key, value) => {
    onUpdateSettings({ [key]: parseFloat(value) });
  };

  const handleToggle = (key) => {
    onUpdateSettings({ [key]: !settings[key] });
  };

  return (
    <Card variant="glass" className={`space-y-6 ${className}`}>
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold text-white font-display">Detection Settings</h2>
        <Button 
          onClick={onClose}
          variant="ghost"
          size="sm"
        >
          <ApperIcon name="X" className="w-4 h-4" />
        </Button>
      </div>

      <div className="space-y-4">
        {/* Detection Threshold */}
        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-300">
            Detection Threshold: {Math.round((settings.detectionThreshold || 0.7) * 100)}%
          </label>
          <input
            type="range"
            min="0.1"
            max="1.0"
            step="0.05"
            value={settings.detectionThreshold || 0.7}
            onChange={(e) => handleSliderChange("detectionThreshold", e.target.value)}
            className="w-full h-2 bg-surface rounded-lg appearance-none cursor-pointer slider"
          />
          <p className="text-xs text-gray-400">
            Lower values detect gestures more easily but may be less accurate
          </p>
        </div>

        {/* Frame Rate */}
        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-300">
            Detection Frame Rate: {settings.detectionFrameRate || 30} FPS
          </label>
          <input
            type="range"
            min="10"
            max="60"
            step="5"
            value={settings.detectionFrameRate || 30}
            onChange={(e) => handleSliderChange("detectionFrameRate", e.target.value)}
            className="w-full h-2 bg-surface rounded-lg appearance-none cursor-pointer slider"
          />
        </div>

        {/* Toggles */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-gray-300">Show Hand Skeleton</span>
            <Button
              onClick={() => handleToggle("showSkeleton")}
              variant={settings.showSkeleton ? "primary" : "secondary"}
              size="sm"
            >
              <ApperIcon name={settings.showSkeleton ? "Eye" : "EyeOff"} className="w-4 h-4" />
            </Button>
          </div>

          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-gray-300">Show Confidence</span>
            <Button
              onClick={() => handleToggle("showConfidence")}
              variant={settings.showConfidence ? "primary" : "secondary"}
              size="sm"
            >
              <ApperIcon name={settings.showConfidence ? "BarChart3" : "BarChart"} className="w-4 h-4" />
            </Button>
          </div>

          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-gray-300">Enable History</span>
            <Button
              onClick={() => handleToggle("enableHistory")}
              variant={settings.enableHistory ? "primary" : "secondary"}
              size="sm"
            >
              <ApperIcon name={settings.enableHistory ? "History" : "HistoryIcon"} className="w-4 h-4" />
            </Button>
          </div>
        </div>

        {/* History Size */}
        {settings.enableHistory && (
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-300">
              History Size: {settings.historySize || 10} items
            </label>
            <input
              type="range"
              min="5"
              max="50"
              step="5"
              value={settings.historySize || 10}
              onChange={(e) => handleSliderChange("historySize", e.target.value)}
              className="w-full h-2 bg-surface rounded-lg appearance-none cursor-pointer slider"
            />
          </div>
        )}

        {/* Reset to Defaults */}
        <div className="pt-4 border-t border-gray-700">
          <Button
            onClick={() => onUpdateSettings({
              detectionThreshold: 0.7,
              showSkeleton: true,
              showConfidence: true,
              detectionFrameRate: 30,
              enableHistory: true,
              historySize: 10
            })}
            variant="outline"
            className="w-full"
          >
            <ApperIcon name="RotateCcw" className="w-4 h-4 mr-2" />
            Reset to Defaults
          </Button>
        </div>
      </div>
    </Card>
  );
};

export default SettingsPanel;