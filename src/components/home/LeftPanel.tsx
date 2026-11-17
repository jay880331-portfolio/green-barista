'use client';

import { useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import {
  Search, MapPin, Plus, Settings,
  Globe, TrendingUp as TrendingUpIcon, Zap, CircleHelp, BookOpen, Store, Megaphone, UserPlus,
  Bell,
} from 'lucide-react';
import UserMenuDropdown from '@/components/layout/UserMenuDropdown';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Button } from '@/components/ui/button';
import { useAppStore } from '@/store/useAppStore';
import {
  mockNewsPosts, filterChips, currentUser,
  communityMenuItems, communityCategories, mockTrending, mockRecommended,
} from '@/data/mockData';
import NewsItem from './NewsItem';

const menuIconMap: Record<string, React.ReactNode> = {
  globe: <Globe size={16} />,
  'trending-up': <TrendingUpIcon size={16} />,
  zap: <Zap size={16} />,
};
const categoryIconMap: Record<string, React.ReactNode> = {
  'circle-help': <CircleHelp size={15} />,
  'book-open': <BookOpen size={15} />,
  store: <Store size={15} />,
  megaphone: <Megaphone size={15} />,
};

export default function LeftPanel() {
  const router = useRouter();
  const pathname = usePathname();
  const { activeFilters, toggleFilter, searchRadius, followedBaristas, toggleFollow } = useAppStore();

  const isOnCommunity = pathname === '/community';
  const defaultTab = isOnCommunity ? 'community' : 'map';
  const [activeTab, setActiveTab] = useState(defaultTab);
  const [postText, setPostText] = useState('');
  const [communitySearch, setCommunitySearch] = useState('');
  const [activeMenu, setActiveMenu] = useState('all');
  const [activeCategory, setActiveCategory] = useState<string | null>(null);

  const radiusLabel =
    searchRadius < 1 ? `${searchRadius * 1000}m` : `${searchRadius.toFixed(1)}km`;

  const handleTabClick = (tabId: string) => {
    setActiveTab(tabId);
    if (tabId === 'map' && isOnCommunity) router.push('/');
    if (tabId === 'community' && !isOnCommunity) router.push('/community');
  };

  const tabTriggerCls =
    'flex-1 rounded-none h-full text-sm data-[state=active]:border-b-2 data-[state=active]:border-espresso data-[state=active]:text-espresso data-[state=active]:bg-transparent data-[state=active]:shadow-none';

  return (
    <div className="w-[360px] shrink-0 hidden lg:flex flex-col h-full bg-gray-50 border-r border-gray-200">
      {/* ── Espresso header ─────────────────────── */}
      <div className="bg-espresso px-5 py-4 shrink-0">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 bg-white/10 rounded-lg flex items-center justify-center">
              <span className="text-base">☕</span>
            </div>
            <span className="text-white font-bold text-lg tracking-tight">바리스타 T</span>
          </div>
          <div className="flex items-center gap-1.5">
            <button
              onClick={() => router.push('/news')}
              className="p-1.5 rounded-full hover:bg-white/10 transition-colors"
              title="알림"
            >
              <Bell size={16} className="text-white/70" />
            </button>
            {/* Profile / Auth dropdown */}
            <UserMenuDropdown avatarClassName="w-8 h-8 border-white/30" />
          </div>
        </div>
      </div>

      {/* ── Tabs ─────────────────────────────────── */}
      <Tabs value={activeTab} className="flex flex-col flex-1 overflow-hidden">
        <TabsList className="w-full rounded-none bg-white border-b border-gray-200 h-12 px-0 gap-0 shrink-0">
          <TabsTrigger value="map" className={tabTriggerCls} onClick={() => handleTabClick('map')}>
            지도 홈
          </TabsTrigger>
          <TabsTrigger value="community" className={tabTriggerCls} onClick={() => handleTabClick('community')}>
            전체 커뮤니티
          </TabsTrigger>
          <TabsTrigger value="news" className={tabTriggerCls} onClick={() => handleTabClick('news')}>
            뉴스
          </TabsTrigger>
        </TabsList>

        {/* ── Map tab ──────────────────────────────── */}
        <TabsContent value="map" className="flex flex-col flex-1 overflow-hidden mt-0">
          <div className="px-4 pt-4 pb-2 shrink-0">
            <div className="relative">
              <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <Input
                placeholder="장소, 바리스타, 키워드 검색"
                className="pl-9 h-10 bg-gray-100 border-transparent rounded-full text-sm focus-visible:ring-0 focus-visible:border-gray-300"
              />
            </div>
          </div>

          <div className="px-4 pb-3 flex gap-2 flex-wrap shrink-0">
            {filterChips.map((chip) => (
              <button
                key={chip.id}
                onClick={() => toggleFilter(chip.id)}
                className={`px-3.5 py-1.5 rounded-full text-xs font-medium transition-all border ${
                  activeFilters.includes(chip.id)
                    ? 'bg-espresso text-white border-espresso'
                    : 'bg-white text-gray-600 border-gray-200 hover:border-gray-300'
                }`}
              >
                {chip.label}
              </button>
            ))}
          </div>

          <div className="px-4 pb-2 flex items-center justify-between shrink-0">
            <div className="flex items-center gap-1.5">
              <MapPin size={13} className="text-espresso" />
              <span className="text-sm font-bold text-gray-900">내 주변 소식</span>
            </div>
            <span className="text-[11px] text-gray-400">한남동 기준 {radiusLabel}</span>
          </div>

          <div className="px-4 pb-3 shrink-0">
            <div className="flex items-center gap-2 bg-white rounded-xl border border-gray-200 px-3 py-2.5">
              <div className="w-7 h-7 bg-gray-100 rounded-full flex items-center justify-center shrink-0">
                <span className="text-xs">✏️</span>
              </div>
              <input
                type="text"
                placeholder="새로운 소식을 남겨보세요..."
                value={postText}
                onChange={(e) => setPostText(e.target.value)}
                className="flex-1 text-sm bg-transparent outline-none text-gray-500 placeholder:text-gray-400"
              />
              <button className="w-7 h-7 bg-espresso rounded-full flex items-center justify-center shrink-0 hover:opacity-90 transition-opacity">
                <Plus size={14} className="text-white" />
              </button>
            </div>
          </div>

          <ScrollArea className="flex-1 px-4">
            <div className="space-y-3 pb-4">
              {mockNewsPosts.map((post) => (
                <NewsItem key={post.id} post={post} />
              ))}
            </div>
          </ScrollArea>
        </TabsContent>

        {/* ── Community tab ─────────────────────────── */}
        <TabsContent value="community" className="flex flex-col flex-1 overflow-hidden mt-0">
          <div className="px-4 pt-4 pb-3 shrink-0">
            <div className="relative">
              <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <Input
                value={communitySearch}
                onChange={(e) => setCommunitySearch(e.target.value)}
                placeholder="원두, 레시피, 카페 검색..."
                className="pl-9 h-10 bg-gray-100 border-transparent rounded-full text-sm focus-visible:ring-0 focus-visible:border-gray-300"
              />
            </div>
          </div>

          <ScrollArea className="flex-1">
            <div className="px-4 pb-6 space-y-5">
              {/* Menu */}
              <section>
                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-2 px-1">메뉴</p>
                <nav className="space-y-0.5">
                  {communityMenuItems.map((item) => (
                    <button
                      key={item.id}
                      onClick={() => setActiveMenu(item.id)}
                      className={`w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-sm transition-all ${
                        activeMenu === item.id
                          ? 'bg-espresso/10 text-espresso font-semibold'
                          : 'text-gray-600 hover:bg-gray-100'
                      }`}
                    >
                      <span className={activeMenu === item.id ? 'text-espresso' : 'text-gray-400'}>
                        {menuIconMap[item.icon]}
                      </span>
                      {item.label}
                      {item.isNew && (
                        <span className="ml-auto text-[9px] font-bold bg-blue-500 text-white px-1.5 py-0.5 rounded-full">
                          NEW
                        </span>
                      )}
                    </button>
                  ))}
                </nav>
              </section>

              {/* Categories */}
              <section>
                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-2 px-1">카테고리</p>
                <nav className="space-y-0.5">
                  {communityCategories.map((cat) => (
                    <button
                      key={cat.id}
                      onClick={() => setActiveCategory(activeCategory === cat.id ? null : cat.id)}
                      className={`w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-sm transition-colors ${
                        activeCategory === cat.id
                          ? 'bg-gray-100 text-gray-900 font-medium'
                          : 'text-gray-600 hover:bg-gray-100'
                      }`}
                    >
                      <div
                        className="w-7 h-7 rounded-lg flex items-center justify-center shrink-0"
                        style={{ backgroundColor: cat.color }}
                      >
                        <span className="text-white">{categoryIconMap[cat.icon]}</span>
                      </div>
                      {cat.label}
                    </button>
                  ))}
                </nav>
              </section>

              <div className="h-px bg-gray-200" />

              {/* Trending */}
              <section>
                <div className="flex items-center gap-2 mb-3">
                  <TrendingUpIcon size={14} className="text-espresso" />
                  <p className="text-sm font-bold text-gray-900">실시간 트렌드</p>
                </div>
                <div className="space-y-3">
                  {mockTrending.map((topic) => (
                    <div key={topic.id} className="group cursor-pointer px-1">
                      <p className="text-[10px] text-gray-400 mb-0.5">{topic.category}</p>
                      <p className="text-sm font-bold text-gray-900 group-hover:text-espresso transition-colors">
                        {topic.tag}
                      </p>
                      <p className="text-[10px] text-gray-400">{topic.count}</p>
                    </div>
                  ))}
                </div>
              </section>

              <div className="h-px bg-gray-200" />

              {/* Recommended */}
              <section>
                <div className="flex items-center gap-2 mb-3">
                  <UserPlus size={14} className="text-espresso" />
                  <p className="text-sm font-bold text-gray-900">추천 바리스타</p>
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
                            className="w-9 h-9 rounded-full object-cover border-2 border-gray-100"
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
                          className={`text-xs h-7 px-2.5 rounded-full transition-all ${
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
            </div>
          </ScrollArea>
        </TabsContent>

        {/* ── News tab ─────────────────────────────── */}
        <TabsContent value="news" className="flex-1 mt-0">
          <div className="flex flex-col items-center justify-center h-full gap-3 text-gray-400">
            <span className="text-3xl">📰</span>
            <p className="text-sm font-medium text-gray-700">커피 뉴스</p>
            <p className="text-xs text-gray-400 text-center px-6">
              최신 커피 업계 소식을 확인하세요.
            </p>
            <button
              onClick={() => router.push('/news')}
              className="mt-1 px-5 py-2 bg-espresso text-white text-xs font-semibold rounded-full hover:bg-sidebar-dark transition-colors"
            >
              뉴스 보러가기
            </button>
          </div>
        </TabsContent>
      </Tabs>

      {/* ── User footer ──────────────────────────── */}
      <div className="px-4 py-3 bg-white border-t border-gray-200 flex items-center justify-between shrink-0">
        <button
          onClick={() => router.push('/profile')}
          className="flex items-center gap-2.5 hover:opacity-80 transition-opacity"
        >
          <div className="relative">
            <img
              src={currentUser.avatar}
              alt={currentUser.name}
              className="w-9 h-9 rounded-full object-cover border-2 border-white shadow-sm"
            />
            <div className="absolute bottom-0 right-0 w-3 h-3 bg-online rounded-full border-2 border-white" />
          </div>
          <div className="text-left">
            <p className="text-sm font-semibold text-gray-900">{currentUser.name}</p>
            <p className="text-[11px] text-online font-medium">● 온라인</p>
          </div>
        </button>
        <button
          onClick={() => router.push('/profile')}
          className="p-2 rounded-full hover:bg-gray-100 transition-colors"
          title="프로필 설정"
        >
          <Settings size={16} className="text-gray-400" />
        </button>
      </div>
    </div>
  );
}
