import type { Barista, NewsPost, Story, TrendingTopic, FilterChip, RecommendedBarista, ProfileUser, NewsArticle } from '@/types';

export const currentUser: Barista = {
  id: '0',
  name: '박준영',
  title: '커피 애호가',
  avatar: 'https://i.pravatar.cc/100?u=junyoung-park',
  isOnline: true,
  isPremium: false,
  lat: 37.5326,
  lng: 126.9969,
  specialty: '핸드드립',
  district: '한남동',
  followers: 320,
};

export const mockBaristas: Barista[] = [
  {
    id: '1',
    name: '지후 바리스타',
    title: '핸드드립 전문',
    avatar: 'https://i.pravatar.cc/100?u=jihu-barista',
    isOnline: true,
    isPremium: false,
    lat: 37.5349,
    lng: 126.9924,
    specialty: '핸드드립',
    district: '이태원',
    followers: 1240,
  },
  {
    id: '2',
    name: '민준',
    title: '로스팅 마스터',
    avatar: 'https://i.pravatar.cc/100?u=minjun-roasting',
    isOnline: true,
    isPremium: true,
    lat: 37.5315,
    lng: 126.9980,
    specialty: '로스팅',
    district: '한남동',
    followers: 3200,
  },
  {
    id: '3',
    name: '서연',
    title: '라떼 아트 강사',
    avatar: 'https://i.pravatar.cc/100?u=seoyeon-latte',
    isOnline: false,
    isPremium: false,
    lat: 37.5295,
    lng: 126.9945,
    specialty: '라떼 아트',
    district: '한남동',
    followers: 890,
  },
  {
    id: '4',
    name: '이현우',
    title: '브루잉 챔피언',
    avatar: 'https://i.pravatar.cc/100?u=hyunwoo-brewing',
    isOnline: true,
    isPremium: true,
    lat: 37.5360,
    lng: 126.9958,
    specialty: '브루잉',
    district: '한남동',
    followers: 5600,
  },
  {
    id: '5',
    name: '박지민',
    title: '라마르조꼬 강사',
    avatar: 'https://i.pravatar.cc/100?u=jimin-espresso',
    isOnline: true,
    isPremium: false,
    lat: 37.5278,
    lng: 126.9936,
    specialty: '라떼 아트',
    district: '용산',
    followers: 2100,
  },
];

const ownPostAuthor: Barista = {
  ...currentUser,
  name: '나 (박준영)',
};

export const mockNewsPosts: NewsPost[] = [
  {
    id: 'own-1',
    author: ownPostAuthor,
    content: '오늘 콜롬비아 게이샤 원두 소량 입고되었습니다. 테이스팅 하실 분 오세요! ☕',
    timeAgo: '방금 전',
    location: '한남동',
    likes: 0,
    comments: 0,
    tags: ['#콜롬비아', '#게이샤'],
    isOwn: true,
  },
  {
    id: 'post-1',
    author: mockBaristas[0],
    content: '오늘의 싱글 오리진 에티오피아 예가체프 추출 중입니다! ☕ 산미 좋아하시는 분들 강추해요.',
    timeAgo: '2분 전',
    location: '이태원로',
    likes: 12,
    comments: 3,
    tags: ['#핸드드립', '#에티오피아', '#예가체프'],
  },
  {
    id: 'post-2',
    author: mockBaristas[1],
    content: '새로운 하우스 블렌드 로스팅 완료. 밸런스 잡는데 3일 걸렸네요. 테이스팅 하러 오세요.',
    timeAgo: '15분 전',
    location: '한남동',
    likes: 28,
    comments: 7,
    tags: ['#로스팅', '#블렌드', '#테이스팅'],
  },
  {
    id: 'post-3',
    author: mockBaristas[2],
    content: '라떼 아트 연습 같이하실 분 있나요? 🎨',
    timeAgo: '1시간 전',
    location: '한남동',
    likes: 5,
    comments: 2,
    tags: ['#라떼아트', '#연습'],
  },
];

