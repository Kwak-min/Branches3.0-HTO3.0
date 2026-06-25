import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "BRANCHES 챕터 퀴즈",
  description: "초록빛 사이버 배경의 BRANCHES 챕터별 보안 퀴즈 화면입니다.",
  icons: {
    icon: "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 64 64'%3E%3Crect width='64' height='64' rx='14' fill='%230f1419'/%3E%3Cpath d='M16 33h17c8 0 15-7 15-15' fill='none' stroke='%235b8bf7' stroke-width='7' stroke-linecap='round'/%3E%3Cpath d='M16 47h17c8 0 15-7 15-15' fill='none' stroke='%238fb4ff' stroke-width='7' stroke-linecap='round'/%3E%3C/svg%3E"
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko">
      <body>{children}</body>
    </html>
  );
}
