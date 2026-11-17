'use client';

import { useState, useRef } from 'react';
import { Image as ImageIcon, Calendar, X, Send } from 'lucide-react';
import { toast } from 'sonner';
import { currentUser } from '@/data/mockData';

export default function PostComposer() {
  const [text, setText] = useState('');
  const [expanded, setExpanded] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!text.trim()) return;
    toast.success('게시물이 등록되었습니다! 🎉', { description: text.slice(0, 60) + (text.length > 60 ? '...' : '') });
    setText('');
    setExpanded(false);
  };

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
      {/* Input area */}
      <form onSubmit={handleSubmit}>
        <div className="flex items-center gap-3 p-4 pb-3">
          <img
            src={currentUser.avatar}
            alt={currentUser.name}
            className="w-10 h-10 rounded-full object-cover border-2 border-gray-100 shrink-0"
          />
          <div
            className={`flex-1 bg-gray-100 rounded-2xl px-4 py-2.5 cursor-text transition-all ${expanded ? 'rounded-xl' : 'rounded-full'}`}
            onClick={() => setExpanded(true)}
          >
            {expanded ? (
              <textarea
                autoFocus
                value={text}
                onChange={(e) => setText(e.target.value)}
                placeholder="오늘의 추출 레시피를 공유해보세요..."
                rows={3}
                className="w-full text-sm bg-transparent outline-none text-gray-700 placeholder:text-gray-400 resize-none"
              />
            ) : (
              <p className="text-sm text-gray-400">오늘의 추출 레시피를 공유해보세요...</p>
            )}
          </div>
          {expanded && text.trim() && (
            <button
              type="submit"
              className="w-10 h-10 bg-espresso rounded-full flex items-center justify-center hover:bg-sidebar-dark transition-colors shrink-0"
            >
              <Send size={15} className="text-white" />
            </button>
          )}
        </div>

        {/* Divider */}
        <div className="h-px bg-gray-100 mx-4" />

        {/* Action buttons */}
        <div className="flex items-center px-4 py-3 gap-4">
          <button
            type="button"
            onClick={() => { setExpanded(true); fileInputRef.current?.click(); }}
            className="flex items-center gap-2 text-sm text-gray-600 hover:text-espresso transition-colors font-medium"
          >
            <div className="w-6 h-6 bg-green-100 rounded-md flex items-center justify-center">
              <ImageIcon size={13} className="text-green-600" />
            </div>
            사진/동영상
          </button>
          <button
            type="button"
            onClick={() => { setExpanded(true); toast.info('이벤트 기능은 준비 중입니다.'); }}
            className="flex items-center gap-2 text-sm text-gray-600 hover:text-espresso transition-colors font-medium"
          >
            <div className="w-6 h-6 bg-blue-100 rounded-md flex items-center justify-center">
              <Calendar size={13} className="text-blue-600" />
            </div>
            이벤트
          </button>
          {expanded && (
            <button
              type="button"
              onClick={() => { setExpanded(false); setText(''); }}
              className="ml-auto flex items-center gap-1 text-xs text-gray-400 hover:text-gray-600 transition-colors"
            >
              <X size={13} />
              취소
            </button>
          )}
        </div>
      </form>

      {/* Hidden file input */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*,video/*"
        className="hidden"
        onChange={(e) => {
          if (e.target.files?.[0]) {
            toast.success('파일이 선택되었습니다.', { description: e.target.files[0].name });
          }
        }}
      />
    </div>
  );
}
