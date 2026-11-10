import Shell from "@/components/Shell";
import {supabase} from "@/lib/supabase";
export const dynamic="force-dynamic";
export default async function Leaderboard(){let rows:any[]=[];try{const {data}=await supabase.from("reports").select("status,reporter_name,assigned_team");rows=data||[]}catch{}
 const users:Record<string,number>={},teams:Record<string,number>={};for(const r of rows){if(["Đã duyệt","Đang dọn","Đã dọn"].includes(r.status)){const n=r.reporter_name||"Ẩn danh";users[n]=(users[n]||0)+5;}if(r.status==="Đã dọn"){const t=r.assigned_team||"Chưa ghi tên đội";teams[t]=(teams[t]||0)+10;}}
 const render=(obj:Record<string,number>)=>Object.entries(obj).sort((a,b)=>b[1]-a[1]||a[0].localeCompare(b[0])).slice(0,10);
 return <Shell active="/leaderboard"><section className="hero"><h1>🏆 Bảng xếp hạng tích điểm</h1><p className="muted">Mỗi báo cáo hợp lệ +5 điểm; mỗi nhiệm vụ đã dọn +10 điểm cho đội.</p></section><div className="two">{[["Người dân",render(users)],["Đội dọn dẹp",render(teams)]].map(([title,list]:any)=><div className="card" key={title}><h2>{title==="Người dân"?"👤":"🧹"} {title}</h2>{list.length?list.map(([n,p]:any,i:number)=><div className="row between" style={{padding:"12px 0",borderBottom:"1px solid #e5eee7"}} key={n}><b>{["🥇","🥈","🥉"][i]||`${i+1}.`} {n}</b><strong>{p} điểm</strong></div>):<p className="muted">Chưa có dữ liệu điểm.</p>}</div>)}</div></Shell>;
}
