/**
 * Geocoding utility
 * Tries Google Geocoding API first (if key is set), then falls back to known Korean areas.
 */

export const KNOWN_AREAS: Record<string, { lat: number; lng: number }> = {
  '한남동': { lat: 37.5326, lng: 126.9969 },
  '이태원': { lat: 37.5349, lng: 126.9924 },
  '성수동': { lat: 37.5444, lng: 127.0557 },
  '성수': { lat: 37.5444, lng: 127.0557 },
  '홍대입구': { lat: 37.5563, lng: 126.9236 },
  '홍대': { lat: 37.5563, lng: 126.9236 },
  '합정': { lat: 37.5496, lng: 126.9142 },
  '망원동': { lat: 37.5546, lng: 126.9066 },
  '상수동': { lat: 37.5489, lng: 126.9218 },
  '연남동': { lat: 37.5596, lng: 126.9284 },
  '마포': { lat: 37.5543, lng: 126.9520 },
  '신촌': { lat: 37.5596, lng: 126.9424 },
  '강남': { lat: 37.4979, lng: 127.0276 },
  '압구정': { lat: 37.5272, lng: 127.0291 },
  '청담동': { lat: 37.5237, lng: 127.0474 },
  '신사동': { lat: 37.5182, lng: 127.0206 },
  '가로수길': { lat: 37.5193, lng: 127.0230 },
  '종로': { lat: 37.5704, lng: 126.9917 },
  '인사동': { lat: 37.5744, lng: 126.9854 },
  '삼청동': { lat: 37.5827, lng: 126.9808 },
  '경복궁': { lat: 37.5794, lng: 126.9770 },
  '광화문': { lat: 37.5759, lng: 126.9768 },
  '명동': { lat: 37.5631, lng: 126.9831 },
  '을지로': { lat: 37.5662, lng: 126.9991 },
  '익선동': { lat: 37.5742, lng: 126.9936 },
  '동대문': { lat: 37.5714, lng: 127.0096 },
  '건대입구': { lat: 37.5403, lng: 127.0705 },
  '건대': { lat: 37.5403, lng: 127.0705 },
  '용산': { lat: 37.5299, lng: 126.9648 },
  '해방촌': { lat: 37.5399, lng: 126.9825 },
  '경리단길': { lat: 37.5389, lng: 126.9897 },
  '서촌': { lat: 37.5808, lng: 126.9695 },
  '통인동': { lat: 37.5808, lng: 126.9695 },
  '신림': { lat: 37.4844, lng: 126.9292 },
  '여의도': { lat: 37.5260, lng: 126.9244 },
  '영등포': { lat: 37.5154, lng: 126.9067 },
  '노량진': { lat: 37.5133, lng: 126.9425 },
  '서울대': { lat: 37.4609, lng: 126.9524 },
  '서울': { lat: 37.5665, lng: 126.9780 },
  // 원주
  '원주': { lat: 37.3422, lng: 127.9202 },
  '관설동': { lat: 37.3504, lng: 127.9471 },
  '단구동': { lat: 37.3441, lng: 127.9545 },
  '판부면': { lat: 37.2895, lng: 127.8712 },
  '행구동': { lat: 37.3700, lng: 127.9680 },
  '반곡관설동': { lat: 37.3618, lng: 127.9502 },
  '갈촌': { lat: 37.3485, lng: 127.9438 },
};

export async function geocodeAddress(address: string): Promise<{ lat: number; lng: number }> {
  const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;

  // 1. Try Google Geocoding API if key is available
  if (apiKey) {
    try {
      const query = address.includes('서울') ? address : `대한민국 서울 ${address}`;
      const response = await fetch(
        `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(query)}&key=${apiKey}&language=ko&region=KR`,
      );
      const data = await response.json();
      if (data.status === 'OK' && data.results.length > 0) {
        return data.results[0].geometry.location;
      }
    } catch (error) {
      console.warn('[geocode] API request failed, using fallback:', error);
    }
  }

  // 2. Fallback: match known Seoul areas
  for (const [area, coords] of Object.entries(KNOWN_AREAS)) {
    if (address.includes(area)) {
      return { lat: coords.lat, lng: coords.lng };
    }
  }

  // 3. Default: Seoul city center
  return { lat: 37.5665, lng: 126.9780 };
}
