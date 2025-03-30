import * as path from "node:path";
import { pathToFileURL } from "node:url";
import { unlink, writeFile } from "node:fs/promises";
import type { SourceNode } from "source-map";
export { default as styled} from "./styled.js";

import postCss from "postcss";
import postCssNested from "postcss-nested";
import postCssImport from "postcss-import";
import postCssImportExtGlob from "postcss-import-ext-glob";
import cssNano from "cssnano";

const inputFile = process.argv[2];
const inputFileNameParsed = path.parse(inputFile);
let name = inputFileNameParsed.name;
const dir = inputFileNameParsed.dir;
if (/\.(css)$/i.test(name)) {
    name = name.split(".").slice(0, -1).join(".");
}
const outputFile = process.argv[3] ?? name + ".css";

async function run() {

    try {
        const filePath = path.join(process.cwd(), inputFile);
        const url = pathToFileURL(filePath).toString();

        console.log(`Loading ${url}`);
        const r = await import(url);

        const style = r.default as SourceNode;

        const outputFilePath = path.join(dir, outputFile);

        const { code: source, map: sourceMap } = style.toStringWithSourceMap();
        const inputSourceMap = filePath + ".map";
        await writeFile(inputSourceMap, JSON.stringify(sourceMap.toJSON()));
        const result = await postCss([
            postCssNested,
            postCssImportExtGlob({ sort: "desc"}),
            postCssImport,
            cssNano({ preset: "default"})
        ])
            .process(source, {
                from: filePath,
                map: {
                    prev: () => inputSourceMap
                },
                to: outputFilePath
            });
        await unlink(inputSourceMap);
        await writeFile(outputFilePath, `${result.css}\n/*# sourceMappingURL=${outputFile}.map */`);
        await writeFile(outputFilePath + ".map", JSON.stringify(result.map.toJSON()));

        process.exit(0);
    } catch (error) {
        console.error(error);
        process.exit(1);
    }

}

run().catch(console.error);