import satori from "satori";
import sharp from "sharp";
import { PostOgCard } from "../../components/og/PostOgCard";
import {
    loadRecursiveBoldFont,
    loadRecursiveMediumFont,
} from "./load-font";

export async function renderPostOg(options: {
    title: string;
    thumbnailSrc?: string;
    faviconSrc: string;
}) {
    const [boldFontData, mediumFontData] = await Promise.all([
        loadRecursiveBoldFont(),
        loadRecursiveMediumFont(),
    ]);
    const svg = await satori(
        PostOgCard({
            title: options.title,
            thumbnailSrc: options.thumbnailSrc,
            faviconSrc: options.faviconSrc,
        }),
        {
            width: 1200,
            height: 630,
            fonts: [
                {
                    name: "Recursive",
                    data: boldFontData,
                    weight: 800,
                    style: "normal",
                },
                {
                    name: "Recursive",
                    data: mediumFontData,
                    weight: 500,
                    style: "normal",
                },
            ],
        },
    );

    return sharp(Buffer.from(svg)).png().toBuffer();
}
