import Shell from "@/components/Shell";
import ReportForm from "@/components/ReportForm";
import ReportList from "@/components/ReportList";
import { supabase, requireSupabase } from "@/lib/supabase";
export const dynamic="force-dynamic";
export default async function Home(){
 let rows:any[]=[];try{requireSupabase();const {data}=await supabase.from("reports").select("id,status").order("created_at",{ascending:false}).limit(500);rows=data||[]}catch{}
 const count=(s:string)=>rows.filter(x=>x.status===s).length;
 return <Shell active="/"><section className="hero"><div className="badge green">🌱 MẮT XANH ĐÔ THỊ</div><h1>Urban GreenEye AI</h1><p className="muted">Cùng cộng đồng phát hiện, phân loại và xử lý rác thải đô thị bằng trí tuệ nhân tạo.</p></section>
 <div className="grid stats"><div className="card stat"><span className="muted">Tổng báo cáo gần đây</span><strong>{rows.length}</strong></div><div className="card stat"><span className="muted">Đã duyệt</span><strong>{count("Đã duyệt")}</strong></div><div className="card stat"><span className="muted">Đang dọn</span><strong>{count("Đang dọn")}</strong></div><div className="card stat"><span className="muted">Đã dọn</span><strong>{count("Đã dọn")}</strong></div></div>
 <div className="two"><ReportForm/><div><div className="section-head"><h2>Báo cáo mới nhất</h2></div><ReportList limit={5}/></div></div></Shell>;
}
