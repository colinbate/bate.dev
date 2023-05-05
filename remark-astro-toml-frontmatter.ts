import type { Root, Literal } from 'mdast';
import type { VFile } from 'vfile';
import { parse } from 'toml';

interface TOML extends Literal {
  type: 'toml'
}

declare module 'mdast' {
  interface FrontmatterContentMap {
    toml: TOML
  }
}

export default function remarkTomlFrontmatter() {
  return function (tree: Root, file: VFile) {
    if (tree?.children[0]?.type === 'toml') {
      const raw = tree.children[0].value;
      const fm = parse(raw);
      Object.assign((file.data.astro as Record<string, any>).frontmatter, fm);
    }
  }
}