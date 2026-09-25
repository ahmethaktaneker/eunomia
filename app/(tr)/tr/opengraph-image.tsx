import { ogSize, renderOg } from "@/lib/og";
import { copy } from "@/lib/i18n";
export const size = ogSize;
export const contentType = "image/png";
export const alt = "Eunomia";
export default function Image() {
  return renderOg({ kicker: copy.tr.preloader, title: "Kamusal hayatı yakından oku.", footer: copy.tr.opening });
}
