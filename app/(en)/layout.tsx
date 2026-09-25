import type { Metadata, Viewport } from "next";
import "../globals.css";
import { fontVars } from "@/lib/fonts";
import { copy } from "@/lib/i18n";
import { layoutMetadata } from "@/lib/routes";
import { bootScript } from "@/components/motion/boot";
import { MotionProvider } from "@/components/motion/motion-provider";

export const metadata: Metadata = layoutMetadata("en");
export const viewport: Viewport = { themeColor: "#121512", colorScheme: "dark" };

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="en" className={fontVars} suppressHydrationWarning>
    <head><script dangerouslySetInnerHTML={{ __html: bootScript }} /></head>
    <body>{children}<MotionProvider label={copy.en.preloader} /></body>
  </html>;
}
