import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "PM Tracker - Project Management Dashboard",
  description: "Track your work with project managers",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body style={{ fontFamily: "'Syne', sans-serif" }}>{children}</body>
    </html>
  );
}
