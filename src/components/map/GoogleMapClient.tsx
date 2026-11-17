'use client';

import { useState, useRef, useEffect } from 'react';
import {
  APIProvider,
  Map,
  AdvancedMarker,
  useMap,
  useMapsLibrary,
} from '@vis.gl/react-google-maps';
import { Store, Coffee, MapPin, Plus, Minus, Navigation } from 'lucide-react';
import { useAppStore } from '@/store/useAppStore';
import { currentUser } from '@/data/mockData';
import MarkerInfoPanel from './MarkerInfoPanel';
import ClusterListPanel from './ClusterListPanel';
import { Slider } from '@/components/ui/slider';
import type { MapUser } from '@/types';

const API_KEY = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY ?? '';
const MAP_ID = process.env.NEXT_PUBLIC_GOOGLE_MAP_ID ?? 'DEMO_MAP_ID';
const DEFAULT_CENTER = { lat: 37.3504, lng: 127.9471 };

/* ── Group users by coordinate (3-decimal precision ≈ 111 m) ── */
interface LocationGroup {
  key: string;
  lat: number;
  lng: number;
  members: MapUser[];
}

function groupByLocation(users: MapUser[]): LocationGroup[] {
  const map: Record<string, LocationGroup> = {};
  users.forEach((u) => {
    const key = `${u.lat.toFixed(3)},${u.lng.toFixed(3)}`;
    if (!map[key]) map[key] = { key, lat: u.lat, lng: u.lng, members: [] };
    map[key].members.push(u);
  });
  return Object.values(map);
}

/* ── Single user avatar marker ─────────────────────────────── */
function UserMarker({ user, onClick }: { user: MapUser; onClick: () => void }) {
  const isCafe = user.role === 'cafe_owner';
  return (
    <div className="flex flex-col items-center cursor-pointer group" onClick={(e) => { e.stopPropagation(); onClick(); }}>
      <div className="relative">
        <div className="w-12 h-12 rounded-full overflow-hidden border-2 border-white shadow-lg transition-transform duration-150 group-hover:scale-110">
          <img
            src={user.avatar}
            alt={user.name}
            className="w-full h-full object-cover"
            onError={(e) => {
              (e.target as HTMLImageElement).src = `https://i.pravatar.cc/48?u=${user.id}`;
            }}
          />
        </div>
        {isCafe ? (
          <div className="absolute -top-1 -right-1 w-5 h-5 bg-gold rounded-full border-2 border-white flex items-center justify-center shadow-sm">
            <Store size={9} className="text-white" />
          </div>
        ) : (
          <div className="absolute -bottom-0.5 -right-0.5 w-4 h-4 bg-espresso rounded-full border-2 border-white flex items-center justify-center">
            <Coffee size={8} className="text-white" />
          </div>
        )}
      </div>
      <div className="mt-1.5 bg-white px-2.5 py-0.5 rounded-full shadow-md text-[11px] font-semibold text-gray-800 whitespace-nowrap max-w-[120px] truncate border border-gray-100">
        {user.name}
      </div>
    </div>
  );
}

/* ── Cluster marker (2+ people at same location) ───────────── */
function ClusterMarker({
  group,
  onClick,
}: {
  group: LocationGroup;
  onClick: () => void;
}) {
  const { members } = group;
  const shown = members.slice(0, 3);
  const extra = members.length - shown.length;
  const totalWidth = shown.length * 20 + 16 + (extra > 0 ? 20 : 0);

  return (
    <div
      className="flex flex-col items-center cursor-pointer group"
      onClick={(e) => { e.stopPropagation(); onClick(); }}
    >
      {/* Stacked avatars */}
      <div className="relative" style={{ width: totalWidth, height: 48 }}>
        {shown.map((u, i) => (
          <div
            key={u.id}
            className="absolute w-12 h-12 rounded-full overflow-hidden border-2 border-white shadow-md transition-transform duration-150 group-hover:scale-105"
            style={{ left: i * 20, zIndex: shown.length - i }}
          >
            <img
              src={u.avatar}
              alt={u.name}
              className="w-full h-full object-cover"
              onError={(e) => {
                (e.target as HTMLImageElement).src = `https://i.pravatar.cc/48?u=${u.id}`;
              }}
            />
          </div>
        ))}
        {/* "+N" overflow bubble */}
        {extra > 0 && (
          <div
            className="absolute w-12 h-12 rounded-full bg-espresso border-2 border-white shadow-md flex items-center justify-center"
            style={{ left: shown.length * 20, zIndex: 0 }}
          >
            <span className="text-[11px] font-bold text-white">+{extra}</span>
          </div>
        )}
        {/* Count badge */}
        <div className="absolute -top-1.5 -right-1.5 min-w-[22px] h-[22px] bg-espresso rounded-full border-2 border-white flex items-center justify-center px-1.5 shadow-sm">
          <span className="text-[10px] font-bold text-white leading-none">{members.length}</span>
        </div>
      </div>

      {/* Label */}
      <div className="mt-2 bg-espresso px-3 py-0.5 rounded-full shadow-md text-[11px] font-bold text-white whitespace-nowrap border border-espresso/30">
        {members.length}명
      </div>
    </div>
  );
}

