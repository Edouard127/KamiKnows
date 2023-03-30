import path from "path";
import {app} from "electron";
import {lstatSync, readdirSync, readFileSync} from "fs";
import ts, {ModuleKind, ScriptTarget} from "typescript";
import KrunkerClient from "../core/class/KrunkerClient";
import {IPlugin} from "../core/interface/IPlugin";
import os from "os";

// This is the most unstable function in the entire code
// I don't expect it to last for a long time until someone finds a way to break
// this shitty system

// It will dynamically transpile the TypeScript code into
// a JavaScript code.
// It will then fix the imports to this current folder
// so the interpreter doesn't scream at us

// Basically to load a plugin you are forced to use the prefix
// "./definitions/src" or else this code will not work
// and the plugin will not be loaded

// Fortunately, there's no modules outside "./definitions/src",
// so the risks are currently low

// You can probably spot 27 different injection exploits in this lol
// But since this is a plugin that runs on the client
// and someone messes with plugins, I expect them to understand
// how javascript work
export default async function LoadPlugin(client: KrunkerClient): Promise<IPlugin[]> {
    const plugins: IPlugin[] = []
    const dir = path.join(os.homedir(), "documents", "kamiknows/scripts");
    // @ts-ignore
    for (const f of readdirSync(dir)
        // Avoid listing the definitions
        .filter(x => !lstatSync(`${dir}/${x}`).isDirectory() && x.endsWith(".ts"))) {

        const file = `${dir}/${f}`
        const tsCode = readFileSync(file, "utf-8");

        const jsCode = ts.transpileModule(tsCode, {
            compilerOptions: {
                target: ScriptTarget.ES2020,
                module: ModuleKind.CommonJS,
            }
        }).outputText

        const wrappedCode = `(function (exports,require){${jsCode}})(module.exports,module.require);`
        // Inject the plugin class inside the exports.customDefault
        // We need to use a custom export because it interferes with the default transpile for the main code
        new Function('module', replaceExports(replaceRequire(wrappedCode)))(module)
        const clazz = new (module.exports["customDefault"])(client) as IPlugin;

        plugins.push(clazz)
    }

    return plugins
}

function replaceRequire(code: string): string {
    return code.replace(/require\(['"]\.\/definitions\/src\/(.*?)['"]\)/g, `require('${__dirname.replace(/\\/gm, "/")}/../$1.js')`)
}

function replaceExports(code: string): string {
    return code.replace(/exports\.default(.*)/gm, "exports['customDefault']$1");
}
