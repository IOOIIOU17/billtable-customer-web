import { useEffect } from 'react';
import { MapContainer, TileLayer, Marker, useMapEvents } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

// Default Leaflet marker icons don't resolve correctly through Vite's
// bundler — point them at the CDN copies instead (same pattern tokens.css
// already uses to pull fonts from a CDN, just for map pin images).
const markerIcon = new L.Icon({
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
});

const LOCATIONIQ_KEY = import.meta.env.VITE_LOCATIONIQ_KEY;

function Recenter({ lat, lng }) {
  const map = useMapEvents({});
  useEffect(() => {
    if (lat && lng) map.setView([lat, lng], Math.max(map.getZoom(), 15));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [lat, lng]);
  return null;
}

function ClickToMove({ onMove }) {
  useMapEvents({
    click(e) { onMove(e.latlng.lat, e.latlng.lng); },
  });
  return null;
}

// LocationMap — the visual "search + pin" surface for Feature 1. Runs on
// LocationIQ (already keyed in .env as VITE_LOCATIONIQ_KEY), not Google
// Maps — same idea (search an address, drop/drag a pin to confirm the
// exact spot) without needing a separate Google Cloud billing account.
export default function LocationMap({ lat, lng, onMove }) {
  if (!lat || !lng) return null;
  return (
    <div style={{ width: '100%', height: '220px', borderRadius: 'var(--radius)', overflow: 'hidden', border: '2px solid var(--color-ink)' }}>
      <MapContainer center={[lat, lng]} zoom={15} style={{ width: '100%', height: '100%' }} scrollWheelZoom={false}>
        <TileLayer
          url={`https://{s}-tiles.locationiq.com/v3/streets/r/{z}/{x}/{y}.png?key=${LOCATIONIQ_KEY}`}
          attribution='&copy; <a href="https://locationiq.com">LocationIQ</a> &copy; OpenStreetMap contributors'
        />
        <Marker
          position={[lat, lng]}
          draggable
          icon={markerIcon}
          eventHandlers={{
            dragend: (e) => {
              const { lat: newLat, lng: newLng } = e.target.getLatLng();
              onMove(newLat, newLng);
            },
          }}
        />
        <ClickToMove onMove={onMove} />
        <Recenter lat={lat} lng={lng} />
      </MapContainer>
    </div>
  );
}
