export type Barista = {
  id: string;
  name: string;
  title: string;
  avatar: string;
  isOnline: boolean;
  isPremium: boolean;
  lat: number;
  lng: number;
  specialty: string;
  district: string;
  followers: number;
};

export type NewsPost = {
  id: string;
  author: Barista;
  content: string;
  timeAgo: string;
  location: string;
  likes: number;
  comments: number;
  tags: string[];
  imageUrl?: string;
  isOwn?: boolean;
};

export type Story = {
  id: string;
  user: Barista;
  hasUnread: boolean;
  ringColor?: string;
};

export type TrendingTopic = {
  id: string;
  category: string;
  tag: string;
  count: string;
};

export type FilterChip = {
  id: string;
  label: string;
  type: 'location' | 'category';
};

export type RecommendedBarista = {
  barista: Barista;
  role: string;
};

export type ProfileUser = Barista & {
  bio: string;
  postsCount: number;
  followingCount: number;
  coverImage?: string;
  email?: string;
  website?: string;
};

export type NewsArticle = {
  id: string;
  title: string;
  summary: string;
  category: string;
  source: string;
  timeAgo: string;
  imageUrl?: string;
  isBookmarked: boolean;
  readTime: string;
  tags: string[];
};

/** Registered user displayed as a marker on the map */
export type MapUser = {
  id: string;
  name: string;
  avatar: string;
  role: 'barista' | 'cafe_owner';
  address: string;
  lat: number;
  lng: number;
  showOnMap: boolean;
  district?: string;
  // Barista fields
  bio?: string;
  specialties?: string[];
  experienceYears?: string;
  currentCafe?: string;
  instagram?: string;
  // Cafe owner fields
  cafeName?: string;
  cafePhone?: string;
  cafeHoursOpen?: string;
  cafeHoursClose?: string;
  cafeFeatures?: string[];
  cafeDesc?: string;
};
