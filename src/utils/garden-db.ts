// src/utils/garden-db.ts
import { parseTomlFrontmatter } from "./frontmatter.ts";
import chokidar, { type FSWatcher } from "chokidar";
import fs from "fs/promises";
import path from "path";

class GardenDB {
  private documents = new Map();
  private watcher: FSWatcher | null = null;
  private gardenDir = path.join(process.cwd(), "src/content/garden");

  async init() {
    // Initial load
    await this.loadAllDocuments();

    // Watch for changes in dev
    if (import.meta.env.DEV) {
      this.watcher = chokidar
        .watch(`${this.gardenDir}/**/*.{md,mdx}`)
        .on("add", (filePath) => this.loadDocument(filePath))
        .on("change", (filePath) => this.loadDocument(filePath))
        .on("unlink", (filePath) => this.removeDocument(filePath));
    }
  }

  private async loadDocument(filePath: string) {
    try {
      const content = await fs.readFile(filePath, "utf-8");
      const { frontmatter } = parseTomlFrontmatter(content);
      const slug = path.basename(filePath, path.extname(filePath));

      this.documents.set(slug, {
        slug,
        frontmatter,
        url: `/garden/${slug}`,
        filePath,
      });
    } catch (error) {
      console.error(`Error loading document ${filePath}:`, error);
    }
  }

  private async loadAllDocuments() {
    try {
      const files = await fs.readdir(this.gardenDir);
      const markdownFiles = files.filter((file) => /\.mdx?$/.test(file));

      await Promise.all(
        markdownFiles.map((file) =>
          this.loadDocument(path.join(this.gardenDir, file)),
        ),
      );
    } catch (error) {
      console.error("Error loading garden documents:", error);
    }
  }

  private removeDocument(filePath: string) {
    const slug = path.basename(filePath, path.extname(filePath));
    this.documents.delete(slug);
  }

  getDocument(slug: string) {
    return this.documents.get(slug);
  }

  getAllDocuments() {
    return Array.from(this.documents.values());
  }
}

const gardenDB = new GardenDB();
export default gardenDB;
