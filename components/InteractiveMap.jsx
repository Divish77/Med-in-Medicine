'use client';

import React, { useEffect, useRef } from 'react';
import 'leaflet/dist/leaflet.css';

export const InteractiveMap = ({
  center = [28.6315, 77.2167],
  zoom = 14,
  pharmacyPos = [28.6315, 77.2167],
  deliveryPos = [28.6139, 77.2090],
  riderPos = null,
  isDraggable = false,
  onPinDrag = null,
  height = '320px'
}) => {
  const mapContainerRef = useRef(null);
  const mapInstanceRef = useRef(null);
  const markersRef = useRef([]);
  const polylineRef = useRef(null);

  useEffect(() => {
    let isMounted = true;
    const container = mapContainerRef.current;
    if (!container || typeof window === 'undefined') return;

    import('leaflet').then((L) => {
      if (!isMounted || !mapContainerRef.current) return;

      delete L.Icon.Default.prototype._getIconUrl;
      L.Icon.Default.mergeOptions({
        iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
        iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
        shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png'
      });

      // Reset leaflet_id if it was stale
      if (container._leaflet_id && !mapInstanceRef.current) {
        container._leaflet_id = null;
      }

      if (!mapInstanceRef.current) {
        try {
          const map = L.map(container, {
            center: center,
            zoom: zoom,
            zoomControl: true,
            attributionControl: false
          });

          L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            maxZoom: 19
          }).addTo(map);

          mapInstanceRef.current = map;
        } catch (e) {
          console.warn('Leaflet map init warning:', e);
          if (container._leaflet_id) {
            container._leaflet_id = null;
          }
          return;
        }
      }

      const map = mapInstanceRef.current;
      if (!map) return;
      try {
        map.setView(center, zoom);
      } catch {}

      markersRef.current.forEach((m) => {
        try { map.removeLayer(m); } catch {}
      });
      markersRef.current = [];
      if (polylineRef.current) {
        try { map.removeLayer(polylineRef.current); } catch {}
        polylineRef.current = null;
      }

      if (pharmacyPos) {
        const pharmacyIcon = L.divIcon({
          className: 'custom-pharmacy-icon',
          html: `<div style="background: #059669; color: white; width: 34px; height: 34px; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-weight: bold; border: 3px solid white; box-shadow: 0 4px 10px rgba(0,0,0,0.3); font-size: 16px;">🏥</div>`,
          iconSize: [34, 34],
          iconAnchor: [17, 17]
        });

        const pharmMarker = L.marker(pharmacyPos, { icon: pharmacyIcon })
          .addTo(map)
          .bindPopup('<b>Nearby Partner Pharmacy</b><br>Stock allocated & verified.');
        markersRef.current.push(pharmMarker);
      }

      if (deliveryPos) {
        const homeIcon = L.divIcon({
          className: 'custom-home-icon',
          html: `<div style="background: #ef4444; color: white; width: 34px; height: 34px; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-weight: bold; border: 3px solid white; box-shadow: 0 4px 10px rgba(0,0,0,0.3); font-size: 16px;">📍</div>`,
          iconSize: [34, 34],
          iconAnchor: [17, 34]
        });

        const delMarker = L.marker(deliveryPos, {
          icon: homeIcon,
          draggable: isDraggable
        }).addTo(map).bindPopup('<b>Your Delivery Location</b>');

        if (isDraggable && onPinDrag) {
          delMarker.on('dragend', (e) => {
            const latlng = e.target.getLatLng();
            onPinDrag(latlng.lat, latlng.lng);
          });
        }

        markersRef.current.push(delMarker);
      }

      if (riderPos) {
        const riderIcon = L.divIcon({
          className: 'custom-rider-icon',
          html: `<div style="background: #0284c7; color: white; width: 38px; height: 38px; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 20px; border: 3px solid white; box-shadow: 0 4px 12px rgba(2, 132, 199, 0.5); animation: pulse-express 1.5s infinite;">🛵</div>`,
          iconSize: [38, 38],
          iconAnchor: [19, 19]
        });

        const riderMarker = L.marker(riderPos, { icon: riderIcon })
          .addTo(map)
          .bindPopup('<b>Delivery Partner</b><br>Speed: 28 km/h • On the way!');
        markersRef.current.push(riderMarker);
      }

      const points = [];
      if (riderPos) {
        points.push(riderPos);
        if (deliveryPos) points.push(deliveryPos);
      } else if (pharmacyPos && deliveryPos) {
        points.push(pharmacyPos);
        points.push(deliveryPos);
      }

      if (points.length >= 2) {
        const polyline = L.polyline(points, {
          color: '#059669',
          weight: 4,
          opacity: 0.8,
          dashArray: '8, 8'
        }).addTo(map);
        polylineRef.current = polyline;

        try {
          const bounds = L.latLngBounds(points);
          map.fitBounds(bounds, { padding: [40, 40] });
        } catch {}
      }
    }).catch((e) => console.warn('Leaflet load failed:', e));

    return () => {
      isMounted = false;
    };
  }, [center, zoom, pharmacyPos, deliveryPos, riderPos, isDraggable, onPinDrag]);

  useEffect(() => {
    return () => {
      if (mapInstanceRef.current) {
        try { mapInstanceRef.current.remove(); } catch {}
        mapInstanceRef.current = null;
      }
    };
  }, []);

  return (
    <div style={{ width: '100%', height, position: 'relative', borderRadius: '12px', overflow: 'hidden', border: '1px solid #e2e8f0' }}>
      <div ref={mapContainerRef} style={{ width: '100%', height: '100%' }} />
    </div>
  );
};

export default InteractiveMap;
