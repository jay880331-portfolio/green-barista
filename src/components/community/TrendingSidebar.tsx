'use client';

import { TrendingUp, UserPlus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { mockTrending, mockRecommended } from '@/data/mockData';
import { useAppStore } from '@/store/useAppStore';

export default function TrendingSidebar() {
  const { followedBaristas, toggleFollow } = useAppStore();

  return (
    <div className="w-72 shrink-0 h-full overflow-y-auto border-l border-gray-200 bg-white">
      <div className="p-5 space-y-6">
        {/* Trending */}
        <section>
          <div className="flex items-center gap-2 mb-4">
            <TrendingUp size={16} className="text-espresso" />
            <h3 className="font-bold text-gray-900">실시간 트렌드</h3>
          </div>
          <div className="space-y-3">
            {mockTrending.map((topic) => (
              <div key={topic.id} className="group cursor-pointer">
                <p className="text-[11px] text-gray-400 mb-0.5">{topic.category}</p>
                <p className="text-sm font-bold text-gray-900 group-hover:text-espresso transition-colors">
                  {topic.tag}
                </p>
                <p className="text-[11px] text-gray-400">{topic.count}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Divider */}
        <div className="h-px bg-gray-100" />

        {/* Recommended baristas */}
        <section>
          <div className="flex items-center gap-2 mb-4">
            <UserPlus size={16} className="text-espresso" />
            <h3 className="font-bold text-gray-900">추천 바리스타</h3>
          </div>
          <div className="space-y-3">
            {mockRecommended.map(({ barista, role }) => {
              const isFollowing = followedBaristas.includes(barista.id);
              return (
                <div key={barista.id} className="flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <img
                      src={barista.avatar}
                      alt={barista.name}
                      className="w-10 h-10 rounded-full object-cover border-2 border-gray-100"
                    />
                    <div>
                      <p className="text-sm font-semibold text-gray-900">{barista.name}</p>
                      <p className="text-[11px] text-gray-400">{role}</p>
                    </div>
                  </div>
                  <Button
                    size="sm"
                    variant={isFollowing ? 'secondary' : 'outline'}
                    onClick={() => toggleFollow(barista.id)}
                    className={`text-xs h-8 px-3 rounded-full transition-all ${
                      isFollowing
                        ? 'text-gray-500'
                        : 'border-espresso text-espresso hover:bg-espresso hover:text-white'
                    }`}
                  >
                    {isFollowing ? '팔로잉' : '팔로우'}
                  </Button>
                </div>
              );
            })}
          </div>
        </section>

        {/* Divider */}
        <div className="h-px bg-gray-100" />

        {/* Footer links */}
        <div className="space-y-1">
          <div className="flex flex-wrap gap-x-3 gap-y-1">
            {['이용약관', '개인정보처리방침', '커뮤니티 가이드라인'].map((link) => (
              <button key={link} className="text-[11px] text-gray-400 hover:text-gray-600 transition-colors">
                {link}
              </button>
            ))}
          </div>
          <button className="text-[11px] text-gray-400 hover:text-gray-600 transition-colors block">
            문의하기
          </button>
          <p className="text-[11px] text-gray-300 pt-1">© 2025 Barista Hub Corp.</p>
        </div>
      </div>
    </div>
  );
}
