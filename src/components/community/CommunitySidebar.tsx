'use client';

import { useState } from 'react';
import Link from 'next/link';
import {
  Globe,
  TrendingUp,
  Zap,
  CircleHelp,
  BookOpen,
  Store,
  Megaphone,
  ArrowLeft,
} from 'lucide-react';
import { ScrollArea } from '@/components/ui/scroll-area';
import { communityMenuItems, communityCategories } from '@/data/mockData';

const menuIconMap: Record<string, React.ReactNode> = {
  globe: <Globe size={17} />,
  'trending-up': <TrendingUp size={17} />,
  zap: <Zap size={17} />,
};

const categoryIconMap: Record<string, React.ReactNode> = {
  'circle-help': <CircleHelp size={17} />,
  'book-open': <BookOpen size={17} />,
  store: <Store size={17} />,
  megaphone: <Megaphone size={17} />,
};

export default function CommunitySidebar() {
  const [activeMenu, setActiveMenu] = useState('all');
  const [activeCategory, setActiveCategory] = useState<string | null>(null);

  return (
    <div className="w-56 shrink-0 h-full flex flex-col border-r border-gray-200 bg-white">
      <ScrollArea className="flex-1">
        <div className="p-4 space-y-6">
          {/* Back to map */}
          <Link
            href="/"
            className="flex items-center gap-2 text-sm text-gray-400 hover:text-espresso transition-colors"
          >
            <ArrowLeft size={15} />
            <span>지도로 돌아가기</span>
          </Link>

          {/* Menu section */}
          <section>
            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-2 px-2">메뉴</p>
            <nav className="space-y-0.5">
              {communityMenuItems.map((item) => (
                <button
                  key={item.id}
                  onClick={() => setActiveMenu(item.id)}
                  className={`w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-sm transition-all ${
                    activeMenu === item.id
                      ? 'bg-espresso/10 text-espresso font-semibold'
                      : 'text-gray-600 hover:bg-gray-50'
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
            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-2 px-2">카테고리</p>
            <nav className="space-y-0.5">
              {communityCategories.map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => setActiveCategory(activeCategory === cat.id ? null : cat.id)}
                  className={`w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-sm transition-colors ${
                    activeCategory === cat.id
                      ? 'bg-gray-100 text-gray-900 font-medium'
                      : 'text-gray-600 hover:bg-gray-50'
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
        </div>
      </ScrollArea>
    </div>
  );
}
