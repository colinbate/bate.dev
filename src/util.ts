import type { CollectionEntry } from "astro:content";

export function sortByDate(
  a: CollectionEntry<"posts">,
  b: CollectionEntry<"posts">,
) {
  return b.data.pubDate.getTime() - a.data.pubDate.getTime();
}

export function sortGardenByDate(
  a: CollectionEntry<"garden">,
  b: CollectionEntry<"garden">,
) {
  const aDate = a.data.updated || a.data.created;
  const bDate = b.data.updated || b.data.created;
  return bDate.getTime() - aDate.getTime();
}
