import React, { useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import { Incident, Resource } from '@/types';
import L from 'leaflet';

interface MapProps {
  incidents?: Incident[];
  resources?: Resource[];
  onMarkerClick?: (item: Incident | Resource) => void;
}

const Map: React.FC<MapProps> = ({ incidents = [], resources = [], onMarkerClick }) => {
  useEffect(() => {
    // Fix the missing icon issue
    delete (L.Icon.Default.prototype as any)._getIconUrl;
    L.Icon.Default.mergeOptions({
      iconUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png',
      iconRetinaUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon-2x.png',
      shadowUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png',
    });
  }, []);

  // Custom icons for different types of markers
  const createIcon = (color: string) => new L.Icon({
    iconUrl: `https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-${color}.png`,
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
    shadowSize: [41, 41]
  });

  const incidentIcon = {
    high: createIcon('red'),
    medium: createIcon('orange'),
    low: createIcon('green')
  };

  const resourceIcon = createIcon('blue');

  return (
    <div className="w-full h-[700px] rounded-lg overflow-hidden">
      <MapContainer
        center={[40.7128, -74.0060]} // Default to New York
        zoom={13}
        className="w-full h-full"
      >
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        />
        
        {incidents.map((incident) => (
          <Marker
            key={incident.id}
            position={[incident.location.lat, incident.location.lng]}
            icon={incidentIcon[incident.priority]}
            eventHandlers={{
              click: () => onMarkerClick?.(incident)
            }}
          >
            <Popup>
              <div className="font-bold">{incident.title}</div>
              <div className="text-sm">{incident.description}</div>
            </Popup>
          </Marker>
        ))}

        {resources.map((resource) => (
          <Marker
            key={resource.id}
            position={[resource.location.lat, resource.location.lng]}
            icon={resourceIcon}
            eventHandlers={{
              click: () => onMarkerClick?.(resource)
            }}
          >
            <Popup>
              <div className="font-bold capitalize">{resource.type}</div>
              <div className="text-sm">Quantity: {resource.quantity}</div>
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  );
};

export default Map; 