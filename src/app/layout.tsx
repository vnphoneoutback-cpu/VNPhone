import type { Metadata } from "next";
import { Noto_Sans_Thai, Geist_Mono } from "next/font/google";
import "./globals.css";

const notoSansThai = Noto_Sans_Thai({
  variable: "--font-noto-sans-thai",
  subsets: ["thai", "latin"],
  weight: ["300", "400", "500", "600", "700", "800", "900"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "VN Phone - ผ่อนมือถือ บัตรประชาชนใบเดียว",
  description:
    "ผ่อนมือถือ iPhone, iPad ง่ายๆ แค่บัตรประชาชนใบเดียว เครื่องศูนย์แท้ รับประกัน 1 ปี จ่ายดาวน์รับเครื่องเลย สาขารังสิต คลองสาม นวนคร",
  keywords: [
    "ผ่อนมือถือ",
    "บัตรประชาชนใบเดียว",
    "iPhone ผ่อน",
    "iPad ผ่อน",
    "VN Phone",
    "วีเอ็นโฟน",
    "ผ่อน iPhone รังสิต",
    "ผ่อนมือถือ นวนคร",
  ],
  openGraph: {
    title: "VN Phone - ผ่อนมือถือ บัตรประชาชนใบเดียว",
    description:
      "เครื่องศูนย์แท้ รับประกัน 1 ปี จ่ายดาวน์รับเครื่องเลย",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="th">
      <body
        className={`${notoSansThai.variable} ${geistMono.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
