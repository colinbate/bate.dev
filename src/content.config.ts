import { defineCollection, z } from "astro:content";
import { glob, file } from "astro/loaders";

const postsCollection = defineCollection({
  loader: glob({ pattern: "**/[^_]*.{md,mdx}", base: "./src/content/posts" }),
  schema: ({ image }) =>
    z.object({
      title: z.string(),
      pubDate: z.date(),
      description: z.string(),
      author: z.string(),
      image: z.object({
        url: z.string().optional(),
        local: image().optional(),
        alt: z.string(),
      }),
      tags: z.array(z.string()),
    }),
});

const projectsCollection = defineCollection({
  loader: glob({
    pattern: "**/[^_]*.{md,mdx}",
    base: "./src/content/projects",
  }),
  schema: ({ image }) =>
    z.object({
      title: z.string(),
      url: z.string(),
      code: z.string().optional(),
      month: z.string().optional(),
      description: z.string(),
      tags: z.array(z.string()),
      wip: z.boolean().optional().default(false),
      image: z
        .object({
          url: z.string().optional(),
          local: image().optional(),
          alt: z.string(),
        })
        .refine((img) => img.local || img.url),
    }),
});

const gardenCollection = defineCollection({
  loader: glob({ pattern: "**/[^_]*.{md,mdx}", base: "./src/content/garden" }),
  schema: z.object({
    title: z.string(),
    created: z.date(),
    updated: z.date().optional(),
    tags: z.array(z.string()).default([]),
    aliases: z.array(z.string()).default([]),
    draft: z.boolean().default(false),
    description: z.string().optional(),
  }),
});

const seriesCollection = defineCollection({
  loader: file("src/content/books/series.json"),
  schema: () =>
    z.object({
      name: z.string(),
      author: z.string(),
      genre: z.string(),
      icon: z.string(),
      bookCount: z.number().int().nonnegative(),
      isComplete: z.boolean(),
      url: z.string().url(),
      firstBookCoverUrl: z.string().optional(),
    }),
});

export const collections = {
  posts: postsCollection,
  projects: projectsCollection,
  series: seriesCollection,
  garden: gardenCollection,
};
