import React, { useState, useEffect } from "react";
import Header from "@/components/organisms/Header";
import WebcamViewer from "@/components/organisms/WebcamViewer";
import RecognitionPanel from "@/components/organisms/RecognitionPanel";
import CameraControls from "@/components/molecules/CameraControls";
import Loading from "@/components/ui/Loading";
import Error from "@/components/ui/Error";
import settingsService from "@/services/api/settingsService";
import { toast } from "react-toastify";

const GestureRecognitionPage = () => {
  const [settings, setSettings] = useState({});
  const [currentGesture, setCurrentGesture] = useState(null);
  const [isRecording, setIsRecording] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const loadSettings = async () => {
    try {
      setLoading(true);
      setError(null);
const settingsData = await settingsService.getSettings();
      setSettings(settingsData);
    } catch (err) {
      console.error("Failed to load settings:", err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleSettingsChange = async (newSettings) => {
    try {
      const updatedSettings = await settingsService.updateSettings(newSettings);
      setSettings(updatedSettings);
      toast.success("Settings updated!");
    } catch (err) {
      console.error("Failed to update settings:", err);
      toast.error("Failed to update settings");
    }
  };

  const handleGestureDetected = (gesture) => {
    setCurrentGesture(gesture);
    
    // Show toast notification for high confidence detections
if (gesture.confidence >= (settings.detection_threshold_c || settings.detectionThreshold || 0.7)) {
      toast.info(`Detected: ${gesture.name}`, {
        autoClose: 2000
      });
    }
  };

  const handleStartRecording = () => {
    setIsRecording(true);
    setCurrentGesture(null);
  };

  const handleStopRecording = () => {
    setIsRecording(false);
    setCurrentGesture(null);
  };

  useEffect(() => {
    loadSettings();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <div className="container mx-auto px-4 py-8">
          <Loading message="Loading GestureSync..." />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-background">
        <div className="container mx-auto px-4 py-8">
          <Error
            title="Application Error"
            message={error}
            onRetry={loadSettings}
          />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Header
        settings={settings}
        onSettingsChange={handleSettingsChange}
      />

      <main className="container mx-auto px-4 py-6 space-y-6">
        {/* Camera Controls */}
        <div className="flex justify-center">
          <CameraControls
            isRecording={isRecording}
            onStart={handleStartRecording}
            onStop={handleStopRecording}
            onSettings={() => {}}
          />
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Left Column - Camera Feed */}
          <div className="space-y-6">
            <WebcamViewer
              onHandDetected={handleGestureDetected}
              isRecording={isRecording}
              settings={settings}
            />
          </div>

          {/* Right Column - Recognition Results */}
          <div className="space-y-6">
            <RecognitionPanel
              currentGesture={currentGesture}
              settings={settings}
            />
          </div>
        </div>

        {/* Instructions */}
        <div className="max-w-4xl mx-auto">
          <div className="bg-gradient-to-r from-surface/30 to-slate-700/30 rounded-xl p-6 border border-gray-700/30">
            <h3 className="text-lg font-semibold text-white mb-4 font-display">
              How to Use GestureSync
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-gray-300">
              <div className="flex items-start space-x-3">
                <div className="w-8 h-8 bg-primary/20 rounded-full flex items-center justify-center flex-shrink-0">
                  <span className="text-primary font-bold">1</span>
                </div>
                <div>
                  <div className="font-medium text-white mb-1">Start Camera</div>
                  <p>Click "Start Camera" and allow browser access to your webcam.</p>
                </div>
              </div>
              
              <div className="flex items-start space-x-3">
                <div className="w-8 h-8 bg-secondary/20 rounded-full flex items-center justify-center flex-shrink-0">
                  <span className="text-secondary font-bold">2</span>
                </div>
                <div>
                  <div className="font-medium text-white mb-1">Make Gestures</div>
                  <p>Position your hand in front of the camera and make different gestures.</p>
                </div>
              </div>
              
              <div className="flex items-start space-x-3">
                <div className="w-8 h-8 bg-accent/20 rounded-full flex items-center justify-center flex-shrink-0">
                  <span className="text-accent font-bold">3</span>
                </div>
                <div>
                  <div className="font-medium text-white mb-1">View Results</div>
                  <p>See real-time recognition results with confidence scores and history.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default GestureRecognitionPage;