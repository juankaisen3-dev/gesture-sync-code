import React from "react";
import Card from "@/components/atoms/Card";
import Badge from "@/components/atoms/Badge";
import ApperIcon from "@/components/ApperIcon";
import { cn } from "@/utils/cn";
import { format } from "date-fns";

const GestureCard = ({ 
  gesture, 
  isActive = false, 
  showTimestamp = true,
  className = ""
}) => {
  const getGestureIcon = (gestureName) => {
    const iconMap = {
      "Thumbs Up": "ThumbsUp",
      "Peace Sign": "Hand",
      "Closed Fist": "Zap",
      "Open Palm": "Hand",
      "Pointing": "MousePointer",
      "OK Sign": "CheckCircle",
      "Rock On": "Zap",
      "Call Me": "Phone",
      "Stop Sign": "Hand",
      "Thumbs Down": "ThumbsDown"
    };
    return iconMap[gestureName] || "Hand";
  };

  const getCategoryVariant = (category) => {
    const categoryMap = {
      "approval": "success",
      "disapproval": "error",
      "gesture": "primary",
      "basic": "info",
      "direction": "warning",
      "communication": "info",
      "command": "error"
    };
    return categoryMap[category] || "default";
  };

  return (
    <Card
      variant={isActive ? "glow" : "default"}
      className={cn(
        "gesture-card-glow transition-all duration-300",
        isActive && "gesture-card-active ring-2 ring-accent/50",
        className
      )}
    >
      <div className="flex items-start justify-between">
        <div className="flex items-center space-x-3">
          <div className={cn(
            "w-10 h-10 rounded-full flex items-center justify-center",
            isActive 
              ? "bg-gradient-to-br from-accent to-emerald-600" 
              : "bg-gradient-to-br from-primary/20 to-secondary/20"
          )}>
            <ApperIcon 
              name={getGestureIcon(gesture.name)} 
              className={cn(
                "w-5 h-5",
                isActive ? "text-white" : "text-primary"
              )}
            />
          </div>
          
          <div className="flex-1 min-w-0">
            <h3 className="font-semibold text-white truncate">
              {gesture.name}
            </h3>
            {gesture.category && (
              <Badge 
                variant={getCategoryVariant(gesture.category)}
                className="mt-1"
              >
                {gesture.category}
              </Badge>
            )}
          </div>
        </div>

        <div className="text-right">
          <div className={cn(
            "text-lg font-bold",
            gesture.confidence >= 0.8 ? "text-accent" :
            gesture.confidence >= 0.6 ? "text-warning" : "text-error"
          )}>
            {Math.round((gesture.confidence || 0) * 100)}%
          </div>
          {showTimestamp && gesture.timestamp && (
            <div className="text-xs text-gray-400 mt-1">
              {format(new Date(gesture.timestamp), "HH:mm:ss")}
            </div>
          )}
        </div>
      </div>

      {gesture.description && (
        <p className="text-sm text-gray-400 mt-3 leading-relaxed">
          {gesture.description}
        </p>
      )}

      {isActive && (
        <div className="absolute -inset-1 bg-gradient-to-r from-accent/20 to-emerald-600/20 rounded-xl -z-10 animate-pulse-slow" />
      )}
    </Card>
  );
};

export default GestureCard;