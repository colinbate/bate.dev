+++
title = "Gardening"
created = 2025-06-28
updated = 2025-06-30
tags = ["meta", "dogfooding"]
slug = "gardening"
+++

I've been interested in the [[PKM]] space for ~5 years now. In that time I've played around with an number of apps.

There were tools out there to take your existing graphs and publish them, but my real brain wouldn't let me just do that. I had to try to build it myself.

Since my existing site was done with [[Astro]], I wanted to see if I could build a garden with Astro. In my journey I found out there is another tool that is aiming to do something similar called [BrainDB](https://astro-digital-garden.stereobooster.com/recipes/braindb/)

So with the help of [[Claude]], I whipped something together. It's not perfect, but it's a start.

Another reason I "needed" to create my own is because I have specific, less popular tastes. [[TOML Frontmatter]] is one of those tastes.

Astro is fine with TOML, as I added that functionality in version 5.2, but Obsidian is not, and I was hoping to use Obsidian to manage the files in the garden.

Turns out this is fine if you are okay in not having any of your frontmatter used. The Templater plugin is fine to create new files with the TOML template in place, and I even wrote my own plugin to set the `updated` date via Hotkey.
