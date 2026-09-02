import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Frontend Archive",
  description: "스터디 회차별 아티클 아카이브",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="ko" className="h-full antialiased">
      <body className="flex min-h-full flex-col">{children}</body>
    </html>
  );
}
