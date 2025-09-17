import React, { useRef, useEffect, useState } from "react";
import Card from "@/components/atoms/Card";
import Button from "@/components/atoms/Button";
import ApperIcon from "@/components/ApperIcon";
import Loading from "@/components/ui/Loading";
import Error from "@/components/ui/Error";
import { toast } from "react-toastify";

const WebcamViewer = ({
  onHandDetected,
  isRecording = false,
  settings = {},
  className = ""
}) => {
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const streamRef = useRef(null);
  const animationRef = useRef(null);
  
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [currentGesture, setCurrentGesture] = useState(null);
  const [handLandmarks, setHandLandmarks] = useState([]);
  const [boundingBox, setBoundingBox] = useState(null);
  const [detectionActive, setDetectionActive] = useState(false);

  // Mock hand connections for skeleton visualization
  const HAND_CONNECTIONS = [
    [0, 1], [1, 2], [2, 3], [3, 4], // Thumb
    [0, 5], [5, 6], [6, 7], [7, 8], // Index finger
    [9, 10], [10, 11], [11, 12], // Middle finger
    [13, 14], [14, 15], [15, 16], // Ring finger
    [17, 18], [18, 19], [19, 20], // Pinky
    [0, 17], [5, 9], [9, 13], [13, 17] // Palm connections
  ];

  const initCamera = async () => {
try {
      setIsLoading(true);
      setError(null);

      // Check if mediaDevices API is available
      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        throw new Error("Camera API not supported in this browser. Please use a modern browser like Chrome, Firefox, or Safari.");
      }

      const stream = await navigator.mediaDevices.getUserMedia({
        video: {
          width: { ideal: 640 },
          height: { ideal: 480 },
          facingMode: "user"
        }
      });

      streamRef.current = stream;
      
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        await new Promise((resolve, reject) => {
          videoRef.current.onloadedmetadata = resolve;
          videoRef.current.onerror = reject;
          // Add timeout to prevent hanging
          setTimeout(() => reject(new Error("Video loading timeout")), 10000);
        });
      }

      toast.success("Camera connected successfully!");
      setIsLoading(false);
    } catch (err) {
      console.error("Camera access error:", err);
      
      let userMessage = "Unable to access camera";
      let errorDetails = err.message;

      // Categorize specific error types for better user guidance
      if (err.name === 'NotAllowedError' || err.message.includes('Permission denied')) {
        userMessage = "Camera access denied";
        errorDetails = "Please allow camera access in your browser and refresh the page. Look for the camera icon in your address bar.";
      } else if (err.name === 'NotFoundError') {
        userMessage = "No camera found";
        errorDetails = "Please connect a camera to your device and try again.";
      } else if (err.name === 'NotReadableError') {
        userMessage = "Camera in use";
        errorDetails = "Your camera might be used by another application. Please close other apps using the camera and try again.";
      } else if (err.name === 'OverconstrainedError') {
        userMessage = "Camera configuration error";
        errorDetails = "Your camera doesn't support the required settings. Try using a different camera.";
      } else if (err.name === 'SecurityError' || err.message.includes('secure')) {
        userMessage = "Security restriction";
        errorDetails = "Camera access requires a secure connection (HTTPS). Please check your connection.";
      }

      setError(`${userMessage}: ${errorDetails}`);
      setIsLoading(false);
      toast.error(`${userMessage}. Please check the error details and try again.`);
    }
  };

  const stopCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    }
    
    if (animationRef.current) {
      cancelAnimationFrame(animationRef.current);
      animationRef.current = null;
    }

    setCurrentGesture(null);
    setHandLandmarks([]);
    setBoundingBox(null);
    setDetectionActive(false);
    
    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }

    // Clear canvas
    if (canvasRef.current) {
      const ctx = canvasRef.current.getContext("2d");
      ctx.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);
    }
  };

  const generateMockLandmarks = () => {
    const centerX = 320;
    const centerY = 240;
    const spread = 80;
    
    return Array.from({ length: 21 }, (_, i) => ({
      x: centerX + (Math.random() - 0.5) * spread,
      y: centerY + (Math.random() - 0.5) * spread,
      z: Math.random() * 0.1 - 0.05,
      visibility: Math.random() * 0.3 + 0.7
    }));
  };

  const generateMockBoundingBox = () => ({
    x: 220 + Math.random() * 100,
    y: 160 + Math.random() * 80,
    width: 160 + Math.random() * 40,
    height: 160 + Math.random() * 40
  });

  const detectHands = async () => {
    if (!videoRef.current || !canvasRef.current) return;

    try {
      // Simulate detection delay
      await new Promise(resolve => setTimeout(resolve, 33)); // ~30 FPS

      const shouldDetectHand = Math.random() > 0.3; // 70% chance of detection
      
      if (shouldDetectHand) {
        const mockLandmarks = generateMockLandmarks();
        const mockBoundingBox = generateMockBoundingBox();
        
        setHandLandmarks(mockLandmarks);
        setBoundingBox(mockBoundingBox);
        setDetectionActive(true);

        // Simulate gesture recognition every few frames
        if (Math.random() > 0.8 && onHandDetected) { // 20% chance per frame
          const mockGesture = await import("@/services/api/gestureService.js").then(service => 
            service.default.recognizeGesture(mockLandmarks, mockBoundingBox)
          );
          setCurrentGesture(mockGesture);
          onHandDetected(mockGesture);
        }
      } else {
        setHandLandmarks([]);
        setBoundingBox(null);
        setDetectionActive(false);
        setCurrentGesture(null);
      }

      drawOverlay();
      
    } catch (error) {
      console.error("Detection error:", error);
    }
  };

  const drawOverlay = () => {
    if (!canvasRef.current || !videoRef.current) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    
    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Draw bounding box
    if (boundingBox && settings.showSkeleton) {
      ctx.strokeStyle = detectionActive ? "#6366F1" : "#8B5CF6";
      ctx.lineWidth = 2;
      ctx.setLineDash([10, 5]);
      ctx.strokeRect(boundingBox.x, boundingBox.y, boundingBox.width, boundingBox.height);
      ctx.setLineDash([]);
    }

    // Draw hand landmarks and connections
    if (handLandmarks.length > 0 && settings.showSkeleton) {
      // Draw connections
      ctx.strokeStyle = "#8B5CF6";
      ctx.lineWidth = 2;
      ctx.lineCap = "round";
      
      HAND_CONNECTIONS.forEach(([start, end]) => {
        if (handLandmarks[start] && handLandmarks[end]) {
          ctx.beginPath();
          ctx.moveTo(handLandmarks[start].x, handLandmarks[start].y);
          ctx.lineTo(handLandmarks[end].x, handLandmarks[end].y);
          ctx.stroke();
        }
      });

      // Draw landmarks
      handLandmarks.forEach((landmark, i) => {
        ctx.fillStyle = i === 0 ? "#10B981" : "#8B5CF6"; // Wrist in different color
        ctx.strokeStyle = "#6366F1";
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.arc(landmark.x, landmark.y, 3, 0, 2 * Math.PI);
        ctx.fill();
        ctx.stroke();
      });
    }

    // Draw gesture label
    if (currentGesture && boundingBox) {
      ctx.fillStyle = "rgba(16, 185, 129, 0.9)";
      ctx.font = "bold 16px Inter";
      ctx.textAlign = "center";
      
      const labelX = boundingBox.x + boundingBox.width / 2;
      const labelY = boundingBox.y - 15;
      
      // Background for text
      const textWidth = ctx.measureText(currentGesture.name).width + 20;
      ctx.fillRect(labelX - textWidth/2, labelY - 20, textWidth, 25);
      
      // Text
      ctx.fillStyle = "white";
      ctx.fillText(currentGesture.name, labelX, labelY - 5);
    }
  };

  const runDetectionLoop = () => {
    if (isRecording && videoRef.current && videoRef.current.readyState === 4) {
      detectHands();
    }
    animationRef.current = requestAnimationFrame(runDetectionLoop);
  };

  useEffect(() => {
    if (isRecording) {
      runDetectionLoop();
    } else {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
        animationRef.current = null;
      }
    }

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [isRecording]);

  useEffect(() => {
    return () => {
      stopCamera();
    };
  }, []);