export const mockCommunityPosts: NewsPost[] = [
  {
    id: 'cp-1',
    author: mockBaristas[0],
    content: '오늘 아침 연습한 로제타입니다. 우유 스팀이 생각보다 잘 나와서 결이 예쁘게 잡혔네요. 🌿\n사용 원두: 에티오피아 예가체프 G1\n머신: 라마르조꼬 GS3',
    timeAgo: '2시간 전',
    location: '서울 한남동',
    likes: 124,
    comments: 18,
    tags: ['#라떼아트', '#로제타', '#모닝커피'],
    imageUrl: 'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=600&q=80',
  },
  {
    id: 'cp-2',
    author: mockBaristas[1],
    content: '이번 주 새로 입고된 케냐 키리냐가 AA 드립 세팅 완료했습니다. 블랙커런트와 자두 향이 정말 인상적이에요. 주말에 오시면 시음해 보실 수 있어요!',
    timeAgo: '4시간 전',
    location: '서울 한남동',
    likes: 89,
    comments: 12,
    tags: ['#케냐커피', '#스페셜티', '#핸드드립'],
  },
];

export const mockStories: Story[] = [
  { id: 's0', user: currentUser, hasUnread: false },
  { id: 's1', user: mockBaristas[0], hasUnread: true, ringColor: '#C8914A' },
  { id: 's2', user: mockBaristas[1], hasUnread: true, ringColor: '#D4A853' },
  { id: 's3', user: mockBaristas[2], hasUnread: false },
  { id: 's4', user: mockBaristas[3], hasUnread: true, ringColor: '#C8914A' },
];

export const mockTrending: TrendingTopic[] = [
  { id: 't1', category: '대한민국 · 커피', tag: '#게이샤_원두', count: '1.2만 게시물' },
  { id: 't2', category: '서울 · 카페', tag: '#성수동_핫플', count: '8,432 게시물' },
  { id: 't3', category: '레시피', tag: '#오트라떼_비율', count: '5,102 게시물' },
];

export const mockRecommended: RecommendedBarista[] = [
  { barista: mockBaristas[3], role: '브루잉 챔피언' },
  { barista: mockBaristas[4], role: '라마이트 강사' },
];

export const currentUserProfile: ProfileUser = {
  ...currentUser,
  bio: '커피를 사랑하는 홈바리스타 ☕ 핸드드립과 에스프레소를 탐구하는 중입니다. 한남동·이태원 근처 카페 탐방 중.',
  postsCount: 47,
  followingCount: 128,
  email: 'junyoung@example.com',
  website: 'instagram.com/junyoung_coffee',
  coverImage: 'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=800&q=80',
};

export const mockProfilePosts: NewsPost[] = [
  {
    id: 'pp-1',
    author: currentUser,
    content: '오늘 콜롬비아 게이샤 원두 소량 입고되었습니다. 테이스팅 하실 분 오세요! ☕',
    timeAgo: '방금 전',
    location: '한남동',
    likes: 14,
    comments: 3,
    tags: ['#콜롬비아', '#게이샤'],
    imageUrl: 'https://images.unsplash.com/photo-1509042239860-f550ce710b93?w=600&q=80',
  },
  {
    id: 'pp-2',
    author: currentUser,
    content: '주말 핸드드립 세션 준비 완료 🌿 에티오피아 예가체프로 시작해볼게요.',
    timeAgo: '3일 전',
    location: '이태원',
    likes: 32,
    comments: 5,
    tags: ['#핸드드립', '#에티오피아'],
    imageUrl: 'https://images.unsplash.com/photo-1442512595331-e89e73853f31?w=600&q=80',
  },
  {
    id: 'pp-3',
    author: currentUser,
    content: '새벽에 혼자 내리는 커피 한 잔. 이 시간이 제일 좋아요.',
    timeAgo: '1주일 전',
    location: '한남동',
    likes: 58,
    comments: 8,
    tags: ['#새벽커피', '#혼커'],
  },
];

