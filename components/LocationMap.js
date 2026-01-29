'use client';

import { useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

// Fix for default marker icon in Next.js
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png',
});

export default function LocationMap({ latitude, longitude, locationName, googleMapsUrl }) {
  const position = [latitude, longitude];

  // Custom themed icon - Elegant Pin
  const customIcon = typeof window !== 'undefined' ? L.divIcon({
    html: `
      <div class="relative flex items-center justify-center transform hover:scale-110 transition-transform duration-300">
        <!-- Main Pin Body -->
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 384 512" class="w-10 h-10 drop-shadow-[0_10px_10px_rgba(0,0,0,0.3)]">
          <path fill="#D97706" d="M172.268 501.67C26.97 291.031 0 269.413 0 192 0 85.961 85.961 0 192 0s192 85.961 192 192c0 77.413-26.97 99.031-172.268 309.67-9.535 13.774-29.93 13.773-39.464 0z"/>
          <!-- Inner Circle -->
          <circle cx="192" cy="192" r="140" fill="white" />
          <!-- Simple Chess Icon (Pawn/King silhouette) -->
          <path fill="#D97706" transform="translate(144, 130) scale(0.22)" d="M224 0c17.7 0 32 14.3 32 32s-14.3 32-32 32H208c-17.7 0-32 14.3-32 32v16H320c17.7 0 32 14.3 32 32s-14.3 32-32 32H288v64h32c17.7 0 32 14.3 32 32s-14.3 32-32 32H128c-17.7 0-32-14.3-32-32s14.3-32 32-32h32V256H128c-17.7 0-32-14.3-32-32s14.3-32 32-32h144V160H160c-17.7 0-32-14.3-32-32s14.3-32 32-32h16V32c0-17.7 14.3-32 32-32h16zM64 416H384c17.7 0 32 14.3 32 32s-14.3 32-32 32H64c-17.7 0-32-14.3-32-32s14.3-32 32-32z"/>
        </svg>
      </div>
    `,
    className: '',
    iconSize: [40, 52],
    iconAnchor: [20, 52],
    popupAnchor: [0, -45]
  }) : null;

  return (
    <div className="relative group">
      <div className="absolute top-4 left-4 z-[1000] bg-white/90 backdrop-blur-sm px-3 py-1.5 rounded-lg shadow-md border border-whisky-200">
        <p className="text-xs font-bold text-whisky-900 uppercase tracking-widest flex items-center gap-2">
          <span className="w-2 h-2 bg-amber rounded-full animate-pulse"></span>
          Gathering Location
        </p>
      </div>

      <div className="w-full h-80 rounded-2xl overflow-hidden border-4 border-whisky-100 shadow-2xl relative">
        <MapContainer
          center={position}
          zoom={15}
          style={{ height: '100%', width: '100%' }}
          scrollWheelZoom={false}
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> &copy; <a href="https://carto.com/attributions">CARTO</a>'
            url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png"
          />
          {customIcon && (
            <Marker position={position} icon={customIcon}>
              <Popup className="custom-popup">
                <div className="p-1 min-w-[200px]">
                  <h3 className="font-bold text-whisky-900 mb-1">{locationName}</h3>
                  <p className="text-xs text-whisky-600 mb-3">Join us for games and strategy!</p>
                  {googleMapsUrl && (
                    <a
                      href={googleMapsUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="block text-center py-2 bg-amber text-white text-xs font-bold rounded-lg hover:bg-amber-dark transition-colors shadow-sm"
                    >
                      Open in Google Maps
                    </a>
                  )}
                </div>
              </Popup>
            </Marker>
          )}
        </MapContainer>

        {/* Decorative corner accents */}
        <div className="absolute top-0 right-0 w-16 h-16 pointer-events-none">
          <div className="absolute top-4 right-4 w-4 h-4 border-t-2 border-r-2 border-amber-400 opacity-50"></div>
        </div>
        <div className="absolute bottom-0 left-0 w-16 h-16 pointer-events-none">
          <div className="absolute bottom-4 left-4 w-4 h-4 border-b-2 border-l-2 border-amber-400 opacity-50"></div>
        </div>
      </div>

      <style jsx global>{`
        .leaflet-popup-content-wrapper {
          border-radius: 12px;
          border: 1px solid rgba(139, 69, 19, 0.1);
          box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.1);
        }
        .leaflet-popup-tip {
          background: white;
        }
      `}</style>
    </div>
  );
}

