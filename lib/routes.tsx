import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { HomePage } from "@/components/home";
import { AboutPage, ArchivePage, ContributePage, TopicPage } from "@/components/sections";
import { ArticlePage } from "@/components/article";
import { getPost, postParams } from "./content";
import { copy, href, KINDS, PAGES, TOPICS, topicHref, type Kind, type Locale } from "./i18n";
import { SITE } from "./site";

const HOME_TITLE = { en: "Eunomia — Law, politics & public life", tr: "Eunomia — Hukuk, siyaset ve kamusal hayat" };

/** Metadata with canonical + hreflang alternates. `paths` maps each available locale to its URL. */
export function pageMetadata(locale: Locale, paths: Partial<Record<Locale, string>>, title: string | undefined, description: string, type: "website" | "article" = "website", extra?: { publishedTime?: string; authors?: string[] }): Metadata {
  const url = paths[locale]!;
  return {
    title: title ?? { absolute: HOME_TITLE[locale] },
    description,
    alternates: {
      canonical: url,
      languages: { ...paths, ...(paths.en ? { "x-default": paths.en } : {}) },
      types: { "application/rss+xml": locale === "tr" ? "/tr/rss.xml" : "/rss.xml" },
    },
    openGraph: {
      type, url, siteName: SITE.name, title: title ?? HOME_TITLE[locale], description,
      locale: locale === "tr" ? "tr_TR" : "en_US",
      ...(type === "article" ? { publishedTime: extra?.publishedTime, authors: extra?.authors } : {}),
    },
    twitter: { card: "summary_large_image", title: title ?? HOME_TITLE[locale], description },
  };
}

export function layoutMetadata(locale: Locale): Metadata {
  return {
    metadataBase: new URL(SITE.url),
    title: { default: HOME_TITLE[locale], template: "%s — Eunomia" },
    description: copy[locale].hero.intro,
    applicationName: SITE.name,
    authors: [{ name: SITE.editor }],
    icons: { icon: "/favicon.svg" },
  };
}

export function homeRoute(locale: Locale) {
  return {
    Page: () => <HomePage locale={locale} />,
    metadata: pageMetadata(locale, { en: "/", tr: "/tr" }, undefined, copy[locale].hero.intro),
  };
}

type SectionParams = { params: Promise<{ section: string }> };
export function sectionRoute(locale: Locale) {
  const valid = (s: string): s is (typeof PAGES)[number] => (PAGES as string[]).includes(s);
  return {
    generateStaticParams: () => PAGES.map(section => ({ section })),
    generateMetadata: async ({ params }: SectionParams): Promise<Metadata> => {
      const { section } = await params;
      if (!valid(section)) return {};
      return pageMetadata(locale, { en: href("en", section), tr: href("tr", section) }, copy[locale].nav[section], copy[locale].sectionDescriptions[section]);
    },
    Page: async ({ params }: SectionParams) => {
      const { section } = await params;
      if (!valid(section)) notFound();
      if (section === "about") return <AboutPage locale={locale} />;
      if (section === "contribute") return <ContributePage locale={locale} />;
      return <ArchivePage locale={locale} kind={section} />;
    },
  };
}

type ArticleParams = { params: Promise<{ section: string; slug: string }> };
export function loadArticle(locale: Locale, section: string, slug: string) {
  return (KINDS as string[]).includes(section) ? getPost(section as Kind, slug, locale) : null;
}
export function findTopic(locale: Locale, section: string, slug: string) {
  return section === "topics" && (TOPICS as readonly string[]).includes(slug) ? copy[locale].topics.items.find(t => t.slug === slug) ?? null : null;
}
export function articleRoute(locale: Locale) {
  return {
    generateStaticParams: () => [...postParams(locale), ...TOPICS.map(slug => ({ section: "topics", slug }))],
    generateMetadata: async ({ params }: ArticleParams): Promise<Metadata> => {
      const { section, slug } = await params;
      const topic = findTopic(locale, section, slug);
      if (topic) return pageMetadata(locale, { en: topicHref("en", topic.slug), tr: topicHref("tr", topic.slug) }, topic.name, topic.desc);
      const post = loadArticle(locale, section, slug);
      if (!post) return {};
      const paths = Object.fromEntries(post.locales.map(l => [l, href(l, post.kind, slug)]));
      return pageMetadata(locale, paths, post.title, post.dek, "article", { publishedTime: post.date, authors: post.author ? [post.author] : undefined });
    },
    Page: async ({ params }: ArticleParams) => {
      const { section, slug } = await params;
      const topic = findTopic(locale, section, slug);
      if (topic) return <TopicPage locale={locale} topic={topic.slug} />;
      const post = loadArticle(locale, section, slug);
      if (!post) notFound();
      return <ArticlePage post={post} />;
    },
  };
}
