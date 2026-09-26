import { ImageResponse } from "next/og";

export const ogSize = { width: 1200, height: 630 };

async function font(text: string, italic = false) {
  try {
    const css = await (await fetch(`https://fonts.googleapis.com/css2?family=EB+Garamond:ital@${italic ? 1 : 0}&text=${encodeURIComponent(text)}`)).text();
    const src = css.match(/src: url\((.+?)\) format\('(opentype|truetype)'\)/)?.[1];
    return src ? await (await fetch(src)).arrayBuffer() : null;
  } catch {
    return null;
  }
}

/** Shared social card: cover-coloured panel, kicker, title and the EU. mark. */
export async function renderOg({ kicker, title, footer }: { kicker: string; title: string; footer: string }) {
  const text = `${kicker}${title}${footer}EU.EUNOMIA`;
  const [regular, italic] = await Promise.all([font(text), font("EU.", true)]);
  const fonts = [
    ...(regular ? [{ name: "Garamond", data: regular, style: "normal" as const, weight: 400 as const }] : []),
    ...(italic ? [{ name: "Garamond", data: italic, style: "italic" as const, weight: 400 as const }] : []),
  ];
  return new ImageResponse(
    <div style={{ width: "100%", height: "100%", display: "flex", background: "#0a0a0a", color: "#e5e1d8", fontFamily: "Garamond, serif", padding: 56 }}>
      <div style={{ flex: 1, display: "flex", flexDirection: "column", justifyContent: "space-between", border: "1px solid #2a2826", padding: "44px 52px" }}>
        <div style={{ display: "flex", justifyContent: "space-between", fontSize: 22, letterSpacing: 5, color: "#b7a486", textTransform: "uppercase" }}>
          <span>{kicker}</span><span>EUNOMIA</span>
        </div>
        <div style={{ display: "flex", fontSize: title.length > 60 ? 68 : 88, lineHeight: 1.02, letterSpacing: -2, maxWidth: 900 }}>{title}</div>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end" }}>
          <span style={{ fontSize: 24, color: "#a8ada4" }}>{footer}</span>
          <span style={{ fontSize: 120, fontStyle: "italic", lineHeight: 0.8, color: "#b7a486" }}>EU.</span>
        </div>
      </div>
      <div style={{ width: 90, marginLeft: 26, display: "flex", background: "linear-gradient(105deg,#151412,#201e1a 52%,#0f0e0d)", borderLeft: "8px solid #0b0a09" }} />
    </div>,
    { ...ogSize, fonts: fonts.length ? fonts : undefined },
  );
}
