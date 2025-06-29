import { defineConfig } from "astro/config";
import svelte from "@astrojs/svelte";
import compress from "astro-compress";
import sitemap from "@astrojs/sitemap";
import mdx from "@astrojs/mdx";
import tailwindcss from "@tailwindcss/vite";
import remarkWikiLink from "@braindb/remark-wiki-link";
import gardenDB from "./src/utils/garden-db.ts";

// Initialize the database
await gardenDB.init();

// Simple slugify function for build time
function slugify(text) {
  return text
    .toLowerCase()
    .replace(/[^\w\s-]/g, "") // Remove special characters
    .replace(/[\s_-]+/g, "-") // Replace spaces and underscores with hyphens
    .replace(/^-+|-+$/g, ""); // Remove leading/trailing hyphens
}

export default defineConfig({
  markdown: {
    drafts: true,
    shikiConfig: { theme: "css-variables" },
    remarkPlugins: [
      [
        remarkWikiLink,
        {
          linkTemplate: ({ slug, alias }) => {
            const [slugWithoutAnchor, anchor] = slug.split("#");

            if (slugWithoutAnchor) {
              const doc = gardenDB.getDocument(slugify(slugWithoutAnchor));

              if (doc) {
                return {
                  hName: "a",
                  hProperties: {
                    href: anchor ? `${doc.url}#${anchor}` : doc.url,
                    class: "wikilink",
                  },
                  hChildren: [
                    {
                      type: "text",
                      value: alias || doc.frontmatter.title || slug,
                    },
                  ],
                };
              }
            }

            // Non-existent link - create with your API
            return {
              hName: "span",
              hProperties: {
                class: "wikilink-new",
                "data-slug": slugify(slugWithoutAnchor || slug),
                title: `Create ${alias || slug}`,
              },
              hChildren: [{ type: "text", value: `${alias || slug}` }],
            };
          },
        },
      ],
    ],
  },
  shikiConfig: {
    wrap: true,
    skipInline: false,
    drafts: true,
  },
  site: "https://bate.dev",
  integrations: [mdx(), svelte(), sitemap() /*, compress({ SVG: false })*/],
  vite: {
    plugins: [tailwindcss()],
  },
});
