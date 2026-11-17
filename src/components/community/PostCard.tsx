'use client';

import { useState } from 'react';
import { Heart, MessageCircle, Share2, MoreHorizontal, MapPin, Send, X } from 'lucide-react';
import { toast } from 'sonner';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import type { NewsPost } from '@/types';
import { currentUser } from '@/data/mockData';

interface PostCardProps {
  post: NewsPost;
}

const mockComments = [
  { id: 'c1', author: '이현우', avatar: 'https://i.pravatar.cc/40?u=hyunwoo-brewing', text: '저도 테이스팅 가고 싶네요! 주말에 방문 가능한가요?', time: '5분 전' },
  { id: 'c2', author: '박지민', avatar: 'https://i.pravatar.cc/40?u=jimin-espresso', text: '로즈타 완성도가 정말 높네요 👏', time: '12분 전' },
];

export default function PostCard({ post }: PostCardProps) {
  const [liked, setLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(post.likes);
  const [commentsOpen, setCommentsOpen] = useState(false);
  const [newComment, setNewComment] = useState('');

  const handleLike = () => {
    setLiked((prev) => !prev);
    setLikeCount((prev) => (liked ? prev - 1 : prev + 1));
  };

  const handleShare = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href + `#post-${post.id}`);
      toast.success('링크가 복사되었습니다!', { description: '게시물 링크를 클립보드에 복사했습니다.' });
    } catch {
      toast.info('공유 기능', { description: '링크가 복사되었습니다.' });
    }
  };

  const handleCommentSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newComment.trim()) return;
    toast.success('댓글이 등록되었습니다.');
    setNewComment('');
  };

  return (
    <div id={`post-${post.id}`} className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
      {/* Header */}
      <div className="flex items-start justify-between p-5 pb-3">
        <div className="flex items-center gap-3">
          <img
            src={post.author.avatar}
            alt={post.author.name}
            className="w-11 h-11 rounded-full object-cover border-2 border-gray-100"
          />
          <div>
            <p className="font-semibold text-gray-900 text-sm">{post.author.name}</p>
            <div className="flex items-center gap-1 text-xs text-gray-400">
              <MapPin size={10} />
              <span>{post.location}</span>
              <span>·</span>
              <span>{post.timeAgo}</span>
            </div>
          </div>
        </div>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button className="p-1.5 rounded-full hover:bg-gray-100 transition-colors">
              <MoreHorizontal size={18} className="text-gray-400" />
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={() => { navigator.clipboard.writeText(window.location.href); toast.success('링크 복사됨'); }}>
              게시물 저장
            </DropdownMenuItem>
            <DropdownMenuItem onClick={handleShare}>공유하기</DropdownMenuItem>
            <DropdownMenuItem className="text-red-500" onClick={() => toast.error('신고가 접수되었습니다.')}>
              신고하기
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {/* Content */}
      <div className="px-5 pb-3">
        <p className="text-sm text-gray-700 leading-relaxed whitespace-pre-line">{post.content}</p>
      </div>

      {/* Tags */}
      {post.tags.length > 0 && (
        <div className="px-5 pb-3 flex flex-wrap gap-1.5">
          {post.tags.map((tag) => (
            <span
              key={tag}
              className="text-xs text-latte bg-amber-50 px-2.5 py-1 rounded-full font-medium cursor-pointer hover:bg-amber-100 transition-colors"
            >
              {tag}
            </span>
          ))}
        </div>
      )}

      {/* Image */}
      {post.imageUrl && (
        <div className="mx-5 mb-3 rounded-xl overflow-hidden">
          <img
            src={post.imageUrl}
            alt="게시물 이미지"
            className="w-full object-cover max-h-80"
          />
        </div>
      )}

      {/* Divider */}
      <div className="h-px bg-gray-100 mx-5" />

      {/* Actions */}
      <div className="flex items-center gap-1 px-3 py-2">
        <button
          onClick={handleLike}
          className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-sm transition-colors ${
            liked ? 'text-red-500 bg-red-50' : 'text-gray-500 hover:bg-gray-50'
          }`}
        >
          <Heart size={16} className={liked ? 'fill-current' : ''} />
          <span>{likeCount}</span>
        </button>
        <button
          onClick={() => setCommentsOpen((prev) => !prev)}
          className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-sm transition-colors ${
            commentsOpen ? 'text-espresso bg-espresso/10' : 'text-gray-500 hover:bg-gray-50'
          }`}
        >
          <MessageCircle size={16} />
          <span>{post.comments}</span>
        </button>
        <button
          onClick={handleShare}
          className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-sm text-gray-500 hover:bg-gray-50 transition-colors"
        >
          <Share2 size={16} />
        </button>
      </div>

      {/* Comments section */}
      {commentsOpen && (
        <div className="border-t border-gray-100">
          {/* Existing comments */}
          <div className="px-5 pt-3 space-y-3">
            {mockComments.map((c) => (
              <div key={c.id} className="flex items-start gap-2.5">
                <img src={c.avatar} alt={c.author} className="w-7 h-7 rounded-full object-cover shrink-0 mt-0.5" />
                <div className="flex-1 bg-gray-50 rounded-xl px-3 py-2">
                  <div className="flex items-center gap-2 mb-0.5">
                    <span className="text-xs font-semibold text-gray-900">{c.author}</span>
                    <span className="text-[10px] text-gray-400">{c.time}</span>
                  </div>
                  <p className="text-xs text-gray-700">{c.text}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Comment input */}
          <form onSubmit={handleCommentSubmit} className="flex items-center gap-2.5 px-5 py-3">
            <img
              src={currentUser.avatar}
              alt="me"
              className="w-7 h-7 rounded-full object-cover shrink-0"
            />
            <div className="flex-1 flex items-center gap-2 bg-gray-100 rounded-full px-3 py-2">
              <input
                type="text"
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                placeholder="댓글을 입력하세요..."
                className="flex-1 text-xs bg-transparent outline-none text-gray-700 placeholder:text-gray-400"
              />
              {newComment && (
                <button type="button" onClick={() => setNewComment('')} className="text-gray-400 hover:text-gray-600">
                  <X size={13} />
                </button>
              )}
            </div>
            <button
              type="submit"
              disabled={!newComment.trim()}
              className="w-8 h-8 bg-espresso rounded-full flex items-center justify-center disabled:opacity-40 hover:bg-sidebar-dark transition-colors shrink-0"
            >
              <Send size={13} className="text-white" />
            </button>
          </form>
        </div>
      )}
    </div>
  );
}
