"use client";
import {useEffect,useState} from "react";
type R={id:string;reporter_name:string;location:string;status:string;ai_result:string;image_path:string;ai_raw_json:string};
const img=(p:string)=>`${process.env.NEXT_PUBLIC_SUPABASE_URL||""}/storage/v1/object/public/${process.env.NEXT_PUBLIC_SUPABASE_BUCKET||"urban-greeneye"}/${(p||"").split("/").map(encodeURIComponent).join("/")}`;
export default function StaffPanel(){const [ok,setOk]=useState(false),[pin,setPin]=useState(""),[rows,setRows]=useState<R[]>([]),[err,setErr]=useState("");
 async function load(){const r=await fetch("/api/reports",{cache:"no-store"});const j=await r.json();setRows((j.reports||[]).filter((x:R)=>["Cần xem lại","Spam/Từ chối","Lỗi AI"].includes(x.status)))}
 useEffect(()=>{if(ok)load()},[ok]);
 async function login(){const r=await fetch("/api/auth",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({role:"staff",pin})});const j=await r.json();if(!r.ok){setErr(j.error);return}setOk(true)}
 async function update(id:string,action:string){const r=await fetch(`/api/reports/${id}`,{method:"PATCH",headers:{"Content-Type":"application/json"},body:JSON.stringify({action})});const j=await r.json();if(!r.ok){setErr(j.error);return}load()}
 if(!ok)return <div className="card" style={{maxWidth:480}}><h2>PIN nhân viên</h2><input type="password" value={pin} onChange={e=>setPin(e.target.value)}/><button className="btn" style={{marginTop:12}} onClick={login}>Đăng nhập</button>{err&&<div className="error">{err}</div>}</div>;
 return <div>{err&&<div className="error">{err}</div>}{rows.map(r=><div className="card" key={r.id}><div className="row between"><b>{r.reporter_name} · {r.location}</b><span className="badge red">{r.status}</span></div><img src={img(r.image_path)} alt="Báo cáo" style={{width:"100%",maxWidth:400,borderRadius:12}}/><p>{r.ai_result}</p><div className="row"><button className="btn" onClick={()=>update(r.id,"approve")}>Duyệt báo cáo</button><button className="btn secondary" onClick={()=>update(r.id,"reject")}>Từ chối</button><button className="btn danger" onClick={()=>update(r.id,"delete")}>Xóa</button></div></div>)}</div>;
}
