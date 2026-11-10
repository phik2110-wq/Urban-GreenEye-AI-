
"use client";

import { useEffect, useState } from "react";
import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  LayersControl,
} from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";

type R = {
  id: string;
  latitude: number | null;
  longitude: number | null;
  location: string;
  status: string;
  description: string;
};

export default function MapView() {
  const [rows, setRows] = useState<R[]>([]);

  useEffect(() => {
    fetch("/api/reports", { cache: "no-store" })
      .then((r) => r.json())
      .then((j) => setRows(j.reports || []))
      .catch((error) => console.error("Lỗi tải báo cáo:", error));
  }, []);

  const pts = rows.filter(
    (r) =>
      r.latitude !== null &&
      r.longitude !== null &&
      Number.isFinite(Number(r.latitude)) &&
      Number.isFinite(Number(r.longitude))
  );

  const center: [number, number] = pts.length
    ? [Number(pts[0].latitude), Number(pts[0].longitude)]
    : [10.957, 106.8427];

  return (
    <div className="card">
      <h2>🗺️ Bản đồ báo cáo</h2>

      <p className="muted">
        Các điểm đỏ/cam là báo cáo chưa hoàn thành; điểm xanh là đã dọn.
      </p>

      <div className="map-frame">
        <MapContainer
          center={center}
          zoom={12}
          style={{ height: "100%", width: "100%" }}
          scrollWheelZoom
        >
          <LayersControl position="topright">
            <LayersControl.BaseLayer checked name="OpenStreetMap">
              <TileLayer
                attribution="© OpenStreetMap"
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              />
            </LayersControl.BaseLayer>

            <LayersControl.BaseLayer name="Vệ tinh Esri">
              <TileLayer
                attribution="Tiles © Esri"
                url="https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}"
              />
            </LayersControl.BaseLayer>
          </LayersControl>

          {pts.map((p) => (
            <Marker
              key={p.id}
              position={[
                Number(p.latitude),
                Number(p.longitude),
              ]}
              icon={L.divIcon({
                className: "greeneye-pin",
                html: `<span style="display:block;background:${
                  p.status === "Đã dọn" ? "#18813a" : "#d43d32"
                };width:15px;height:15px;border:2px solid white;border-radius:50%;box-shadow:0 1px 5px #333"></span>`,
              })}
            >
              <Popup>
                <b>{p.location}</b>
                <br />
                {p.status}
                <br />
                {p.description}
              </Popup>
            </Marker>
          ))}
        </MapContainer>
      </div>

      <p className="muted">
        {pts.length} báo cáo có tọa độ hợp lệ.
      </p>
    </div>
  );
}
