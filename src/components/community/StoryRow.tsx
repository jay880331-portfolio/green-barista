'use client';

import { Plus } from 'lucide-react';
import { mockStories } from '@/data/mockData';

export default function StoryRow() {
  return (
    <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
      <div className="flex items-center gap-5 overflow-x-auto scrollbar-hidden">
        {/* Add my story */}
        <div className="flex flex-col items-center gap-1.5 shrink-0 cursor-pointer group">
          <div className="w-16 h-16 rounded-full border-2 border-dashed border-gray-300 flex items-center justify-center bg-gray-50 group-hover:border-latte transition-colors">
            <Plus size={22} className="text-gray-400 group-hover:text-latte transition-colors" />
          </div>
          <span className="text-[11px] text-gray-500 text-center leading-tight">내 스토리</span>
        </div>

        {/* Stories */}
        {mockStories.slice(1).map((story) => (
          <div key={story.id} className="flex flex-col items-center gap-1.5 shrink-0 cursor-pointer">
            <div
              className="w-16 h-16 rounded-full p-0.5"
              style={{
                background: story.hasUnread
                  ? `conic-gradient(${story.ringColor || '#C8914A'}, #D4A853, ${story.ringColor || '#C8914A'})`
                  : 'transparent',
                border: story.hasUnread ? 'none' : '2px solid #e5e7eb',
              }}
            >
              <div className="w-full h-full rounded-full overflow-hidden border-2 border-white">
                <img
                  src={story.user.avatar}
                  alt={story.user.name}
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
            <span className="text-[11px] text-gray-600 text-center leading-tight max-w-[60px] truncate">
              {story.user.name.split(' ')[0]}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
