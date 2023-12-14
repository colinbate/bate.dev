import { defineConfig } from "astro/config";
import { tokenColors } from "./custom-theme.json";
import svelte from "@astrojs/svelte";
import tailwind from "@astrojs/tailwind";
import compress from "astro-compress";
import sitemap from "@astrojs/sitemap";
import mdx from "@astrojs/mdx";
import toml from './toml-content';

import remarkFrontmatter from 'remark-frontmatter';
import remarkTomlFrontmatter from './remark-astro-toml-frontmatter';
export default defineConfig({
  markdown: {
    drafts: true,
    shikiConfig: { theme: "css-variables" },
    remarkPlugins: [
      [remarkFrontmatter, 'toml'],
      remarkTomlFrontmatter,
    ],
  },
  shikiConfig: {
    wrap: true,
    skipInline: false,
    drafts: true,
  },
  site: 'https://bate.dev',
  integrations: [mdx(), toml(), svelte(), tailwind(), compress(), sitemap()],
});