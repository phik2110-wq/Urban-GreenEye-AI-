import Shell from "@/components/Shell";
import ReportList from "@/components/ReportList";
export default function Completed(){return <Shell active="/completed"><section className="hero"><h1>✅ Danh sách đã dọn</h1><p className="muted">Các nhiệm vụ đã hoàn thành và ghi nhận ảnh sau dọn.</p></section><ReportList status="Đã dọn" limit={100}/></Shell>}
