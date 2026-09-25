import { EB_Garamond, Geist_Mono } from "next/font/google";

export const serif = EB_Garamond({
  subsets: ["latin", "latin-ext", "greek", "greek-ext"],
  style: ["normal", "italic"],
  variable: "--font-serif",
  display: "swap",
});

export const mono = Geist_Mono({
  subsets: ["latin", "latin-ext"],
  variable: "--font-mono",
  display: "swap",
});

export const fontVars = `${serif.variable} ${mono.variable}`;
