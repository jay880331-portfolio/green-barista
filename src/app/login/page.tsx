'use client';

import { useState } from 'react';
import { Eye, EyeOff, Coffee, ArrowRight } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { toast } from 'sonner';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAppStore } from '@/store/useAppStore';

export default function LoginPage() {
  const router = useRouter();
  const { login } = useAppStore();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPw, setShowPw] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      toast.error('이메일과 비밀번호를 입력해주세요.');
      return;
    }
    setLoading(true);
    // Simulated login
    await new Promise((r) => setTimeout(r, 1000));
    login();
    setLoading(false);
    toast.success('로그인 성공! 환영합니다 ☕');
    router.push('/');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-white to-stone-50 flex items-center justify-center p-4">
      <div className="w-full max-w-sm">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-espresso rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg">
            <Coffee size={28} className="text-white" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900">바리스타 커뮤니티</h1>
          <p className="text-sm text-gray-500 mt-1">커피를 사랑하는 사람들의 공간</p>
        </div>

        {/* Card */}
        <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-6">
          <h2 className="text-lg font-bold text-gray-900 mb-5">로그인</h2>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-gray-600 mb-1.5">이메일</label>
              <Input
                type="email"
                placeholder="coffee@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="h-11 rounded-xl border-gray-200 focus-visible:ring-espresso/20 focus-visible:border-espresso text-sm"
                autoComplete="email"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-600 mb-1.5">비밀번호</label>
              <div className="relative">
                <Input
                  type={showPw ? 'text' : 'password'}
                  placeholder="비밀번호 입력"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="h-11 rounded-xl border-gray-200 focus-visible:ring-espresso/20 focus-visible:border-espresso text-sm pr-10"
                  autoComplete="current-password"
                />
                <button
                  type="button"
                  onClick={() => setShowPw((p) => !p)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  {showPw ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
              <div className="flex justify-end mt-1.5">
                <button type="button" className="text-[11px] text-latte hover:underline">
                  비밀번호를 잊으셨나요?
                </button>
              </div>
            </div>

            <Button
              type="submit"
              disabled={loading}
              className="w-full h-11 bg-espresso hover:bg-sidebar-dark text-white rounded-xl font-semibold text-sm gap-2 disabled:opacity-70"
            >
              {loading ? '로그인 중...' : (
                <>로그인 <ArrowRight size={15} /></>
              )}
            </Button>
          </form>

          <div className="flex items-center gap-3 my-5">
            <Separator className="flex-1" />
            <span className="text-xs text-gray-400">또는</span>
            <Separator className="flex-1" />
          </div>

          {/* Social login placeholder */}
          <div className="space-y-2.5">
            <button
              onClick={() => toast.info('카카오 로그인 준비 중입니다.')}
              className="w-full h-11 bg-[#FEE500] hover:bg-[#FDD800] text-[#3C1E1E] rounded-xl font-semibold text-sm transition-colors flex items-center justify-center gap-2"
            >
              <span className="text-lg">💬</span>
              카카오로 로그인
            </button>
            <button
              onClick={() => toast.info('구글 로그인 준비 중입니다.')}
              className="w-full h-11 bg-white border border-gray-200 hover:border-gray-300 text-gray-700 rounded-xl font-semibold text-sm transition-colors flex items-center justify-center gap-2"
            >
              <span className="text-lg">🔵</span>
              구글로 로그인
            </button>
          </div>
        </div>

        {/* Sign up link */}
        <p className="text-center text-sm text-gray-500 mt-5">
          아직 회원이 아니신가요?{' '}
          <Link href="/signup" className="text-espresso font-semibold hover:underline">
            회원가입
          </Link>
        </p>
      </div>
    </div>
  );
}
