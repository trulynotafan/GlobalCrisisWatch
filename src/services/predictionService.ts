import axios from 'axios';
import { DisasterPrediction } from '@/types';

interface PredictionParams {
  latitude: number;
  longitude: number;
  timeframe: number; // in hours
  dataPoints: {
    temperature: number;
    humidity: number;
    windSpeed: number;
    rainfall: number;
    seismicActivity?: number;
    waterLevel?: number;
  }[];
}

interface RiskAssessment {
  riskLevel: 1 | 2 | 3 | 4 | 5;
  confidence: number;
  factors: string[];
}

class PredictionService {
  private readonly API_URL = process.env.NEXT_PUBLIC_ML_API_URL;

  async getPredictions(params: PredictionParams): Promise<DisasterPrediction[]> {
    try {
      const response = await axios.post(`${this.API_URL}/predict`, params);
      return response.data.predictions;
    } catch (error) {
      console.error('Failed to get predictions:', error);
      throw error;
    }
  }

  async assessRisk(location: { lat: number; lng: number }): Promise<RiskAssessment> {
    try {
      const response = await axios.post(`${this.API_URL}/assess-risk`, { location });
      return response.data.assessment;
    } catch (error) {
      console.error('Failed to assess risk:', error);
      throw error;
    }
  }

  async getHistoricalAnalysis(location: { lat: number; lng: number }): Promise<any> {
    try {
      const response = await axios.get(`${this.API_URL}/historical-analysis`, {
        params: location
      });
      return response.data;
    } catch (error) {
      console.error('Failed to get historical analysis:', error);
      throw error;
    }
  }
}

export const predictionService = new PredictionService(); 