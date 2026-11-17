import { create } from 'zustand';
import type { MapUser } from '@/types';

/* ── Default map users built from existing mock barista data ── */
const defaultMapUsers: MapUser[] = [
  // ── 원주 카페 ────────────────────────────────────────────
  {
    id: 'cafe-wonju-1',
    name: '김민수',
    avatar: 'https://i.pravatar.cc/100?u=wonju-radio1',
    role: 'cafe_owner',
    address: '강원특별자치도 원주시 관설동 1765-3',
    lat: 37.3504,
    lng: 127.9471,
    showOnMap: true,
    district: '관설동',
    cafeName: '커피라디오 관설동 본점 📻',
    cafeFeatures: ['인기 맛집', '평점 4.4', '스페셜티'],
    cafeDesc: '평점 4.4점으로 인기가 정말 많은 곳이에요! ☕️ 커피라디오만의 시그니처 커피를 맛보세요.',
  },
  {
    id: 'cafe-wonju-2',
    name: '이지현',
    avatar: 'https://i.pravatar.cc/100?u=wonju-radio2',
    role: 'cafe_owner',
    address: '강원특별자치도 원주시 단구동 1477-12',
    lat: 37.3441,
    lng: 127.9545,
    showOnMap: true,
    district: '단구동',
    cafeName: '커피라디오 단구동점 📻',
    cafeFeatures: ['커피라디오', '단구동', '분점'],
    cafeDesc: '단구동에서도 커피라디오 특유의 맛있는 커피를 만날 수 있어요! 🎶',
  },
  {
    id: 'cafe-wonju-3',
    name: '박서윤',
    avatar: 'https://i.pravatar.cc/100?u=wonju-honey',
    role: 'cafe_owner',
    address: '강원특별자치도 원주시 판부면 서곡리 213-3',
    lat: 37.2895,
    lng: 127.8712,
    showOnMap: true,
    district: '판부면',
    cafeName: '허니포레스트 🍯',
    cafeFeatures: ['평점 4.3', '자연 뷰', '편안한 분위기'],
    cafeDesc: '평점 4.3점의 달콤하고 편안한 분위기가 매력적인 곳이에요! 🌲 자연 속에서 여유를 즐겨보세요.',
  },
  {
    id: 'cafe-wonju-4',
    name: '최준호',
    avatar: 'https://i.pravatar.cc/100?u=wonju-bakery',
    role: 'cafe_owner',
    address: '강원특별자치도 원주시 행구동 행구로 307',
    lat: 37.3698,
    lng: 127.9678,
    showOnMap: true,
    district: '행구동',
    cafeName: '베이커리궁 🥐',
    cafeFeatures: ['평점 4.2', '베이커리 카페', '수제 빵'],
    cafeDesc: '빵을 좋아하신다면 꼭 가보셔야 할 평점 4.2점의 베이커리 카페예요! 🥖',
  },
  {
    id: 'cafe-wonju-5',
    name: '김가영',
    avatar: 'https://i.pravatar.cc/100?u=wonju-atelier',
    role: 'cafe_owner',
    address: '강원특별자치도 원주시 행구동 행구로 314',
    lat: 37.3703,
    lng: 127.9685,
    showOnMap: true,
    district: '행구동',
    cafeName: '빵공장 라뜰리에 김가 🍞',
    cafeFeatures: ['유명 빵집', '수제 디저트', '베이커리'],
    cafeDesc: '맛있는 빵과 함께 여유를 즐길 수 있는 아주 유명한 빵공장이에요! 🍰',
  },
  {
    id: 'cafe-wonju-6',
    name: '정하은',
    avatar: 'https://i.pravatar.cc/100?u=wonju-galchon',
    role: 'cafe_owner',
    address: '강원특별자치도 원주시 관설동 갈촌길 126',
    lat: 37.3485,
    lng: 127.9438,
    showOnMap: true,
    district: '관설동',
    cafeName: '갈촌126 🌿',
    cafeFeatures: ['평점 4.1', '한적한 분위기', '로컬 카페'],
    cafeDesc: '한적하고 여유로운 시간을 보내기 좋은 평점 4.1점의 카페예요! 🍵',
  },
  {
    id: 'cafe-wonju-7',
    name: '오승민',
    avatar: 'https://i.pravatar.cc/100?u=wonju-view',
    role: 'cafe_owner',
    address: '강원특별자치도 원주시 반곡관설동 단관초교길 30-15',
    lat: 37.3618,
    lng: 127.9502,
    showOnMap: true,
    district: '반곡관설동',
    cafeName: '카페 뷰 ☕️',
    cafeHoursOpen: '10:00',
    cafeHoursClose: '24:00',
    cafeFeatures: ['자정 운영', '야간 카페', '뷰 맛집'],
    cafeDesc: '자정까지 운영해서 늦은 시간에 방문하기 좋은 곳이에요! 🌙',
  },
  // ── 커피라디오 관설동 본점 소속 바리스타 3명 ───────────────
  {
    id: 'barista-radio-1',
    name: '한지우',
    avatar: 'https://i.pravatar.cc/100?u=barista-radio-jiw',
    role: 'barista',
    address: '강원특별자치도 원주시 관설동 1765-3',
    lat: 37.3504,
    lng: 127.9471,
    showOnMap: true,
    district: '관설동',
    specialties: ['에스프레소', '라떼 아트'],
    bio: '커피라디오 관설동 본점에서 에스프레소를 담당하고 있어요. 매일 최고의 한 잔을 만드는 것이 목표입니다.',
    experienceYears: '4',
    currentCafe: '커피라디오 관설동 본점',
    instagram: 'jiw_coffee',
  },
  {
    id: 'barista-radio-2',
    name: '송예린',
    avatar: 'https://i.pravatar.cc/100?u=barista-radio-yerin',
    role: 'barista',
    address: '강원특별자치도 원주시 관설동 1765-3',
    lat: 37.3504,
    lng: 127.9471,
    showOnMap: true,
    district: '관설동',
    specialties: ['핸드드립', '커핑'],
    bio: '원두 본연의 맛을 살리는 핸드드립 전문 바리스타입니다. 오늘도 맛있는 드립 한 잔 드세요!',
    experienceYears: '3',
    currentCafe: '커피라디오 관설동 본점',
    instagram: 'yerin_drip',
  },
  {
    id: 'barista-radio-3',
    name: '문도현',
    avatar: 'https://i.pravatar.cc/100?u=barista-radio-dohyun',
    role: 'barista',
    address: '강원특별자치도 원주시 관설동 1765-3',
    lat: 37.3504,
    lng: 127.9471,
    showOnMap: true,
    district: '관설동',
    specialties: ['로스팅', '브루잉'],
    bio: '직접 로스팅한 원두로 다양한 브루잉 메뉴를 선보이고 있습니다.',
    experienceYears: '6',
    currentCafe: '커피라디오 관설동 본점',
  },
  // ── 서울 바리스타 ─────────────────────────────────────────
  {
    id: 'map-1',
    name: '지후 바리스타',
    avatar: 'https://i.pravatar.cc/100?u=jihu-barista',
    role: 'barista',
    address: '이태원',
    lat: 37.5349,
    lng: 126.9924,
    showOnMap: true,
    district: '이태원',
    specialties: ['핸드드립'],
    bio: '이태원에서 핸드드립 전문으로 활동하는 바리스타입니다.',
    experienceYears: '5',
    instagram: 'jihu_coffee',
  },
  {
    id: 'map-2',
    name: '민준',
    avatar: 'https://i.pravatar.cc/100?u=minjun-roasting',
    role: 'barista',
    address: '한남동',
    lat: 37.5315,
    lng: 126.9980,
    showOnMap: true,
    district: '한남동',
    specialties: ['로스팅'],
    bio: '로스팅 마스터. 매일 아침 직접 로스팅한 원두를 사용합니다.',
    experienceYears: '8',
  },
  {
    id: 'map-3',
    name: '서연',
    avatar: 'https://i.pravatar.cc/100?u=seoyeon-latte',
    role: 'barista',
    address: '한남동',
    lat: 37.5295,
    lng: 126.9945,
    showOnMap: true,
    district: '한남동',
    specialties: ['라떼 아트'],
    bio: '라떼 아트 강사로 활동 중입니다. 수업 문의 환영해요!',
    experienceYears: '3',
    instagram: 'seoyeon_latte',
  },
  {
    id: 'map-4',
    name: '이현우',
    avatar: 'https://i.pravatar.cc/100?u=hyunwoo-brewing',
    role: 'cafe_owner',
    address: '한남동',
    lat: 37.5360,
    lng: 126.9958,
    showOnMap: true,
    district: '한남동',
    cafeName: '브루잉 랩 한남',
    cafePhone: '02-794-1234',
    cafeHoursOpen: '08:00',
    cafeHoursClose: '21:00',
    cafeFeatures: ['스페셜티 원두', '직접 로스팅', '싱글 오리진'],
    cafeDesc: '브루잉 챔피언이 운영하는 스페셜티 카페. 다양한 브루잉 메뉴를 즐기실 수 있어요.',
  },
  {
    id: 'map-5',
    name: '박지민',
    avatar: 'https://i.pravatar.cc/100?u=jimin-espresso',
    role: 'barista',
    address: '용산',
    lat: 37.5278,
    lng: 126.9936,
    showOnMap: true,
    district: '용산',
    specialties: ['라떼 아트', '에스프레소'],
    bio: '라마르조꼬 전문 바리스타. 에스프레소 마스터를 목표로 수련 중입니다.',
    experienceYears: '4',
    currentCafe: '에스프레소 바',
    instagram: 'jimin_espresso',
  },
];

