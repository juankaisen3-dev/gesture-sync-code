import React, { useState, useEffect } from "react";
import Card from "@/components/atoms/Card";
import Button from "@/components/atoms/Button";
import ApperIcon from "@/components/ApperIcon";
import ConfidenceMeter from "@/components/molecules/ConfidenceMeter";
import GestureCard from "@/components/molecules/GestureCard";
import Empty from "@/components/ui/Empty";
import Loading from "@/components/ui/Loading";
import Error from "@/components/ui/Error";
import gestureService from "@/services/api/gestureService";
import { toast } from "react-toastify";

const RecognitionPanel = ({
  currentGesture = null,
  settings = {},
  className = ""
}) => {
  const [history, setHistory] = useState([]);
  const [availableGestures, setAvailableGestures] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [stats, setStats] = useState({
    totalDetections: 0,
    averageConfidence: 0,
    mostCommon: null
  });

  const loadData = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const [historyData, gesturesData] = await Promise.all([
        gestureService.getRecognitionHistory(settings.historySize || 10),
        gestureService.getAll()
      ]);
      
      setHistory(historyData);
      setAvailableGestures(gesturesData);
      calculateStats(historyData);
    } catch (err) {
      console.error("Failed to load recognition data:", err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const calculateStats = (historyData) => {
    if (historyData.length === 0) {
      setStats({ totalDetections: 0, averageConfidence: 0, mostCommon: null });
      return;
    }

    const totalDetections = historyData.length;
    const averageConfidence = historyData.reduce((sum, item) => sum + item.confidence, 0) / totalDetections;
    
    // Find most common gesture
    const gestureCount = historyData.reduce((acc, item) => {
      acc[item.name] = (acc[item.name] || 0) + 1;
      return acc;
    }, {});
    
    const mostCommon = Object.keys(gestureCount).reduce((a, b) => 
      gestureCount[a] > gestureCount[b] ? a : b, null
    );

    setStats({
      totalDetections,
      averageConfidence: parseFloat(averageConfidence.toFixed(2)),
      mostCommon
    });
  };

  const handleClearHistory = async () => {
    try {
      await gestureService.clearHistory();
      setHistory([]);
      setStats({ totalDetections: 0, averageConfidence: 0, mostCommon: null });
      toast.success("History cleared successfully!");
    } catch (err) {
      console.error("Failed to clear history:", err);
      toast.error("Failed to clear history");
    }
  };

  useEffect(() => {
    loadData();
  }, [settings.historySize]);

  // Update history when new gesture is detected
  useEffect(() => {
    if (currentGesture) {
      setHistory(prevHistory => {
        const newHistory = [currentGesture, ...prevHistory.slice(0, (settings.historySize || 10) - 1)];
        calculateStats(newHistory);
        return newHistory;
      });
    }
  }, [currentGesture, settings.historySize]);

  if (loading) {
    return (
      <Card variant="gradient" className={className}>
        <Loading message="Loading recognition data..." />
      </Card>
    );
  }

  if (error) {
    return (
      <Card variant="gradient" className={className}>
        <Error
          title="Recognition Error"
          message={error}
          onRetry={loadData}
        />
      </Card>
    );
  }

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Current Recognition */}
      <Card variant="glass">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold text-white font-display flex items-center">
            <ApperIcon name="Zap" className="w-5 h-5 mr-2 text-accent" />
            Current Recognition
          </h2>
        </div>

        {currentGesture ? (
          <div className="flex items-center space-x-6">
            <ConfidenceMeter 
              confidence={currentGesture.confidence} 
              size="lg"
            />
            <div className="flex-1">
              <h3 className="text-2xl font-bold text-white mb-2 gradient-text">
                {currentGesture.name}
              </h3>
              <p className="text-gray-400 mb-3">
                {availableGestures.find(g => g.name === currentGesture.name)?.description || 
                 "Hand gesture detected"}
              </p>
              <div className="flex items-center text-sm text-gray-500">
                <ApperIcon name="Clock" className="w-4 h-4 mr-1" />
                Just detected
              </div>
            </div>
          </div>
        ) : (
          <Empty
            title="No gesture detected"
            message="Make a gesture in front of the camera to see recognition results here."
            actionLabel=""
            showLabel={false}
          />
        )}
      </Card>

      {/* Statistics */}
      <Card variant="default">
        <h3 className="text-lg font-semibold text-white mb-4 flex items-center">
          <ApperIcon name="BarChart3" className="w-5 h-5 mr-2 text-info" />
          Detection Statistics
        </h3>
        
        <div className="grid grid-cols-3 gap-4">
          <div className="text-center">
            <div className="text-2xl font-bold gradient-text">
              {stats.totalDetections}
            </div>
            <div className="text-sm text-gray-400">Total Detections</div>
          </div>
          
          <div className="text-center">
            <div className="text-2xl font-bold text-accent">
              {Math.round(stats.averageConfidence * 100)}%
            </div>
            <div className="text-sm text-gray-400">Avg. Confidence</div>
          </div>
          
          <div className="text-center">
            <div className="text-lg font-bold text-white truncate">
              {stats.mostCommon || "None"}
            </div>
            <div className="text-sm text-gray-400">Most Common</div>
          </div>
        </div>
      </Card>

      {/* History */}
      {settings.enableHistory && (
        <Card variant="default">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-white flex items-center">
              <ApperIcon name="History" className="w-5 h-5 mr-2 text-secondary" />
              Recent History ({history.length})
            </h3>
            
            {history.length > 0 && (
              <Button
                onClick={handleClearHistory}
                variant="ghost"
                size="sm"
              >
                <ApperIcon name="Trash2" className="w-4 h-4 mr-2" />
                Clear
              </Button>
            )}
          </div>

          <div className="space-y-3 max-h-[400px] overflow-y-auto">
            {history.length > 0 ? (
              history.map((gesture, index) => (
                <GestureCard
                  key={`${gesture.id || gesture.name}-${index}`}
                  gesture={gesture}
                  isActive={index === 0}
                  showTimestamp={true}
                />
              ))
            ) : (
              <Empty
                title="No history yet"
                message="Detected gestures will appear here for quick review."
                showAction={false}
              />
            )}
          </div>
        </Card>
      )}

      {/* Available Gestures */}
      <Card variant="default">
        <h3 className="text-lg font-semibold text-white mb-4 flex items-center">
          <ApperIcon name="Hand" className="w-5 h-5 mr-2 text-primary" />
          Supported Gestures
        </h3>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-h-[300px] overflow-y-auto">
          {availableGestures.map((gesture) => (
            <div 
              key={gesture.Id}
              className="flex items-center space-x-3 p-2 rounded-lg bg-surface/30 hover:bg-surface/50 transition-colors"
            >
              <div className="w-8 h-8 bg-gradient-to-br from-primary/20 to-secondary/20 rounded-full flex items-center justify-center">
                <ApperIcon name="Hand" className="w-4 h-4 text-primary" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="font-medium text-white text-sm truncate">
                  {gesture.name}
                </div>
                <div className="text-xs text-gray-400 truncate">
                  {gesture.description}
                </div>
              </div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
};

export default RecognitionPanel;