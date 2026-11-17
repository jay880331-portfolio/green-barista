import LeftPanel from '@/components/home/LeftPanel';
import CommunityFeed from '@/components/community/CommunityFeed';
import MobileCommunityHeader from '@/components/community/MobileCommunityHeader';
import BottomNav from '@/components/layout/BottomNav';

export default function CommunityPage() {
  return (
    <main className="flex h-screen overflow-hidden relative">
      {/* Left panel — same as map home, community tab active */}
      <LeftPanel />

      {/* Community feed — fills remaining space */}
      <div className="flex-1 relative overflow-hidden">
        <CommunityFeed />
        {/* Mobile floating header (lg: hidden) */}
        <MobileCommunityHeader />
      </div>

      {/* Mobile bottom navigation */}
      <BottomNav />
    </main>
  );
}
