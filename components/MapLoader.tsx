"use client";

import dynamic from "next/dynamic";

const MapView = dynamic(
  () => import("@/components/MapView"),
  {
    ssr: false,
    loading: () => (
      <div className="card">
        <p>Đang tải bản đồ...</p>
      </div>
    ),
  }
);

export default function MapLoader() {
  return <MapView />;
}
