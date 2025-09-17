import gesturesData from "@/services/mockData/gestures.json";

// Simulate network delay
const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

class GestureService {
  constructor() {
    this.gestures = [...gesturesData];
    this.recognitionHistory = [];
  }

  async getAll() {
    await delay(300);
    return [...this.gestures];
  }

  async getById(id) {
    await delay(200);
    const gesture = this.gestures.find(g => g.Id === parseInt(id));
    return gesture ? { ...gesture } : null;
  }

  async recognizeGesture(landmarks, boundingBox) {
    await delay(100);
    
    // Simulate gesture recognition logic
    const availableGestures = [...this.gestures];
    const randomGesture = availableGestures[Math.floor(Math.random() * availableGestures.length)];
    
    // Generate realistic confidence score
    const confidence = Math.random() * 0.4 + 0.6; // 0.6 to 1.0
    
    const recognition = {
      id: `recognition_${Date.now()}`,
      name: randomGesture.name,
      confidence: parseFloat(confidence.toFixed(2)),
      timestamp: new Date(),
      landmarks: landmarks || [],
      boundingBox: boundingBox || null,
      category: randomGesture.category
    };

    // Add to history
    this.addToHistory(recognition);
    
    return recognition;
  }

  async getRecognitionHistory(limit = 10) {
    await delay(150);
    return this.recognitionHistory.slice(0, limit);
  }

  addToHistory(recognition) {
    this.recognitionHistory.unshift(recognition);
    if (this.recognitionHistory.length > 20) {
      this.recognitionHistory = this.recognitionHistory.slice(0, 20);
    }
  }

  async clearHistory() {
    await delay(100);
    this.recognitionHistory = [];
    return true;
  }

  async getGesturesByCategory(category) {
    await delay(250);
    return this.gestures.filter(g => g.category === category);
  }

  // Simulate hand landmark detection
  async detectHandLandmarks(imageData) {
    await delay(50);
    
    // Generate mock hand landmarks (21 points for MediaPipe hand model)
    const landmarks = [];
    for (let i = 0; i < 21; i++) {
      landmarks.push({
        x: Math.random() * 640, // Random x coordinate
        y: Math.random() * 480, // Random y coordinate
        z: Math.random() * 0.1 - 0.05, // Small z depth
        visibility: Math.random() * 0.3 + 0.7 // High visibility
      });
    }

    const boundingBox = {
      x: Math.random() * 200 + 100,
      y: Math.random() * 150 + 75,
      width: Math.random() * 200 + 150,
      height: Math.random() * 200 + 150
    };

    return {
      landmarks,
      boundingBox,
      isDetected: Math.random() > 0.2 // 80% chance of detection
    };
  }
}

export default new GestureService();