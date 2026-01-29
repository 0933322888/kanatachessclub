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

  // Custom themed icon
  const customIcon = typeof window !== 'undefined' ? L.divIcon({
    html: `
      <div class="relative">
        <div class="absolute -top-10 -left-5 bg-amber p-2 rounded-full shadow-xl border-2 border-white transform hover:scale-110 transition-transform">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512" class="w-6 h-6 fill-white">
            <path d="M96 48L82.7 61.3C70.7 73.3 64 89.5 64 106.5V128l0 0 0 0c0 17.7 14.3 32 32 32l0 0h1.1l-6.4 12.8c-4.8 9.6-4.7 21 0 30.6l10.4 20.8c2.4 4.8 2.3 10.5 0 15.3l-10.4 20.8c-4.8 9.6-4.7 21 0 30.6l6.4 12.8h-1.1c-17.7 0-32 14.3-32 32l0 0 0 0v21.5c0 17 6.7 33.2 18.7 45.2L96 464c12.2 12.2 31.7 12.5 44.2 1l12.7-11.7c4.6-4.2 4.9-10.9 .8-15.6l-50.4-58.8c-3.1-3.6-3.7-8.7-1.4-13.1l6.4-12.8c4.8-9.6 4.7-21 0-30.6l-10.4-20.8c-2.4-4.8-2.3-10.5 0-15.3l10.4-20.8c4.8-9.6 4.7-21 0-30.6l-6.4-12.8H112c-17.7 0-32-14.3-32-32V106.5c0-17 6.7-33.2 18.7-45.2L112 48c12.2-12.2 31.7-12.5 44.2-1l12.7 11.7c4.6 4.2 4.9 10.9 .8 15.6L119.3 133c-3.1 3.6-3.7 8.7-1.4 13.1l6.4 12.8c4.8 9.6 4.7 21 0 30.6l10.4 20.8c2.4 4.8 2.3 10.5 0 15.3l-10.4 20.8c-4.8 9.6-4.7 21 0 30.6l-6.4 12.8h32.7c15.5 0 30.8 4.2 44.1 12.1l52.6 31.1c13.3 7.9 28.5 12.1 44.1 12.1h26.5c44 0 86.4-12.1 123.6-34.1l52.6-31.1C417.5 241.2 432 225.5 432 208.5c0-17.7-14.3-32-32-32l0 0h-32.7c-15.5 0-30.8 4.2-44.1 12.1l-52.6 31.1c-13.3 7.9-28.5 12.1-44.1 12.1h-26.5c-8.8 0-16-7.2-16-16s7.2-16 16-16h26.5c15.5 0 30.8-4.2 44.1-12.1l52.6-31.1c13.3-7.9 28.5-12.1 44.1-12.1H400c17.7 0 32-14.3 32-32s-14.3-32-32-32h-32.7c-44 0-86.4 12.1-123.6 34.1l-52.6 31.1c-13.3 7.9-28.5 12.1-44.1 12.1H112c-17.7 0-32-14.3-32-32s14.3-32 32-32h32.7c15.5 0 30.8-4.2 44.1-12.1L241.3 53.3c13.3-7.9 28.5-12.1 44.1-12.1h26.5c8.8 0 16-7.2 16-16S320.8 8.1 312 8.1l-26.5 0c-44 0-86.4 12.1-123.6 34.1L110.1 73c-4.2 2.5-8.2 5.1-12.1 7.7L82.7 61.3C70.7 73.3 64 89.5 64 106.5l0 0 0 0 0 0 0 0z"/>
          </svg>
        </div>
      </div>
    `,
    className: '',
    iconSize: [30, 42],
    iconAnchor: [15, 42],
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

