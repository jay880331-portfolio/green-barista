'use client';

import { useState } from 'react';
import { Settings, MapPin, Link as LinkIcon, Crown, UserCheck, UserPlus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import type { ProfileUser } from '@/types';
import Link from 'next/link';

interface ProfileHeaderProps {
  user: ProfileUser;
  isOwnProfile?: boolean;
}

export default function ProfileHeader({ user, isOwnProfile = true }: ProfileHeaderProps) {
  const [isFollowing, setIsFollowing] = useState(false);

  const handleFollow = () => {
    setIsFollowing((prev) => !prev);
    toast.success(isFollowing ? `${user.name} 팔로우를 취소했습니다.` : `${user.name}님을 팔로우했습니다.`);
  };

  return (
    <div className="bg-white">
      {/* Cover image */}
      <div className="relative h-36 md:h-48 bg-gradient-to-br from-espresso to-sidebar-dark overflow-hidden">
        {user.coverImage && (
          <img
            src={user.coverImage}
            alt="커버 이미지"
            className="w-full h-full object-cover opacity-60"
          />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent" />
        {isOwnProfile && (
          <Link
            href="/profile#settings"
            className="absolute top-3 right-3 w-8 h-8 bg-black/30 backdrop-blur-sm rounded-full flex items-center justify-center hover:bg-black/50 transition-colors"
            title="설정"
          >
            <Settings size={15} className="text-white" />
          </Link>
        )}
      </div>

      {/* Avatar + actions row */}
      <div className="px-4 md:px-6">
        <div className="flex items-end justify-between -mt-12 mb-3">
          <div className="relative">
            <img
              src={user.avatar}
              alt={user.name}
              className="w-20 h-20 md:w-24 md:h-24 rounded-full object-cover border-4 border-white shadow-md"
            />
            {user.isOnline && (
              <div className="absolute bottom-1 right-1 w-4 h-4 bg-online rounded-full border-2 border-white" />
            )}
            {user.isPremium && (
              <div className="absolute -top-1 -right-1 w-6 h-6 bg-gold rounded-full flex items-center justify-center border-2 border-white">
                <Crown size={11} className="text-white" />
              </div>
            )}
          </div>

          <div className="flex gap-2 mb-1">
            {isOwnProfile ? (
              <Link href="/profile">
                <Button variant="outline" size="sm" className="h-8 px-4 rounded-full text-xs border-gray-300 hover:border-espresso hover:text-espresso transition-colors">
                  프로필 편집
                </Button>
              </Link>
            ) : (
              <>
                <Button
                  size="sm"
                  variant={isFollowing ? 'secondary' : 'default'}
                  onClick={handleFollow}
                  className={`h-8 px-4 rounded-full text-xs gap-1.5 transition-all ${
                    isFollowing
                      ? 'text-gray-600'
                      : 'bg-espresso hover:bg-sidebar-dark text-white border-espresso'
                  }`}
                >
                  {isFollowing ? <UserCheck size={13} /> : <UserPlus size={13} />}
                  {isFollowing ? '팔로잉' : '팔로우'}
                </Button>
                <Button variant="outline" size="sm" className="h-8 px-4 rounded-full text-xs border-gray-300">
                  메시지
                </Button>
              </>
            )}
          </div>
        </div>

        {/* Name + meta */}
        <div className="mb-4">
          <div className="flex items-center gap-2 mb-0.5">
            <h1 className="text-lg font-bold text-gray-900">{user.name}</h1>
            {user.isPremium && (
              <span className="text-[10px] font-bold bg-gold/10 text-gold border border-gold/30 px-2 py-0.5 rounded-full">
                PREMIUM
              </span>
            )}
          </div>
          <p className="text-sm text-gray-500 mb-2">{user.title} · {user.specialty}</p>
          {user.bio && (
            <p className="text-sm text-gray-700 leading-relaxed mb-2">{user.bio}</p>
          )}
          <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-gray-400">
            {user.district && (
              <span className="flex items-center gap-1">
                <MapPin size={11} />
                {user.district}
              </span>
            )}
            {user.website && (
              <span className="flex items-center gap-1 text-latte">
                <LinkIcon size={11} />
                {user.website}
              </span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
