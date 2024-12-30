import { defineCollection, z } from "astro:content";
import { glob } from "astro/loaders";

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

export const collections = {
  posts: postsCollection,
  projects: projectsCollection,
};
