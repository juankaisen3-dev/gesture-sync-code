import settingsData from "@/services/mockData/settings.json";

// Simulate network delay
const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

class SettingsService {
  constructor() {
    this.settings = { ...settingsData };
  }

  async getSettings() {
    await delay(200);
    return { ...this.settings };
  }

  async updateSettings(newSettings) {
    await delay(300);
    this.settings = { ...this.settings, ...newSettings };
    return { ...this.settings };
  }

  async resetToDefaults() {
    await delay(250);
    this.settings = { ...settingsData };
    return { ...this.settings };
  }

  async updateDetectionThreshold(threshold) {
    await delay(150);
    this.settings.detectionThreshold = Math.max(0.1, Math.min(1.0, threshold));
    return this.settings.detectionThreshold;
  }

  async toggleSkeleton() {
    await delay(100);
    this.settings.showSkeleton = !this.settings.showSkeleton;
    return this.settings.showSkeleton;
  }

  async toggleConfidence() {
    await delay(100);
    this.settings.showConfidence = !this.settings.showConfidence;
    return this.settings.showConfidence;
  }

  async updateCameraId(cameraId) {
    await delay(200);
    this.settings.cameraId = cameraId;
    return this.settings.cameraId;
  }
}

export default new SettingsService();