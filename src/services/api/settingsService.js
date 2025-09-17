class SettingsService {
  constructor() {
    this.apperClient = null;
    this.tableName = 'settings_c';
    this.settingsId = 1; // Assuming single settings record
    this.initializeClient();
  }

  initializeClient() {
    const { ApperClient } = window.ApperSDK;
    this.apperClient = new ApperClient({
      apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
      apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
    });
  }

  async getSettings() {
    try {
      const params = {
        fields: [
          { field: { Name: "id_c" } },
          { field: { Name: "detection_threshold_c" } },
          { field: { Name: "show_skeleton_c" } },
          { field: { Name: "show_confidence_c" } },
          { field: { Name: "camera_id_c" } },
          { field: { Name: "detection_frame_rate_c" } },
          { field: { Name: "min_hand_size_c" } },
          { field: { Name: "max_hands_c" } },
          { field: { Name: "smoothing_factor_c" } },
          { field: { Name: "enable_history_c" } },
          { field: { Name: "history_size_c" } },
          { field: { Name: "confidence_colors_c" } }
        ]
      };
      
      const response = await this.apperClient.getRecordById(this.tableName, this.settingsId, params);
      
      if (!response.success) {
        // If no settings record exists, create default one
        return await this.createDefaultSettings();
      }
      
      const data = response.data;
      return {
        Id: data.Id,
        detection_threshold_c: data.detection_threshold_c || 0.7,
        show_skeleton_c: data.show_skeleton_c !== false,
        show_confidence_c: data.show_confidence_c !== false,
        camera_id_c: data.camera_id_c || "default",
        detection_frame_rate_c: data.detection_frame_rate_c || 30,
        min_hand_size_c: data.min_hand_size_c || 0.1,
        max_hands_c: data.max_hands_c || 2,
        smoothing_factor_c: data.smoothing_factor_c || 0.5,
        enable_history_c: data.enable_history_c !== false,
        history_size_c: data.history_size_c || 10,
        confidence_colors_c: data.confidence_colors_c ? JSON.parse(data.confidence_colors_c) : {
          high: "#10B981",
          medium: "#F59E0B",
          low: "#EF4444"
        },
        // Legacy field mappings for backward compatibility
        detectionThreshold: data.detection_threshold_c || 0.7,
        showSkeleton: data.show_skeleton_c !== false,
        showConfidence: data.show_confidence_c !== false,
        cameraId: data.camera_id_c || "default",
        detectionFrameRate: data.detection_frame_rate_c || 30,
        minHandSize: data.min_hand_size_c || 0.1,
        maxHands: data.max_hands_c || 2,
        smoothingFactor: data.smoothing_factor_c || 0.5,
        enableHistory: data.enable_history_c !== false,
        historySize: data.history_size_c || 10,
        confidenceColors: data.confidence_colors_c ? JSON.parse(data.confidence_colors_c) : {
          high: "#10B981",
          medium: "#F59E0B",
          low: "#EF4444"
        }
      };
    } catch (error) {
      console.error("Error fetching settings:", error);
      return await this.createDefaultSettings();
    }
  }

  async createDefaultSettings() {
    try {
      const defaultSettings = {
        id_c: this.settingsId,
        detection_threshold_c: 0.7,
        show_skeleton_c: true,
        show_confidence_c: true,
        camera_id_c: "default",
        detection_frame_rate_c: 30,
        min_hand_size_c: 0.1,
        max_hands_c: 2,
        smoothing_factor_c: 0.5,
        enable_history_c: true,
        history_size_c: 10,
        confidence_colors_c: JSON.stringify({
          high: "#10B981",
          medium: "#F59E0B",
          low: "#EF4444"
        })
      };

      const params = {
        records: [defaultSettings]
      };
      
      const response = await this.apperClient.createRecord(this.tableName, params);
      
      if (!response.success) {
        console.error("Failed to create default settings:", response.message);
        return this.getDefaultSettingsObject();
      }
      
      return await this.getSettings();
    } catch (error) {
      console.error("Error creating default settings:", error);
      return this.getDefaultSettingsObject();
    }
  }

  getDefaultSettingsObject() {
    return {
      Id: this.settingsId,
      detection_threshold_c: 0.7,
      show_skeleton_c: true,
      show_confidence_c: true,
      camera_id_c: "default",
      detection_frame_rate_c: 30,
      min_hand_size_c: 0.1,
      max_hands_c: 2,
      smoothing_factor_c: 0.5,
      enable_history_c: true,
      history_size_c: 10,
      confidence_colors_c: {
        high: "#10B981",
        medium: "#F59E0B",
        low: "#EF4444"
      },
      // Legacy mappings
      detectionThreshold: 0.7,
      showSkeleton: true,
      showConfidence: true,
      cameraId: "default",
      detectionFrameRate: 30,
      minHandSize: 0.1,
      maxHands: 2,
      smoothingFactor: 0.5,
      enableHistory: true,
      historySize: 10,
      confidenceColors: {
        high: "#10B981",
        medium: "#F59E0B",
        low: "#EF4444"
      }
    };
  }

  async updateSettings(newSettings) {
    try {
      // Convert legacy field names to database field names
      const dbSettings = {};
      
      if (newSettings.detectionThreshold !== undefined) dbSettings.detection_threshold_c = newSettings.detectionThreshold;
      if (newSettings.showSkeleton !== undefined) dbSettings.show_skeleton_c = newSettings.showSkeleton;
      if (newSettings.showConfidence !== undefined) dbSettings.show_confidence_c = newSettings.showConfidence;
      if (newSettings.cameraId !== undefined) dbSettings.camera_id_c = newSettings.cameraId;
      if (newSettings.detectionFrameRate !== undefined) dbSettings.detection_frame_rate_c = newSettings.detectionFrameRate;
      if (newSettings.minHandSize !== undefined) dbSettings.min_hand_size_c = newSettings.minHandSize;
      if (newSettings.maxHands !== undefined) dbSettings.max_hands_c = newSettings.maxHands;
      if (newSettings.smoothingFactor !== undefined) dbSettings.smoothing_factor_c = newSettings.smoothingFactor;
      if (newSettings.enableHistory !== undefined) dbSettings.enable_history_c = newSettings.enableHistory;
      if (newSettings.historySize !== undefined) dbSettings.history_size_c = newSettings.historySize;
      if (newSettings.confidenceColors !== undefined) dbSettings.confidence_colors_c = JSON.stringify(newSettings.confidenceColors);

      // Also handle direct database field names
      Object.keys(newSettings).forEach(key => {
        if (key.endsWith('_c')) {
          dbSettings[key] = newSettings[key];
        }
      });

      const params = {
        records: [{
          Id: this.settingsId,
          ...dbSettings
        }]
      };
      
      const response = await this.apperClient.updateRecord(this.tableName, params);
      
      if (!response.success) {
        console.error("Failed to update settings:", response.message);
        throw new Error(response.message);
      }
      
      return await this.getSettings();
    } catch (error) {
      console.error("Error updating settings:", error);
      throw error;
    }
  }

  async resetToDefaults() {
    const defaultSettings = {
      detectionThreshold: 0.7,
      showSkeleton: true,
      showConfidence: true,
      cameraId: "default",
      detectionFrameRate: 30,
      minHandSize: 0.1,
      maxHands: 2,
      smoothingFactor: 0.5,
      enableHistory: true,
      historySize: 10,
      confidenceColors: {
        high: "#10B981",
        medium: "#F59E0B",
        low: "#EF4444"
      }
    };
    
    return await this.updateSettings(defaultSettings);
  }

  async updateDetectionThreshold(threshold) {
    const settings = await this.updateSettings({
      detectionThreshold: Math.max(0.1, Math.min(1.0, threshold))
    });
    return settings.detectionThreshold;
  }

  async toggleSkeleton() {
    const currentSettings = await this.getSettings();
    const settings = await this.updateSettings({
      showSkeleton: !currentSettings.showSkeleton
    });
    return settings.showSkeleton;
  }

  async toggleConfidence() {
    const currentSettings = await this.getSettings();
    const settings = await this.updateSettings({
      showConfidence: !currentSettings.showConfidence
    });
    return settings.showConfidence;
  }

  async updateCameraId(cameraId) {
    const settings = await this.updateSettings({ cameraId });
    return settings.cameraId;
  }
}

export default new SettingsService();
export default new SettingsService();