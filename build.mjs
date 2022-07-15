import { build } from "esbuild";
import stylus from "stylus";
import * as fs from "fs";
import * as path from "path";

const renderStylus = (content, options) => {
    return new Promise((resolve, reject) => {
        const styl = stylus(content.toString());

        styl.set("filename", options.filePath);

        if (options.sourcemap) {
            styl.set("sourcemap", {
                comment: true,
                inline: true
            });
        }

        styl.render((err, css) => {
            if (err) {
                return reject(err);
            }

            resolve(css);
        });
    });
}

// A custom esbuild plugin that transforms stylus to css and injects it as a raw string into the JS document
const cssPlugin = {
    name: "Stylus plugin",
    setup: (build) => {
        const { sourcemap } = build.initialOptions
        const stylusRegex = /\.(styl|stylus)$/
        const anyRegex = /.*/

        build.onResolve({ filter: stylusRegex }, args => ({
            path: path.resolve(process.cwd(), path.relative(process.cwd(), args.resolveDir), args.path),
            namespace: "__stylus__",
        }))

        build.onLoad({ filter: anyRegex, namespace: "__stylus__" }, async args => {
            const content = await fs.promises.readFile(args.path);
            const css = await renderStylus(content, {
                filePath: args.path,
                sourcemap: sourcemap === true || sourcemap === "linked" || sourcemap === "inline" || sourcemap === "external" || sourcemap === "both"
            });
            
            return {
                contents: `module.exports = ${JSON.stringify(css)}`
            }
        });
    }
}

build({
    entryPoints: [
        "src/index.ts"
    ],
    bundle: true,
    sourcemap: true,
    format: "esm",
    outdir: "dist",
    plugins: [
        //style({
        //    minify: true
        //})
        cssPlugin
    ]
});
