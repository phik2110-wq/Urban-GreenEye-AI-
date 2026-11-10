import {NextRequest,NextResponse} from "next/server";
import {setSessionCookie,clearSessionCookie,Role} from "@/lib/auth";
export const runtime="nodejs";
export async function POST(req:NextRequest){try{const {role,pin}=await req.json() as {role:Role;pin:string};if(!["admin","team","staff"].includes(role)||typeof pin!=="string")return NextResponse.json({error:"Thông tin đăng nhập không hợp lệ."},{status:400});const expected=role==="admin"?process.env.ADMIN_PIN:role==="team"?process.env.TEAM_PIN:process.env.STAFF_PIN;if(!expected)return NextResponse.json({error:"Chưa cấu hình PIN tương ứng trên Vercel."},{status:503});if(pin!==expected)return NextResponse.json({error:"Mã PIN không đúng."},{status:401});const res=NextResponse.json({ok:true});setSessionCookie(res,role);return res;}catch{return NextResponse.json({error:"Không xử lý được đăng nhập."},{status:400})}}
export async function DELETE(){const res=NextResponse.json({ok:true});clearSessionCookie(res);return res}
