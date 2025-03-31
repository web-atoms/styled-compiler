import path from "path";
import valueParser from "postcss-value-parser";
import { SourceNode } from "source-map";
import SourceMapReMap from "./SourceMapReMap.js";
import { writeFile } from "fs/promises";
import FilePath from "./FilePath.js";

const jsProcessed = Symbol("jsProcessed");

const postCssImportJs =(opts = {}) => {
    return {
        postcssPlugin: "postcss-js",
        Once(root, { AtRule, result}) {
            const promisesList = [];

            root.walkAtRules("import", (rule) => {

                if (rule[jsProcessed]) {
                    return;
                }
                rule[jsProcessed] = true;

                promisesList.push(new Promise<void>(async (resolve) => {

                    const params = valueParser(rule.params).nodes;

                    const dirName =
                        typeof rule.source.input.file === 'string'
                            ? path.dirname(rule.source.input.file)
                            : __dirname;

                    for (const param of params) {
                        if (param.type !== "string") {
                            result.warn(`File path was expected` , {
                                node: rule
                            });
                            continue;
                        }

                        if (!/\.js$/i.test(param.value)) {
                            continue;
                        }

                        const nodeFilePath = new FilePath(path.resolve(dirName, param.value));
                        const fileResult = (await import(nodeFilePath.fileUrl))?.default as SourceNode;

                        if (!fileResult) {
                            result.warn(`JavaScript file did not return Style object` , {
                                node: rule
                            });
                            continue;
                        }

                        const fp = new FilePath(nodeFilePath.dir);
                        
                        const sourceRoot = fp.webPath;

                        const cssFilePath = nodeFilePath.filePath.replace(".css.js", ".css");

                        const { code: source, map: sourceMap } = fileResult.toStringWithSourceMap({});
                        await writeFile(cssFilePath, source, "utf-8");
                        await writeFile(cssFilePath + ".map", SourceMapReMap.save(sourceMap, sourceRoot), "utf-8");

                        // save file and change import

                        const replacedRule = new AtRule({
                            name: 'import',
                            params: cssFilePath,
                            source: rule.source,
                          });

                        replacedRule[jsProcessed] = true;

                        rule.before(replacedRule);
                        
                    }

                    rule.remove();

                    resolve();
                }));
            });

            return Promise.all(promisesList);
        }
    };    
};
postCssImportJs.postcss = true;
export default postCssImportJs;