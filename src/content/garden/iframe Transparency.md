+++
title = "iframe Transparency"
slug = "iframe-transparency"
created = 2025-09-04
tags = []
aliases = []
+++

By default, `<iframe>`s have transparent backgrounds unless the child document specifies a specific background color for it to use. However, more recently, the support of `color-scheme` in browsers has caused for a slight shift in this behavior. If the `color-scheme` of the parent document and the color scheme of the child document differ, including if one doesn't specify, it can cause the iframe to use the canvas background, which is to say a white background in light mode or a dark background in dark mode.

You can add `html,body {background: transparent !important;}` all day long and it won't work.

This can be particularly vexing if you aren't setting `color-scheme` anywhere, as was my case. Only, I eventually learned, there was a package setting it for me in the form of the `mode-watcher` package.

To make matters more frustrating, the `<iframe>` was showing up properly transparent when the page was reloaded. This was because `mode-watcher` was setting the `color-scheme` via inline style on the `<html>` tag. And it was basically racing with the `<iframe>` loading. On navigation it would already be set when the frame was loaded; an a white background resulted. Otherwise the frame would load first and be fine.

Hopefully you find this if you are having a similar issue.

