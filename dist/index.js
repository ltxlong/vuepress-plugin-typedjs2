import { getDirname, path } from "@vuepress/utils";
const __dirname = getDirname(import.meta.url);
const serializeFunctions = (options) => {
    const serialized = {};
    for (const key in options) {
        if (typeof options[key] === "function") {
            serialized[key + 'FuncStr'] = options[key].toString();
        }
        else {
            serialized[key] = options[key];
        }
    }
    return serialized;
};
export default (options = {}) => {
    return {
        name: "vuepress-plugin-typedjs2",
        define: {
            TYPED_OPTIONS: serializeFunctions(options),
        },
        clientConfigFile: path.resolve(__dirname, "./client.js")
    };
};
//# sourceMappingURL=index.js.map