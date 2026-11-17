'use client';

import { useAppStore } from '@/store/useAppStore';
import CommunitySidebar from './CommunitySidebar';
import TrendingSidebar from './TrendingSidebar';
import { ScrollArea } from '@/components/ui/scroll-area';

export default function CommunityLayout({ children }: { children: React.ReactNode }) {
  const { communitySidebarOpen } = useAppStore();

  return (
    <div className="flex flex-1 overflow-hidden">
      {/* Left sidebar — desktop only, collapsible */}
      <div
        className={`shrink-0 h-full transition-all duration-300 overflow-hidden hidden lg:block ${
          communitySidebarOpen ? 'lg:w-56 opacity-100' : 'lg:w-0 opacity-0'
        }`}
      >
        <CommunitySidebar />
      </div>

      {/* Center feed — full width on mobile, padded bottom for bottom nav */}
      <ScrollArea className="flex-1">
        <div className="pb-20 lg:pb-0">
          {children}
        </div>
      </ScrollArea>

      {/* Right sidebar — large desktop only */}
      <div className="hidden xl:block">
        <TrendingSidebar />
      </div>
    </div>
  );
}
