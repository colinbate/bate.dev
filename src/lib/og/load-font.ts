import { readFile } from "node:fs/promises";
import path from "node:path";

function loadFont(filename: string) {
    return readFile(
        path.join(
            process.cwd(),
            "src/assets/fonts",
            filename,
        ),
    );
}

export function loadRecursiveBoldFont() {
    return loadFont("RecursiveSansLnrSt-Bold.ttf");
}

export function loadRecursiveMediumFont() {
    return loadFont("RecursiveSansLnrSt-Med.ttf");
}
