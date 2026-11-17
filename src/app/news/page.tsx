'use client';

import { useState, useMemo } from 'react';
import { Search, Newspaper } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import NewsCard from '@/components/news/NewsCard';
import NewsCategoryFilter from '@/components/news/NewsCategoryFilter';
import NewsTrendingSidebar from '@/components/news/NewsTrendingSidebar';
import BottomNav from '@/components/layout/BottomNav';
import { mockNewsArticles, newsCategories } from '@/data/mockData';

export default function NewsPage() {
  const [activeCategory, setActiveCategory] = useState('전체');
  const [searchQuery, setSearchQuery] = useState('');

  const filtered = useMemo(() => {
    let list = mockNewsArticles;
    if (activeCategory !== '전체') {
      list = list.filter((a) => a.category === activeCategory);
    }
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      list = list.filter(
        (a) =>
          a.title.toLowerCase().includes(q) ||
          a.summary.toLowerCase().includes(q) ||
          a.tags.some((t) => t.toLowerCase().includes(q))
      );
    }
    return list;
  }, [activeCategory, searchQuery]);

  const featured = filtered[0];
  const rest = filtered.slice(1);

  return (
    <div className="flex h-screen overflow-hidden bg-gray-50">
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Mobile header */}
        <div className="bg-espresso px-4 py-3 flex items-center gap-3 lg:hidden shrink-0">
          <Newspaper size={18} className="text-white" />
          <span className="text-white font-bold text-base">커피 뉴스</span>
        </div>

        {/* Desktop header */}
        <div className="hidden lg:flex items-center justify-between bg-white border-b border-gray-100 px-6 py-4 shrink-0">
          <div className="flex items-center gap-2">
            <Newspaper size={18} className="text-espresso" />
            <h1 className="text-lg font-bold text-gray-900">커피 뉴스</h1>
          </div>
          <div className="relative w-64">
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <Input
              placeholder="뉴스 검색..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9 h-9 bg-gray-100 border-transparent rounded-full text-sm focus-visible:ring-0 focus-visible:border-gray-300"
            />
          </div>
        </div>

        <div className="flex flex-1 overflow-hidden">
          <ScrollArea className="flex-1">
            <div className="max-w-2xl mx-auto xl:max-w-none p-4 pb-24 lg:pb-6 space-y-4">
              {/* Mobile search */}
              <div className="relative lg:hidden">
                <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <Input
                  placeholder="뉴스 검색..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-9 h-10 bg-white border-gray-200 rounded-full text-sm focus-visible:ring-0"
                />
              </div>

              {/* Category filter */}
              <NewsCategoryFilter
                categories={newsCategories}
                active={activeCategory}
                onChange={setActiveCategory}
              />

              {/* Content */}
              {filtered.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-16 text-gray-400 gap-3">
                  <Newspaper size={40} strokeWidth={1.5} />
                  <p className="text-sm">검색 결과가 없습니다.</p>
                </div>
              ) : (
                <>
                  {/* Featured */}
                  {featured && <NewsCard article={featured} featured />}

                  {/* Rest */}
                  {rest.length > 0 && (
                    <div className="space-y-3">
                      <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">최신 소식</p>
                      {rest.map((article) => (
                        <NewsCard key={article.id} article={article} />
                      ))}
                    </div>
                  )}
                </>
              )}
            </div>
          </ScrollArea>

          {/* Right sidebar — xl only */}
          <div className="hidden xl:block">
            <NewsTrendingSidebar />
          </div>
        </div>
      </div>

      <BottomNav />
    </div>
  );
}
