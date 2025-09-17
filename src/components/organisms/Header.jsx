import React, { useState } from "react";
import Button from "@/components/atoms/Button";
import ApperIcon from "@/components/ApperIcon";
import SettingsPanel from "@/components/molecules/SettingsPanel";
import { motion, AnimatePresence } from "framer-motion";

const Header = ({
  onSettingsChange,
  settings = {},
  className = ""
}) => {
  const [showSettings, setShowSettings] = useState(false);

  return (
    <>
      <header className={`bg-gradient-to-r from-surface to-slate-700 border-b border-gray-700/50 ${className}`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo and Title */}
            <div className="flex items-center space-x-4">
              <div className="w-10 h-10 bg-gradient-to-br from-primary to-secondary rounded-lg flex items-center justify-center">
                <ApperIcon name="Hand" className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold gradient-text font-display">
                  GestureSync
                </h1>
                <p className="text-sm text-gray-400">Real-time Hand Gesture Recognition</p>
              </div>
            </div>

            {/* Header Actions */}
            <div className="flex items-center space-x-4">
              {/* Status Indicators */}
              <div className="hidden sm:flex items-center space-x-4 text-sm">
                <div className="flex items-center text-gray-400">
                  <ApperIcon name="Eye" className="w-4 h-4 mr-2" />
                  <span>{settings.showSkeleton ? "Skeleton On" : "Skeleton Off"}</span>
                </div>
                <div className="flex items-center text-gray-400">
                  <ApperIcon name="BarChart3" className="w-4 h-4 mr-2" />
                  <span>Threshold: {Math.round((settings.detectionThreshold || 0.7) * 100)}%</span>
                </div>
              </div>

              {/* Settings Button */}
              <Button
                onClick={() => setShowSettings(!showSettings)}
                variant={showSettings ? "primary" : "ghost"}
                size="sm"
              >
                <ApperIcon name="Settings" className="w-4 h-4 mr-2" />
                Settings
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Settings Panel Overlay */}
      <AnimatePresence>
        {showSettings && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={(e) => {
              if (e.target === e.currentTarget) {
                setShowSettings(false);
              }
            }}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="w-full max-w-md"
            >
              <SettingsPanel
                settings={settings}
                onUpdateSettings={(newSettings) => {
                  onSettingsChange({ ...settings, ...newSettings });
                }}
                onClose={() => setShowSettings(false)}
              />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default Header;