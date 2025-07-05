+++
title = "Backstories"
slug = "backstories"
created = 2025-07-01
tags = ["app", "spec"]
aliases = []
description = "Backstories is a mobile-first, series-focused book tracking app designed for high-volume readers—especially audiobook and indie fans—who want to ditch social features and focus on what they’ve read, what’s next, and when. It streamlines personal library management, tracks series progress and upcoming releases, and supports metadata capture from Audible, Amazon, and Goodreads CSV exports."
+++

## Overview
A mobile-first, personal-focused book tracking app optimized for audiobook-heavy, series-driven readers (especially [[LitRPG]], sci-fi, and fantasy). Designed for users who want to move away from Goodreads and manage their personal reading library without social features. Core differentiators include support for series tracking, audiobook imports, and flexible metadata for indie and Amazon-exclusive books.

---

## Core Principles
- Mobile-first design for on-the-go tracking
- No social features — fully personal or optionally shared
- Prioritize series and release tracking
- Offline-capable (PWA)
- Friendly to audiobooks and indie titles (no ISBN reliance)

---

## User Personas
- High-volume audiobook reader (150–200 books/year)
- Prefers bingeing full series
- Often discovers books before completion and wants to track for future
- Doesn’t want to re-read by accident
- Needs help remembering context across long series gaps

---

## Feature Set

### 1. Import & Metadata Capture
- Goodreads CSV import
- Audible Library scraper (via bookmarklet or page tool)
- Manual book entry with optional smart metadata lookup
- Optional Amazon/Audible scraping via Durable Object or headless proxy

### 2. Personal Library
- Track status: Unread / Reading / Completed / Abandoned / Wishlist
- Track format: Audiobook / Ebook / Physical
- Add personal rating, notes, tags
- Support bulk editing

### 3. Series Tracking
- Group books into series manually or via import
- View progress within a series
- See what’s next to read
- Mark series as finished/incomplete/paused
- Add upcoming releases to a tracker (manual or scraped)

### 4. Series Watchlist
- Track series not yet started
- Set alerts or flags for completed vs. in-progress
- Include upcoming books in release tracker

### 5. Release Radar
- List view of upcoming books (sortable by date, series)
- Manual input or scraped from Audible/Amazon
- Optional future: Discord/web push/email notifications

### 6. Notes & Summaries
- Add personal notes per book
- Add a personal summary at the series level
- Summaries meant for future recall after gaps between releases
- Optional future: AI-assisted summarization from book description or notes

### 7. Search & Discovery Tools
- Internal search (title/author/series/tags)
- Quick links to Audible/Amazon searches from app
- Bookmarklet to grab current page metadata and push to app

### 8. Privacy & Multi-User Support
- Each library will be single user
- Static login for site protection
- Future support for hosting multiple D1 databases (user per database) with basic login support
- Books/series/etc can be exported for sharing across libraries if desired
- Possible to opt-in to publish certain aspects of your library

### 9. Sharing & Publishing
- Tag-based sharing mechanisms
- Only share what you want, separate from your ability to track

---

## UX Considerations
- Core actions (mark read, add book, check release) must be 1–2 taps
- Home screen: customizable dashboard (e.g. "Next in Series", "Releases This Month")
- Desktop views for bulk edits and import management

---

## Roadmap Phases

### Phase 0: Data Foundations
- Schema design in D1
- Goodreads CSV importer
	- File uploader
	- Handle at least 1MB file with ~5000 entries
- Basic view of data on a dashboard

### Phase 1: MVP App
- Mobile-first UI: View/add/edit books and series
- Manual entry tools
- Status/tags/format support

### Phase 2: Metadata Tools
- Search helpers: Quick link to Audible/Amazon
- Bookmarklet for book import
- Audible page importer (manual DOM-based tool)

### Phase 3: Series + Releases
- Series pages: progress view, next-to-read logic
- Upcoming releases list (manually entered)
- Series watchlist

### Phase 4: Notes & Summaries
- Book-level notes
- Series-level summaries
- Future: AI summarization helpers

### Phase 5: Multi-user & Sharing
- Login support
- Global book pool with per-entry privacy control
- Optional contribution to shared book data

### Phase 6: Power Features
- Bulk editing tools
- Audible/Goodreads/Amazon re-sync
- Release notification options

---

## Optional Future Enhancements
- Browser extension
- Image hosting via R2 for covers
- Integration with Discord for release pings
- Smart duplicate detection during import
- Export tools (CSV/JSON backup)

---

## Stack Summary
- SvelteKit 2 (mobile-first PWA)
- Svelte 5 with Runes
- Shadcn-Svelte
- Tailwind 4
- Drizzle ORM
- Cloudflare D1 for storage
- Durable Object or Workers for scraping/bookmarklet metadata
- Optional: Cloudflare R2 for image storage
- Auth: Kinde or custom cookie-based

---

## Goal
Empower avid audiobook and series readers to confidently track what they’ve read, remember what matters, and know exactly what’s next — without relying on bloated or unreliable third-party platforms.
