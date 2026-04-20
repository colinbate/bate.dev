import type { ImageMetadata } from "astro";
import { readFile } from "node:fs/promises";
import sharp from "sharp";

type ImageMetadataWithPath = ImageMetadata & {
    fsPath?: string;
};

export type PostImageSource = ImageMetadataWithPath | string | URL;

async function readImageSource(source: PostImageSource) {
    if (source instanceof URL) {
        if (source.protocol === "file:") {
            return readFile(source);
        }

        const response = await fetch(source);
        if (!response.ok) {
            throw new Error(
                `Failed to load remote image ${source.href}: ${response.status}`,
            );
        }

        return Buffer.from(await response.arrayBuffer());
    }

    if (typeof source === "string") {
        if (source.startsWith("http://") || source.startsWith("https://")) {
            const response = await fetch(source);
            if (!response.ok) {
                throw new Error(
                    `Failed to load remote image ${source}: ${response.status}`,
                );
            }

            return Buffer.from(await response.arrayBuffer());
        }

        return readFile(source);
    }

    if (source.fsPath) {
        return readFile(source.fsPath);
    }

    throw new Error("Local post image metadata did not include a file path.");
}

export async function loadPostImage(source: PostImageSource) {
    const input = await readImageSource(source);

    return sharp(input)
        .resize(420, 420, { fit: "cover", position: "centre" })
        .png()
        .toBuffer();
}
