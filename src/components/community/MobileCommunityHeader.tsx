'use client';

import { useState } from 'react';
import { Bell } from 'lucide-react';
import { communityMenuItems } from '@/data/mockData';
import UserMenuDropdown from '@/components/layout/UserMenuDropdown';
import { toast } from 'sonner';

export default function MobileCommunityHeader() {
  const [activeMenu, setActiveMenu] = useState('all');

  return (
    <div className="absolute top-0 inset-x-0 z-[500] lg:hidden pointer-events-none">
      {/* Top bar */}
      <div className="bg-espresso/95 backdrop-blur-sm px-4 py-3 flex items-center justify-between pointer-events-auto">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 bg-white/15 rounded-lg flex items-center justify-center">
            <span className="text-sm">☕</span>
          </div>
          <span className="font-bold text-white tracking-tight">바리스타 T</span>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-white/70 text-sm font-medium">전체 커뮤니티</span>
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

      {/* Menu chips */}
      <div className="bg-espresso/90 backdrop-blur-sm px-3 pb-2.5 pt-1 flex gap-2 pointer-events-auto">
        {communityMenuItems.map((item) => (
          <button
            key={item.id}
            onClick={() => setActiveMenu(item.id)}
            className={`shrink-0 px-3.5 py-1.5 rounded-full text-xs font-medium transition-all border ${
              activeMenu === item.id
                ? 'bg-white text-espresso border-white'
                : 'bg-white/15 text-white/80 border-white/20 hover:bg-white/25'
            }`}
          >
            {item.label}
            {item.isNew && (
              <span className="ml-1.5 text-[8px] font-bold bg-blue-500 text-white px-1 py-0.5 rounded-full">
                N
              </span>
            )}
          </button>
        ))}
      </div>
    </div>
  );
}
