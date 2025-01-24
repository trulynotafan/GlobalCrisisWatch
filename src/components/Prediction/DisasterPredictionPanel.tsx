import React, { useEffect, useState } from 'react';
import { predictionService } from '@/services/predictionService';
import { DisasterPrediction } from '@/types';
import { format } from 'date-fns';
import LoadingSpinner from '@/components/Common/LoadingSpinner';
import { ChartBarIcon, MapPinIcon, ClockIcon } from '@heroicons/react/24/outline';

interface DisasterPredictionPanelProps {
  location: { lat: number; lng: number };
  onPredictionSelect?: (prediction: DisasterPrediction) => void;
}

const DisasterPredictionPanel: React.FC<DisasterPredictionPanelProps> = ({
  location,
  onPredictionSelect
}) => {
  const [predictions, setPredictions] = useState<DisasterPrediction[]>([]);
  const [riskAssessment, setRiskAssessment] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        // Get weather data from external API
        const weatherData = await fetch(
          `https://api.openweathermap.org/data/2.5/forecast?lat=${location.lat}&lon=${location.lng}&appid=${process.env.NEXT_PUBLIC_WEATHER_API_KEY}`
        ).then(res => res.json());

        // Transform weather data for our prediction model
        const predictionParams = {
          latitude: location.lat,
          longitude: location.lng,
          timeframe: 72, // 3 days forecast
          dataPoints: weatherData.list.map((item: any) => ({
            temperature: item.main.temp,
            humidity: item.main.humidity,
            windSpeed: item.wind.speed,
            rainfall: item.rain?.['3h'] || 0
          }))
        };

        // Get predictions and risk assessment
        const [predictionsData, riskData] = await Promise.all([
          predictionService.getPredictions(predictionParams),
          predictionService.assessRisk(location)
        ]);

        setPredictions(predictionsData);
        setRiskAssessment(riskData);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch predictions');
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [location]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-500/20 border border-red-500/50 rounded-lg p-4 text-center">
        <p className="text-red-400">{error}</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Risk Assessment */}
      <div className="bg-dark-secondary rounded-lg p-6">
        <h3 className="text-lg font-semibold mb-4">Current Risk Assessment</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-dark-accent rounded-lg p-4">
            <div className="flex items-center space-x-2 mb-2">
              <ChartBarIcon className="h-5 w-5 text-blue-400" />
              <span className="font-medium">Risk Level</span>
            </div>
            <div className="text-2xl font-bold">
              {riskAssessment?.riskLevel}/5
            </div>
          </div>

          <div className="bg-dark-accent rounded-lg p-4">
            <div className="flex items-center space-x-2 mb-2">
              <MapPinIcon className="h-5 w-5 text-green-400" />
              <span className="font-medium">Location</span>
            </div>
            <div className="text-sm">
              {location.lat.toFixed(4)}, {location.lng.toFixed(4)}
            </div>
          </div>

          <div className="bg-dark-accent rounded-lg p-4">
            <div className="flex items-center space-x-2 mb-2">
              <ClockIcon className="h-5 w-5 text-purple-400" />
              <span className="font-medium">Updated</span>
            </div>
            <div className="text-sm">
              {format(new Date(), 'MMM dd, yyyy HH:mm')}
            </div>
          </div>
        </div>

        {riskAssessment?.factors && (
          <div className="mt-4">
            <h4 className="font-medium mb-2">Risk Factors:</h4>
            <ul className="list-disc list-inside space-y-1 text-sm text-dark-muted">
              {riskAssessment.factors.map((factor: string, index: number) => (
                <li key={index}>{factor}</li>
              ))}
            </ul>
          </div>
        )}
      </div>

      {/* Predictions List */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold">Predicted Events</h3>
        {predictions.map((prediction) => (
          <div
            key={prediction.id}
            className="bg-dark-secondary rounded-lg p-4 hover:bg-dark-accent transition cursor-pointer"
            onClick={() => onPredictionSelect?.(prediction)}
          >
            <div className="flex justify-between items-start">
              <div>
                <h4 className="font-medium">{prediction.type}</h4>
                <p className="text-sm text-dark-muted mt-1">
                  Probability: {(prediction.probability * 100).toFixed(1)}%
                </p>
              </div>
              <span className={`px-2 py-1 text-xs rounded-full ${
                prediction.estimatedImpact.severity >= 4
                  ? 'bg-red-500/20 text-red-400'
                  : prediction.estimatedImpact.severity >= 3
                  ? 'bg-yellow-500/20 text-yellow-400'
                  : 'bg-green-500/20 text-green-400'
              }`}>
                Severity {prediction.estimatedImpact.severity}/5
              </span>
            </div>

            <div className="mt-4 grid grid-cols-2 gap-4 text-sm text-dark-muted">
              <div>
                <span className="block font-medium text-dark-text">Time Frame</span>
                <span>{format(new Date(prediction.timeframe.start), 'MMM dd HH:mm')}</span>
                <span className="mx-2">-</span>
                <span>{format(new Date(prediction.timeframe.end), 'MMM dd HH:mm')}</span>
              </div>
              <div>
                <span className="block font-medium text-dark-text">People at Risk</span>
                <span>{prediction.estimatedImpact.peopleAtRisk.toLocaleString()}</span>
              </div>
            </div>

            {prediction.estimatedImpact.infrastructureAtRisk.length > 0 && (
              <div className="mt-2 text-sm">
                <span className="font-medium text-dark-text">Infrastructure at Risk:</span>
                <div className="flex flex-wrap gap-2 mt-1">
                  {prediction.estimatedImpact.infrastructureAtRisk.map((item, index) => (
                    <span
                      key={index}
                      className="px-2 py-1 bg-dark-accent rounded-full text-xs"
                    >
                      {item}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default DisasterPredictionPanel; 