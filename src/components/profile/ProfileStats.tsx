import type { ProfileUser } from '@/types';

interface ProfileStatsProps {
  user: ProfileUser;
}

export default function ProfileStats({ user }: ProfileStatsProps) {
  const stats = [
    { label: '게시물', value: user.postsCount },
    { label: '팔로워', value: user.followers.toLocaleString() },
    { label: '팔로잉', value: user.followingCount },
  ];

  return (
    <div className="bg-white border-b border-gray-100">
      <div className="flex divide-x divide-gray-100">
        {stats.map((stat) => (
          <button
            key={stat.label}
            className="flex-1 py-3 flex flex-col items-center gap-0.5 hover:bg-gray-50 transition-colors"
          >
            <span className="text-lg font-bold text-gray-900">{stat.value}</span>
            <span className="text-xs text-gray-400">{stat.label}</span>
          </button>
        ))}
      </div>
    </div>
  );
}
