import type { Locale } from "./i18n";

type Entry = Record<Locale, { term: string; def: string }>;

/** Terms referenced from MDX with <Term id="…">…</Term>. Keep definitions short and plain. */
export const GLOSSARY: Record<string, Entry> = {
  holding: {
    en: { term: "Holding", def: "The part of a judgment that decides the legal question before the court and binds the parties." },
    tr: { term: "Hüküm", def: "Mahkemenin önündeki hukuki soruyu karara bağlayan ve tarafları bağlayan kısım." },
  },
  reasoning: {
    en: { term: "Reasoning", def: "The explanation a court gives for its decision; later courts and commentators argue mostly about this part." },
    tr: { term: "Gerekçe", def: "Mahkemenin kararına dair açıklaması; sonraki mahkemeler ve yorumcular en çok bu kısmı tartışır." },
  },
  dissent: {
    en: { term: "Dissent", def: "An opinion written by a judge who disagrees with the majority. It does not change the outcome but records the disagreement." },
    tr: { term: "Karşı oy", def: "Çoğunluğa katılmayan bir hâkimin yazdığı görüş. Sonucu değiştirmez ama ayrılığı kayda geçirir." },
  },
  "judicial-review": {
    en: { term: "Judicial review", def: "The power of a court to examine whether a law or official act is compatible with the constitution or a higher rule." },
    tr: { term: "Yargısal denetim", def: "Bir mahkemenin, bir kanunun ya da idari işlemin anayasaya veya üst bir kurala uygunluğunu inceleme yetkisi." },
  },
  "natural-justice": {
    en: { term: "Natural justice", def: "Minimum standards of fair decision-making: hear both sides, and let no one judge their own case." },
    tr: { term: "Doğal adalet", def: "Adil karar vermenin asgari ölçütleri: iki tarafı da dinlemek ve kimsenin kendi davasında hâkim olmaması." },
  },
  "constitutional-court": {
    en: { term: "Constitutional court", def: "A specialised court with exclusive power to review whether laws comply with the constitution." },
    tr: { term: "Anayasa mahkemesi", def: "Kanunların anayasaya uygunluğunu denetleme yetkisi yalnızca kendisine ait olan uzman mahkeme." },
  },
  scrutiny: {
    en: { term: "Parliamentary scrutiny", def: "The ways a legislature examines and questions the government: committees, questions, debates and inquiries." },
    tr: { term: "Meclis denetimi", def: "Yasama organının hükümeti inceleme ve sorgulama yolları: komisyonlar, soru önergeleri, genel görüşme ve araştırmalar." },
  },
  polyarchy: {
    en: { term: "Polyarchy", def: "Robert Dahl's term for real-world democracies that meet a set of institutional conditions, from free elections to free expression." },
    tr: { term: "Poliarşi", def: "Robert Dahl'ın, serbest seçimlerden ifade özgürlüğüne bir dizi kurumsal koşulu karşılayan gerçek demokrasiler için kullandığı terim." },
  },
};

export function glossary(locale: Locale) {
  return Object.entries(GLOSSARY)
    .map(([id, e]) => ({ id, ...e[locale] }))
    .sort((a, b) => a.term.localeCompare(b.term, locale));
}
