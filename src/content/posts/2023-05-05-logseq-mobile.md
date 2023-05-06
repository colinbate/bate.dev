+++
title = "Reordering Mobile Editing Icons in LogSeq"
slug = "logseq-mobile"
author = "Colin Bate"
description = "I found a way to avoid needing to constantly scroll sideways to access the icons I need."
pubDate = 2023-05-05T12:00:00Z
tags = [ "logseq", "css", "flex" ]

[image]
local = "./2023-05-05-logseq-mobile.jpg"
alt = "Phone with LogSeq logo."
+++
It uses TextMate grammar to tokenize strings, and colors the tokens with VS Code themes. In short, Shiki generates HTML that looks exactly like your code in VS Code, and it works great in your static website generator.

#### It's simple to use:

```js
// Example JavaScript
const shiki = require('shiki')
shiki.getHighlighter({
    theme: 'nord'
}).then(highlighter => {
    console.log(highlighter.codeToHtml(`console.log('shiki');`, {
        lang: 'js'
    }))
})
// <pre class="shiki" style="background-color: #2e3440"><code>
//   <!-- Highlighted Code -->
// </code></pre>
```
### Here's Shiki using Shiki ( how meta ) and markdown-it to generate this page:
```js
const fs = require('fs')
const markdown = require('markdown-it')
const shiki = require('shiki')
shiki.getHighlighter({
  theme: 'nord'
}).then(highlighter => {
  const md = markdown({
    html: true,
    highlight: (code, lang) => {
      return highlighter.codeToHtml(code, { lang })
    }
  })
  const html = md.render(fs.readFileSync('index.md', 'utf-8'))
  const out = `
    <title>Shiki</title>
    <link rel="stylesheet" href="style.css">
    ${html}
    <script src="index.js"></script>
  `
  fs.writeFileSync('index.html', out)
  console.log('done')
})
```
### Shiki can load any VS Code themes.:
```js
import { tokenColors } from "./custom-theme.json";
// https://astro.build/config
// VS Code Theme is:
export default defineConfig({
  markdown: {
    shikiConfig: {
      theme: {
        name: "custom",
        type: "dark",
        settings: tokenColors,
      },
      wrap: true,
      skipInline: false,
      drafts: false,
    },
  },
});
```