export const mockNewsArticles: NewsArticle[] = [
  {
    id: 'n1',
    title: '2024 월드 바리스타 챔피언십 한국 대표팀 출전',
    summary: '한국 대표팀이 이번 세계 대회에서 핸드드립 부문 역대 최고 성적을 거둘 것으로 기대되고 있습니다.',
    category: '이벤트',
    source: '커피 데일리',
    timeAgo: '2시간 전',
    imageUrl: 'https://images.unsplash.com/photo-1521302080334-4bebac2763a6?w=600&q=80',
    isBookmarked: false,
    readTime: '3분',
    tags: ['#WBC', '#챔피언십', '#한국'],
  },
  {
    id: 'n2',
    title: '스페셜티 커피 시장 연간 20% 성장세 지속',
    summary: '국내 스페셜티 커피 소비가 꾸준히 늘면서 소규모 로스터리 카페들이 새로운 트렌드를 이끌고 있습니다.',
    category: '트렌드',
    source: '푸드앤비버리지',
    timeAgo: '5시간 전',
    imageUrl: 'https://images.unsplash.com/photo-1511537190424-bbbab87ac5eb?w=600&q=80',
    isBookmarked: true,
    readTime: '5분',
    tags: ['#스페셜티', '#로스터리', '#트렌드'],
  },
  {
    id: 'n3',
    title: '라떼 아트 입문자를 위한 우유 스팀 완전 정복',
    summary: '초보 바리스타도 쉽게 따라할 수 있는 마이크로폼 만들기의 핵심 포인트를 정리했습니다.',
    category: '레시피',
    source: '바리스타 매거진',
    timeAgo: '1일 전',
    imageUrl: 'https://images.unsplash.com/photo-1534040385115-33dcb3acba5b?w=600&q=80',
    isBookmarked: false,
    readTime: '7분',
    tags: ['#라떼아트', '#우유스팀', '#입문'],
  },
  {
    id: 'n4',
    title: '에티오피아 예가체프 G1, 올해의 원두 선정',
    summary: '국제 커피 품질 기관이 선정한 올해의 스페셜티 원두로 에티오피아 예가체프 G1이 뽑혔습니다.',
    category: '원두',
    source: 'SCA 코리아',
    timeAgo: '2일 전',
    imageUrl: 'https://images.unsplash.com/photo-1447933601403-0c6688de566e?w=600&q=80',
    isBookmarked: false,
    readTime: '4분',
    tags: ['#에티오피아', '#예가체프', '#스페셜티'],
  },
  {
    id: 'n5',
    title: '홈카페 인기 메뉴 TOP 5: 2024 트렌드 분석',
    summary: '올해 가장 많이 검색된 홈카페 레시피와 장비들을 분석해 인기 메뉴 TOP 5를 공개합니다.',
    category: '레시피',
    source: '홈카페 트렌드',
    timeAgo: '3일 전',
    imageUrl: 'https://images.unsplash.com/photo-1461023058943-07fcbe16d735?w=600&q=80',
    isBookmarked: true,
    readTime: '6분',
    tags: ['#홈카페', '#레시피', '#트렌드'],
  },
  {
    id: 'n6',
    title: '서울 성수동, 새로운 스페셜티 커피 성지로 부상',
    summary: '성수동에 개성 있는 스페셜티 카페들이 잇달아 오픈하며 커피 마니아들의 발길을 끌고 있습니다.',
    category: '카페 투어',
    source: '서울 카페 가이드',
    timeAgo: '4일 전',
    imageUrl: 'https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?w=600&q=80',
    isBookmarked: false,
    readTime: '5분',
    tags: ['#성수동', '#카페투어', '#스페셜티'],
  },
];

export const newsCategories = ['전체', '트렌드', '레시피', '이벤트', '원두', '카페 투어'];

export const filterChips: FilterChip[] = [
  { id: 'active', label: '활동중', type: 'category' },
  { id: 'latte', label: '라떼아트', type: 'category' },
  { id: 'roasting', label: '로스팅', type: 'category' },
  { id: 'handdip', label: '핸드드립', type: 'category' },
];

export const communityMenuItems = [
  { id: 'all', label: '전체 커뮤니티', icon: 'globe' },
  { id: 'popular', label: '인기 게시글', icon: 'trending-up' },
  { id: 'latest', label: '최신글', icon: 'zap', isNew: true },
];

export const communityCategories = [
  { id: 'qa', label: '질문과 답변', icon: 'circle-help', color: '#F97316' },
  { id: 'recipe', label: '레시피 공유', icon: 'book-open', color: '#92400E' },
  { id: 'cafe', label: '카페 투어', icon: 'store', color: '#EF4444' },
  { id: 'job', label: '구인/구직', icon: 'megaphone', color: '#8B5CF6' },
];
