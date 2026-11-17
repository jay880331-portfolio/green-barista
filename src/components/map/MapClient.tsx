'use client';

import { useEffect, useRef } from 'react';
import { MapContainer, TileLayer, Marker, Circle, Popup } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { mockBaristas, currentUser } from '@/data/mockData';
import { useAppStore } from '@/store/useAppStore';
import type { Barista } from '@/types';
import { Slider } from '@/components/ui/slider';
import { MapPin, Plus, Minus, Navigation } from 'lucide-react';

function createAvatarMarker(barista: Barista, isCurrentUser = false) {
  const size = isCurrentUser ? 48 : 56;
  const borderColor = barista.isPremium ? '#D4A853' : isCurrentUser ? '#3D2B1F' : '#FFFFFF';
  const borderWidth = barista.isPremium ? 3 : 2;
  const grayscale = !barista.isOnline ? 'filter:grayscale(100%);' : '';

  const onlineDot = barista.isOnline
    ? `<div style="position:absolute;bottom:2px;right:2px;width:13px;height:13px;border-radius:50%;background:#22C55E;border:2.5px solid white;z-index:2;"></div>`
    : '';

  const label =
    !isCurrentUser
      ? `<div style="margin-top:5px;text-align:center;background:rgba(255,255,255,0.95);padding:3px 10px;border-radius:999px;box-shadow:0 2px 8px rgba(0,0,0,0.12);white-space:nowrap;">
           <div style="font-size:12px;font-weight:600;color:#1a1a1a;">${barista.name}</div>
           <div style="font-size:10px;color:#C8914A;font-weight:500;">${barista.specialty}</div>
         </div>`
      : '';

  return L.divIcon({
    className: '',
    html: `
      <div style="display:flex;flex-direction:column;align-items:center;cursor:pointer;">
        <div style="position:relative;width:${size}px;height:${size}px;">
          <div style="width:${size}px;height:${size}px;border-radius:50%;overflow:hidden;border:${borderWidth}px solid ${borderColor};box-shadow:0 3px 12px rgba(0,0,0,0.2);background:#e5e7eb;${grayscale}">
            <img src="${barista.avatar}" style="width:100%;height:100%;object-fit:cover;" onerror="this.src='https://i.pravatar.cc/${size}?u=fallback${barista.id}'" />
          </div>
          ${onlineDot}
        </div>
        ${label}
      </div>
    `,
    iconSize: undefined,
    iconAnchor: [size / 2, size / 2],
    popupAnchor: [0, -(size / 2 + 8)],
  });
}

export default function MapClient() {
  const mapRef = useRef<L.Map | null>(null);
  const { searchRadius, setSearchRadius } = useAppStore();
  const center: [number, number] = [37.5326, 126.9969];

  useEffect(() => {
    // Fix leaflet default icon issue
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    delete (L.Icon.Default.prototype as any)._getIconUrl;
    L.Icon.Default.mergeOptions({
      iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png',
      iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png',
      shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png',
    });
  }, []);

  const handleZoomIn = () => mapRef.current?.zoomIn();
  const handleZoomOut = () => mapRef.current?.zoomOut();
  const handleLocate = () => mapRef.current?.setView(center, 15);

  const radiusLabel =
    searchRadius < 1
      ? `${searchRadius * 1000}m`
      : `${searchRadius.toFixed(1)}km`;

  const sliderValue = searchRadius <= 1
    ? (searchRadius - 0.5) / 0.5 * 33.3
    : searchRadius === 2
      ? 66.6
      : 100;

  const sliderStops = [0.5, 1, 2, 5];

  function sliderToRadius(val: number) {
    if (val <= 33.3) return 0.5 + (val / 33.3) * 0.5;
    if (val <= 66.6) return 1 + ((val - 33.3) / 33.3) * 1;
    return 2 + ((val - 66.6) / 33.4) * 3;
  }

  return (
    <div className="relative w-full h-full">
      <MapContainer
        ref={mapRef}
        center={center}
        zoom={15}
        style={{ width: '100%', height: '100%' }}
        zoomControl={false}
        attributionControl={false}
      >
        <TileLayer
          url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png"
          attribution='&copy; OpenStreetMap contributors &copy; CARTO'
        />

        {/* Search radius circle */}
        <Circle
          center={center}
          radius={searchRadius * 1000}
          pathOptions={{
            fillColor: 'rgba(61, 43, 31, 0.04)',
            fillOpacity: 1,
            color: 'rgba(61, 43, 31, 0.15)',
            weight: 1.5,
          }}
        />

        {/* Barista markers */}
        {mockBaristas.map((barista) => (
          <Marker
            key={barista.id}
            position={[barista.lat, barista.lng]}
            icon={createAvatarMarker(barista)}
          >
            <Popup closeButton={false}>
              <div className="text-center px-1 py-0.5 min-w-[100px]">
                <p className="font-semibold text-sm text-espresso">{barista.name}</p>
                <p className="text-xs text-latte">{barista.specialty}</p>
                <p className="text-xs text-gray-400 mt-0.5">{barista.district}</p>
              </div>
            </Popup>
          </Marker>
        ))}

        {/* Current user marker */}
        <Marker
          position={[currentUser.lat, currentUser.lng]}
          icon={createAvatarMarker(currentUser, true)}
        >
          <Popup closeButton={false}>
            <div className="text-center px-1 py-0.5">
              <p className="font-semibold text-sm text-espresso">나 ({currentUser.name})</p>
              <p className="text-xs text-gray-400">{currentUser.district}</p>
            </div>
          </Popup>
        </Marker>
      </MapContainer>

      {/* Map zoom controls */}
      <div className="absolute bottom-[7.5rem] lg:bottom-28 right-4 z-[1000] flex flex-col gap-1.5">
        <button
          onClick={handleLocate}
          className="w-10 h-10 bg-white rounded-full shadow-md flex items-center justify-center hover:bg-gray-50 transition-colors"
        >
          <Navigation size={16} className="text-espresso" />
        </button>
        <button
          onClick={handleZoomIn}
          className="w-10 h-10 bg-white rounded-full shadow-md flex items-center justify-center hover:bg-gray-50 transition-colors text-lg font-light text-espresso"
        >
          <Plus size={18} />
        </button>
        <button
          onClick={handleZoomOut}
          className="w-10 h-10 bg-white rounded-full shadow-md flex items-center justify-center hover:bg-gray-50 transition-colors text-espresso"
        >
          <Minus size={18} />
        </button>
      </div>

      {/* Range slider panel */}
      <div className="absolute bottom-20 lg:bottom-6 left-1/2 -translate-x-1/2 z-[1000] bg-white rounded-2xl shadow-lg px-5 py-3.5 min-w-[280px]">
        <div className="flex items-center justify-between mb-2.5">
          <div className="flex items-center gap-1.5">
            <MapPin size={14} className="text-espresso" />
            <span className="text-sm font-semibold text-espresso">반경설정</span>
          </div>
          <span className="text-sm font-bold text-espresso">{radiusLabel}</span>
        </div>
        <Slider
          min={0}
          max={100}
          step={0.1}
          value={[sliderValue]}
          onValueChange={([val]) => setSearchRadius(parseFloat(sliderToRadius(val).toFixed(1)))}
          className="w-full"
        />
        <div className="flex justify-between mt-1.5">
          {sliderStops.map((stop) => (
            <span key={stop} className="text-[10px] text-gray-400">
              {stop < 1 ? `${stop * 1000}m` : `${stop}km`}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}
