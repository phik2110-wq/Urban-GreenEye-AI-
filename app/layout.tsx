import type { Metadata } from "next";
import "./globals.css";
export const metadata: Metadata = {
  title: "Urban GreenEye AI – Mắt Xanh Đô Thị",
  description: "Hệ thống báo cáo, phân tích và theo dõi rác thải đô thị bằng AI."
};
export default function RootLayout({ children }: Readonly<{children: React.ReactNode}>) {
  return <html lang="vi" translate="no"><body>{children}</body></html>;
}
