import type { Metadata } from "next";
import "./globals.css";
import "./features.css";
import { fontVars } from "@/lib/fonts";
import { copy } from "@/lib/i18n";
import { NotFoundView } from "@/components/sections";
import { MotionProvider } from "@/components/motion/motion-provider";

export const metadata: Metadata = { title: "404 — Eunomia", robots: { index: false } };

export default function GlobalNotFound() {
  return <html lang="en" className={fontVars}>
    <body><NotFoundView locale="en" /><MotionProvider label={copy.en.preloader} /></body>
  </html>;
}
