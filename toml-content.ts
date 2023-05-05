import { matter } from 'toml-matter';
import { fileURLToPath } from 'node:url';
import type { AstroIntegration, ContentEntryType, HookParameters } from 'astro';
import type { ErrorPayload as ViteErrorPayload } from 'vite';

type IntegrationWithPrivateHooks = {
	name: string;
	hooks: Omit<AstroIntegration['hooks'], 'astro:config:setup'> & {
		'astro:config:setup': (
			params: HookParameters<'astro:config:setup'> & {
				// `contentEntryType` is not a public API
				// Add type defs here
				addContentEntryType: (contentEntryType: ContentEntryType) => void;
			}
		) => void | Promise<void>;
	};
};

function parseFrontmatter(fileContents: string, filePath: string) {
	try {
		return matter(fileContents);
	} catch (e: any) {
		if (e.name === 'SyntaxError') {
			const err: Error & ViteErrorPayload['err'] = e;
			err.id = filePath;
			err.loc = { file: err.id, line: e.line, column: e.column };
			throw err;
		} else {
			throw e;
		}
	}
}

export default function tomlContent(): IntegrationWithPrivateHooks {
	return {
		name: '@colinbate/toml-content',
		hooks: {
			'astro:config:setup': async ({ addContentEntryType }) => {
				function getEntryInfo({ fileUrl, contents }: { fileUrl: URL; contents: string }) {
          const id = fileURLToPath(fileUrl);
					const parsed = parseFrontmatter(contents, id);
					return {
						data: parsed.data,
						body: parsed.content,
						slug: ('slug' in parsed.data && typeof parsed.data.slug === 'string') ? parsed.data.slug : undefined as unknown as string,
						rawData: parsed.matter ?? '',
					};
				}
				addContentEntryType({
					extensions: ['.md', '.mdx'],
					getEntryInfo,
				});
			},
		},
	};
}
