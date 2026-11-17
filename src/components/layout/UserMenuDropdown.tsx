'use client';

import { useRouter } from 'next/navigation';
import { User, LogIn, UserPlus, Settings, LogOut, Bell } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useAppStore } from '@/store/useAppStore';
import { currentUser } from '@/data/mockData';
import { toast } from 'sonner';

interface UserMenuDropdownProps {
  /** Extra classes for the trigger wrapper button */
  triggerClassName?: string;
  /** Extra classes for the avatar img */
  avatarClassName?: string;
  /** Alignment of the dropdown */
  align?: 'start' | 'end' | 'center';
}

export default function UserMenuDropdown({
  triggerClassName = '',
  avatarClassName = 'w-8 h-8 border-white/30',
  align = 'end',
}: UserMenuDropdownProps) {
  const router = useRouter();
  const { isLoggedIn, login, logout } = useAppStore();

  const handleLogout = () => {
    logout();
    toast.success('로그아웃 되었습니다.');
    router.push('/');
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button
          className={`focus:outline-none rounded-full transition-all hover:ring-2 hover:ring-white/50 ${triggerClassName}`}
          aria-label="프로필 메뉴"
        >
          <img
            src={currentUser.avatar}
            alt={currentUser.name}
            className={`rounded-full object-cover border-2 cursor-pointer ${avatarClassName}`}
          />
        </button>
      </DropdownMenuTrigger>

      <DropdownMenuContent align={align} className="w-52 mt-1">
        {isLoggedIn ? (
          <>
            {/* User info header */}
            <div className="px-3 py-2.5 border-b border-gray-100 mb-1">
              <p className="text-sm font-semibold text-gray-900 truncate">{currentUser.name}</p>
              <p className="text-xs text-gray-400 truncate">{currentUser.title} · {currentUser.district}</p>
            </div>

            <DropdownMenuItem
              className="gap-2 cursor-pointer"
              onClick={() => router.push('/profile')}
            >
              <User size={14} className="text-gray-400" />
              내 프로필
            </DropdownMenuItem>

            <DropdownMenuItem
              className="gap-2 cursor-pointer"
              onClick={() => toast.info('알림 기능은 준비 중입니다.')}
            >
              <Bell size={14} className="text-gray-400" />
              알림
            </DropdownMenuItem>

            <DropdownMenuItem
              className="gap-2 cursor-pointer"
              onClick={() => router.push('/profile')}
            >
              <Settings size={14} className="text-gray-400" />
              설정
            </DropdownMenuItem>

            <DropdownMenuSeparator />

            <DropdownMenuItem
              className="gap-2 cursor-pointer text-red-500 focus:text-red-500 focus:bg-red-50"
              onClick={handleLogout}
            >
              <LogOut size={14} />
              로그아웃
            </DropdownMenuItem>
          </>
        ) : (
          <>
            <div className="px-3 py-2.5 border-b border-gray-100 mb-1">
              <p className="text-sm font-semibold text-gray-900">바리스타 커뮤니티</p>
              <p className="text-xs text-gray-400">로그인하여 활동해보세요</p>
            </div>

            <DropdownMenuItem
              className="gap-2 cursor-pointer"
              onClick={() => router.push('/login')}
            >
              <LogIn size={14} className="text-gray-400" />
              로그인
            </DropdownMenuItem>

            <DropdownMenuItem
              className="gap-2 cursor-pointer"
              onClick={() => router.push('/signup')}
            >
              <UserPlus size={14} className="text-gray-400" />
              회원가입
            </DropdownMenuItem>
          </>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
