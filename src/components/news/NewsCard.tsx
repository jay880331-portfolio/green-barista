'use client';

import { useState } from 'react';
import { Bookmark, BookmarkCheck, Clock, ExternalLink } from 'lucide-react';
import { toast } from 'sonner';
import { Badge } from '@/components/ui/badge';
import type { NewsArticle } from '@/types';

const categoryColors: Record<string, string> = {
  '트렌드': 'bg-blue-50 text-blue-600',
  '레시피': 'bg-amber-50 text-amber-700',
  '이벤트': 'bg-purple-50 text-purple-600',
  '원두': 'bg-green-50 text-green-700',
  '카페 투어': 'bg-red-50 text-red-600',
};

interface NewsCardProps {
  article: NewsArticle;
  featured?: boolean;
}

export default function NewsCard({ article, featured = false }: NewsCardProps) {
  const [bookmarked, setBookmarked] = useState(article.isBookmarked);

  const handleBookmark = (e: React.MouseEvent) => {
    e.stopPropagation();
    setBookmarked((prev) => !prev);
    toast.success(bookmarked ? '북마크가 해제되었습니다.' : '저장되었습니다!');
  };

  if (featured) {
    return (
      <div className="relative rounded-2xl overflow-hidden bg-white border border-gray-100 shadow-sm cursor-pointer group">
        {article.imageUrl && (
          <div className="relative h-48 overflow-hidden">
            <img
              src={article.imageUrl}
              alt={article.title}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent" />
            <div className="absolute bottom-0 left-0 p-4 right-12">
              <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full mb-2 inline-block ${categoryColors[article.category] ?? 'bg-gray-100 text-gray-600'}`}>
                {article.category}
              </span>
              <h3 className="text-white font-bold text-base leading-snug line-clamp-2">{article.title}</h3>
            </div>
          </div>
        )}
        <button
          onClick={handleBookmark}
          className="absolute top-3 right-3 w-8 h-8 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center shadow-sm hover:bg-white transition-colors"
        >
          {bookmarked
            ? <BookmarkCheck size={15} className="text-espresso fill-espresso" />
            : <Bookmark size={15} className="text-gray-500" />}
        </button>
        <div className="px-4 py-3">
          <p className="text-xs text-gray-500 line-clamp-2 mb-2">{article.summary}</p>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-[10px] text-gray-400">
              <span className="font-medium text-gray-500">{article.source}</span>
              <span>·</span>
              <span>{article.timeAgo}</span>
            </div>
            <div className="flex items-center gap-1 text-[10px] text-gray-400">
              <Clock size={10} />
              <span>{article.readTime} 읽기</span>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden flex gap-3 p-4 cursor-pointer hover:border-gray-200 transition-colors group">
      {article.imageUrl && (
        <div className="shrink-0 w-20 h-20 rounded-xl overflow-hidden">
          <img
            src={article.imageUrl}
            alt={article.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
        </div>
      )}
      <div className="flex-1 min-w-0">
        <div className="flex items-start justify-between gap-2 mb-1">
          <span className={`text-[9px] font-bold px-2 py-0.5 rounded-full shrink-0 ${categoryColors[article.category] ?? 'bg-gray-100 text-gray-600'}`}>
            {article.category}
          </span>
          <button onClick={handleBookmark} className="shrink-0 mt-0.5">
            {bookmarked
              ? <BookmarkCheck size={14} className="text-espresso fill-espresso" />
              : <Bookmark size={14} className="text-gray-300 hover:text-gray-500 transition-colors" />}
          </button>
        </div>
        <h3 className="text-sm font-semibold text-gray-900 line-clamp-2 leading-snug mb-1">{article.title}</h3>
        <div className="flex items-center gap-2 text-[10px] text-gray-400">
          <span className="font-medium text-gray-500">{article.source}</span>
          <span>·</span>
          <span>{article.timeAgo}</span>
          <span>·</span>
          <Clock size={9} />
          <span>{article.readTime}</span>
        </div>
      </div>
    </div>
  );
}
