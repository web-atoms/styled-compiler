import path from "path";
import { fileURLToPath } from "url";

export default class FilePath {

    public readonly filePath: string;
    public readonly webPath: string;
    public readonly dir: string;
    public readonly name: string;
    public readonly baseName: string;
    public readonly ext: string;

    constructor(
        filePath: string
    ) {
        if(filePath.startsWith("file://")) {
            filePath = fileURLToPath(filePath);
        }
        this.filePath = filePath;
        const { dir, name, base, ext } = path.parse(filePath);
        this.dir = dir;
        this.name = base;
        this.baseName = name;
        this.ext = ext;
        this.webPath = `/${filePath.replaceAll("\\", "/").replace(":/", "/")}`;
    }

    relativeTo(root: FilePath) {
        const r = path.relative(new FilePath(root.dir).webPath, this.webPath).replaceAll("\\","/");
        return "./" + r;
    }

    toString() {
        return this.filePath;
    }

}