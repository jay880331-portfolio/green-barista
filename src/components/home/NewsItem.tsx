'use client';

import { Heart, MessageCircle, Edit2, Trash2 } from 'lucide-react';
import type { NewsPost } from '@/types';

interface NewsItemProps {
  post: NewsPost;
}

export default function NewsItem({ post }: NewsItemProps) {
  return (
    <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100">
      {/* Header */}
      <div className="flex items-start justify-between mb-2">
        <div className="flex items-center gap-2.5">
          <img
            src={post.author.avatar}
            alt={post.author.name}
            className="w-9 h-9 rounded-full object-cover border-2 border-white shadow-sm"
          />
          <div>
            <p className="text-sm font-semibold text-gray-900 leading-tight">{post.author.name}</p>
            <p className="text-[11px] text-gray-400">
              {post.timeAgo} · {post.location}
            </p>
          </div>
        </div>
        {post.isOwn && (
          <div className="flex items-center gap-1">
            <button className="p-1.5 rounded-full hover:bg-gray-100 transition-colors">
              <Edit2 size={13} className="text-gray-400" />
            </button>
            <button className="p-1.5 rounded-full hover:bg-gray-100 transition-colors">
              <Trash2 size={13} className="text-gray-400" />
            </button>
          </div>
        )}
      </div>

      {/* Content */}
      <p className="text-sm text-gray-700 leading-relaxed mb-2.5">{post.content}</p>

      {/* Tags */}
      {post.tags.length > 0 && (
        <div className="flex flex-wrap gap-1.5 mb-2.5">
          {post.tags.map((tag) => (
            <span key={tag} className="text-[11px] text-latte bg-amber-50 px-2 py-0.5 rounded-full font-medium">
              {tag}
            </span>
          ))}
        </div>
      )}

      {/* Actions */}
      {!post.isOwn && (
        <div className="flex items-center gap-3 pt-1 border-t border-gray-50">
          <button className="flex items-center gap-1.5 text-gray-400 hover:text-red-400 transition-colors">
            <Heart size={14} />
            <span className="text-xs">{post.likes}</span>
          </button>
          <button className="flex items-center gap-1.5 text-gray-400 hover:text-blue-400 transition-colors">
            <MessageCircle size={14} />
            <span className="text-xs">{post.comments}</span>
          </button>
        </div>
      )}
    </div>
  );
}
