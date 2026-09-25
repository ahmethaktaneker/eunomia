import Link from "next/link";
import { copy, formatDate, href, type Locale } from "@/lib/i18n";
import type { PostMeta } from "@/lib/content";
import { Arrow } from "./shell";

export function PostList({ posts, locale }: { posts: PostMeta[]; locale: Locale }) {
  const c = copy[locale];
  return <ol className="post-list" data-stagger>
    {posts.map((p, i) => <li key={`${p.kind}/${p.slug}`}>
      <Link href={href(locale, p.kind, p.slug)} className="post-row" data-cursor={c.cursor.read}>
        <span className="post-index">{String(i + 1).padStart(2, "0")}</span>
        <span className="post-main"><span className="post-title">{p.title}</span><span className="post-dek">{p.dek}</span></span>
        <span className="post-meta"><span>{c.nav[p.kind]}</span><time dateTime={p.date}>{formatDate(p.date, locale)}</time><span>{p.readingTime} {c.latest.minRead}</span></span>
        <Arrow />
      </Link>
    </li>)}
  </ol>;
}
