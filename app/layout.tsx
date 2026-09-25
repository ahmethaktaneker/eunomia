import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Eunomia — Law, politics & public life",
  description: "Independent essays and research on law, politics and society in English and Turkish.",
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
    <html lang="en">
      <body className="antialiased">{children}</body>
    </html>
  );
}
