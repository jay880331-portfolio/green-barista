'use client';

import dynamic from 'next/dynamic';

const GoogleMapClient = dynamic(() => import('./GoogleMapClient'), {
  ssr: false,
  loading: () => (
    <div className="w-full h-full bg-map-bg flex items-center justify-center">
      <div className="text-center">
        <div className="w-8 h-8 border-2 border-espresso border-t-transparent rounded-full animate-spin mx-auto mb-2" />
        <p className="text-sm text-gray-500">지도 로딩 중...</p>
      </div>
    </div>
  ),
});

export default function MapView() {
  return (
    <div className="w-full h-full">
      <GoogleMapClient />
    </div>
  );
}
