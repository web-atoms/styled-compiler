import * as path from "node:path";
import { pathToFileURL } from "node:url";
import { writeFile } from "node:fs/promises";
import type { SourceNode } from "source-map";
import { processLess } from "./processLess.js";
export { default as styled} from "./styled.js";
import less from "less";

const inputFile = process.argv[2];
const inputFileNameParsed = path.parse(inputFile);
let name = inputFileNameParsed.name;
const dir = inputFileNameParsed.dir;
if (/\.(less|css)$/i.test(name)) {
    name = name.split(".").slice(0, -1).join(".");
}
const outputFile = process.argv[3] ?? name + ".less";

async function run() {

    try {
        const filePath = path.join(process.cwd(), inputFile);
        const url = pathToFileURL(filePath).toString();

        console.log(`Loading ${url}`);
        const r = await import(url);

        const style = r.default as SourceNode;

        const outputFilePath = path.join(dir, outputFile);

        const { code: source, map: sourceMap } = style.toStringWithSourceMap();

        await writeFile(outputFilePath, source);
        await writeFile(outputFilePath + ".map", JSON.stringify(sourceMap.toJSON()));
        if (style[processLess]) {
            // process less...

            const { code, map } = style.toStringWithSourceMap();
            const output = await less.render(code, {
                filename: name + ".less",
                sourceMap: {}
            });

            const cssFile = path.join(dir, name + ".css");

            await writeFile(cssFile, output.css);
            await writeFile(cssFile + ".map", JSON.stringify(map.toJSON()));
    

        }

        process.exit(0);
    } catch (error) {
        console.error(error);
        process.exit(1);
    }

}

run().catch(console.error);