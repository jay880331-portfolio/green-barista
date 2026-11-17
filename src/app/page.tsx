import LeftPanel from "@/components/home/LeftPanel";
import MapView from "@/components/map/MapView";
import MobileMapHeader from "@/components/home/MobileMapHeader";
import BottomNav from "@/components/layout/BottomNav";

//test
export default function Home() {
  return (
    <main className="flex h-screen overflow-hidden relative">
      {/* Left panel — desktop only (lg+) */}
      <LeftPanel />

      {/* Map — fills remaining space */}
      <div className="flex-1 relative overflow-hidden">
        <MapView />
        {/* Mobile floating header + filter chips (lg: hidden) */}
        <MobileMapHeader />
      </div>

      {/* Mobile bottom navigation */}
      <BottomNav />
    </main>
  );
}
