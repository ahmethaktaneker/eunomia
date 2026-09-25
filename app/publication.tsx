import Link from "next/link";
import { FolioScene } from "./folio-scene";

type Locale = "en" | "tr";
type Section = "home" | "essays" | "research" | "about";

const copy = {
  en: {
    nav: ["Essays", "Research", "About"], eyebrow: "Independent writing on law, politics & society",
    headline: <>Public life,<br /><em>examined.</em></>,
    intro: "A bilingual publication for arguments that deserve evidence, context and a wider conversation.",
    scroll: "Scroll to open", stages: ["THE COVER", "THE INQUIRY", "THE PUBLICATION"],
    opening: "An independent publication in formation", statementLabel: "A NOTE FROM THE EDITOR",
    statement: <>We begin with a simple editorial commitment: <em>take the question seriously.</em></>,
    statementBody: "Eunomia brings research and clear writing into the same room. We examine the ideas and decisions that shape public life, in English and Turkish, without asking readers to choose between depth and clarity.",
    principles: ["Ask precisely", "Show the evidence", "Make it readable"],
    formatsLabel: "THE READING ROOM / 01—02", formatsTitle: <>Two ways<br /><em>to inquire.</em></>,
    formatsIntro: "Different lengths, the same standard of care.",
    formats: [
      { name: "Essays", desc: "Short, researched arguments written for readers beyond the university.", meta: "ARGUMENT / CONTEXT / PUBLIC LIFE" },
      { name: "Research", desc: "Longer work that puts sources, method and limits in full view.", meta: "SOURCES / METHOD / ANALYSIS" },
    ],
    status: "The first pieces are in development.", closingLabel: "AN OPENING, NOT AN ENDPOINT",
    closing: <>Questions worth<br /><em>staying with.</em></>,
    closingBody: "This publication is being built piece by piece. Read the editorial approach while the first essays and studies take shape.",
    aboutLink: "About the publication",
    sectionDescriptions: ["Researched essays about law, politics and the way we live together.", "Long-form analysis with its sources and method in view.", "The people, purpose and editorial standards behind the publication."],
    coming: "IN PREPARATION",
    archiveIntro: ["The first essays are being written. Each piece will have a clear argument, sources and an English or Turkish edition.", "The research archive opens when the first study is ready. We would rather publish a considered piece than an unfinished one."],
    archiveTopics: ["Public life", "Institutions", "Justice", "Democracy"],
    approachLabel: "OUR EDITORIAL APPROACH",
    about1: "Eunomia is an independent bilingual publication on law, politics and society. It is a place for questions with public consequences to be examined carefully and read widely.",
    about2: "Essays make a researched argument accessible to a broad audience. Research pieces take more space to explain evidence, reasoning and limitations. English and Turkish editions connect readers across languages.",
    about3: "We distinguish evidence from interpretation, link to material sources and correct errors openly. The publication is at an early stage; its first work will appear here when it is ready.",
    role: "Founder & Editor-in-Chief", footer: "Independent writing on law, politics & society.",
  },
  tr: {
    nav: ["Yazılar", "Araştırmalar", "Hakkında"], eyebrow: "Hukuk, siyaset ve toplum üzerine bağımsız yayın",
    headline: <>Kamusal hayatı<br /><em>yakından oku.</em></>,
    intro: "Kanıta, bağlama ve daha geniş bir tartışmaya yer açan iki dilli bir yayın.",
    scroll: "Açmak için kaydır", stages: ["KAPAK", "İNCELEME", "YAYIN"],
    opening: "Kuruluş aşamasında bağımsız bir yayın", statementLabel: "EDİTÖRDEN BİR NOT",
    statement: <>Basit bir editoryal ilkeyle başlıyoruz: <em>soruyu ciddiye almak.</em></>,
    statementBody: "Eunomia, araştırmayı ve anlaşılır yazıyı aynı yerde buluşturur. Kamusal hayatı şekillendiren fikirleri ve kararları, derinlik ile açıklık arasında seçim yapmadan Türkçe ve İngilizce inceler.",
    principles: ["Soruyu belirle", "Kaynağı göster", "Anlaşılır yaz"],
    formatsLabel: "OKUMA ODASI / 01—02", formatsTitle: <>İki farklı<br /><em>inceleme biçimi.</em></>,
    formatsIntro: "Farklı uzunluklar, aynı editoryal özen.",
    formats: [
      { name: "Yazılar", desc: "Üniversite dışındaki okura da seslenen, araştırmaya dayalı kısa savlar.", meta: "SAV / BAĞLAM / KAMUSAL HAYAT" },
      { name: "Araştırmalar", desc: "Kaynakları, yöntemi ve sınırları açıkça gösteren kapsamlı çalışmalar.", meta: "KAYNAK / YÖNTEM / ANALİZ" },
    ],
    status: "İlk çalışmalar hazırlanıyor.", closingLabel: "BAŞLANGIÇ NOKTASI",
    closing: <>Üzerinde durmaya<br /><em>değer sorular.</em></>,
    closingBody: "Bu yayın adım adım kuruluyor. İlk yazılar ve araştırmalar hazırlanırken editoryal yaklaşımımızı okuyabilirsin.",
    aboutLink: "Yayın hakkında",
    sectionDescriptions: ["Hukuk, siyaset ve birlikte yaşam üzerine araştırmaya dayalı yazılar.", "Kaynakları ve yöntemi görünür kılan kapsamlı incelemeler.", "Yayının amacı, ekibi ve editoryal ilkeleri."],
    coming: "HAZIRLANIYOR",
    archiveIntro: ["İlk yazılar hazırlanıyor. Her yazı açık bir sav, kaynaklar ve Türkçe veya İngilizce bir sürüm içerecek.", "Araştırma arşivi ilk çalışma tamamlandığında açılacak. Tamamlanmamış bir çalışmayı aceleyle yayımlamak istemiyoruz."],
    archiveTopics: ["Kamusal hayat", "Kurumlar", "Adalet", "Demokrasi"],
    approachLabel: "EDİTORYAL YAKLAŞIMIMIZ",
    about1: "Eunomia; hukuk, siyaset ve toplum üzerine bağımsız, iki dilli bir yayındır. Kamusal sonuçları olan soruları özenle incelemek ve geniş bir okur kitlesine ulaştırmak için kuruluyor.",
    about2: "Yazılar, araştırılmış bir savı geniş okura açar. Araştırmalar ise kanıtları, akıl yürütmeyi ve çalışmanın sınırlarını açıklamak için daha fazla alan kullanır. Türkçe ve İngilizce sürümler iki dildeki okurları buluşturur.",
    about3: "Kanıtla yorumu ayırır, önemli iddiaları kaynaklandırır ve hataları açıkça düzeltiriz. Yayın henüz başlangıç aşamasında; ilk çalışmalar tamamlandığında burada yer alacak.",
    role: "Kurucu ve Genel Yayın Yönetmeni", footer: "Hukuk, siyaset ve toplum üzerine bağımsız yazılar.",
  },
};

