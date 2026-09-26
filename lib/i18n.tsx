export type Locale = "en" | "tr";
export type Kind = "essays" | "research";
export type Section = "home" | Kind | "about" | "contribute" | "explore" | "glossary";

export const LOCALES: Locale[] = ["en", "tr"];
export const KINDS: Kind[] = ["essays", "research"];
export const TOPICS = ["public-life", "institutions", "justice", "democracy"] as const;
export type Topic = (typeof TOPICS)[number];
export const PAGES: Exclude<Section, "home">[] = ["essays", "research", "about", "contribute"];
/** Pages outside the main navigation (footer, search and in-page links reach them). */
export const EXTRA_PAGES: Exclude<Section, "home">[] = ["explore", "glossary"];

export function href(locale: Locale, section: Section, slug?: string) {
  const base = locale === "tr" ? "/tr" : "";
  if (section === "home") return base || "/";
  return `${base}/${section}${slug ? `/${slug}` : ""}`;
}

export function topicHref(locale: Locale, topic: string) {
  return `${locale === "tr" ? "/tr" : ""}/topics/${topic}`;
}

export function formatDate(date: string, locale: Locale) {
  return new Intl.DateTimeFormat(locale === "tr" ? "tr-TR" : "en-GB", { day: "numeric", month: "long", year: "numeric", timeZone: "UTC" }).format(new Date(date));
}

