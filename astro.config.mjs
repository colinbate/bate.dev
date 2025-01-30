import { defineConfig } from "astro/config";
import { tokenColors } from "./custom-theme.json";
import svelte from "@astrojs/svelte";
import compress from "astro-compress";
import sitemap from "@astrojs/sitemap";
import mdx from "@astrojs/mdx";
import tailwindcss from "@tailwindcss/vite";

export default defineConfig({
  markdown: {
    drafts: true,
    shikiConfig: { theme: "css-variables" },
  },
  shikiConfig: {
    wrap: true,
    skipInline: false,
    drafts: true,
  },
  site: 'https://bate.dev',
  integrations: [mdx(), svelte(), compress({SVG: false}), sitemap()],
  vite: {
    plugins: [
      tailwindcss()
    ],
  }
});