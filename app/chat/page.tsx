"use client";
import Shell from "@/components/Shell";
import {useState} from "react";
type M={role:"user"|"assistant";content:string};
export default function Chat(){const [history,setHistory]=useState<M[]>([{role:"assistant",content:"👋 Xin chào! Mình là Trợ lý Mắt Xanh. Bạn muốn hỏi cách phân loại hoặc xử lý loại rác nào?"}]);const [q,setQ]=useState(""),[busy,setBusy]=useState(false),[err,setErr]=useState("");
 async function send(e:React.FormEvent){e.preventDefault();if(!q.trim()||busy)return;const next=[...history,{role:"user" as const,content:q.trim()}];setHistory(next);setQ("");setBusy(true);setErr("");try{const r=await fetch("/api/chat",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({history:next})});const j=await r.json();if(!r.ok)throw Error(j.error);setHistory([...next,{role:"assistant",content:j.answer}]);}catch(e){setErr(e instanceof Error?e.message:"Không gọi được AI.");}finally{setBusy(false)}}
 return <Shell active="/chat"><section className="hero"><h1>💬 Chat AI về rác thải</h1><p className="muted">Trợ lý Mắt Xanh – tư vấn phân loại, tái chế và xử lý rác.</p></section><div className="card chat">{history.map((m,i)=><div className={`bubble ${m.role}`} key={i}>{m.content}</div>)}{busy&&<div className="muted">Trợ lý Mắt Xanh đang trả lời…</div>}{err&&<div className="error">{err}</div>}<form className="row" onSubmit={send}><input value={q} onChange={e=>setQ(e.target.value)} maxLength={400} placeholder="Ví dụ: Pin cũ nên bỏ ở đâu?" disabled={busy}/><button className="btn" disabled={busy}>Gửi</button></form></div></Shell>;
}
