import { SourceNode } from "source-map";
import { parse } from "stacktrace-parser";
import * as path from "node:path";
import { processLess } from "./processLess.js";

export default class styled {

    /** This will not expand less variables */
    static less(t: TemplateStringsArray, ... a: any[]) {

        const stack = parse(new Error().stack);
        const callee = stack[1];
        const file = callee.file;

        const { base: fileName } = path.parse(file);


        const s = new SourceNode(callee.lineNumber, callee.column || 1, fileName, "");
        for (let index = 0; index < t.length; index++) {
            const element = t[index];
            // we need to build map from previous length
            s.add(element);
            if (index < a.length) {
                const arg = a[index];
                if (Array.isArray(arg)) {
                    for (const item of arg) {
                        if (item instanceof SourceNode) {
                            s.add(item);
                            continue;
                        }
                        s.add(item);
                    }
                    continue;
                } 
                if (arg instanceof SourceNode) {
                    s.add(arg);
                    continue;
                }
                s.add(arg);                
            }
        }

        return s;
    }

    /** This will expand `&` only */
    static css(t: TemplateStringsArray, ... a: any[]) {

        const stack = parse(new Error().stack);
        const callee = stack[1];
        const file = callee.file;

        const { base: fileName } = path.parse(file);


        const s = new SourceNode(callee.lineNumber, callee.column || 1, fileName, "");
        for (let index = 0; index < t.length; index++) {
            const element = t[index];
            // we need to build map from previous length
            s.add(element);
            if (index < a.length) {
                const arg = a[index];
                if (Array.isArray(arg)) {
                    for (const item of arg) {
                        if (item instanceof SourceNode) {
                            s.add(item);
                            continue;
                        }
                        s.add(item);
                    }
                    continue;
                } 
                if (arg instanceof SourceNode) {
                    s.add(arg);
                    continue;
                }
                s.add(arg);                
            }
        }
        s[processLess] = true;
        return s;
    }

}