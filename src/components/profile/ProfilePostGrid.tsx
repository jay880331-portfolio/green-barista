'use client';

import { Heart, MessageCircle, ImageOff } from 'lucide-react';
import type { NewsPost } from '@/types';

interface ProfilePostGridProps {
  posts: NewsPost[];
}

export default function ProfilePostGrid({ posts }: ProfilePostGridProps) {
  if (posts.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16 text-gray-400 gap-3">
        <ImageOff size={40} strokeWidth={1.5} />
        <p className="text-sm">아직 게시물이 없습니다.</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-3 gap-0.5 md:gap-1">
      {posts.map((post) => (
        <div
          key={post.id}
          className="relative aspect-square bg-gray-100 overflow-hidden group cursor-pointer"
        >
          {post.imageUrl ? (
            <img
              src={post.imageUrl}
              alt={post.content.slice(0, 20)}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-amber-50 to-amber-100 p-2">
              <p className="text-xs text-gray-500 text-center line-clamp-4 leading-relaxed">{post.content}</p>
            </div>
          )}
          {/* Hover overlay */}
          <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-4">
            <span className="flex items-center gap-1 text-white text-sm font-semibold">
              <Heart size={16} className="fill-white" />
              {post.likes}
            </span>
            <span className="flex items-center gap-1 text-white text-sm font-semibold">
              <MessageCircle size={16} className="fill-white" />
              {post.comments}
            </span>
          </div>
        </div>
      ))}
    </div>
  );
}