function href(locale: Locale, section: Section) {
  const base = locale === "tr" ? "/tr" : "";
  return section === "home" ? base || "/" : `${base}/${section}`;
}

export function PublicationPage({ locale, section }: { locale: Locale; section: Section }) {
  const c = copy[locale];
  const sections: Section[] = ["essays", "research", "about"];
  const index = sections.indexOf(section);
  return <div className="site-shell" lang={locale}>
    <a className="skip-link" href="#content">{locale === "en" ? "Skip to content" : "İçeriğe geç"}</a>
    <header className="site-header">
      <Link href={href(locale, "home")} className="brand" aria-label="Eunomia, home"><span className="brand-monogram">EU<span>.</span></span><span className="brand-name">EUNOMIA</span></Link>
      <nav aria-label={locale === "en" ? "Main navigation" : "Ana menü"}>{sections.map((s, i) => <Link key={s} href={href(locale, s)} aria-current={s === section ? "page" : undefined}>{c.nav[i]}</Link>)}</nav>
      <div className="language"><Link href={href("en", section)} aria-current={locale === "en" ? "page" : undefined} lang="en">EN</Link><span>/</span><Link href={href("tr", section)} aria-current={locale === "tr" ? "page" : undefined} lang="tr">TR</Link></div>
    </header>

    {section === "home" ? <main id="content">
      <section className="journey" data-chapter="0" aria-label={locale === "en" ? "Opening the publication" : "Yayına giriş"}>
        <div className="journey-stage">
          <div className="hero-top"><span>EUNOMIA / VOL. 00</span><span>ENGLISH &nbsp; / &nbsp; TÜRKÇE</span></div>
          <div className="hero-heading"><p className="kicker">{c.eyebrow}</p><h1>{c.headline}</h1><p className="hero-intro">{c.intro}</p></div>
          <FolioScene locale={locale} />
          <div className="hero-bottom"><span>{c.scroll} <b>↓</b></span><span className="hero-chapter">{c.stages.map((item,i)=><i key={item} className={`chapter-${i}`}>0{i+1} / {item}</i>)}</span></div>
          <div className="hero-progress" aria-hidden="true"><span /></div>
        </div>
      </section>
      <div className="edition-strip"><span>EUNOMIA &nbsp; / &nbsp; EST. 2026</span><span>{c.opening}</span><span>01 — 03</span></div>
      <section className="editorial-statement reveal"><div className="statement-meta"><span>01 / {c.statementLabel}</span><span className="statement-asterisk">✳</span></div><div className="statement-content"><h2>{c.statement}</h2><p>{c.statementBody}</p><div className="principles">{c.principles.map((p,i)=><span key={p}><small>0{i+1}</small>{p}</span>)}</div></div></section>
      <section className="formats" aria-labelledby="formats-title"><div className="formats-heading reveal"><div><p className="kicker">{c.formatsLabel}</p><h2 id="formats-title">{c.formatsTitle}</h2></div><p>{c.formatsIntro}</p></div><div className="format-grid">{(["essays","research"] as const).map((s,i)=><Link href={href(locale,s)} className={`format format-${i+1} reveal`} key={s}><span className="format-top"><small>0{i+1} / 02</small><small>↗</small></span><span className="format-type">{c.formats[i].name}</span><span className="format-bottom"><span>{c.formats[i].desc}</span><small>{c.formats[i].meta}</small></span></Link>)}</div><div className="format-status"><span className="status-dot" />{c.status}</div></section>
      <section className="closing-panel reveal"><p className="kicker">03 / {c.closingLabel}</p><h2>{c.closing}</h2><div className="closing-bottom"><p>{c.closingBody}</p><Link href={href(locale,"about")}>{c.aboutLink} <span>↗</span></Link></div><span className="closing-watermark" aria-hidden="true">CI.</span></section>
    </main> : <main id="content" className="inner-page">
      <div className="inner-top"><span>EUNOMIA &nbsp; / &nbsp; 0{index+1}</span><span>ENGLISH / TÜRKÇE</span></div>
      <div className="inner-hero"><div><p className="kicker">{section === "about" ? c.approachLabel : c.coming}</p><h1>{c.nav[index]}<span>.</span></h1></div><p>{c.sectionDescriptions[index]}</p></div>
      {section === "about" ? <><section className="about-intro"><span className="section-index">01 / {locale === "en" ? "PURPOSE" : "AMAÇ"}</span><p>{c.about1}</p></section><div className="about-columns"><div><span>02 / {locale === "en" ? "FORMATS" : "YAYIN TÜRLERİ"}</span><p>{c.about2}</p></div><div><span>03 / {locale === "en" ? "STANDARDS" : "İLKELER"}</span><p>{c.about3}</p></div></div><div className="editor-signature"><span className="signature-mark">EU.</span><div><strong>Ahmet Haktan Eker</strong><span>{c.role}</span></div></div></> : <><section className="archive-opening"><span className="section-index">00 / {c.coming}</span><p>{c.archiveIntro[index]}</p></section><div className="archive-categories"><p>{locale === "en" ? "AREAS OF INQUIRY" : "İNCELEME ALANLARI"}</p>{c.archiveTopics.map((topic,i)=><div key={topic}><span>0{i+1}</span><strong>{topic}</strong><span>—</span></div>)}</div><Link className="archive-about" href={href(locale,"about")}>{c.aboutLink} ↗</Link></>}
    </main>}

    <footer className="site-footer"><div className="footer-main"><span className="footer-mark">EU.</span><div><strong>EUNOMIA</strong><p>{c.footer}</p></div><Link href={href(locale,"home")}>↑</Link></div><div className="footer-meta"><span>© {new Date().getUTCFullYear()} Eunomia</span><span>ENGLISH / TÜRKÇE</span><span>{locale === "en" ? "Independent publication" : "Bağımsız yayın"}</span></div></footer>
  </div>;
}
