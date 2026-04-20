import type { APIRoute } from "astro";
import type { CollectionEntry } from "astro:content";
import { getCollection } from "astro:content";
import { readFile } from "node:fs/promises";
import path from "node:path";
import { pathToFileURL } from "node:url";
import {
    loadPostImage,
    type PostImageSource,
} from "../../lib/og/load-post-image";
import { renderPostOg } from "../../lib/og/render-post-og";

type PostEntry = CollectionEntry<"posts">;

function getRenderedLocalImagePath(post: PostEntry) {
    const frontmatter = post.rendered?.metadata?.frontmatter;

    if (
        frontmatter &&
        typeof frontmatter === "object" &&
        "image" in frontmatter &&
        frontmatter.image &&
        typeof frontmatter.image === "object" &&
        "local" in frontmatter.image &&
        typeof frontmatter.image.local === "string"
    ) {
        return frontmatter.image.local;
    }

    return undefined;
}

function getThumbnailSource(post: PostEntry): PostImageSource {
    const localImagePath = getRenderedLocalImagePath(post);

    if (localImagePath && post.filePath) {
        const absoluteFilePath = path.resolve(
            path.dirname(post.filePath),
            localImagePath,
        );

        return pathToFileURL(absoluteFilePath);
    }

    if (post.data.image.url) {
        return post.data.image.url;
    }

    if (post.data.image.local) {
        return post.data.image.local;
    }

    throw new Error(`Post ${post.id} does not have an OG image source.`);
}

export async function getStaticPaths() {
    const posts = await getCollection("posts");

    return posts.map((post) => ({
        params: { slug: post.id },
        props: { post },
    }));
}

export const GET: APIRoute = async ({ props }) => {
    const post = props.post as PostEntry;
    const thumbnailBuffer = await loadPostImage(getThumbnailSource(post)).catch(
        (error) => {
            console.warn(
                `Skipping OG thumbnail for ${post.id}: ${
                    error instanceof Error ? error.message : String(error)
                }`,
            );
            return undefined;
        },
    );
    const faviconBuffer = await readFile(
        path.join(process.cwd(), "src/assets/branding/favicon.png"),
    );

    const png = await renderPostOg({
        title: post.data.ogtitle ?? post.data.title,
        thumbnailSrc: thumbnailBuffer
            ? `data:image/png;base64,${thumbnailBuffer.toString("base64")}`
            : undefined,
        faviconSrc: `data:image/png;base64,${faviconBuffer.toString("base64")}`,
    });

    return new Response(png, {
        headers: {
            "Content-Type": "image/png",
            "Cache-Control": "public, max-age=31536000, immutable",
        },
    });
};
