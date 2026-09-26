import Link from "next/link";
import { copy, formatDate, href, type Locale } from "@/lib/i18n";
import type { PostMeta } from "@/lib/content";
import { Arrow } from "./shell";
import { Cover } from "./cover";

export function SampleBadge({ locale }: { locale: Locale }) {
  return <span className="sample-badge" title={locale === "tr" ? "Tasarımı göstermek için örnek içerik" : "Demo content shown to preview the design"}>{copy[locale].sample}</span>;
}

export function PostList({ posts, locale, compact = false }: { posts: PostMeta[]; locale: Locale; compact?: boolean }) {
  const c = copy[locale];
  return <ol className={`post-list${compact ? " post-list--compact" : ""}`} data-stagger>
    {posts.map((p, i) => {
      const topic = c.topics.items.find(t => t.slug === p.topic);
      return <li key={`${p.kind}/${p.slug}`} data-topic={p.topic ?? ""}>
        <Link href={href(locale, p.kind, p.slug)} className="post-row" data-cursor={c.cursor.read}>
          <span className="post-index"><Cover post={p} size="sm" /><small>{String(i + 1).padStart(2, "0")}</small></span>
          <span className="post-main"><span className="post-title">{p.title}</span><span className="post-dek">{p.dek}</span></span>
          <span className="post-meta">
            <span>{c.nav[p.kind]}{topic ? ` · ${topic.name}` : ""}</span>
            <time dateTime={p.date}>{formatDate(p.date, locale)}</time>
            <span>{p.readingTime} {c.latest.minRead}</span>
            {p.sample && <SampleBadge locale={locale} />}
          </span>
          <Arrow />
        </Link>
      </li>;
    })}
  </ol>;
}
