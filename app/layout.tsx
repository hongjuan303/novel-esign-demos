import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "小说电子签全链路 Demo",
  description: "作者投稿后台与内部绿台的腾讯电子签交互原型。",
  metadataBase: new URL("https://novel-esign-demos.sites.openai.com"),
  openGraph: {
    title: "小说电子签全链路 Demo",
    description: "作者投稿后台 × 内部绿台",
    images: ["/og.png"],
  },
  twitter: {
    card: "summary_large_image",
    title: "小说电子签全链路 Demo",
    description: "作者投稿后台 × 内部绿台",
    images: ["/og.png"],
  },
  icons: {
    icon: "/favicon.svg",
    shortcut: "/favicon.svg",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="zh-CN">
      <body>{children}</body>
    </html>
  );
}
