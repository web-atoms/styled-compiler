import { SourceNode } from "source-map";

export default class StyledSheet {

    constructor(
        public readonly source: string,
        public readonly node: SourceNode
    ) {

    }

    toString() {
        return this.source;
    }
}