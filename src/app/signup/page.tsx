'use client';

import { useState, useRef } from 'react';
import {
  Eye, EyeOff, Coffee, ArrowRight, Check,
  User, Store, Heart, MapPin, Clock, Phone,
  Camera, Map,
} from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { toast } from 'sonner';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAppStore } from '@/store/useAppStore';
import { geocodeAddress } from '@/lib/geocode';

/* ─── Constants ──────────────────────────────────────────── */
type UserRole = 'barista' | 'cafe_owner' | 'enthusiast' | '';

const specialties = ['핸드드립', '에스프레소', '라떼 아트', '로스팅', '브루잉', '커핑', '기타'];
const certifications = ['SCA 바리스타', 'Q-grader', '바리스타 1급', '바리스타 2급', 'SCAE', '기타'];
const brewStyles = ['에스프레소', '핸드드립', '콜드브루', '모카포트', '프렌치프레스', '에어로프레스'];
const coffeeOrigins = ['에티오피아', '콜롬비아', '케냐', '과테말라', '브라질', '코스타리카', '다양하게'];
const menuFeatures = ['스페셜티 원두', '싱글 오리진', '직접 로스팅', '라떼 아트', '시즌 메뉴', '비건 음료'];

const TOTAL_STEPS = 4;

const stepLabels: Record<UserRole | '', string[]> = {
  '': ['계정 정보', '유형 선택', '상세 정보', '마무리'],
  barista: ['계정 정보', '유형 선택', '바리스타 정보', '마무리'],
  cafe_owner: ['계정 정보', '유형 선택', '카페 정보', '마무리'],
  enthusiast: ['계정 정보', '유형 선택', '취향 정보', '마무리'],
};

/* ─── Form state ─────────────────────────────────────────── */
interface FormState {
  // step 1
  name: string;
  email: string;
  password: string;
  passwordConfirm: string;
  avatarUrl: string;       // profile photo (object URL or data URL)
  // step 2
  role: UserRole;
  // step 3 — barista
  specialties: string[];
  experienceYears: string;
  certs: string[];
  currentCafe: string;
  bio: string;
  instagram: string;
  baristaAddress: string;  // address for map pin
  // step 3 — cafe owner
  cafeName: string;
  cafeAddress: string;
  cafePhone: string;
  cafeHoursOpen: string;
  cafeHoursClose: string;
  cafeFeatures: string[];
  cafeDesc: string;
  // step 3 — enthusiast
  favoriteOrigins: string[];
  brewStyles: string[];
  coffeeLevel: string;
  // step 4
  district: string;
  showOnMap: boolean;
  agree: boolean;
}

