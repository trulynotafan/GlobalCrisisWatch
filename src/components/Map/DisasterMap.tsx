import React, { useEffect, useState } from 'react';
import { Alert, DisasterPrediction } from '@/types';
import LoadingSpinner from '@/components/Common/LoadingSpinner';
import dynamic from 'next/dynamic';

// Dynamically import Leaflet components
const MapContainer = dynamic(
  () => import('react-leaflet').then((mod) => mod.MapContainer),
  { ssr: false }
);

const TileLayer = dynamic(
  () => import('react-leaflet').then((mod) => mod.TileLayer),
  { ssr: false }
);

const Marker = dynamic(
  () => import('react-leaflet').then((mod) => mod.Marker),
  { ssr: false }
);

const Popup = dynamic(
  () => import('react-leaflet').then((mod) => mod.Popup),
  { ssr: false }
);

const Circle = dynamic(
  () => import('react-leaflet').then((mod) => mod.Circle),
  { ssr: false }
);

interface DisasterMapProps {
  alerts?: Alert[];
  predictions?: DisasterPrediction[];
  onAlertClick?: (alert: Alert) => void;
  onPredictionClick?: (prediction: DisasterPrediction) => void;
}

const DisasterMap: React.FC<DisasterMapProps> = ({
  alerts = [],
  predictions = [],
  onAlertClick,
  onPredictionClick
}) => {
  const [isClient, setIsClient] = useState(false);
  const [mapCenter, setMapCenter] = useState<[number, number]>([0, 0]);
  const [userLocation, setUserLocation] = useState<[number, number] | null>(null);
  const [L, setL] = useState<any>(null);

  useEffect(() => {
    setIsClient(true);
    // Import Leaflet on client side
    import('leaflet').then((leaflet) => {
      setL(leaflet.default);
      // Fix the default icon issue
      delete (leaflet.default.Icon.Default.prototype as any)._getIconUrl;
      leaflet.default.Icon.Default.mergeOptions({
        iconUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png',
        iconRetinaUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon-2x.png',
        shadowUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png',
      });
    });

    // Get user's location
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        setUserLocation([latitude, longitude]);
        setMapCenter([latitude, longitude]);
      },
      () => {
        // Default to New York if geolocation fails
        setMapCenter([40.7128, -74.0060]);
      }
    );
  }, []);

  if (!isClient || !L) {
    return (
      <div className="w-full h-[700px] bg-dark-secondary rounded-lg flex items-center justify-center">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  // Custom icons for different types of alerts
  const createIcon = (color: string) => new L.Icon({
    iconUrl: `https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-${color}.png`,
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
    shadowSize: [41, 41]
  });

  const alertIcon = {
    warning: createIcon('yellow'),
    danger: createIcon('red'),
    info: createIcon('blue'),
    success: createIcon('green')
  };

  const getSeverityColor = (severity: number) => {
    const colors = {
      1: '#4CAF50',
      2: '#8BC34A',
      3: '#FFC107',
      4: '#FF9800',
      5: '#F44336'
    };
    return colors[severity as keyof typeof colors];
  };

  return (
    <>
      <link
        rel="stylesheet"
        href="https://unpkg.com/leaflet@1.7.1/dist/leaflet.css"
        integrity="sha512-xodZBNTC5n17Xt2atTPuE1HxjVMSvLVW9ocqUKLsCC5CXdbqCmblAshOMAS6/keqq/sMZMZ19scR4PsZChSR7A=="
        crossOrigin=""
      />
      <MapContainer
        center={mapCenter}
        zoom={13}
        className="w-full h-[700px] rounded-lg"
      >
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        />

        {/* Active Alerts */}
        {alerts.map((alert) => (
          <Marker
            key={alert.id}
            position={[alert.location?.lat || 0, alert.location?.lng || 0]}
            icon={alertIcon[alert.type]}
            eventHandlers={{
              click: () => onAlertClick?.(alert)
            }}
          >
            <Popup>
              <div className="p-2">
                <h3 className="font-bold">{alert.title}</h3>
                <p className="text-sm">{alert.message}</p>
                <p className="text-xs text-gray-500 mt-1">
                  Severity: {alert.severity} | Status: {alert.status}
                </p>
              </div>
            </Popup>
          </Marker>
        ))}

        {/* Disaster Predictions */}
        {predictions.map((prediction) => (
          <Circle
            key={prediction.id}
            center={[prediction.location.lat, prediction.location.lng]}
            radius={prediction.probability * 1000}
            pathOptions={{
              color: getSeverityColor(prediction.estimatedImpact.severity),
              fillColor: getSeverityColor(prediction.estimatedImpact.severity),
              fillOpacity: 0.3
            }}
            eventHandlers={{
              click: () => onPredictionClick?.(prediction)
            }}
          >
            <Popup>
              <div className="p-2">
                <h3 className="font-bold">{prediction.type}</h3>
                <p className="text-sm">Probability: {(prediction.probability * 100).toFixed(1)}%</p>
                <p className="text-sm">People at risk: {prediction.estimatedImpact.peopleAtRisk.toLocaleString()}</p>
                <p className="text-xs text-gray-500 mt-1">
                  Severity: {prediction.estimatedImpact.severity}
                </p>
              </div>
            </Popup>
          </Circle>
        ))}

        {/* User Location */}
        {userLocation && (
          <Marker position={userLocation} icon={createIcon('blue')}>
            <Popup>Your Location</Popup>
          </Marker>
        )}
      </MapContainer>
    </>
  );
};

export default DisasterMap; 