interface AppState {
  isLoggedIn: boolean;
  isActive: boolean;
  searchRadius: number;
  activeFilters: string[];
  activeMenuId: string;
  followedBaristas: string[];
  communitySidebarOpen: boolean;
  /** All users that appear as markers on the map */
  registeredMapUsers: MapUser[];
  /** Currently selected marker (shows info panel) */
  selectedMapUser: MapUser | null;
  login: () => void;
  logout: () => void;
  setIsActive: (active: boolean) => void;
  setSearchRadius: (radius: number) => void;
  toggleFilter: (filterId: string) => void;
  setActiveMenu: (id: string) => void;
  toggleFollow: (baristaid: string) => void;
  toggleCommunitySidebar: () => void;
  addMapUser: (user: MapUser) => void;
  setSelectedMapUser: (user: MapUser | null) => void;
}

export const useAppStore = create<AppState>((set) => ({
  isLoggedIn: true,
  isActive: true,
  searchRadius: 1,
  activeFilters: ['active'],
  activeMenuId: 'all',
  followedBaristas: [],
  communitySidebarOpen: true,
  registeredMapUsers: defaultMapUsers,
  selectedMapUser: null,

  login: () => set({ isLoggedIn: true }),
  logout: () => set({ isLoggedIn: false }),
  setIsActive: (active) => set({ isActive: active }),
  setSearchRadius: (radius) => set({ searchRadius: radius }),
  toggleFilter: (filterId) =>
    set((state) => ({
      activeFilters: state.activeFilters.includes(filterId)
        ? state.activeFilters.filter((f) => f !== filterId)
        : [...state.activeFilters, filterId],
    })),
  setActiveMenu: (id) => set({ activeMenuId: id }),
  toggleFollow: (baristaid) =>
    set((state) => ({
      followedBaristas: state.followedBaristas.includes(baristaid)
        ? state.followedBaristas.filter((id) => id !== baristaid)
        : [...state.followedBaristas, baristaid],
    })),
  toggleCommunitySidebar: () =>
    set((state) => ({ communitySidebarOpen: !state.communitySidebarOpen })),
  addMapUser: (user) =>
    set((state) => ({ registeredMapUsers: [...state.registeredMapUsers, user] })),
  setSelectedMapUser: (user) => set({ selectedMapUser: user }),
}));
