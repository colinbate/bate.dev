// src/utils/frontmatter.ts
import * as toml from "smol-toml";

// Capture frontmatter wrapped with `+++`
const tomlFrontmatterRE = /(?:^\uFEFF?|^\s*\n)\+\+\+([\s\S]*?\n)\+\+\+/;

export function extractTomlFrontmatter(code: string): string | undefined {
  return tomlFrontmatterRE.exec(code)?.[1];
}

export interface ParseTomlResult {
  frontmatter: Record<string, any>;
  content: string;
}

export function parseTomlFrontmatter(code: string): ParseTomlResult {
  const rawFrontmatter = extractTomlFrontmatter(code);

  if (rawFrontmatter == null) {
    return { frontmatter: {}, content: code };
  }

  try {
    const parsed = toml.parse(rawFrontmatter);
    const frontmatter = (
      parsed && typeof parsed === "object" ? parsed : {}
    ) as Record<string, any>;

    // Remove frontmatter from content
    const content = code.replace(`+++${rawFrontmatter}+++`, "");

    return { frontmatter, content };
  } catch (error) {
    console.error("Error parsing TOML frontmatter:", error);
    return { frontmatter: {}, content: code };
  }
}
