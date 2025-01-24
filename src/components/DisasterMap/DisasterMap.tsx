import React, { useMemo } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import 'leaflet.markercluster/dist/MarkerCluster.css';
import styles from './DisasterMap.module.css';
import CustomMarkerCluster from '@/components/Map/CustomMarkerCluster';
import { format } from 'date-fns';

// Dark mode map style
const DARK_MAP_STYLE = 'https://tiles.stadiamaps.com/tiles/alidade_smooth_dark/{z}/{x}/{y}{r}.png';

// Custom popup style
const customPopupStyle = {
  className: 'dark-theme-popup'
};

// Create emoji markers for different event types
const createEmojiIcon = (emoji: string) => {
  return L.divIcon({
    html: `<span style="font-size: 24px;">${emoji}</span>`,
    className: styles.emojiMarker,
    iconSize: [32, 32],
    iconAnchor: [16, 16],
    popupAnchor: [0, -16]
  });
};

const eventIcons = {
  Earthquake: createEmojiIcon('🌋'),
  Wildfire: createEmojiIcon('🔥'),
  Flood: createEmojiIcon('🌊'),
  Storm: createEmojiIcon('🌪️'),
  Volcano: createEmojiIcon('🗻'),
  Drought: createEmojiIcon('☀️'),
  Conflict: createEmojiIcon('⚔️'),
  Disease: createEmojiIcon('🦠'),
  'News Report': createEmojiIcon('📰'),
  default: createEmojiIcon('⚠️')
};

interface DisasterEvent {
  type: string;
  location: string;
  coordinates?: [number, number];
  severity?: string;
  source: string;
  timestamp?: string;
  description?: string;
}

interface DisasterMapProps {
  events: Array<DisasterEvent>;
  onMarkerClick?: (event: DisasterEvent) => void;
}

const DisasterMap: React.FC<DisasterMapProps> = ({ events, onMarkerClick }) => {
  const mappableEvents = useMemo(() => 
    events
      .filter(event => event.coordinates)
      .slice(0, 1000),
    [events]
  );

  const getIcon = (type: string) => {
    if (type.includes('Earthquake')) return eventIcons.Earthquake;
    if (type.includes('Fire')) return eventIcons.Wildfire;
    if (type.includes('Flood')) return eventIcons.Flood;
    if (type.includes('Storm')) return eventIcons.Storm;
    if (type.includes('Volcano')) return eventIcons.Volcano;
    if (type.includes('Drought')) return eventIcons.Drought;
    if (type.includes('Conflict')) return eventIcons.Conflict;
    if (type.includes('Disease')) return eventIcons.Disease;
    if (type.includes('News')) return eventIcons['News Report'];
    return eventIcons.default;
  };

  const getEventDescription = (event: DisasterEvent) => {
    switch (event.type) {
      case 'Earthquake':
        return `A ${event.severity} earthquake occurred near ${event.location}`;
      case 'News Report':
        return event.severity || 'News report about disaster situation';
      default:
        return `${event.type} incident reported at ${event.location}`;
    }
  };

  const formatDate = (timestamp: string) => {
    try {
      return format(new Date(timestamp), 'PPp');
    } catch {
      return timestamp;
    }
  };

  return (
    <MapContainer
      center={[20, 0]}
      zoom={2}
      className={styles.mapContainer}
      preferCanvas={true}
      zoomControl={false}
    >
      <TileLayer
        url={DARK_MAP_STYLE}
        attribution='&copy; <a href="https://stadiamaps.com/">Stadia Maps</a>, &copy; <a href="https://openmaptiles.org/">OpenMapTiles</a> &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors'
        maxZoom={20}
      />
      <div className={styles.zoomControl}>
        <div className="leaflet-control-zoom leaflet-bar leaflet-control">
          <a className="leaflet-control-zoom-in" href="#" title="Zoom in" role="button" aria-label="Zoom in">+</a>
          <a className="leaflet-control-zoom-out" href="#" title="Zoom out" role="button" aria-label="Zoom out">−</a>
        </div>
      </div>
      <CustomMarkerCluster maxClusterRadius={50}>
        {mappableEvents.map((event, index) => (
          <Marker
            key={event.timestamp || index}
            position={event.coordinates!}
            icon={getIcon(event.type)}
            eventHandlers={{
              click: () => onMarkerClick && onMarkerClick(event)
            }}
          >
            <Popup
              {...customPopupStyle}
            >
              <div className="text-dark p-2 max-w-sm">
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-2xl">{getIcon(event.type).options.html}</span>
                  <span className="font-bold text-lg">{event.type}</span>
                </div>
                
                <div className="mb-3 font-medium">{event.location}</div>
                
                {event.severity && (
                  <div className="mb-2 text-red-600 font-medium">
                    {event.severity}
                  </div>
                )}
                
                <div className="text-gray-600 mb-3 text-sm">
                  {getEventDescription(event)}
                </div>
                
                {event.timestamp && (
                  <div className="text-sm text-gray-500 mb-2">
                    {formatDate(event.timestamp)}
                  </div>
                )}
                
                <div className="flex justify-between items-center mt-3 pt-2 border-t border-gray-200">
                  <span className="text-xs text-gray-500">
                    Source: {event.source}
                  </span>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onMarkerClick && onMarkerClick(event);
                    }}
                    className="text-xs bg-blue-500 text-white px-2 py-1 rounded hover:bg-blue-600 transition"
                  >
                    View Details
                  </button>
                </div>
              </div>
            </Popup>
          </Marker>
        ))}
      </CustomMarkerCluster>
    </MapContainer>
  );
};

export default DisasterMap; 