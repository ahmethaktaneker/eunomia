import athena from "@/public/images/athena.webp";
import eirene from "@/public/images/eirene.webp";
import demosthenes from "@/public/images/demosthenes.webp";
import justice from "@/public/images/justice.webp";
import carceri from "@/public/images/carceri.webp";
import forum from "@/public/images/forum.webp";

/**
 * Public-domain (CC0) images from The Met Open Access, converted to greyscale.
 * Prints are stored as negatives (light lines on black) so CSS can tint them gold.
 */
export const IMAGES = {
  athena: { src: athena, kind: "statue", title: "Marble head and torso of Athena", date: "Roman, 1st–2nd century CE", url: "https://www.metmuseum.org/art/collection/search/251476" },
  eirene: { src: eirene, kind: "statue", title: "Marble statue of Eirene (the personification of peace)", date: "Roman, ca. 14–68 CE", url: "https://www.metmuseum.org/art/collection/search/247173" },
  demosthenes: { src: demosthenes, kind: "statue", title: "Marble head of Demosthenes", date: "Roman, 2nd century CE", url: "https://www.metmuseum.org/art/collection/search/257882" },
  justice: { src: justice, kind: "print", title: "Albrecht Dürer, Justice", date: "ca. 1499", url: "https://www.metmuseum.org/art/collection/search/391087" },
  carceri: { src: carceri, kind: "print", title: "Giovanni Battista Piranesi, The Round Tower, from “Carceri d'invenzione”", date: "ca. 1749–50", url: "https://www.metmuseum.org/art/collection/search/337725" },
  forum: { src: forum, kind: "print", title: "Giovanni Battista Piranesi, The Forum Romanum (Campo Vaccino)", date: "ca. 1775", url: "https://www.metmuseum.org/art/collection/search/363433" },
} as const;

export type ImageKey = keyof typeof IMAGES;

export const TOPIC_IMAGES: Record<string, ImageKey> = {
  "public-life": "forum",
  institutions: "carceri",
  justice: "justice",
  democracy: "demosthenes",
};
