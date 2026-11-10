export function reportCode(id: string) {
  return `QL-${id.replace(/[^a-f0-9]/gi, "").slice(0, 6).toUpperCase() || "000000"}`;
}
export function imageUrl(path?: string | null) {
  if (!path) return "";
  if (/^https?:\/\//i.test(path)) return path;
  const base = process.env.SUPABASE_URL;
  const bucket = process.env.SUPABASE_BUCKET || "urban-greeneye";
  return base ? `${base}/storage/v1/object/public/${bucket}/${path.split("/").map(encodeURIComponent).join("/")}` : "";
}
