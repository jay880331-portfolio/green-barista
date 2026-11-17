'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Map, Users, Plus, Newspaper, UserCircle } from 'lucide-react';
import { toast } from 'sonner';

const navItems = [
  { label: '지도', icon: Map, href: '/' },
  { label: '커뮤니티', icon: Users, href: '/community' },
  { label: '', icon: Plus, href: '#', isFab: true },
  { label: '뉴스', icon: Newspaper, href: '/news' },
  { label: '프로필', icon: UserCircle, href: '/profile' },
];

export default function BottomNav() {
  const pathname = usePathname();

  return (
    <nav className="fixed bottom-0 inset-x-0 h-16 bg-white/95 backdrop-blur-sm border-t border-gray-200 flex items-center justify-around px-1 z-[900] lg:hidden">
      {navItems.map((item) => {
        if (item.isFab) {
          return (
            <div key="fab" className="flex flex-col items-center -mt-5">
              <button
                onClick={() => toast.info('게시물 작성 기능은 준비 중입니다.')}
                className="w-14 h-14 bg-espresso rounded-full flex items-center justify-center shadow-lg hover:bg-sidebar-dark transition-colors active:scale-95"
              >
                <Plus size={22} className="text-white" />
              </button>
            </div>
          );
        }

        const isActive = pathname === item.href;

        return (
          <Link
            key={item.href}
            href={item.href}
            className={`flex flex-col items-center gap-1 py-1 px-4 rounded-xl transition-colors ${
              isActive ? 'text-espresso' : 'text-gray-400'
            }`}
          >
            <item.icon size={20} strokeWidth={isActive ? 2.5 : 1.8} />
            <span className={`text-[10px] font-medium ${isActive ? 'font-semibold' : ''}`}>
              {item.label}
            </span>
          </Link>
        );
      })}
    </nav>
  );
}
