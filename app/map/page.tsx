import Shell from "@/components/Shell";
import MapView from "@/components/MapView";
export default function MapPage(){return <Shell active="/map"><section className="hero"><h1>🗺️ Bản đồ điểm nóng ô nhiễm</h1><p className="muted">Tổng hợp báo cáo có tọa độ và tình trạng xử lý.</p></section><MapView/></Shell>}
