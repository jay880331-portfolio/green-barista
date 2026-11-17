'use client';

import {
  X, MapPin, Phone, Clock, Instagram, Store, Coffee, Star, ChevronRight,
} from 'lucide-react';
import type { MapUser } from '@/types';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';

interface MarkerInfoPanelProps {
  user: MapUser;
  onClose: () => void;
}

export default function MarkerInfoPanel({ user, onClose }: MarkerInfoPanelProps) {
  const isCafe = user.role === 'cafe_owner';
  const hasCafeInfo = isCafe && (user.cafeName || user.cafeDesc || user.cafeFeatures?.length);

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

          {/* ── PERSON HEADER ── */}
          <div className="px-5 pt-4 pb-4 bg-gradient-to-br from-stone-50 to-amber-50">
            <div className="flex items-start gap-3">

              {/* Avatar */}
              <div className="relative shrink-0">
                <img
                  src={user.avatar}
                  alt={user.name}
                  className="w-16 h-16 rounded-2xl object-cover shadow-md border-2 border-espresso/20"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src =
                      `https://i.pravatar.cc/64?u=${user.id}`;
                  }}
                />
                {/* Role badge */}
                <div className={`absolute -top-1.5 -right-1.5 w-6 h-6 rounded-full border-2 border-white flex items-center justify-center shadow-sm ${isCafe ? 'bg-gold' : 'bg-espresso'}`}>
                  {isCafe
                    ? <Store size={11} className="text-white" />
                    : <Coffee size={11} className="text-white" />
                  }
                </div>
              </div>

              {/* Name & role */}
              <div className="flex-1 min-w-0 pt-0.5">
                <span className={`inline-flex items-center gap-1 text-[9px] font-bold uppercase tracking-widest px-2 py-0.5 rounded-full mb-1 ${isCafe ? 'bg-gold/15 text-amber-700' : 'bg-espresso/10 text-espresso'}`}>
                  {isCafe ? '카페 운영자' : '바리스타'}
                </span>
                <h3 className="text-base font-bold text-gray-900 leading-tight">
                  {user.name}
                </h3>
                {/* Primary specialty (barista) */}
                {!isCafe && user.specialties && user.specialties.length > 0 && (
                  <p className="text-xs text-latte font-medium mt-0.5">{user.specialties[0]}</p>
                )}
                {/* District */}
                {user.district && (
                  <p className="text-[11px] text-gray-400 mt-0.5 flex items-center gap-0.5">
                    <MapPin size={9} />
                    {user.district}
                  </p>
                )}
              </div>

              {/* Close */}
              <button
                onClick={onClose}
                className="shrink-0 w-8 h-8 rounded-full bg-white/80 hover:bg-white shadow-sm flex items-center justify-center transition-colors"
              >
                <X size={14} className="text-gray-500" />
              </button>
            </div>

            {/* Specialty chips (barista, multiple) */}
            {!isCafe && user.specialties && user.specialties.length > 1 && (
              <div className="flex flex-wrap gap-1.5 mt-3">
                {user.specialties.map((s) => (
                  <span key={s} className="px-2.5 py-1 bg-espresso/10 text-espresso text-[11px] font-semibold rounded-full">
                    {s}
                  </span>
                ))}
              </div>
            )}
          </div>

          {/* ── BODY ── */}
          <div className="px-5 py-4 space-y-3.5">

            {/* Bio (barista) */}
            {!isCafe && user.bio && (
              <p className="text-sm text-gray-600 leading-relaxed">{user.bio}</p>
            )}

            {/* Barista meta rows */}
            {!isCafe && (
              <div className="space-y-2">
                {user.experienceYears && (
                  <InfoRow icon={<Star size={13} className="text-espresso" />} label={`경력 ${user.experienceYears}년`} />
                )}
                {user.instagram && (
                  <InfoRow
                    icon={<Instagram size={13} className="text-espresso" />}
                    label={`@${user.instagram}`}
                    onClick={() => window.open(`https://instagram.com/${user.instagram}`, '_blank')}
                    clickable
                  />
                )}
              </div>
            )}

            {/* ── CAFE CARD (소속/운영 카페) ── */}
            {/* Barista → shows currentCafe name */}
            {!isCafe && user.currentCafe && (
              <div className="bg-amber-50 border border-amber-100 rounded-xl p-3.5">
                <p className="text-[10px] font-bold uppercase tracking-widest text-amber-600 mb-2 flex items-center gap-1">
                  <Store size={10} />
                  소속 카페
                </p>
                <p className="text-sm font-semibold text-gray-900">{user.currentCafe}</p>
                {user.address && (
                  <p className="text-xs text-gray-500 mt-1 flex items-center gap-1">
                    <MapPin size={10} className="shrink-0" />
                    {user.address}
                  </p>
                )}
              </div>
            )}

            {/* Cafe owner → shows full cafe card */}
            {hasCafeInfo && (
              <div className="bg-amber-50 border border-amber-100 rounded-xl p-3.5 space-y-2.5">
                <p className="text-[10px] font-bold uppercase tracking-widest text-amber-600 flex items-center gap-1">
                  <Store size={10} />
                  운영 카페
                </p>

                {/* Cafe name */}
                <p className="text-sm font-bold text-gray-900">
                  {user.cafeName || user.name}
                </p>

                {/* Feature chips */}
                {user.cafeFeatures && user.cafeFeatures.length > 0 && (
                  <div className="flex flex-wrap gap-1">
                    {user.cafeFeatures.map((f) => (
                      <span key={f} className="px-2 py-0.5 bg-white text-amber-700 text-[10px] font-semibold rounded-full border border-amber-200">
                        {f}
                      </span>
                    ))}
                  </div>
                )}

                {/* Cafe desc */}
                {user.cafeDesc && (
                  <p className="text-xs text-gray-600 leading-relaxed">{user.cafeDesc}</p>
                )}

                {/* Cafe info rows */}
                <div className="space-y-1.5 pt-0.5">
                  {user.address && (
                    <InfoRow icon={<MapPin size={12} className="text-amber-600" />} label={user.address} small />
                  )}
                  {user.cafePhone && (
                    <InfoRow
                      icon={<Phone size={12} className="text-amber-600" />}
                      label={user.cafePhone}
                      onClick={() => window.open(`tel:${user.cafePhone}`)}
                      clickable
                      small
                    />
                  )}
                  {user.cafeHoursOpen && user.cafeHoursClose && (
                    <InfoRow
                      icon={<Clock size={12} className="text-amber-600" />}
                      label={`${user.cafeHoursOpen} ~ ${user.cafeHoursClose}`}
                      small
                    />
                  )}
                </div>
              </div>
            )}

            {/* Barista without currentCafe → show address */}
            {!isCafe && !user.currentCafe && user.address && (
              <div className="space-y-2">
                <InfoRow icon={<MapPin size={13} className="text-espresso" />} label={user.address} />
              </div>
            )}
          </div>

          {/* ── FOOTER CTA ── */}
          <div className="px-5 pb-5 pt-1 flex gap-2">
            <Button
              className="flex-1 h-10 bg-espresso hover:bg-sidebar-dark text-white rounded-xl text-sm font-semibold"
              onClick={() => toast.info('메시지 기능은 준비 중입니다.')}
            >
              메시지 보내기
            </Button>
            <Button
              variant="outline"
              size="icon"
              className="h-10 w-10 rounded-xl border-gray-200 shrink-0"
              onClick={() => toast.info('프로필 페이지는 준비 중입니다.')}
            >
              <ChevronRight size={16} className="text-gray-500" />
            </Button>
          </div>
        </div>
      </div>
    </>
  );
}

/* ── InfoRow ── */
function InfoRow({
  icon, label, onClick, clickable = false, small = false,
}: {
  icon: React.ReactNode;
  label: string;
  onClick?: () => void;
  clickable?: boolean;
  small?: boolean;
}) {
  return (
    <div
      className={`flex items-center gap-2 ${small ? 'text-xs' : 'text-sm'} text-gray-700 ${clickable ? 'cursor-pointer hover:text-espresso transition-colors group' : ''}`}
      onClick={onClick}
    >
      <span className="shrink-0">{icon}</span>
      <span className={`leading-snug truncate ${clickable ? 'group-hover:underline underline-offset-2' : ''}`}>
        {label}
      </span>
    </div>
  );
}