const en = {
  nav: { essays: "Essays", research: "Research", about: "About", contribute: "Contribute", explore: "Explore", glossary: "Glossary" },
  skip: "Skip to content", mainNav: "Main navigation", home: "Eunomia, home",
  cursor: { read: "Read", open: "Open" },
  hero: {
    eyebrow: "Independent writing on law, politics & society",
    headline: <>Public life,<br /><em>examined.</em></>,
    intro: "A bilingual publication for arguments that deserve evidence, context and a wider conversation.",
    scroll: "Scroll to open", stages: ["The cover", "The inquiry", "The publication"],
    cover: { publication: "An independent publication", foot: "Law / Politics / Society · Est. 2026" },
  },
  opening: "Issue 01 — Autumn 2026",
  chapters: ["Prologue", "The featured piece", "A letter", "The name", "Research", "The questions", "An invitation"],
  prologue: {
    kicker: "An independent publication on law, politics & society",
    line: "Good order is never a given. It is a question we keep asking.",
    alt: "Marble head and torso of Athena, Roman, 1st–2nd century CE",
  },
  letter: {
    greeting: "Dear reader,",
    body: [
      "I started Eunomia because the questions that shape our life together — who makes the rules, whether they are fair, how power is held to account — are too often argued in slogans or buried in footnotes. I wanted a place in between: writing researched enough to trust and clear enough to share.",
      "It is written for students finding their way into law and politics, for readers who follow public life without a law degree, and for anyone, anywhere, who wants to follow these debates in English or Turkish.",
      "We will not always be right. When we are wrong, we will say so in public. What I can promise is care: to ask precisely, to show the evidence, and to write for you.",
    ],
    closing: "With care,",
    alt: "Marble statue of Eirene, the personification of peace and sister of Eunomia, Roman, ca. 14–68 CE",
    caption: "Eirene — peace, and Eunomia's sister",
  },
  credits: { label: "Image credits", note: "All images are public domain (CC0), courtesy of The Metropolitan Museum of Art Open Access." },
  marquee: ["Law", "Politics", "Society", "Justice", "Institutions", "Democracy"],
  statementLabel: "A note from the editor",
  statement: "We begin with a simple editorial commitment: take the question seriously.",
  statementBody: "Eunomia brings research and clear writing into the same room. We examine the ideas and decisions that shape public life, in English and Turkish, without asking readers to choose between depth and clarity.",
  principles: ["Ask precisely", "Show the evidence", "Make it readable"],
  name: {
    label: "The name", title: <>Why <em>Eunomia?</em></>,
    etymology: <><i>eu</i>, “good” &nbsp;+&nbsp; <i>nomos</i>, “law”</>,
    body: "In Hesiod’s Theogony, Eunomia is one of the Horae, the daughters of Zeus and Themis: the goddess of good order and lawful conduct. Solon later gave her name to a poem arguing that a city is ruined not by the gods but by its own citizens — and that good order is what sets it right.",
    sisters: [
      { greek: "Εὐνομία", name: "Eunomia", role: "Good order" },
      { greek: "Δίκη", name: "Dike", role: "Justice" },
      { greek: "Εἰρήνη", name: "Eirene", role: "Peace" },
    ],
    closing: "Good order is never a given. It is a public question — the one this publication exists to ask.",
  },
  latest: { label: "Latest from the desk", title: <>Recently<br /><em>published.</em></>, all: "All essays", minRead: "min read" },
  featured: "Featured", sample: "Sample", allTopics: "All", pieces: "pieces", piece: "piece",
  research: { label: "From the research desk", title: <>Research<br /><em>notes.</em></>, all: "All research", abstract: "Abstract", findings: "Key findings" },
  topicPage: { label: "Topic", empty: "Nothing published under this topic yet.", other: "Other topics" },
  formatsLabel: "The reading room / 01—02", formatsTitle: <>Two ways<br /><em>to inquire.</em></>,
  formatsIntro: "Different lengths, the same standard of care.",
  formats: [
    { name: "Essays", desc: "Short, researched arguments written for readers beyond the university.", meta: "Argument / Context / Public life" },
    { name: "Research", desc: "Longer work that puts sources, method and limits in full view.", meta: "Sources / Method / Analysis" },
  ],
  status: "essays and research notes, in English and Turkish.",
  topics: {
    label: "Areas of inquiry", title: <>Four questions<br /><em>we keep asking.</em></>, hint: "Keep scrolling",
    items: [
      { slug: "public-life", name: "Public life", desc: "How citizens argue, decide and live together in shared space." },
      { slug: "institutions", name: "Institutions", desc: "Courts, parliaments and agencies — how they are designed and how they drift." },
      { slug: "justice", name: "Justice", desc: "Rights, remedies and the distance between law on paper and law in practice." },
      { slug: "democracy", name: "Democracy", desc: "Elections, representation and the conditions that keep self-government alive." },
    ],
  },
  closingLabel: "Write for Eunomia",
  closing: <>Questions worth<br /><em>staying with.</em></>,
  closingBody: "We publish careful arguments for a public audience. If there is a question you cannot stop thinking about, pitch it to us.",
  aboutLink: "About the publication", contributeLink: "Contribute",
  sectionDescriptions: {
    essays: "Researched essays about law, politics and the way we live together.",
    research: "Long-form analysis with its sources and method in view.",
    about: "The people, purpose and editorial standards behind the publication.",
    contribute: "Pitch an essay or a piece of research, in English or Turkish.",
    explore: "Every piece and topic as a map. Drag, hover and follow the connections.",
    glossary: "Short, plain definitions of the legal and political terms used across the publication.",
  },
  coming: "In preparation", published: "Published", archive: "The archive",
  archiveIntro: {
    essays: "The first essays are being written. Each piece will have a clear argument, sources and an English or Turkish edition.",
    research: "The research archive opens when the first study is ready. We would rather publish a considered piece than an unfinished one.",
  },
  areas: "Areas of inquiry",
  approachLabel: "Our editorial approach", purpose: "Purpose", formatsWord: "Formats", standards: "Standards",
  about1: "Eunomia is an independent bilingual publication on law, politics and society. It is a place for questions with public consequences to be examined carefully and read widely.",
  about2: "Essays make a researched argument accessible to a broad audience. Research pieces take more space to explain evidence, reasoning and limitations. English and Turkish editions connect readers across languages.",
  about3: "We distinguish evidence from interpretation, link to material sources and correct errors openly. The publication is at an early stage; its first work will appear here when it is ready.",
  role: "Founder & Editor-in-Chief",
  contribute: {
    label: "Open call",
    lead: "We publish writers who can make a careful argument legible to a public audience — students, researchers, practitioners and citizens alike.",
    lookLabel: "What we look for",
    look: [
      { title: "A real question", desc: "Something with public consequences that is not yet settled — not a summary of a debate, but a position within it." },
      { title: "Evidence in view", desc: "Claims tied to sources a reader can check: cases, statutes, data, archives, scholarship." },
      { title: "Clear prose", desc: "Written for an intelligent reader outside your field. Technical terms earn their place or go." },
    ],
    stepsLabel: "How to pitch",
    steps: [
      { title: "Send a short pitch", desc: "Around 200 words: the question, your argument, and why it matters now." },
      { title: "Tell us the format", desc: "An essay (1,500–3,000 words) or a research piece (longer, with method and limits)." },
      { title: "Work with an editor", desc: "Accepted pitches go through structural and line editing before publication, in either language." },
    ],
    cta: "Send a pitch", soon: "Submissions open with the first issue.",
  },
  article: {
    contents: "Contents", notes: "Sources & notes", backTo: "Back to", other: "Read in Türkçe",
    by: "By", minRead: "min read", next: "Continue reading", backToTop: "Back to top", progress: "Reading progress",
  },
  tools: {
    save: "Save", saved: "Saved", list: "My list", listEmpty: "Nothing saved yet. Use the bookmark on any piece to keep it here.",
    continue: "Continue reading", remove: "Remove", read: "read",
    search: "Search", searchHint: "Search essays, topics and terms…", noResults: "Nothing matches that yet.", openSearch: "Open search",
    light: "Light theme", dark: "Dark theme",
    copyQuote: "Copy quote", shareX: "Share on X", copied: "Copied",
    cite: "Cite this piece", copy: "Copy",
    featured: "Read the featured piece", term: "Term", allTerms: "All terms", explore: "Explore the map",
    mapHint: "Drag the stars · hover to trace connections · click to read",
  },
  editor: { label: "The editor", links: "Elsewhere" },
  footer: "Independent writing on law, politics & society.", independent: "Independent publication", rss: "RSS",
  notFound: { title: <>Lost in<br /><em>the archive.</em></>, body: "This page has not been written yet — or it has moved elsewhere.", home: "Return to the front page" },
  preloader: "Law / Politics / Society",
};

