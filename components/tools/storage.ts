/** Per-visitor reading state kept in localStorage: saved pieces and reading progress. */

export type ListItem = { href: string; title: string; kind: string; savedAt: number };
export type Progress = Record<string, { title: string; kind: string; progress: number; at: number }>;

const LIST = "eu-list";
const PROGRESS = "eu-progress";
export const LIST_EVENT = "eu-list-change";

function read<T>(key: string, fallback: T): T {
  try { return JSON.parse(localStorage.getItem(key) ?? "") as T; } catch { return fallback; }
}
function write(key: string, value: unknown) {
  try { localStorage.setItem(key, JSON.stringify(value)); } catch {}
  window.dispatchEvent(new Event(LIST_EVENT));
}

export const getList = () => read<ListItem[]>(LIST, []);
export const getProgress = () => read<Progress>(PROGRESS, {});
export const isSaved = (href: string) => getList().some(i => i.href === href);

export function toggleSaved(item: Omit<ListItem, "savedAt">) {
  const list = getList();
  const next = list.some(i => i.href === item.href) ? list.filter(i => i.href !== item.href) : [{ ...item, savedAt: Date.now() }, ...list];
  write(LIST, next);
  return next.some(i => i.href === item.href);
}

export function removeSaved(href: string) {
  write(LIST, getList().filter(i => i.href !== href));
}

let last = 0;
export function saveProgress(href: string, title: string, kind: string, progress: number) {
  const now = Date.now();
  if (now - last < 800 && progress < 0.98) return;
  last = now;
  const all = getProgress();
  all[href] = { title, kind, progress: Math.max(all[href]?.progress ?? 0, Math.min(1, progress)), at: now };
  write(PROGRESS, all);
}
