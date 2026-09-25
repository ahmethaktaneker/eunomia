import { rss } from "@/lib/rss";
export const dynamic = "force-static";
export function GET() { return rss("en"); }
