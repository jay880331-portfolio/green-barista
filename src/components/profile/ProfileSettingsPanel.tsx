'use client';

import { useState } from 'react';
import { Bell, Lock, Eye, Moon, LogOut, ChevronRight, Smartphone } from 'lucide-react';
import { Switch } from '@/components/ui/switch';
import { toast } from 'sonner';

const settingGroups = [
  {
    title: '알림',
    items: [
      { id: 'push', label: '푸시 알림', sub: '새 팔로워, 좋아요, 댓글', icon: Bell, isToggle: true, defaultValue: true },
      { id: 'sms', label: '문자 알림', sub: '중요 알림만 받기', icon: Smartphone, isToggle: true, defaultValue: false },
    ],
  },
  {
    title: '개인정보',
    items: [
      { id: 'private', label: '비공개 계정', sub: '승인된 팔로워만 게시물 열람', icon: Lock, isToggle: true, defaultValue: false },
      { id: 'location', label: '위치 공개', sub: '내 활동 지역 표시', icon: Eye, isToggle: true, defaultValue: true },
    ],
  },
  {
    title: '테마',
    items: [
      { id: 'dark', label: '다크 모드', sub: '어두운 화면 테마 적용', icon: Moon, isToggle: true, defaultValue: false },
    ],
  },
];

export default function ProfileSettingsPanel() {
  const [toggles, setToggles] = useState<Record<string, boolean>>(() =>
    Object.fromEntries(
      settingGroups.flatMap((g) => g.items.filter((i) => i.isToggle).map((i) => [i.id, i.defaultValue]))
    )
  );

  const handleToggle = (id: string) => {
    setToggles((prev) => ({ ...prev, [id]: !prev[id] }));
    toast.success('설정이 저장되었습니다.');
  };

  return (
    <div className="px-4 md:px-6 py-4 space-y-6">
      {settingGroups.map((group) => (
        <div key={group.title}>
          <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-2">{group.title}</p>
          <div className="bg-white rounded-2xl border border-gray-100 divide-y divide-gray-100 overflow-hidden">
            {group.items.map((item) => (
              <div key={item.id} className="flex items-center justify-between px-4 py-3.5">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center">
                    <item.icon size={15} className="text-gray-500" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-900">{item.label}</p>
                    <p className="text-xs text-gray-400">{item.sub}</p>
                  </div>
                </div>
                {item.isToggle ? (
                  <Switch
                    checked={toggles[item.id]}
                    onCheckedChange={() => handleToggle(item.id)}
                    className="data-[state=checked]:bg-espresso"
                  />
                ) : (
                  <ChevronRight size={16} className="text-gray-300" />
                )}
              </div>
            ))}
          </div>
        </div>
      ))}

      {/* Logout */}
      <button
        onClick={() => toast.error('로그아웃 되었습니다.')}
        className="w-full flex items-center gap-3 px-4 py-3.5 bg-white rounded-2xl border border-gray-100 text-red-500 hover:bg-red-50 transition-colors"
      >
        <div className="w-8 h-8 rounded-full bg-red-50 flex items-center justify-center">
          <LogOut size={15} className="text-red-500" />
        </div>
        <span className="text-sm font-medium">로그아웃</span>
      </button>

      <div className="pb-4 text-center">
        <p className="text-[10px] text-gray-300">바리스타 커뮤니티 v1.0.0</p>
      </div>
    </div>
  );
}
