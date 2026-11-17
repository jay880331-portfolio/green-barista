import { TrendingUp, Bookmark, Coffee } from 'lucide-react';
import { mockTrending } from '@/data/mockData';

const hotTopics = [
  { label: '#WBC2024', count: '2.1만' },
  { label: '#에티오피아예가체프', count: '1.8만' },
  { label: '#홈카페', count: '9,400' },
  { label: '#성수동카페', count: '7,200' },
  { label: '#스페셜티커피', count: '6,500' },
];

export default function NewsTrendingSidebar() {
  return (
    <div className="w-72 shrink-0 h-full border-l border-gray-100 overflow-y-auto">
      <div className="p-5 space-y-6">
        {/* Trending tags */}
        <section>
          <div className="flex items-center gap-2 mb-3">
            <TrendingUp size={14} className="text-espresso" />
            <p className="text-sm font-bold text-gray-900">커피 트렌드</p>
          </div>
          <div className="flex flex-wrap gap-2">
            {hotTopics.map((t) => (
              <button
                key={t.label}
                className="px-3 py-1.5 rounded-full text-xs bg-amber-50 text-latte border border-amber-100 hover:bg-amber-100 transition-colors"
              >
                {t.label}
                <span className="ml-1 text-gray-400">{t.count}</span>
              </button>
            ))}
          </div>
        </section>

        <div className="h-px bg-gray-100" />

        {/* Reading list */}
        <section>
          <div className="flex items-center gap-2 mb-3">
            <Bookmark size={14} className="text-espresso" />
            <p className="text-sm font-bold text-gray-900">읽기 목록</p>
          </div>
          <p className="text-xs text-gray-400">북마크한 기사가 없습니다.</p>
        </section>

        <div className="h-px bg-gray-100" />

        {/* Newsletter CTA */}
        <section>
          <div className="bg-gradient-to-br from-espresso to-sidebar-dark rounded-2xl p-4 text-white">
            <Coffee size={20} className="mb-2 opacity-80" />
            <p className="text-sm font-bold mb-1">☕ 커피 뉴스레터</p>
            <p className="text-xs opacity-70 mb-3 leading-relaxed">매주 월요일, 한 주간의 커피 업계 소식을 이메일로 받아보세요.</p>
            <button className="w-full py-1.5 bg-white/20 hover:bg-white/30 transition-colors rounded-full text-xs font-semibold">
              구독하기
            </button>
          </div>
        </section>
      </div>
    </div>
  );
}
