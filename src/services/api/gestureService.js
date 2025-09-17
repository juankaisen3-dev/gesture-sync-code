class GestureService {
  constructor() {
    this.apperClient = null;
    this.tableName = 'gesture_c';
    this.historyTableName = 'recognition_history_c';
    this.initializeClient();
  }

  initializeClient() {
    const { ApperClient } = window.ApperSDK;
    this.apperClient = new ApperClient({
      apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
      apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
    });
  }

  async getAll() {
    try {
      const params = {
        fields: [
          { field: { Name: "id_c" } },
          { field: { Name: "name_c" } },
          { field: { Name: "description_c" } },
          { field: { Name: "confidence_c" } },
          { field: { Name: "category_c" } },
          { field: { Name: "landmarks_c" } }
        ]
      };
      
      const response = await this.apperClient.fetchRecords(this.tableName, params);
      
      if (!response.success) {
        console.error(response.message);
        return [];
      }
      
      return response.data || [];
    } catch (error) {
      console.error("Error fetching gestures:", error);
      return [];
    }
  }

  async getById(id) {
    try {
      const params = {
        fields: [
          { field: { Name: "id_c" } },
          { field: { Name: "name_c" } },
          { field: { Name: "description_c" } },
          { field: { Name: "confidence_c" } },
          { field: { Name: "category_c" } },
          { field: { Name: "landmarks_c" } }
        ]
      };
      
      const response = await this.apperClient.getRecordById(this.tableName, parseInt(id), params);
      
      if (!response.success) {
        console.error(response.message);
        return null;
      }
      
      return response.data;
    } catch (error) {
      console.error("Error fetching gesture by ID:", error);
      return null;
    }
  }

  async recognizeGesture(landmarks, boundingBox) {
    try {
      // Get available gestures first
      const gestures = await this.getAll();
      if (gestures.length === 0) {
        throw new Error("No gestures available for recognition");
      }
      
      // Simulate recognition logic
      const randomGesture = gestures[Math.floor(Math.random() * gestures.length)];
      const confidence = Math.random() * 0.4 + 0.6; // 0.6 to 1.0
      
      const recognitionData = {
        id_c: `recognition_${Date.now()}`,
        name_c: randomGesture.name_c,
        confidence_c: parseFloat(confidence.toFixed(2)),
        timestamp_c: new Date().toISOString(),
        landmarks_c: JSON.stringify(landmarks || []),
        bounding_box_c: JSON.stringify(boundingBox || null),
        category_c: randomGesture.category_c
      };

      // Store in recognition history
      const historyParams = {
        records: [recognitionData]
      };
      
      const historyResponse = await this.apperClient.createRecord(this.historyTableName, historyParams);
      
      if (!historyResponse.success) {
        console.error("Failed to save recognition history:", historyResponse.message);
      }
      
      return {
        id: recognitionData.id_c,
        name: recognitionData.name_c,
        confidence: recognitionData.confidence_c,
        timestamp: new Date(recognitionData.timestamp_c),
        landmarks: JSON.parse(recognitionData.landmarks_c),
        boundingBox: JSON.parse(recognitionData.bounding_box_c),
        category: recognitionData.category_c
      };
    } catch (error) {
      console.error("Error recognizing gesture:", error);
      return null;
    }
  }

  async getRecognitionHistory(limit = 10) {
    try {
      const params = {
        fields: [
          { field: { Name: "id_c" } },
          { field: { Name: "name_c" } },
          { field: { Name: "confidence_c" } },
          { field: { Name: "timestamp_c" } },
          { field: { Name: "landmarks_c" } },
          { field: { Name: "bounding_box_c" } },
          { field: { Name: "category_c" } }
        ],
        orderBy: [
          { fieldName: "timestamp_c", sorttype: "DESC" }
        ],
        pagingInfo: {
          limit: limit,
          offset: 0
        }
      };
      
      const response = await this.apperClient.fetchRecords(this.historyTableName, params);
      
      if (!response.success) {
        console.error(response.message);
        return [];
      }
      
      return (response.data || []).map(record => ({
        id: record.id_c,
        name: record.name_c,
        confidence: record.confidence_c,
        timestamp: new Date(record.timestamp_c),
        landmarks: record.landmarks_c ? JSON.parse(record.landmarks_c) : [],
        boundingBox: record.bounding_box_c ? JSON.parse(record.bounding_box_c) : null,
        category: record.category_c
      }));
    } catch (error) {
      console.error("Error fetching recognition history:", error);
      return [];
    }
  }

  async clearHistory() {
    try {
      // Get all history records first
      const historyRecords = await this.getRecognitionHistory(1000); // Get a large number
      
      if (historyRecords.length === 0) {
        return true;
      }
      
      const recordIds = historyRecords.map(record => record.id);
      const params = {
        RecordIds: recordIds
      };
      
      const response = await this.apperClient.deleteRecord(this.historyTableName, params);
      
      if (!response.success) {
        console.error("Failed to clear history:", response.message);
        return false;
      }
      
      return true;
    } catch (error) {
      console.error("Error clearing history:", error);
      return false;
    }
  }

  async getGesturesByCategory(category) {
    try {
      const params = {
        fields: [
          { field: { Name: "id_c" } },
          { field: { Name: "name_c" } },
          { field: { Name: "description_c" } },
          { field: { Name: "confidence_c" } },
          { field: { Name: "category_c" } },
          { field: { Name: "landmarks_c" } }
        ],
        where: [
          {
            FieldName: "category_c",
            Operator: "EqualTo",
            Values: [category]
          }
        ]
      };
      
      const response = await this.apperClient.fetchRecords(this.tableName, params);
      
      if (!response.success) {
        console.error(response.message);
        return [];
      }
      
      return response.data || [];
    } catch (error) {
      console.error("Error fetching gestures by category:", error);
      return [];
    }
  }

  // Simulate hand landmark detection (utility method)
  async detectHandLandmarks(imageData) {
    // This remains a simulation for UI demonstration
    const landmarks = [];
    for (let i = 0; i < 21; i++) {
      landmarks.push({
        x: Math.random() * 640,
        y: Math.random() * 480,
        z: Math.random() * 0.1 - 0.05,
        visibility: Math.random() * 0.3 + 0.7
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
      isDetected: Math.random() > 0.2
    };
  }
}

export default new GestureService();