"use client";
import { useState } from "react";
export default function ReportForm(){
 const [busy,setBusy]=useState(false),[msg,setMsg]=useState(""),[file,setFile]=useState<File|null>(null);
 async function submit(e:React.FormEvent<HTMLFormElement>){e.preventDefault();setMsg("");if(!file){setMsg("Vui lòng chọn ảnh hiện trường.");return}
  const form=e.currentTarget;const fd=new FormData(form);fd.set("image",file);setBusy(true);
  try{const r=await fetch("/api/reports",{method:"POST",body:fd});const j=await r.json();if(!r.ok)throw new Error(j.error||"Không gửi được báo cáo.");setMsg(`Đã gửi báo cáo ${j.code||""}. Trạng thái: ${j.status||"Đang xử lý"}.`);form.reset();setFile(null);window.dispatchEvent(new Event("greeneye-refresh"));}
  catch(err){setMsg(err instanceof Error?err.message:"Có lỗi xảy ra.");}finally{setBusy(false)}
 }
 return <form className="card" onSubmit={submit}><h2>📷 Gửi báo cáo rác thải</h2><p className="muted">Ảnh phải thể hiện rõ rác thải tại địa điểm thực tế. AI sẽ phân tích ảnh sau khi gửi.</p>
  <label>Họ tên / biệt danh *</label><input name="reporter_name" required maxLength={100} placeholder="Tên người gửi"/>
  <label>Địa điểm *</label><input name="location" required maxLength={300} placeholder="Địa chỉ hoặc tên khu vực"/>
  <div className="two"><div><label>Vĩ độ (latitude)</label><input name="latitude" type="number" step="any" placeholder="10.9570"/></div><div><label>Kinh độ (longitude)</label><input name="longitude" type="number" step="any" placeholder="106.8427"/></div></div>
  <label>Mô tả thêm</label><textarea name="description" maxLength={1000} placeholder="Mô tả tình trạng rác..."/>
  <label>Ảnh hiện trường * (JPG, PNG, WEBP – tối đa 10 MB)</label><input type="file" accept="image/jpeg,image/png,image/webp" onChange={e=>setFile(e.target.files?.[0]||null)} required/>
  {msg&&<div className={msg.startsWith("Đã gửi")?"success":"error"}>{msg}</div>}
  <button className="btn" disabled={busy}>{busy?"Đang gửi và phân tích ảnh...":"Gửi báo cáo & phân tích AI"}</button>
 </form>;
}
