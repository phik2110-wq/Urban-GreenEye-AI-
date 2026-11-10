import {NextRequest,NextResponse} from "next/server";
import {askGreeneye} from "@/lib/greeneye";
export const runtime="nodejs";export const maxDuration=60;
export async function POST(req:NextRequest){try{const {history}=await req.json();if(!Array.isArray(history))return NextResponse.json({error:"Lịch sử chat không hợp lệ."},{status:400});const safe=history.filter((x:any)=>["user","assistant"].includes(x?.role)&&typeof x?.content==="string").slice(-12).map((x:any)=>({role:x.role,content:x.content.slice(0,1500)}));const answer=await askGreeneye(safe);return NextResponse.json({answer})}catch(e){return NextResponse.json({error:e instanceof Error?e.message:"Chat AI gặp lỗi."},{status:500})}}
