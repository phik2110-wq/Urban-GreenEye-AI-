import { createHmac, timingSafeEqual } from "node:crypto";
import { NextRequest, NextResponse } from "next/server";

const COOKIE = "greeneye_session";
const secret = () => process.env.SESSION_SECRET || "";

function sign(value: string) {
  const s = secret();
  if (s.length < 32) throw new Error("SESSION_SECRET phải có ít nhất 32 ký tự.");
  return createHmac("sha256", s).update(value).digest("hex");
}

export type Role = "admin" | "team" | "staff";

export function createSession(role: Role) {
  const payload = `${role}.${Date.now() + 8 * 60 * 60 * 1000}`;
  return `${payload}.${sign(payload)}`;
}

export function readSession(req: NextRequest): Role | null {
  try {
    const token = req.cookies.get(COOKIE)?.value || "";
    const parts = token.split(".");
    if (parts.length !== 3) return null;
    const [role, exp, signature] = parts;
    if (!["admin", "team", "staff"].includes(role)) return null;
    if (!Number.isFinite(Number(exp)) || Number(exp) < Date.now()) return null;
    const expected = sign(`${role}.${exp}`);
    const a = Buffer.from(signature);
    const b = Buffer.from(expected);
    if (a.length !== b.length || !timingSafeEqual(a, b)) return null;
    return role as Role;
  } catch { return null; }
}

export function setSessionCookie(res: NextResponse, role: Role) {
  res.cookies.set(COOKIE, createSession(role), {
    httpOnly: true, secure: process.env.NODE_ENV === "production",
    sameSite: "lax", path: "/", maxAge: 8 * 60 * 60
  });
}

export function clearSessionCookie(res: NextResponse) {
  res.cookies.set(COOKIE, "", { httpOnly: true, secure: process.env.NODE_ENV === "production", sameSite: "lax", path: "/", maxAge: 0 });
}

export function hasRole(req: NextRequest, allowed: Role[]) {
  const role = readSession(req);
  return !!role && allowed.includes(role);
}
