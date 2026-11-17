import StoryRow from './StoryRow';
import PostComposer from './PostComposer';
import PostCard from './PostCard';
import { mockCommunityPosts } from '@/data/mockData';
import { Plus } from 'lucide-react';

export default function CenterFeed() {
  return (
    <div className="max-w-2xl mx-auto px-4 py-5 space-y-4 pb-24">
      {/* Stories */}
      <StoryRow />

      {/* Post composer */}
      <PostComposer />

      {/* Posts */}
      {mockCommunityPosts.map((post) => (
        <PostCard key={post.id} post={post} />
      ))}

      {/* FAB */}
      <div className="fixed bottom-6 right-6 z-50">
        <button className="w-14 h-14 bg-espresso hover:bg-sidebar-dark text-white rounded-full shadow-xl flex items-center justify-center transition-all hover:scale-105 active:scale-95">
          <Plus size={24} />
        </button>
      </div>
    </div>
  );
}
