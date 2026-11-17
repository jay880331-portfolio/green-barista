'use client';

import StoryRow from './StoryRow';
import PostComposer from './PostComposer';
import PostCard from './PostCard';
import { mockCommunityPosts } from '@/data/mockData';

export default function CommunityFeed() {
  return (
    <div className="h-full overflow-y-auto bg-gray-50">
      {/* pt-[140px] on mobile to clear the floating MobileCommunityHeader */}
      <div className="max-w-2xl mx-auto px-4 pt-[148px] lg:pt-6 pb-24 lg:pb-6 space-y-4">
        <StoryRow />
        <PostComposer />
        {mockCommunityPosts.map((post) => (
          <PostCard key={post.id} post={post} />
        ))}
      </div>
    </div>
  );
}
