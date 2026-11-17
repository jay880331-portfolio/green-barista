'use client';

import { useState } from 'react';
import { Grid3X3, List, Bookmark, Settings2 } from 'lucide-react';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { ScrollArea } from '@/components/ui/scroll-area';
import ProfileHeader from '@/components/profile/ProfileHeader';
import ProfileStats from '@/components/profile/ProfileStats';
import ProfilePostGrid from '@/components/profile/ProfilePostGrid';
import ProfileSettingsPanel from '@/components/profile/ProfileSettingsPanel';
import PostCard from '@/components/community/PostCard';
import BottomNav from '@/components/layout/BottomNav';
import { currentUserProfile, mockProfilePosts } from '@/data/mockData';

export default function ProfilePage() {
  const [listView, setListView] = useState(false);

  return (
    <div className="flex h-screen overflow-hidden bg-gray-50">
      {/* Desktop left sidebar area — hidden on mobile via existing LeftPanel pattern */}
      <div className="flex-1 flex flex-col overflow-hidden">
        <ScrollArea className="flex-1">
          <div className="max-w-2xl mx-auto pb-20 lg:pb-8">
            <ProfileHeader user={currentUserProfile} isOwnProfile />
            <ProfileStats user={currentUserProfile} />

            <Tabs defaultValue="posts" className="mt-0">
              <TabsList className="w-full rounded-none bg-white border-b border-gray-200 h-12 px-0 gap-0">
                <TabsTrigger
                  value="posts"
                  className="flex-1 rounded-none h-full text-sm gap-1.5 data-[state=active]:border-b-2 data-[state=active]:border-espresso data-[state=active]:text-espresso data-[state=active]:bg-transparent data-[state=active]:shadow-none"
                >
                  <Grid3X3 size={14} />
                  게시물
                </TabsTrigger>
                <TabsTrigger
                  value="saved"
                  className="flex-1 rounded-none h-full text-sm gap-1.5 data-[state=active]:border-b-2 data-[state=active]:border-espresso data-[state=active]:text-espresso data-[state=active]:bg-transparent data-[state=active]:shadow-none"
                >
                  <Bookmark size={14} />
                  저장됨
                </TabsTrigger>
                <TabsTrigger
                  value="settings"
                  className="flex-1 rounded-none h-full text-sm gap-1.5 data-[state=active]:border-b-2 data-[state=active]:border-espresso data-[state=active]:text-espresso data-[state=active]:bg-transparent data-[state=active]:shadow-none"
                >
                  <Settings2 size={14} />
                  설정
                </TabsTrigger>
              </TabsList>

              {/* Posts tab */}
              <TabsContent value="posts" className="mt-0">
                {/* View toggle */}
                <div className="flex justify-end gap-1 px-4 py-2 bg-white border-b border-gray-100">
                  <button
                    onClick={() => setListView(false)}
                    className={`p-1.5 rounded-lg transition-colors ${!listView ? 'bg-gray-100 text-gray-900' : 'text-gray-400 hover:text-gray-600'}`}
                  >
                    <Grid3X3 size={16} />
                  </button>
                  <button
                    onClick={() => setListView(true)}
                    className={`p-1.5 rounded-lg transition-colors ${listView ? 'bg-gray-100 text-gray-900' : 'text-gray-400 hover:text-gray-600'}`}
                  >
                    <List size={16} />
                  </button>
                </div>

                {listView ? (
                  <div className="space-y-3 p-4">
                    {mockProfilePosts.map((post) => (
                      <PostCard key={post.id} post={post} />
                    ))}
                  </div>
                ) : (
                  <ProfilePostGrid posts={mockProfilePosts} />
                )}
              </TabsContent>

              {/* Saved tab */}
              <TabsContent value="saved" className="mt-0">
                <div className="flex flex-col items-center justify-center py-16 text-gray-400 gap-3">
                  <Bookmark size={40} strokeWidth={1.5} />
                  <p className="text-sm">저장된 게시물이 없습니다.</p>
                </div>
              </TabsContent>

              {/* Settings tab */}
              <TabsContent value="settings" className="mt-0">
                <ProfileSettingsPanel />
              </TabsContent>
            </Tabs>
          </div>
        </ScrollArea>
      </div>

      <BottomNav />
    </div>
  );
}
