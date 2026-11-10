import Link from "next/link";
import { Leaf, Camera, MessageCircle, Map, Trophy, Users, CheckCircle, MessageSquare, Shield, Settings } from "lucide-react";
const groups = [
  { title:"Dành cho người dân", links:[["/","📷 Gửi báo cáo",Camera],["/chat","💬 Chat AI về rác",MessageCircle],["/feedback","📝 Phản ánh & báo lỗi",MessageSquare]] },
  { title:"Đội dọn dẹp", links:[["/team","🧹 Nhận nhiệm vụ",Users],["/completed","✅ Danh sách đã dọn",CheckCircle]] },
  { title:"Theo dõi & thống kê", links:[["/map","🗺️ Bản đồ điểm nóng",Map],["/leaderboard","🏆 Bảng xếp hạng",Trophy]] },
  { title:"Kiểm duyệt & quản trị", links:[["/staff","🛡️ Spam & kiểm duyệt",Shield],["/admin","⚙️ Quản trị",Settings]] }
];
export default function Shell({children,active}:{children:React.ReactNode;active:string}) {
 return <div className="shell"><aside className="sidebar">
   <div className="brand"><div className="brand-icon"><Leaf/></div><div><strong>Urban GreenEye AI</strong><small>Mắt Xanh Đô Thị</small></div></div>
   <div className="badge green">● Hệ thống Mắt Xanh</div>
   <nav>{groups.map(g=><div key={g.title}><div className="nav-title">{g.title}</div>{g.links.map(([href,label,Icon])=><Link key={href as string} href={href as string} className={`nav-link ${active===href?"active":""}`}>{label as string}</Link>)}</div>)}</nav>
   <div className="card" style={{marginTop:20,fontSize:12,lineHeight:1.6}}>AI Vision phân tích ảnh rác · Chat AI hướng dẫn phân loại · Bản đồ theo dõi báo cáo · Spam tự xóa sau 7 ngày.</div>
 </aside><main className="main">{children}<div className="footer">URBAN GREENEYE • CLEAN CITY – GREEN FUTURE</div></main></div>;
}
