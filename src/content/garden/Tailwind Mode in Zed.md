+++
title = "Tailwind Mode in Zed"
slug = "tailwind-mode-in-zed"
created = 2025-09-04
tags = ["snippet"]
aliases = []
description = "A tiny .zed/settings.json snippet that makes the Zed editor use the Tailwind language server for CSS files in Tailwind 4+ projects."
+++

By default the CSS mode in the Zed code editor doesn't like the extra @-rules that Tailwind uses. So, if you have a project that is using Tailwind 4+, then you can add this to a `.zed/settings.json` file inside that project:

```json
"languages": {
	"CSS": {
		"language_servers": ["tailwindcss-language-server"]
	}
}
```

