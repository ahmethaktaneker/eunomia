import justice from "@/public/images/justice.webp";
import carceri from "@/public/images/carceri.webp";
import forum from "@/public/images/forum.webp";
import assembly from "@/public/images/assembly.webp";

/**
 * Public-domain (CC0) images from The Met Open Access, converted to greyscale.
 * Prints are stored as negatives (light lines on black) so CSS can tint them gold.
 */
export const IMAGES = {
  justice: { src: justice, kind: "print", title: "Albrecht Dürer, Justice", date: "ca. 1499", url: "https://www.metmuseum.org/art/collection/search/391087" },
  carceri: { src: carceri, kind: "print", title: "Giovanni Battista Piranesi, The Round Tower, from “Carceri d'invenzione”", date: "ca. 1749–50", url: "https://www.metmuseum.org/art/collection/search/337725" },
  assembly: { src: assembly, kind: "print", title: "Matthias Oesterreich after Pietro Testa, Figures gathered around an orator", date: "1752", url: "https://www.metmuseum.org/art/collection/search/400208" },
  forum: { src: forum, kind: "print", title: "Giovanni Battista Piranesi, The Forum Romanum (Campo Vaccino)", date: "ca. 1775", url: "https://www.metmuseum.org/art/collection/search/363433" },
} as const;

export type ImageKey = keyof typeof IMAGES;

export const TOPIC_IMAGES: Record<string, ImageKey> = {
  "public-life": "forum",
  institutions: "carceri",
  justice: "justice",
  democracy: "assembly",
};
