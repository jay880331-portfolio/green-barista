'use client';

import { X, Store, Coffee, ChevronRight, MapPin } from 'lucide-react';
import type { MapUser } from '@/types';

interface ClusterListPanelProps {
  members: MapUser[];
  onSelectUser: (user: MapUser) => void;
  onClose: () => void;
}

export default function ClusterListPanel({
  members,
  onSelectUser,
  onClose,
}: ClusterListPanelProps) {
  /* Derive a location label from the group */
  const cafeOwner = members.find((m) => m.role === 'cafe_owner');
  const locationName =
    cafeOwner?.cafeName ||
    members[0]?.currentCafe ||
    members[0]?.district ||
    '이 위치';

  const baristaCount = members.filter((m) => m.role === 'barista').length;
  const cafeCount = members.filter((m) => m.role === 'cafe_owner').length;
  const subtitle =
    [
      cafeCount > 0 && `카페 운영자 ${cafeCount}명`,
      baristaCount > 0 && `바리스타 ${baristaCount}명`,
    ]
      .filter(Boolean)
      .join(' · ');

  return (
    <>
      {/* Backdrop */}
      <div className="absolute inset-0 z-20" onClick={onClose} aria-hidden />

      {/* Panel */}
      <div className="absolute bottom-0 left-0 right-0 lg:left-auto lg:right-4 lg:bottom-4 lg:w-80 z-30 pointer-events-auto">
        <div className="bg-white rounded-t-3xl lg:rounded-2xl shadow-2xl overflow-hidden animate-in slide-in-from-bottom-4 duration-300">

          {/* Drag handle — mobile */}
          <div className="lg:hidden flex justify-center pt-3 pb-1">
            <div className="w-10 h-1 bg-gray-200 rounded-full" />
          </div>

          {/* Header */}
          <div className="px-5 pt-4 pb-3 bg-gradient-to-br from-stone-50 to-amber-50">
            <div className="flex items-start gap-2">
              {/* Stacked mini-avatars */}
              <div className="relative shrink-0 flex items-center h-9" style={{ width: `${Math.min(members.length, 3) * 20 + 16}px` }}>
                {members.slice(0, 3).map((u, i) => (
                  <img
                    key={u.id}
                    src={u.avatar}
                    alt={u.name}
                    className="absolute w-9 h-9 rounded-full border-2 border-white shadow-sm object-cover"
                    style={{ left: i * 20, zIndex: 3 - i }}
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = `https://i.pravatar.cc/36?u=${u.id}`;
                    }}
                  />
                ))}
              </div>

              <div className="flex-1 min-w-0 pl-1">
                <div className="flex items-center gap-1 mb-0.5">
                  <MapPin size={10} className="text-espresso shrink-0" />
                  <p className="text-[10px] font-bold uppercase tracking-widest text-espresso truncate">
                    {members.length}명
                  </p>
                </div>
                <h3 className="text-sm font-bold text-gray-900 leading-tight truncate">
                  {locationName}
                </h3>
                {subtitle && (
                  <p className="text-[11px] text-gray-400 mt-0.5">{subtitle}</p>
                )}
              </div>

              <button
                onClick={onClose}
                className="shrink-0 w-8 h-8 rounded-full bg-white/80 hover:bg-white shadow-sm flex items-center justify-center transition-colors"
              >
                <X size={14} className="text-gray-500" />
              </button>
            </div>
          </div>

          {/* Member list */}
          <div className="divide-y divide-gray-50 max-h-72 overflow-y-auto">
            {members.map((user) => {
              const isCafe = user.role === 'cafe_owner';
              return (
                <button
                  key={user.id}
                  onClick={() => onSelectUser(user)}
                  className="w-full flex items-center gap-3 px-5 py-3.5 hover:bg-amber-50/60 transition-colors text-left group"
                >
                  {/* Avatar */}
                  <div className="relative shrink-0">
                    <img
                      src={user.avatar}
                      alt={user.name}
                      className="w-11 h-11 rounded-full object-cover border-2 border-white shadow-sm"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = `https://i.pravatar.cc/44?u=${user.id}`;
                      }}
                    />
                    <div
                      className={`absolute -bottom-0.5 -right-0.5 w-4 h-4 rounded-full border-2 border-white flex items-center justify-center shadow-sm ${
                        isCafe ? 'bg-gold' : 'bg-espresso'
                      }`}
                    >
                      {isCafe
                        ? <Store size={8} className="text-white" />
                        : <Coffee size={8} className="text-white" />
                      }
                    </div>
                  </div>

                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-gray-900 group-hover:text-espresso transition-colors">
                      {user.name}
                    </p>
                    <p className="text-xs text-gray-400 truncate mt-0.5">
                      {isCafe
                        ? (user.cafeName || '카페 운영자')
                        : [user.specialties?.[0], user.experienceYears && `경력 ${user.experienceYears}년`].filter(Boolean).join(' · ') || '바리스타'
                      }
                    </p>
                  </div>

                  <ChevronRight size={14} className="text-gray-300 group-hover:text-espresso shrink-0 transition-colors" />
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </>
  );
}
