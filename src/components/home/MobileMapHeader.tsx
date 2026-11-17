'use client';

import { Bell } from 'lucide-react';
import { useAppStore } from '@/store/useAppStore';
import { filterChips } from '@/data/mockData';
import UserMenuDropdown from '@/components/layout/UserMenuDropdown';
import { toast } from 'sonner';

export default function MobileMapHeader() {
  const { isActive, setIsActive, activeFilters, toggleFilter } = useAppStore();

  return (
    <div className="absolute top-0 inset-x-0 z-[500] lg:hidden pointer-events-none">
      {/* Top bar */}
      <div className="bg-espresso/95 backdrop-blur-sm px-4 py-3 flex items-center justify-between pointer-events-auto">
        {/* Logo */}
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 bg-white/15 rounded-lg flex items-center justify-center">
            <span className="text-sm">☕</span>
          </div>
          <span className="font-bold text-white tracking-tight">바리스타 T</span>
        </div>

        {/* Right actions */}
        <div className="flex items-center gap-2">
          {/* Active toggle */}
          <button
            onClick={() => setIsActive(!isActive)}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium transition-all ${
              isActive
                ? 'bg-online/20 text-white border border-online/40'
                : 'bg-white/10 text-white/60 border border-white/20'
            }`}
          >
            <div className={`w-2 h-2 rounded-full ${isActive ? 'bg-online' : 'bg-gray-400'}`} />
            지금 활동 중
          </button>

          <button
            onClick={() => toast.info('알림 기능은 준비 중입니다.')}
            className="p-1.5 rounded-full hover:bg-white/10 transition-colors"
          >
            <Bell size={18} className="text-white/80" />
          </button>

          {/* Avatar with dropdown */}
          <UserMenuDropdown avatarClassName="w-8 h-8 border-white/30" />
        </div>
      </div>

      {/* Filter chips row */}
      <div className="px-3 pt-2.5 pb-2 flex gap-2 overflow-x-auto pointer-events-auto">
        {filterChips.map((chip) => {
          const active = activeFilters.includes(chip.id);
          return (
            <button
              key={chip.id}
              onClick={() => toggleFilter(chip.id)}
              className={`shrink-0 px-3.5 py-1.5 rounded-full text-xs font-medium transition-all border shadow-sm backdrop-blur-sm ${
                active
                  ? 'bg-espresso text-white border-espresso'
                  : 'bg-white/90 text-gray-700 border-white/60 hover:bg-white'
              }`}
            >
              {chip.label}
            </button>
          );
        })}
      </div>
    </div>
  );
}
