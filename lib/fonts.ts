import { EB_Garamond, Geist_Mono, Mrs_Saint_Delafield } from "next/font/google";

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

/** Handwritten signature under the editor's letter. */
export const signature = Mrs_Saint_Delafield({
  subsets: ["latin"],
  weight: "400",
  variable: "--font-sign",
  display: "swap",
});

export const fontVars = `${serif.variable} ${mono.variable} ${signature.variable}`;
