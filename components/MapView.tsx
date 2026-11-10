
"use client";

import { useEffect, useState } from "react";
import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  LayersControl,
  useMap,
} from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

type Report = {
  id: string | number;
  latitude: number | string | null;
  longitude: number | string | null;
  location?: string;
  status?: string;
  description?: string;
};

const DEFAULT_CENTER: [number, number] = [10.957, 106.8427];

const createMarkerIcon = (status?: string) => {
  const color = status === "Đã dọn" ? "#18813a" : "#d43d32";

  return L.divIcon({
    className: "greeneye-marker",
    html: `<div style="
      width:16px;
      height:16px;
      background:${color};
      border:3px solid white;
      border-radius:50%;
      box-shadow:0 1px 6px rgba(0,0,0,.5);
    "></div>`,
    iconSize: [22, 22],
    iconAnchor: [11, 11],
    popupAnchor: [0, -12],
  });
};

function MapAutoCenter({ reports }: { reports: Report[] }) {
  const map = useMap();

  useEffect(() => {
    if (reports.length === 1) {
      const report = reports[0];
      map.setView(
        [Number(report.latitude), Number(report.longitude)],
        14
      );
    } else if (reports.length > 1) {
      const bounds = L.latLngBounds(
        reports.map((report) => [
          Number(report.latitude),
          Number(report.longitude),
        ])
      );

      map.fitBounds(bounds, { padding: [30, 30], maxZoom: 15 });
    }
  }, [reports, map]);

  return null;
}

export default function MapView() {
  const [reports, setReports] = useState<Report[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let active = true;

    async function loadReports() {
      try {
        const response = await fetch("/api/reports", {
          cache: "no-store",
        });

        if (!response.ok) {
          throw new Error("Không thể tải danh sách báo cáo.");
        }

        const data = await response.json();

        if (active) {
          setReports(
            Array.isArray(data.reports) ? data.reports : []
          );
          setError("");
        }
      } catch (err) {
        if (active) {
          setError(
            err instanceof Error
              ? err.message
              : "Đã xảy ra lỗi khi tải bản đồ."
          );
        }
      } finally {
        if (active) {
          setLoading(false);
        }
      }
    }

    loadReports();

    return () => {
      active = false;
    };
  }, []);

  const validReports = reports.filter((report) => {
    if (
      report.latitude === null ||
      report.longitude === null ||
      report.latitude === "" ||
      report.longitude === ""
    ) {
      return false;
    }

    const lat = Number(report.latitude);
    const lng = Number(report.longitude);

    return (
      Number.isFinite(lat) &&
      Number.isFinite(lng) &&
      lat >= -90 &&
      lat <= 90 &&
      lng >= -180 &&
      lng <= 180
    );
  });

  const cleanedCount = validReports.filter(
    (report) => report.status === "Đã dọn"
  ).length;

  const pendingCount = validReports.length - cleanedCount;

  return (
    <div className="card">
      <div style={{ marginBottom: 16 }}>
        <h2>🗺️ Bản đồ báo cáo môi trường</h2>
        <p className="muted">
          Theo dõi các vị trí ô nhiễm và tình trạng xử lý.
        </p>
      </div>

      <div
        style={{
          display: "flex",
          gap: 12,
          flexWrap: "wrap",
          marginBottom: 16,
        }}
      >
        <div>
          <span style={{ color: "#d43d32" }}>● </span>
          Chưa hoàn thành: <strong>{pendingCount}</strong>
        </div>

        <div>
          <span style={{ color: "#18813a" }}>● </span>
          Đã dọn: <strong>{cleanedCount}</strong>
        </div>
      </div>

      {error && (
        <p style={{ color: "#d43d32", marginBottom: 12 }}>
          {error}
        </p>
      )}

      {loading && (
        <p className="muted">Đang tải dữ liệu bản đồ...</p>
      )}

      <div
        className="map-frame"
        style={{
          height: 500,
          width: "100%",
          overflow: "hidden",
          borderRadius: 12,
        }}
      >
        <MapContainer
          center={DEFAULT_CENTER}
          zoom={12}
          style={{ height: "100%", width: "100%" }}
          scrollWheelZoom={true}
        >
          <LayersControl position="topright">
            <LayersControl.BaseLayer
              checked
              name="Bản đồ đường phố"
            >
              <TileLayer
                attribution="© OpenStreetMap"
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              />
            </LayersControl.BaseLayer>

            <LayersControl.BaseLayer name="Bản đồ vệ tinh">
              <TileLayer
                attribution="Tiles © Esri"
                url="https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}"
              />
            </LayersControl.BaseLayer>
          </LayersControl>

          {validReports.map((report) => (
            <Marker
              key={report.id}
              position={[
                Number(report.latitude),
                Number(report.longitude),
              ]}
              icon={createMarkerIcon(report.status)}
            >
              <Popup>
                <div style={{ minWidth: 160 }}>
                  <strong>
                    {report.location || "Vị trí báo cáo"}
                  </strong>

                  <p style={{ margin: "8px 0" }}>
                    Trạng thái: {report.status || "Chưa xác định"}
                  </p>

                  <p>
                    {report.description || "Không có mô tả."}
                  </p>
                </div>
              </Popup>
            </Marker>
          ))}

          <MapAutoCenter reports={validReports} />
        </MapContainer>
      </div>

      {!loading && validReports.length === 0 && (
        <p className="muted" style={{ marginTop: 12 }}>
          Chưa có báo cáo nào có tọa độ hợp lệ.
        </p>
      )}

      <p className="muted" style={{ marginTop: 12 }}>
        Đang hiển thị {validReports.length} vị trí báo cáo.
      </p>
    </div>
  );
}
