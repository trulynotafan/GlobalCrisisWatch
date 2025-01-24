import React, { useEffect, useState } from 'react';
import L from 'leaflet';
import 'leaflet.markercluster';
import { useMap } from 'react-leaflet';
import styles from '../DisasterMap/DisasterMap.module.css';

interface ClusterProps {
  children: React.ReactElement[];
  maxClusterRadius?: number;
}

const CustomMarkerCluster: React.FC<ClusterProps> = ({ 
  children, 
  maxClusterRadius = 80 
}) => {
  const map = useMap();
  const [markers] = useState(() => L.markerClusterGroup({
    maxClusterRadius,
    iconCreateFunction: (cluster) => {
      const count = cluster.getChildCount();
      return L.divIcon({
        html: `<div class="${styles.clusterMarker}">${count}</div>`,
        className: styles.customMarkerCluster,
        iconSize: L.point(40, 40)
      });
    },
    spiderfyOnMaxZoom: true,
    showCoverageOnHover: false,
    zoomToBoundsOnClick: true,
    removeOutsideVisibleBounds: true
  }));

  useEffect(() => {
    map.addLayer(markers);
    return () => {
      map.removeLayer(markers);
    };
  }, [map, markers]);

  useEffect(() => {
    markers.clearLayers();
    children.forEach(child => {
      const { position, icon } = child.props;
      if (position) {
        const marker = L.marker(position, { icon });
        markers.addLayer(marker);
      }
    });
  }, [markers, children]);

  return null;
};

export default CustomMarkerCluster; 