/* ── Current (logged-in) user marker ──────────────────────── */
function CurrentUserMarker() {
  return (
    <div className="flex flex-col items-center pointer-events-none">
      <div className="relative">
        <div className="w-12 h-12 rounded-full overflow-hidden border-2 border-espresso shadow-lg ring-4 ring-espresso/20">
          <img
            src={currentUser.avatar}
            alt={currentUser.name}
            className="w-full h-full object-cover"
          />
        </div>
        <div className="absolute bottom-0 right-0 w-4 h-4 bg-online rounded-full border-2 border-white" />
      </div>
      <div className="mt-1.5 bg-espresso px-2.5 py-0.5 rounded-full shadow-md text-[11px] font-semibold text-white whitespace-nowrap">
        나
      </div>
    </div>
  );
}

/* ── Search radius circle overlay ─────────────────────────── */
function SearchRadiusCircle({ radiusKm }: { radiusKm: number }) {
  const map = useMap('barista-map');
  const mapsLib = useMapsLibrary('maps');
  const circleRef = useRef<google.maps.Circle | null>(null);

  useEffect(() => {
    if (!map || !mapsLib) return;
    const circle = new mapsLib.Circle({
      center: DEFAULT_CENTER,
      radius: radiusKm * 1000,
      map,
      fillColor: '#3D2B1F',
      fillOpacity: 0.04,
      strokeColor: '#3D2B1F',
      strokeOpacity: 0.15,
      strokeWeight: 1.5,
      clickable: false,
    });
    circleRef.current = circle;
    return () => { circle.setMap(null); circleRef.current = null; };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [map, mapsLib]);

  useEffect(() => { circleRef.current?.setRadius(radiusKm * 1000); }, [radiusKm]);
  return null;
}

/* ── Zoom / locate controls ───────────────────────────────── */
function MapControls() {
  const map = useMap('barista-map');
  const zoomIn = () => map?.setZoom((map.getZoom() ?? 15) + 1);
  const zoomOut = () => map?.setZoom((map.getZoom() ?? 15) - 1);
  const locate = () => { map?.panTo(DEFAULT_CENTER); map?.setZoom(15); };

  return (
    <div className="absolute bottom-[7.5rem] lg:bottom-28 right-4 z-10 flex flex-col gap-1.5 pointer-events-auto">
      <button onClick={locate} className="w-10 h-10 bg-white rounded-full shadow-md flex items-center justify-center hover:bg-gray-50 transition-colors">
        <Navigation size={16} className="text-espresso" />
      </button>
      <button onClick={zoomIn} className="w-10 h-10 bg-white rounded-full shadow-md flex items-center justify-center hover:bg-gray-50 transition-colors text-espresso">
        <Plus size={18} />
      </button>
      <button onClick={zoomOut} className="w-10 h-10 bg-white rounded-full shadow-md flex items-center justify-center hover:bg-gray-50 transition-colors text-espresso">
        <Minus size={18} />
      </button>
    </div>
  );
}

/* ── Main Google Map client ───────────────────────────────── */
export default function GoogleMapClient() {
  const {
    registeredMapUsers,
    selectedMapUser,
    setSelectedMapUser,
    searchRadius,
    setSearchRadius,
  } = useAppStore();

  /* Cluster selection is local — no need to persist to store */
  const [selectedCluster, setSelectedCluster] = useState<MapUser[] | null>(null);

  const visibleUsers = registeredMapUsers.filter((u) => u.showOnMap);
  const locationGroups = groupByLocation(visibleUsers);

  const closeAll = () => { setSelectedMapUser(null); setSelectedCluster(null); };
  const selectUser = (user: MapUser) => { setSelectedCluster(null); setSelectedMapUser(user); };
  const selectCluster = (members: MapUser[]) => { setSelectedMapUser(null); setSelectedCluster(members); };

  const radiusLabel = searchRadius < 1 ? `${searchRadius * 1000}m` : `${searchRadius.toFixed(1)}km`;
  const sliderStops = [0.5, 1, 2, 5];
  const sliderValue =
    searchRadius <= 1 ? ((searchRadius - 0.5) / 0.5) * 33.3
    : searchRadius === 2 ? 66.6 : 100;

  function sliderToRadius(val: number) {
    if (val <= 33.3) return 0.5 + (val / 33.3) * 0.5;
    if (val <= 66.6) return 1 + ((val - 33.3) / 33.3) * 1;
    return 2 + ((val - 66.6) / 33.4) * 3;
  }

  /* No API key → friendly error */
  if (!API_KEY) {
    return (
      <div className="w-full h-full flex items-center justify-center bg-map-bg">
        <div className="text-center p-6 bg-white rounded-2xl shadow-lg max-w-sm mx-4">
          <div className="w-14 h-14 bg-espresso/10 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <MapPin size={28} className="text-espresso" />
          </div>
          <h3 className="font-bold text-gray-900 mb-2">Google Maps API 키 필요</h3>
          <p className="text-sm text-gray-500 leading-relaxed">
            프로젝트 루트의{' '}
            <code className="bg-gray-100 px-1.5 py-0.5 rounded text-xs font-mono">.env.local</code>{' '}
            파일에<br />
            <code className="bg-gray-100 px-1.5 py-0.5 rounded text-xs font-mono">
              NEXT_PUBLIC_GOOGLE_MAPS_API_KEY
            </code>
            를<br />설정 후 서버를 재시작해주세요.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="relative w-full h-full">
      <APIProvider apiKey={API_KEY} language="ko" region="KR">
        <Map
          id="barista-map"
          mapId={MAP_ID}
          defaultCenter={DEFAULT_CENTER}
          defaultZoom={15}
          disableDefaultUI
          gestureHandling="greedy"
          style={{ width: '100%', height: '100%' }}
          onClick={closeAll}
        >
          <SearchRadiusCircle radiusKm={searchRadius} />

          {/* Render groups: single marker or cluster marker */}
          {locationGroups.map((group) =>
            group.members.length === 1 ? (
              <AdvancedMarker
                key={group.members[0].id}
                position={{ lat: group.lat, lng: group.lng }}
                zIndex={selectedMapUser?.id === group.members[0].id ? 10 : 1}
              >
                <UserMarker
                  user={group.members[0]}
                  onClick={() => selectUser(group.members[0])}
                />
              </AdvancedMarker>
            ) : (
              <AdvancedMarker
                key={group.key}
                position={{ lat: group.lat, lng: group.lng }}
                zIndex={selectedCluster ? 10 : 2}
              >
                <ClusterMarker
                  group={group}
                  onClick={() => selectCluster(group.members)}
                />
              </AdvancedMarker>
            )
          )}

          {/* Current user */}
          <AdvancedMarker
            position={{ lat: currentUser.lat, lng: currentUser.lng }}
            zIndex={20}
          >
            <CurrentUserMarker />
          </AdvancedMarker>
        </Map>

        <MapControls />
      </APIProvider>

      {/* Radius slider panel */}
      <div className="absolute bottom-20 lg:bottom-6 left-1/2 -translate-x-1/2 z-10 bg-white rounded-2xl shadow-lg px-5 py-3.5 min-w-[280px] pointer-events-auto">
        <div className="flex items-center justify-between mb-2.5">
          <div className="flex items-center gap-1.5">
            <MapPin size={14} className="text-espresso" />
            <span className="text-sm font-semibold text-espresso">반경설정</span>
          </div>
          <span className="text-sm font-bold text-espresso">{radiusLabel}</span>
        </div>
        <Slider
          min={0} max={100} step={0.1}
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

      {/* Cluster list panel */}
      {selectedCluster && !selectedMapUser && (
        <ClusterListPanel
          members={selectedCluster}
          onSelectUser={selectUser}
          onClose={closeAll}
        />
      )}

      {/* Individual info panel */}
      {selectedMapUser && (
        <MarkerInfoPanel
          user={selectedMapUser}
          onClose={closeAll}
        />
      )}
    </div>
  );
}
