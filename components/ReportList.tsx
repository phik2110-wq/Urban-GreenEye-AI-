"use client";
import { useEffect,useState } from "react";
type Report={id:string;reporter_name:string;location:string;description:string;status:string;ai_result:string;image_path:string;created_at:string;assigned_team?:string;cleanup_note?:string;cleanup_image_path?:string};
const url=(p:string)=>p?.startsWith("http")?p:`${process.env.NEXT_PUBLIC_SUPABASE_URL||""}/storage/v1/object/public/${process.env.NEXT_PUBLIC_SUPABASE_BUCKET||"urban-greeneye"}/${(p||"").split("/").map(encodeURIComponent).join("/")}`;
const code=(id:string)=>"QL-"+id.replace(/-/g,"").slice(0,6).toUpperCase();
export default function ReportList({status,limit=6}:{status?:string;limit?:number}){
 const [rows,setRows]=useState<Report[]>([]),[err,setErr]=useState("");
 async function load(){try{const r=await fetch("/api/reports",{cache:"no-store"});const j=await r.json();if(!r.ok)throw Error(j.error);setRows((j.reports||[]).filter((x:Report)=>!status||x.status===status).slice(0,limit));}catch(e){setErr(e instanceof Error?e.message:"Không tải được báo cáo");}}
 useEffect(()=>{load();const f=()=>load();window.addEventListener("greeneye-refresh",f);return()=>window.removeEventListener("greeneye-refresh",f)},[status,limit]);
 if(err)return <div className="error">{err}</div>;
 if(!rows.length)return <div className="card muted">Chưa có báo cáo phù hợp.</div>;
 return <div className="grid">{rows.map(r=><article className="card report" key={r.id}><img src={url(r.image_path)} alt="Ảnh báo cáo"/><div><div className="row between"><b>{code(r.id)}</b><span className={`badge ${r.status==="Đã dọn"?"green":r.status==="Spam/Từ chối"?"red":r.status==="Đang dọn"?"orange":""}`}>{r.status}</span></div><p><b>Người gửi:</b> {r.reporter_name||"Ẩn danh"}</p><p><b>Địa điểm:</b> {r.location||"Chưa có"}</p><p>{r.description||"Không có mô tả"}</p>{r.ai_result&&<p className="muted">🤖 {r.ai_result}</p>}<small className="muted">{new Date(r.created_at).toLocaleString("vi-VN")}</small></div></article>)}</div>;
}