/* ─── Component ──────────────────────────────────────────── */
export default function SignupPage() {
  const router = useRouter();
  const { login, addMapUser } = useAppStore();
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [showPw, setShowPw] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [form, setForm] = useState<FormState>({
    name: '', email: '', password: '', passwordConfirm: '', avatarUrl: '',
    role: '',
    specialties: [], experienceYears: '', certs: [], currentCafe: '', bio: '', instagram: '',
    baristaAddress: '',
    cafeName: '', cafeAddress: '', cafePhone: '', cafeHoursOpen: '09:00', cafeHoursClose: '22:00',
    cafeFeatures: [], cafeDesc: '',
    favoriteOrigins: [], brewStyles: [], coffeeLevel: '',
    district: '', showOnMap: true, agree: false,
  });

  const set = <K extends keyof FormState>(key: K, val: FormState[K]) =>
    setForm((prev) => ({ ...prev, [key]: val }));

  const toggleArr = (
    key: 'specialties' | 'certs' | 'cafeFeatures' | 'favoriteOrigins' | 'brewStyles',
    val: string,
  ) =>
    setForm((prev) => {
      const arr = prev[key] as string[];
      return { ...prev, [key]: arr.includes(val) ? arr.filter((v) => v !== val) : [...arr, val] };
    });

  /* Profile photo upload */
  const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 5 * 1024 * 1024) {
      toast.error('사진 파일은 5MB 이하만 가능합니다.');
      return;
    }
    const objectUrl = URL.createObjectURL(file);
    set('avatarUrl', objectUrl);
  };

  /* Validation per step */
  const validate = (s: number): boolean => {
    if (s === 1) {
      if (!form.name || !form.email || !form.password) {
        toast.error('모든 필드를 입력해주세요.'); return false;
      }
      if (form.password.length < 8) { toast.error('비밀번호는 8자 이상이어야 합니다.'); return false; }
      if (form.password !== form.passwordConfirm) { toast.error('비밀번호가 일치하지 않습니다.'); return false; }
    }
    if (s === 2 && !form.role) { toast.error('유형을 선택해주세요.'); return false; }
    if (s === 3 && form.role === 'cafe_owner') {
      if (!form.cafeName) { toast.error('카페 이름을 입력해주세요.'); return false; }
      if (!form.cafeAddress) { toast.error('카페 주소를 입력해주세요.'); return false; }
    }
    return true;
  };

  const next = () => { if (validate(step)) setStep((s) => s + 1); };
  const back = () => setStep((s) => s - 1);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.agree) { toast.error('이용약관에 동의해주세요.'); return; }
    if (!form.district) { toast.error('활동 지역을 입력해주세요.'); return; }
    setLoading(true);

    /* Geocode and register map user */
    if (form.showOnMap && (form.role === 'barista' || form.role === 'cafe_owner')) {
      const address =
        form.role === 'cafe_owner' ? form.cafeAddress : (form.baristaAddress || form.district);

      try {
        const coords = await geocodeAddress(address);
        const avatar =
          form.avatarUrl || `https://i.pravatar.cc/100?u=${encodeURIComponent(form.email)}`;

        addMapUser({
          id: `user-${Date.now()}`,
          name: form.name,
          avatar,
          role: form.role as 'barista' | 'cafe_owner',
          address,
          lat: coords.lat,
          lng: coords.lng,
          showOnMap: true,
          district: form.district,
          // barista
          bio: form.bio,
          specialties: form.specialties,
          experienceYears: form.experienceYears,
          currentCafe: form.currentCafe,
          instagram: form.instagram,
          // cafe owner
          cafeName: form.cafeName,
          cafePhone: form.cafePhone,
          cafeHoursOpen: form.cafeHoursOpen,
          cafeHoursClose: form.cafeHoursClose,
          cafeFeatures: form.cafeFeatures,
          cafeDesc: form.cafeDesc,
        });
      } catch {
        toast.error('주소 처리 중 오류가 발생했습니다. 기본 위치로 등록됩니다.');
      }
    }

    await new Promise((r) => setTimeout(r, 600));
    login();
    setLoading(false);
    toast.success('가입 완료! 바리스타 커뮤니티에 오신 것을 환영합니다 ☕');
    router.push('/');
  };

  const labels = stepLabels[form.role];

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-white to-stone-50 flex items-center justify-center p-4 py-10">
      <div className="w-full max-w-sm">

        {/* Logo */}
        <div className="text-center mb-7">
          <div className="w-14 h-14 bg-espresso rounded-2xl flex items-center justify-center mx-auto mb-3 shadow-lg">
            <Coffee size={24} className="text-white" />
          </div>
          <h1 className="text-xl font-bold text-gray-900">바리스타 커뮤니티</h1>
          <p className="text-xs text-gray-500 mt-0.5">무료로 시작하세요</p>
        </div>

        {/* Step indicator */}
        <div className="flex items-center mb-5 gap-1">
          {Array.from({ length: TOTAL_STEPS }, (_, i) => i + 1).map((s) => (
            <div key={s} className="flex items-center flex-1 gap-1">
              <div className={`w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold shrink-0 transition-all duration-300 ${
                step > s ? 'bg-espresso text-white' : step === s ? 'bg-espresso text-white ring-4 ring-espresso/20' : 'bg-gray-100 text-gray-400'
              }`}>
                {step > s ? <Check size={11} /> : s}
              </div>
              {s < TOTAL_STEPS && (
                <div className={`flex-1 h-0.5 rounded-full transition-all duration-500 ${step > s ? 'bg-espresso' : 'bg-gray-100'}`} />
              )}
            </div>
          ))}
        </div>

        {/* Step label */}
        <p className="text-[10px] text-gray-400 mb-4 text-center">
          {labels.map((l, i) => (
            <span key={l} className={step === i + 1 ? 'text-espresso font-semibold' : ''}>
              {i > 0 && <span className="text-gray-200 mx-1">›</span>}
              {l}
            </span>
          ))}
        </p>

        {/* ── Card ── */}
        <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-6">

          {/* ── STEP 1: 계정 정보 ── */}
          {step === 1 && (
            <>
              <h2 className="text-base font-bold text-gray-900 mb-4">계정 만들기</h2>

              {/* Profile photo upload */}
              <div className="flex flex-col items-center mb-5">
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handlePhotoChange}
                />
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="relative group"
                >
                  <div className={`w-20 h-20 rounded-full overflow-hidden border-2 border-dashed flex items-center justify-center transition-all ${
                    form.avatarUrl
                      ? 'border-espresso'
                      : 'border-gray-200 group-hover:border-espresso bg-gray-50 group-hover:bg-espresso/5'
                  }`}>
                    {form.avatarUrl ? (
                      <img
                        src={form.avatarUrl}
                        alt="프로필 미리보기"
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <Camera size={22} className="text-gray-300 group-hover:text-espresso transition-colors" />
                    )}
                  </div>
                  <div className={`absolute bottom-0 right-0 w-6 h-6 rounded-full border-2 border-white flex items-center justify-center transition-colors ${
                    form.avatarUrl ? 'bg-espresso' : 'bg-gray-300 group-hover:bg-espresso'
                  }`}>
                    <Camera size={11} className="text-white" />
                  </div>
                </button>
                <p className="text-[11px] text-gray-400 mt-2">
                  {form.avatarUrl ? '사진 변경' : '프로필 사진 추가 (선택)'}
                </p>
              </div>

              <div className="space-y-3.5">
                <Field label="이름">
                  <Input placeholder="홍길동" value={form.name} onChange={(e) => set('name', e.target.value)}
                    className="h-11 rounded-xl border-gray-200 focus-visible:ring-espresso/20 focus-visible:border-espresso text-sm" />
                </Field>
                <Field label="이메일">
                  <Input type="email" placeholder="coffee@example.com" value={form.email}
                    onChange={(e) => set('email', e.target.value)} autoComplete="email"
                    className="h-11 rounded-xl border-gray-200 focus-visible:ring-espresso/20 focus-visible:border-espresso text-sm" />
                </Field>
                <Field label="비밀번호">
                  <div className="relative">
                    <Input type={showPw ? 'text' : 'password'} placeholder="8자 이상" value={form.password}
                      onChange={(e) => set('password', e.target.value)} autoComplete="new-password"
                      className="h-11 rounded-xl border-gray-200 focus-visible:ring-espresso/20 focus-visible:border-espresso text-sm pr-10" />
                    <button type="button" onClick={() => setShowPw((p) => !p)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
                      {showPw ? <EyeOff size={15} /> : <Eye size={15} />}
                    </button>
                  </div>
                </Field>
                <Field label="비밀번호 확인">
                  <Input type="password" placeholder="비밀번호 재입력" value={form.passwordConfirm}
                    onChange={(e) => set('passwordConfirm', e.target.value)} autoComplete="new-password"
                    className={`h-11 rounded-xl text-sm ${
                      form.passwordConfirm && form.password !== form.passwordConfirm
                        ? 'border-red-300 focus-visible:border-red-400'
                        : 'border-gray-200 focus-visible:ring-espresso/20 focus-visible:border-espresso'
                    }`} />
                  {form.passwordConfirm && form.password !== form.passwordConfirm && (
                    <p className="text-[11px] text-red-500 mt-1">비밀번호가 일치하지 않습니다.</p>
                  )}
                </Field>
              </div>
              <NextBtn onClick={next} className="mt-5" />
            </>
          )}

          {/* ── STEP 2: 역할 선택 ── */}
          {step === 2 && (
            <>
              <h2 className="text-base font-bold text-gray-900 mb-1">나는 누구인가요?</h2>
              <p className="text-xs text-gray-400 mb-4">지도에 표시되는 방식이 달라집니다.</p>
              <div className="space-y-2.5">
                <RoleCard
                  role="barista" selected={form.role === 'barista'} onSelect={() => set('role', 'barista')}
                  icon={<User size={20} />}
                  title="바리스타"
                  desc="카페에서 커피를 만들거나, 프리랜서로 활동하는 바리스타예요."
                  badge="지도에 핀 표시"
                />
                <RoleCard
                  role="cafe_owner" selected={form.role === 'cafe_owner'} onSelect={() => set('role', 'cafe_owner')}
                  icon={<Store size={20} />}
                  title="카페 운영자"
                  desc="카페를 운영하고 있어요. 카페 정보가 지도에 표시됩니다."
                  badge="카페 핀 표시"
                />
                <RoleCard
                  role="enthusiast" selected={form.role === 'enthusiast'} onSelect={() => set('role', 'enthusiast')}
                  icon={<Heart size={20} />}
                  title="커피 애호가"
                  desc="커피를 사랑하는 일반 사용자예요. 지도에는 표시되지 않습니다."
                />
              </div>
              <NavBtns onBack={back} onNext={next} className="mt-5" />
            </>
          )}

          {/* ── STEP 3: 바리스타 상세 ── */}
          {step === 3 && form.role === 'barista' && (
            <>
              <h2 className="text-base font-bold text-gray-900 mb-1">바리스타 정보</h2>
              <p className="text-xs text-gray-400 mb-4">지도에서 다른 사용자에게 보여질 정보예요.</p>
              <div className="space-y-4">
                {/* 활동 주소 */}
                <Field label="활동 주소 *">
                  <div className="relative">
                    <MapPin size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                    <Input
                      placeholder="예: 서울 용산구 한남동 123-4"
                      value={form.baristaAddress}
                      onChange={(e) => set('baristaAddress', e.target.value)}
                      className="h-11 rounded-xl border-gray-200 focus-visible:ring-espresso/20 focus-visible:border-espresso text-sm pl-9"
                    />
                  </div>
                  <p className="text-[10px] text-espresso mt-1 flex items-center gap-1">
                    <MapPin size={9} />
                    이 주소를 기반으로 지도에 핀이 표시됩니다
                  </p>
                </Field>

                {/* 전문 분야 */}
                <div>
                  <label className="block text-xs font-semibold text-gray-600 mb-2">전문 분야 <span className="text-gray-400 font-normal">(복수 선택)</span></label>
                  <ChipGroup items={specialties} selected={form.specialties} onToggle={(v) => toggleArr('specialties', v)} />
                </div>

                {/* 경력 */}
                <Field label="경력 연수">
                  <div className="flex items-center gap-2">
                    <Input type="number" min={0} max={50} placeholder="0" value={form.experienceYears}
                      onChange={(e) => set('experienceYears', e.target.value)}
                      className="h-11 rounded-xl border-gray-200 focus-visible:ring-espresso/20 focus-visible:border-espresso text-sm w-24" />
                    <span className="text-sm text-gray-500">년</span>
                  </div>
                </Field>

                {/* 자격증 */}
                <div>
                  <label className="block text-xs font-semibold text-gray-600 mb-2">보유 자격증 <span className="text-gray-400 font-normal">(복수 선택)</span></label>
                  <ChipGroup items={certifications} selected={form.certs} onToggle={(v) => toggleArr('certs', v)} />
                </div>

                {/* 현재 근무 카페 */}
                <Field label="현재 근무 카페" hint="없으면 비워두세요">
                  <div className="relative">
                    <Store size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                    <Input placeholder="카페 이름" value={form.currentCafe}
                      onChange={(e) => set('currentCafe', e.target.value)}
                      className="h-11 rounded-xl border-gray-200 focus-visible:ring-espresso/20 focus-visible:border-espresso text-sm pl-9" />
                  </div>
                </Field>

                {/* 한 줄 소개 */}
                <Field label="한 줄 소개">
                  <textarea
                    placeholder="나만의 커피 철학이나 소개를 써주세요"
                    value={form.bio}
                    onChange={(e) => set('bio', e.target.value)}
                    rows={2}
                    className="w-full rounded-xl border border-gray-200 px-3 py-2.5 text-sm focus:outline-none focus:border-espresso resize-none placeholder:text-gray-400"
                  />
                </Field>

                {/* 인스타그램 */}
                <Field label="인스타그램" hint="선택">
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm">@</span>
                    <Input placeholder="username" value={form.instagram}
                      onChange={(e) => set('instagram', e.target.value)}
                      className="h-11 rounded-xl border-gray-200 focus-visible:ring-espresso/20 focus-visible:border-espresso text-sm pl-8" />
                  </div>
                </Field>
              </div>
              <NavBtns onBack={back} onNext={next} className="mt-5" />
            </>
          )}

          {/* ── STEP 3: 카페 운영자 상세 ── */}
          {step === 3 && form.role === 'cafe_owner' && (
            <>
              <h2 className="text-base font-bold text-gray-900 mb-1">카페 정보 등록</h2>
              <p className="text-xs text-gray-400 mb-4">지도에 카페 핀으로 표시됩니다.</p>
              <div className="space-y-3.5">
                {/* 카페 이름 */}
                <Field label="카페 이름 *">
                  <div className="relative">
                    <Store size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                    <Input placeholder="예: 블루밍 커피" value={form.cafeName}
                      onChange={(e) => set('cafeName', e.target.value)}
                      className="h-11 rounded-xl border-gray-200 focus-visible:ring-espresso/20 focus-visible:border-espresso text-sm pl-9" />
                  </div>
                </Field>

                {/* 주소 */}
                <Field label="카페 주소 *">
                  <div className="flex gap-2">
                    <div className="relative flex-1">
                      <MapPin size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                      <Input placeholder="서울 용산구 한남동 ..." value={form.cafeAddress}
                        onChange={(e) => set('cafeAddress', e.target.value)}
                        className="h-11 rounded-xl border-gray-200 focus-visible:ring-espresso/20 focus-visible:border-espresso text-sm pl-9" />
                    </div>
                    <button
                      type="button"
                      onClick={() => toast.info('주소 검색 기능은 준비 중입니다.')}
                      className="shrink-0 h-11 px-3 rounded-xl border border-gray-200 text-xs text-gray-500 hover:border-espresso hover:text-espresso transition-colors flex items-center gap-1"
                    >
                      <Map size={13} />
                      검색
                    </button>
                  </div>
                  <p className="text-[10px] text-espresso mt-1 flex items-center gap-1">
                    <MapPin size={9} />
                    입력한 주소를 기반으로 지도에 핀이 표시됩니다
                  </p>
                </Field>

                {/* 전화번호 */}
                <Field label="전화번호" hint="선택">
                  <div className="relative">
                    <Phone size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                    <Input type="tel" placeholder="02-1234-5678" value={form.cafePhone}
                      onChange={(e) => set('cafePhone', e.target.value)}
                      className="h-11 rounded-xl border-gray-200 focus-visible:ring-espresso/20 focus-visible:border-espresso text-sm pl-9" />
                  </div>
                </Field>

                {/* 영업시간 */}
                <div>
                  <label className="block text-xs font-semibold text-gray-600 mb-1.5">영업시간</label>
                  <div className="flex items-center gap-2">
                    <div className="relative flex-1">
                      <Clock size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                      <Input type="time" value={form.cafeHoursOpen}
                        onChange={(e) => set('cafeHoursOpen', e.target.value)}
                        className="h-10 rounded-xl border-gray-200 text-sm pl-9 focus-visible:ring-espresso/20 focus-visible:border-espresso" />
                    </div>
                    <span className="text-gray-400 text-sm shrink-0">~</span>
                    <div className="relative flex-1">
                      <Clock size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                      <Input type="time" value={form.cafeHoursClose}
                        onChange={(e) => set('cafeHoursClose', e.target.value)}
                        className="h-10 rounded-xl border-gray-200 text-sm pl-9 focus-visible:ring-espresso/20 focus-visible:border-espresso" />
                    </div>
                  </div>
                </div>

                {/* 카페 특징 */}
                <div>
                  <label className="block text-xs font-semibold text-gray-600 mb-2">카페 특징 <span className="text-gray-400 font-normal">(복수 선택)</span></label>
                  <ChipGroup items={menuFeatures} selected={form.cafeFeatures} onToggle={(v) => toggleArr('cafeFeatures', v)} />
                </div>

                {/* 한 줄 소개 */}
                <Field label="카페 소개" hint="선택">
                  <textarea
                    placeholder="카페의 분위기와 특징을 알려주세요"
                    value={form.cafeDesc}
                    onChange={(e) => set('cafeDesc', e.target.value)}
                    rows={2}
                    className="w-full rounded-xl border border-gray-200 px-3 py-2.5 text-sm focus:outline-none focus:border-espresso resize-none placeholder:text-gray-400"
                  />
                </Field>
              </div>
              <NavBtns onBack={back} onNext={next} className="mt-5" />
            </>
          )}

          {/* ── STEP 3: 커피 애호가 취향 ── */}
          {step === 3 && form.role === 'enthusiast' && (
            <>
              <h2 className="text-base font-bold text-gray-900 mb-1">커피 취향</h2>
              <p className="text-xs text-gray-400 mb-4">맞춤 콘텐츠를 추천하는 데 활용됩니다.</p>
              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-gray-600 mb-2">좋아하는 원두 산지</label>
                  <ChipGroup items={coffeeOrigins} selected={form.favoriteOrigins} onToggle={(v) => toggleArr('favoriteOrigins', v)} />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-600 mb-2">즐기는 추출 방식</label>
                  <ChipGroup items={brewStyles} selected={form.brewStyles} onToggle={(v) => toggleArr('brewStyles', v)} />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-600 mb-2">나의 커피 경험</label>
                  <div className="grid grid-cols-3 gap-2">
                    {[
                      { id: 'beginner', label: '입문자', emoji: '🌱' },
                      { id: 'intermediate', label: '중급자', emoji: '☕' },
                      { id: 'expert', label: '전문가', emoji: '🏆' },
                    ].map((level) => (
                      <button
                        key={level.id}
                        type="button"
                        onClick={() => set('coffeeLevel', level.id)}
                        className={`flex flex-col items-center gap-1 py-3 rounded-xl border-2 text-xs font-medium transition-all ${
                          form.coffeeLevel === level.id
                            ? 'border-espresso bg-espresso/5 text-espresso'
                            : 'border-gray-100 text-gray-500 hover:border-gray-200'
                        }`}
                      >
                        <span className="text-xl">{level.emoji}</span>
                        {level.label}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
              <NavBtns onBack={back} onNext={next} className="mt-5" />
            </>
          )}

          {/* ── STEP 4: 마무리 ── */}
          {step === 4 && (
            <>
              <h2 className="text-base font-bold text-gray-900 mb-1">거의 다 됐어요!</h2>
              <p className="text-xs text-gray-400 mb-4">활동 지역을 설정하고 가입을 완료하세요.</p>
              <form onSubmit={handleSubmit} className="space-y-4">
                {/* 활동 지역 */}
                <Field label="활동 지역 *">
                  <div className="relative">
                    <MapPin size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                    <Input placeholder="예: 한남동, 성수동, 마포구" value={form.district}
                      onChange={(e) => set('district', e.target.value)}
                      className="h-11 rounded-xl border-gray-200 focus-visible:ring-espresso/20 focus-visible:border-espresso text-sm pl-9" />
                  </div>
                </Field>

                {/* 지도 공개 여부 — barista & cafe only */}
                {(form.role === 'barista' || form.role === 'cafe_owner') && (
                  <div className="flex items-center justify-between bg-espresso/5 rounded-xl px-4 py-3 border border-espresso/10">
                    <div className="flex items-center gap-2.5">
                      <Map size={15} className="text-espresso shrink-0" />
                      <div>
                        <p className="text-sm font-semibold text-gray-900">지도에 표시하기</p>
                        <p className="text-[10px] text-gray-400">
                          {form.role === 'cafe_owner' ? '카페 위치가 지도에 공개됩니다' : '내 활동 위치가 지도에 공개됩니다'}
                        </p>
                      </div>
                    </div>
                    <Switch
                      checked={form.showOnMap}
                      onCheckedChange={(v) => set('showOnMap', v)}
                      className="data-[state=checked]:bg-espresso"
                    />
                  </div>
                )}

                {/* 요약 카드 */}
                <div className="bg-gray-50 rounded-xl p-3.5 space-y-2 border border-gray-100">
                  <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wide">가입 정보 요약</p>
                  {/* Profile photo preview */}
                  {form.avatarUrl && (
                    <div className="flex items-center gap-2.5">
                      <img
                        src={form.avatarUrl}
                        alt="프로필"
                        className="w-10 h-10 rounded-full object-cover border-2 border-white shadow"
                      />
                      <span className="text-xs text-gray-500">프로필 사진 설정됨</span>
                    </div>
                  )}
                  <SummaryRow label="이름" value={form.name} />
                  <SummaryRow label="이메일" value={form.email} />
                  <SummaryRow label="유형" value={
                    form.role === 'barista' ? '바리스타' :
                    form.role === 'cafe_owner' ? '카페 운영자' : '커피 애호가'
                  } />
                  {form.role === 'barista' && form.specialties.length > 0 && (
                    <SummaryRow label="전문 분야" value={form.specialties.join(', ')} />
                  )}
                  {form.role === 'barista' && form.baristaAddress && (
                    <SummaryRow label="활동 주소" value={form.baristaAddress} />
                  )}
                  {form.role === 'cafe_owner' && form.cafeName && (
                    <SummaryRow label="카페명" value={form.cafeName} />
                  )}
                  {form.role === 'cafe_owner' && form.cafeAddress && (
                    <SummaryRow label="카페 주소" value={form.cafeAddress} />
                  )}
                </div>

                {/* 약관 동의 */}
                <button
                  type="button"
                  onClick={() => set('agree', !form.agree)}
                  className="flex items-start gap-2.5 w-full text-left"
                >
                  <div className={`mt-0.5 w-5 h-5 rounded-md border-2 flex items-center justify-center shrink-0 transition-all ${
                    form.agree ? 'bg-espresso border-espresso' : 'border-gray-300'
                  }`}>
                    {form.agree && <Check size={11} className="text-white" strokeWidth={3} />}
                  </div>
                  <span className="text-xs text-gray-500 leading-relaxed">
                    <span className="text-latte">이용약관</span> 및 <span className="text-latte">개인정보 처리방침</span>에 동의합니다.
                  </span>
                </button>

                <div className="flex gap-2 pt-1">
                  <Button type="button" variant="outline" onClick={back}
                    className="flex-[0.6] h-11 rounded-xl border-gray-200 text-sm">
                    이전
                  </Button>
                  <Button type="submit" disabled={loading}
                    className="flex-1 h-11 bg-espresso hover:bg-sidebar-dark text-white rounded-xl font-semibold text-sm disabled:opacity-70">
                    {loading ? '처리 중...' : '가입 완료 🎉'}
                  </Button>
                </div>
              </form>
            </>
          )}
        </div>

        {/* Login link */}
        <p className="text-center text-sm text-gray-500 mt-5">
          이미 계정이 있으신가요?{' '}
          <Link href="/login" className="text-espresso font-semibold hover:underline">로그인</Link>
        </p>
      </div>
    </div>
  );
}

/* ─── Sub-components ─────────────────────────────────────── */

function Field({ label, hint, children }: { label: string; hint?: string; children: React.ReactNode }) {
  return (
    <div>
      <div className="flex items-center justify-between mb-1.5">
        <label className="block text-xs font-semibold text-gray-600">{label}</label>
        {hint && <span className="text-[10px] text-gray-400">{hint}</span>}
      </div>
      {children}
    </div>
  );
}

function ChipGroup({ items, selected, onToggle }: { items: string[]; selected: string[]; onToggle: (v: string) => void }) {
  return (
    <div className="flex flex-wrap gap-1.5">
      {items.map((item) => (
        <button
          key={item}
          type="button"
          onClick={() => onToggle(item)}
          className={`px-3 py-1.5 rounded-full text-xs font-medium border transition-all ${
            selected.includes(item)
              ? 'bg-espresso text-white border-espresso'
              : 'bg-white text-gray-600 border-gray-200 hover:border-gray-300'
          }`}
        >
          {selected.includes(item) && <Check size={9} className="inline mr-1" strokeWidth={3} />}
          {item}
        </button>
      ))}
    </div>
  );
}

function RoleCard({ role, selected, onSelect, icon, title, desc, badge }: {
  role: UserRole; selected: boolean; onSelect: () => void;
  icon: React.ReactNode; title: string; desc: string; badge?: string;
}) {
  return (
    <button
      type="button"
      onClick={onSelect}
      className={`w-full flex items-start gap-3 p-4 rounded-2xl border-2 text-left transition-all ${
        selected ? 'border-espresso bg-espresso/5' : 'border-gray-100 hover:border-gray-200 bg-white'
      }`}
    >
      <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 transition-all ${
        selected ? 'bg-espresso text-white' : 'bg-gray-100 text-gray-400'
      }`}>
        {icon}
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 mb-0.5">
          <span className={`text-sm font-bold ${selected ? 'text-espresso' : 'text-gray-900'}`}>{title}</span>
          {badge && (
            <span className="text-[9px] font-bold bg-espresso/10 text-espresso px-2 py-0.5 rounded-full">{badge}</span>
          )}
        </div>
        <p className="text-xs text-gray-500 leading-relaxed">{desc}</p>
      </div>
      <div className={`mt-0.5 w-5 h-5 rounded-full border-2 flex items-center justify-center shrink-0 transition-all ${
        selected ? 'border-espresso bg-espresso' : 'border-gray-200'
      }`}>
        {selected && <Check size={10} className="text-white" strokeWidth={3} />}
      </div>
    </button>
  );
}

function NextBtn({ onClick, className = '' }: { onClick: () => void; className?: string }) {
  return (
    <Button type="button" onClick={onClick}
      className={`w-full h-11 bg-espresso hover:bg-sidebar-dark text-white rounded-xl font-semibold text-sm gap-2 ${className}`}>
      다음 <ArrowRight size={15} />
    </Button>
  );
}

function NavBtns({ onBack, onNext, className = '' }: { onBack: () => void; onNext: () => void; className?: string }) {
  return (
    <div className={`flex gap-2 ${className}`}>
      <Button type="button" variant="outline" onClick={onBack}
        className="flex-[0.6] h-11 rounded-xl border-gray-200 text-sm">이전</Button>
      <Button type="button" onClick={onNext}
        className="flex-1 h-11 bg-espresso hover:bg-sidebar-dark text-white rounded-xl font-semibold text-sm gap-1.5">
        다음 <ArrowRight size={15} />
      </Button>
    </div>
  );
}

function SummaryRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between text-xs">
      <span className="text-gray-400">{label}</span>
      <span className="text-gray-700 font-medium text-right max-w-[60%] truncate">{value}</span>
    </div>
  );
}
