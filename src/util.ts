import type { CollectionEntry } from "astro:content";

export function sortByDate(
  a: CollectionEntry<"posts">,
  b: CollectionEntry<"posts">
) {
  return b.data.pubDate.getTime() - a.data.pubDate.getTime();
}
