import { getCollection, type CollectionEntry } from "astro:content";
import fs from "fs/promises";
import path from "path";

export type GardenEntry = CollectionEntry<"garden">;

export interface BacklinkItem {
  entry: GardenEntry;
  linkText: string;
}

export interface FileCreationResult {
  success: boolean;
  error?: string;
  filePath?: string;
}

// Slugify function for converting titles to filenames
export function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^\w\s-]/g, "") // Remove special characters
    .replace(/[\s_-]+/g, "-") // Replace spaces and underscores with hyphens
    .replace(/^-+|-+$/g, ""); // Remove leading/trailing hyphens
}

// WikiLink resolver for remark-wiki-link (runtime version)
export function gardenWikiLinkResolver(name: string): string {
  return slugify(name);
}

// Get all garden entries (for building alias map)
export async function getGardenEntries(): Promise<GardenEntry[]> {
  try {
    return await getCollection("garden");
  } catch {
    return [];
  }
}

// Build alias map for resolving alternative names
export async function buildAliasMap(): Promise<Map<string, string>> {
  const entries = await getGardenEntries();
  const aliasMap = new Map<string, string>();

  for (const entry of entries) {
    const slug = entry.id.replace(/\.mdx?$/, "");

    // Map title to slug
    aliasMap.set(entry.data.title.toLowerCase(), slug);

    // Map aliases to slug
    if (entry.data.aliases) {
      for (const alias of entry.data.aliases) {
        aliasMap.set(alias.toLowerCase(), slug);
      }
    }
  }

  return aliasMap;
}

// Resolve wikilink to actual slug (considering aliases)
export async function resolveWikiLink(linkText: string): Promise<string> {
  const aliasMap = await buildAliasMap();
  const normalizedLink = linkText.toLowerCase();

  // Check if it's an alias first
  if (aliasMap.has(normalizedLink)) {
    return aliasMap.get(normalizedLink)!;
  }

  // Fall back to slugified version
  return slugify(linkText);
}

// Check if a garden file exists
export async function gardenFileExists(slug: string): Promise<boolean> {
  const gardenDir = path.join(process.cwd(), "src/content/garden");
  try {
    await fs.access(path.join(gardenDir, `${slug}.md`));
    return true;
  } catch {
    try {
      await fs.access(path.join(gardenDir, `${slug}.mdx`));
      return true;
    } catch {
      return false;
    }
  }
}

// Create a new garden file
export async function createGardenFile(
  title: string,
  slug: string,
): Promise<FileCreationResult> {
  const gardenDir = path.join(process.cwd(), "src/content/garden");
  const filePath = path.join(gardenDir, `${title}.md`);

  // Ensure garden directory exists
  await fs.mkdir(gardenDir, { recursive: true });

  // Check if file already exists
  if (await gardenFileExists(slug)) {
    return { success: false, error: "File already exists" };
  }

  const now = new Date().toLocaleDateString("en-CA");
  const content = `+++
title = "${title}"
created = ${now}
tags = []
aliases = []
slug = "${slug}"
+++


`;

  try {
    await fs.writeFile(filePath, content, "utf8");
    return { success: true, filePath };
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : "Unknown error";
    return { success: false, error: errorMessage };
  }
}

// Get related garden entries by tags
export async function getRelatedEntries(
  currentEntry: GardenEntry,
  limit: number = 5,
): Promise<GardenEntry[]> {
  const allEntries = await getGardenEntries();
  const currentTags = new Set(currentEntry.data.tags || []);

  if (currentTags.size === 0) return [];

  const related = allEntries
    .filter((entry) => entry.id !== currentEntry.id)
    .map((entry) => {
      const entryTags = new Set(entry.data.tags || []);
      const commonTags = [...currentTags].filter((tag) => entryTags.has(tag));
      return {
        entry,
        score: commonTags.length,
      };
    })
    .filter((item) => item.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, limit)
    .map((item) => item.entry);

  return related;
}

// Extract backlinks from garden content
export async function getBacklinks(
  targetSlug: string,
): Promise<BacklinkItem[]> {
  const allEntries = await getGardenEntries();
  const backlinks: BacklinkItem[] = [];

  for (const entry of allEntries) {
    const entrySlug = entry.id.replace(/\.mdx?$/, "");
    if (entrySlug === targetSlug) continue;

    // Simple regex to find wikilinks in content
    const wikiLinkRegex = /\[\[([^\]]+)\]\]/g;
    let match: RegExpExecArray | null;

    while ((match = wikiLinkRegex.exec(entry.body)) !== null) {
      const linkText = match[1].split("|")[0]; // Handle aliases
      const resolvedSlug = await resolveWikiLink(linkText);

      if (resolvedSlug === targetSlug) {
        backlinks.push({
          entry,
          linkText: match[1],
        });
        break; // Only count each entry once
      }
    }
  }

  return backlinks;
}
