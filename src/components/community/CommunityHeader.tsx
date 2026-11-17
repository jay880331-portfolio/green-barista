'use client';

import { useState } from 'react';
import { Search, Bell, Menu, X, Coffee, CheckCheck } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { currentUser } from '@/data/mockData';
import { useAppStore } from '@/store/useAppStore';
import CommunitySidebar from './CommunitySidebar';

const mockNotifications = [
  { id: '1', avatar: 'https://i.pravatar.cc/40?u=jihu-barista', text: '지후 바리스타님이 회원님의 게시물에 좋아요를 눌렀습니다.', time: '2분 전', unread: true },
  { id: '2', avatar: 'https://i.pravatar.cc/40?u=minjun-roasting', text: '민준님이 댓글을 남겼습니다: "저도 테이스팅 가고 싶네요!"', time: '15분 전', unread: true },
  { id: '3', avatar: 'https://i.pravatar.cc/40?u=hyunwoo-brewing', text: '이현우님이 팔로우하기 시작했습니다.', time: '1시간 전', unread: false },
];

export default function CommunityHeader() {
  const { toggleCommunitySidebar, communitySidebarOpen } = useAppStore();
  const [notifOpen, setNotifOpen] = useState(false);
  const [notifications, setNotifications] = useState(mockNotifications);

  const unreadCount = notifications.filter((n) => n.unread).length;

  const markAllRead = () =>
    setNotifications((prev) => prev.map((n) => ({ ...n, unread: false })));

  const NotifContent = () => (
    <PopoverContent align="end" className="w-80 p-0 rounded-2xl overflow-hidden shadow-xl">
      <div className="flex items-center justify-between px-4 py-3 border-b border-gray-100">
        <span className="font-bold text-gray-900">알림</span>
        <button
          onClick={markAllRead}
          className="flex items-center gap-1 text-xs text-espresso hover:text-sidebar-dark font-medium"
        >
          <CheckCheck size={13} />
          모두 읽음
        </button>
      </div>
      <div className="divide-y divide-gray-50 max-h-72 overflow-y-auto">
        {notifications.map((n) => (
          <div
            key={n.id}
            onClick={() =>
              setNotifications((prev) =>
                prev.map((notif) => (notif.id === n.id ? { ...notif, unread: false } : notif))
              )
            }
            className={`flex items-start gap-3 px-4 py-3 hover:bg-gray-50 cursor-pointer transition-colors ${n.unread ? 'bg-amber-50/50' : ''}`}
          >
            <img src={n.avatar} alt="" className="w-9 h-9 rounded-full object-cover shrink-0" />
            <div className="flex-1 min-w-0">
              <p className="text-xs text-gray-700 leading-snug">{n.text}</p>
              <p className="text-[10px] text-gray-400 mt-0.5">{n.time}</p>
            </div>
            {n.unread && <div className="w-2 h-2 bg-espresso rounded-full shrink-0 mt-1" />}
          </div>
        ))}
      </div>
    </PopoverContent>
  );

  return (
    <header className="h-14 bg-espresso flex items-center px-4 gap-3 shrink-0 z-10 shadow-sm">
      {/* Left: Logo + hamburger */}
      <div className="flex items-center gap-2 shrink-0">
        {/* Desktop: inline sidebar toggle */}
        <button
          onClick={toggleCommunitySidebar}
          className="hidden lg:flex p-1.5 rounded-lg hover:bg-white/10 transition-colors text-white/70 hover:text-white"
          title={communitySidebarOpen ? '사이드바 닫기' : '사이드바 열기'}
        >
          {communitySidebarOpen ? <X size={18} /> : <Menu size={18} />}
        </button>

        {/* Mobile: Sheet drawer trigger */}
        <Sheet>
          <SheetTrigger asChild>
            <button className="lg:hidden p-1.5 rounded-lg hover:bg-white/10 transition-colors text-white/70 hover:text-white">
              <Menu size={18} />
            </button>
          </SheetTrigger>
          <SheetContent side="left" className="w-72 p-0 border-r border-gray-200">
            <CommunitySidebar />
          </SheetContent>
        </Sheet>

        {/* Brand */}
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 bg-white/15 rounded-lg flex items-center justify-center">
            <Coffee size={14} className="text-white" />
          </div>
          <span className="font-bold text-white tracking-tight">바리스타 T</span>
        </div>
      </div>

      {/* Center: Search — desktop */}
      <div className="hidden md:flex flex-1 max-w-xl mx-auto relative">
        <Search size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-white/50" />
        <Input
          placeholder="원두, 레시피, 카페 검색..."
          className="pl-9 h-9 bg-white/12 border-white/20 rounded-full text-sm text-white placeholder:text-white/50 focus-visible:ring-0 focus-visible:bg-white/20 focus-visible:border-white/30"
        />
      </div>

      {/* Mobile: page label */}
      <div className="md:hidden flex-1">
        <p className="text-white/80 text-sm font-medium">전체 커뮤니티</p>
      </div>

      {/* Right: mobile search + bell + avatar */}
      <div className="flex items-center gap-1 shrink-0">
        <button className="md:hidden p-2 rounded-full hover:bg-white/10 transition-colors">
          <Search size={18} className="text-white/80" />
        </button>

        <Popover open={notifOpen} onOpenChange={setNotifOpen}>
          <PopoverTrigger asChild>
            <button className="relative p-2 rounded-full hover:bg-white/10 transition-colors">
              <Bell size={18} className="text-white/80" />
              {unreadCount > 0 && (
                <div className="absolute top-1.5 right-1.5 w-4 h-4 bg-red-500 rounded-full flex items-center justify-center">
                  <span className="text-[9px] text-white font-bold">{unreadCount}</span>
                </div>
              )}
            </button>
          </PopoverTrigger>
          <NotifContent />
        </Popover>

        <button className="flex items-center gap-2 hover:bg-white/10 rounded-xl px-2 py-1.5 transition-colors">
          <img
            src={currentUser.avatar}
            alt={currentUser.name}
            className="w-8 h-8 rounded-full object-cover border-2 border-white/30"
          />
          <span className="hidden lg:block text-sm font-medium text-white/90">{currentUser.name}</span>
        </button>
      </div>
    </header>
  );
}