if (error) {
    return (
      <Card variant="gradient" className={className}>
        <Error
          title="Camera Access Error"
          message={error}
          onRetry={initCamera}
        />
      </Card>
    );
  }

  return (
    <Card variant="gradient" className={className}>
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-bold text-white font-display flex items-center">
            <ApperIcon name="Camera" className="w-5 h-5 mr-2 text-primary" />
            Live Camera Feed
          </h2>
          <div className="flex items-center space-x-2">
            {detectionActive && (
              <div className="flex items-center text-accent text-sm">
                <div className="w-2 h-2 bg-accent rounded-full animate-pulse mr-2"></div>
                Detecting
              </div>
            )}
            <Button
              onClick={isRecording ? stopCamera : initCamera}
              variant={isRecording ? "danger" : "success"}
              size="sm"
              disabled={isLoading}
            >
              <ApperIcon 
                name={isRecording ? "CameraOff" : "Camera"} 
                className="w-4 h-4 mr-2" 
              />
              {isLoading ? "Starting..." : isRecording ? "Stop" : "Start"}
            </Button>
          </div>
        </div>

        <div className="relative bg-black rounded-lg overflow-hidden">
          {isLoading ? (
            <div className="aspect-video flex items-center justify-center">
              <Loading message="Initializing camera..." />
            </div>
          ) : (
            <>
              <video
                ref={videoRef}
                autoPlay
                playsInline
                muted
                className="w-full aspect-video object-cover"
                style={{ transform: "scaleX(-1)" }} // Mirror effect
              />
              <canvas
                ref={canvasRef}
                width={640}
                height={480}
                className="absolute top-0 left-0 w-full h-full"
                style={{ transform: "scaleX(-1)" }} // Mirror effect
              />
            </>
          )}
          
          {!isRecording && !isLoading && (
            <div className="absolute inset-0 flex items-center justify-center bg-black/50">
              <div className="text-center text-white">
                <ApperIcon name="Camera" className="w-16 h-16 mx-auto mb-4 text-gray-400" />
                <p className="text-lg font-medium mb-2">Camera is stopped</p>
                <p className="text-sm text-gray-400">Click Start to begin gesture detection</p>
              </div>
            </div>
          )}
        </div>

        {currentGesture && settings.showConfidence && (
          <div className="bg-surface/50 rounded-lg p-3">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-white">
                Current: {currentGesture.name}
              </span>
              <span className="text-sm font-bold text-accent">
                {Math.round(currentGesture.confidence * 100)}%
              </span>
            </div>
          </div>
        )}
      </div>
    </Card>
  );
};

export default WebcamViewer;