const tr: typeof en = {
  nav: { essays: "Yazılar", research: "Araştırmalar", about: "Hakkında", contribute: "Katkı", explore: "Keşfet", glossary: "Sözlük" },
  skip: "İçeriğe geç", mainNav: "Ana menü", home: "Eunomia, ana sayfa",
  cursor: { read: "Oku", open: "Aç" },
  hero: {
    eyebrow: "Hukuk, siyaset ve toplum üzerine bağımsız yayın",
    headline: <>Kamusal hayatı<br /><em>yakından oku.</em></>,
    intro: "Kanıta, bağlama ve daha geniş bir tartışmaya yer açan iki dilli bir yayın.",
    scroll: "Açmak için kaydır", stages: ["Kapak", "İnceleme", "Yayın"],
    cover: { publication: "Bağımsız bir yayın", foot: "Hukuk / Siyaset / Toplum · Kuruluş 2026" },
  },
  opening: "Sayı 01 — Sonbahar 2026",
  chapters: ["Önsöz", "Öne çıkan", "Bir mektup", "İsim", "Araştırma", "Sorular", "Davet"],
  prologue: {
    kicker: "Hukuk, siyaset ve toplum üzerine bağımsız bir yayın",
    line: "İyi düzen hiçbir zaman kendiliğinden gelmez. Sormaya devam ettiğimiz bir sorudur.",
    alt: "Athena'nın mermer baş ve gövdesi, Roma dönemi, MS 1.–2. yüzyıl",
  },
  letter: {
    greeting: "Sevgili okur,",
    body: [
      "Eunomia'yı başlattım, çünkü birlikte yaşamımızı biçimlendiren sorular — kuralları kimin koyduğu, bu kuralların adil olup olmadığı, gücün nasıl hesap verdiği — çoğu zaman ya sloganlarla tartışılıyor ya da dipnotlara gömülüyor. Arada bir yer istedim: güvenilecek kadar araştırılmış, paylaşılacak kadar açık yazılar.",
      "Bu yayın hukuka ve siyasete adım atan öğrenciler için, hukuk eğitimi almamış ama kamusal hayatı takip eden okurlar için ve bu tartışmaları Türkçe ya da İngilizce izlemek isteyen herkes için yazılıyor.",
      "Her zaman haklı olmayacağız. Yanıldığımızda bunu herkesin önünde söyleyeceğiz. Söz verebileceğim şey özen: soruyu dikkatle sormak, kanıtı göstermek ve senin için yazmak.",
    ],
    closing: "Özenle,",
    alt: "Barışın kişileştirmesi ve Eunomia'nın kız kardeşi Eirene'nin mermer heykeli, Roma dönemi, MS 14–68",
    caption: "Eirene — barış ve Eunomia'nın kız kardeşi",
  },
  credits: { label: "Görsel kaynakları", note: "Tüm görseller kamu malıdır (CC0); The Metropolitan Museum of Art Open Access koleksiyonundan alınmıştır." },
  marquee: ["Hukuk", "Siyaset", "Toplum", "Adalet", "Kurumlar", "Demokrasi"],
  statementLabel: "Editörden bir not",
  statement: "Basit bir editoryal ilkeyle başlıyoruz: soruyu ciddiye almak.",
  statementBody: "Eunomia, araştırmayı ve anlaşılır yazıyı aynı yerde buluşturur. Kamusal hayatı şekillendiren fikirleri ve kararları, derinlik ile açıklık arasında seçim yapmadan Türkçe ve İngilizce inceler.",
  principles: ["Soruyu belirle", "Kaynağı göster", "Anlaşılır yaz"],
  name: {
    label: "İsim", title: <>Neden <em>Eunomia?</em></>,
    etymology: <><i>eu</i>, “iyi” &nbsp;+&nbsp; <i>nomos</i>, “yasa”</>,
    body: "Hesiodos’un Theogonia’sında Eunomia, Zeus ile Themis’in kızları olan Horalardan biridir: iyi düzenin ve yasaya uygun davranışın tanrıçası. Solon da bir şiirine onun adını verir; bir şehri tanrıların değil kendi yurttaşlarının yıktığını, onu yeniden ayağa kaldıranın ise iyi düzen olduğunu savunur.",
    sisters: [
      { greek: "Εὐνομία", name: "Eunomia", role: "İyi düzen" },
      { greek: "Δίκη", name: "Dike", role: "Adalet" },
      { greek: "Εἰρήνη", name: "Eirene", role: "Barış" },
    ],
    closing: "İyi düzen hiçbir zaman kendiliğinden gelmez. Kamusal bir sorudur — bu yayın da o soruyu sormak için var.",
  },
  latest: { label: "Masadan son yazılar", title: <>Yeni<br /><em>yayımlananlar.</em></>, all: "Tüm yazılar", minRead: "dk okuma" },
  featured: "Öne çıkan", sample: "Örnek", allTopics: "Tümü", pieces: "çalışma", piece: "çalışma",
  research: { label: "Araştırma masasından", title: <>Araştırma<br /><em>notları.</em></>, all: "Tüm araştırmalar", abstract: "Özet", findings: "Temel bulgular" },
  topicPage: { label: "Konu", empty: "Bu konuda henüz bir şey yayımlanmadı.", other: "Diğer konular" },
  formatsLabel: "Okuma odası / 01—02", formatsTitle: <>İki farklı<br /><em>inceleme biçimi.</em></>,
  formatsIntro: "Farklı uzunluklar, aynı editoryal özen.",
  formats: [
    { name: "Yazılar", desc: "Üniversite dışındaki okura da seslenen, araştırmaya dayalı kısa savlar.", meta: "Sav / Bağlam / Kamusal hayat" },
    { name: "Araştırmalar", desc: "Kaynakları, yöntemi ve sınırları açıkça gösteren kapsamlı çalışmalar.", meta: "Kaynak / Yöntem / Analiz" },
  ],
  status: "Türkçe ve İngilizce yazılar ve araştırma notları.",
  topics: {
    label: "İnceleme alanları", title: <>Sormaya devam<br /><em>ettiğimiz dört soru.</em></>, hint: "Kaydırmaya devam et",
    items: [
      { slug: "public-life", name: "Kamusal hayat", desc: "Yurttaşların ortak alanda nasıl tartıştığı, karar verdiği ve birlikte yaşadığı." },
      { slug: "institutions", name: "Kurumlar", desc: "Mahkemeler, meclisler ve idareler — nasıl tasarlandıkları ve zamanla nasıl kaydıkları." },
      { slug: "justice", name: "Adalet", desc: "Haklar, başvuru yolları ve kâğıt üzerindeki hukuk ile uygulamadaki hukuk arasındaki mesafe." },
      { slug: "democracy", name: "Demokrasi", desc: "Seçimler, temsil ve özyönetimi ayakta tutan koşullar." },
    ],
  },
  closingLabel: "Eunomia için yaz",
  closing: <>Üzerinde durmaya<br /><em>değer sorular.</em></>,
  closingBody: "Geniş bir okur kitlesi için özenli savlar yayımlıyoruz. Aklından çıkmayan bir soru varsa, bize öner.",
  aboutLink: "Yayın hakkında", contributeLink: "Katkı ver",
  sectionDescriptions: {
    essays: "Hukuk, siyaset ve birlikte yaşam üzerine araştırmaya dayalı yazılar.",
    research: "Kaynakları ve yöntemi görünür kılan kapsamlı incelemeler.",
    about: "Yayının amacı, ekibi ve editoryal ilkeleri.",
    contribute: "Türkçe ya da İngilizce bir yazı veya araştırma öner.",
    explore: "Tüm yazılar ve konular bir harita olarak. Sürükle, üzerine gel ve bağlantıları izle.",
    glossary: "Yayın boyunca kullanılan hukuki ve siyasi terimlerin kısa ve sade tanımları.",
  },
  coming: "Hazırlanıyor", published: "Yayımlandı", archive: "Arşiv",
  archiveIntro: {
    essays: "İlk yazılar hazırlanıyor. Her yazı açık bir sav, kaynaklar ve Türkçe veya İngilizce bir sürüm içerecek.",
    research: "Araştırma arşivi ilk çalışma tamamlandığında açılacak. Tamamlanmamış bir çalışmayı aceleyle yayımlamak istemiyoruz.",
  },
  areas: "İnceleme alanları",
  approachLabel: "Editoryal yaklaşımımız", purpose: "Amaç", formatsWord: "Yayın türleri", standards: "İlkeler",
  about1: "Eunomia; hukuk, siyaset ve toplum üzerine bağımsız, iki dilli bir yayındır. Kamusal sonuçları olan soruları özenle incelemek ve geniş bir okur kitlesine ulaştırmak için kuruluyor.",
  about2: "Yazılar, araştırılmış bir savı geniş okura açar. Araştırmalar ise kanıtları, akıl yürütmeyi ve çalışmanın sınırlarını açıklamak için daha fazla alan kullanır. Türkçe ve İngilizce sürümler iki dildeki okurları buluşturur.",
  about3: "Kanıtla yorumu ayırır, önemli iddiaları kaynaklandırır ve hataları açıkça düzeltiriz. Yayın henüz başlangıç aşamasında; ilk çalışmalar tamamlandığında burada yer alacak.",
  role: "Kurucu ve Genel Yayın Yönetmeni",
  contribute: {
    label: "Açık çağrı",
    lead: "Özenli bir savı geniş bir okur kitlesine anlaşılır kılabilen yazarları yayımlıyoruz — öğrenciler, araştırmacılar, uygulayıcılar ve yurttaşlar.",
    lookLabel: "Aradığımız şey",
    look: [
      { title: "Gerçek bir soru", desc: "Kamusal sonuçları olan ve henüz çözülmemiş bir mesele — bir tartışmanın özeti değil, o tartışma içinde bir tutum." },
      { title: "Görünür kanıt", desc: "Okurun kontrol edebileceği kaynaklara bağlanan iddialar: kararlar, mevzuat, veri, arşiv, akademik literatür." },
      { title: "Açık bir dil", desc: "Alanın dışındaki düşünen okur için yazılmış metin. Teknik terimler ya yerini hak eder ya da çıkar." },
    ],
    stepsLabel: "Nasıl öneri gönderilir",
    steps: [
      { title: "Kısa bir öneri gönder", desc: "Yaklaşık 200 kelime: soru, savın ve neden şimdi önemli olduğu." },
      { title: "Biçimi belirt", desc: "Yazı (1.500–3.000 kelime) ya da araştırma (daha uzun, yöntem ve sınırlarıyla)." },
      { title: "Editörle çalış", desc: "Kabul edilen öneriler yayından önce yapısal ve satır düzeyinde editörlükten geçer; iki dilde de." },
    ],
    cta: "Öneri gönder", soon: "Başvurular ilk sayıyla birlikte açılacak.",
  },
  article: {
    contents: "İçindekiler", notes: "Kaynaklar ve notlar", backTo: "Geri dön:", other: "Read in English",
    by: "Yazan", minRead: "dk okuma", next: "Okumaya devam et", backToTop: "Başa dön", progress: "Okuma ilerlemesi",
  },
  tools: {
    save: "Kaydet", saved: "Kaydedildi", list: "Listem", listEmpty: "Henüz bir şey kaydetmedin. Herhangi bir yazıdaki yer imiyle burada tutabilirsin.",
    continue: "Kaldığın yerden devam et", remove: "Kaldır", read: "okundu",
    search: "Ara", searchHint: "Yazı, konu ve terim ara…", noResults: "Henüz eşleşen bir şey yok.", openSearch: "Aramayı aç",
    light: "Açık tema", dark: "Koyu tema",
    copyQuote: "Alıntıyı kopyala", shareX: "X'te paylaş", copied: "Kopyalandı",
    cite: "Bu yazıya atıf yap", copy: "Kopyala",
    featured: "Öne çıkan yazıyı oku", term: "Terim", allTerms: "Tüm terimler", explore: "Haritayı keşfet",
    mapHint: "Yıldızları sürükle · bağlantılar için üzerine gel · okumak için tıkla",
  },
  editor: { label: "Editör", links: "Diğer bağlantılar" },
  footer: "Hukuk, siyaset ve toplum üzerine bağımsız yazılar.", independent: "Bağımsız yayın", rss: "RSS",
  notFound: { title: <>Arşivde<br /><em>kaybolduk.</em></>, body: "Bu sayfa henüz yazılmadı — ya da başka bir yere taşındı.", home: "Ana sayfaya dön" },
  preloader: "Hukuk / Siyaset / Toplum",
};

export const copy = { en, tr };
export type Copy = typeof en;
