import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "海州 商品3Dビュワー",
  description: "Start 3D Viewer",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="ja">
      <body>
        {children}
      </body>
    </html>
  );
}
