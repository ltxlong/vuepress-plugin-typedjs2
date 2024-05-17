import type { Plugin } from "@vuepress/core";
import { getDirname, path } from "@vuepress/utils";

const __dirname = getDirname(import.meta.url);

const serializeFunctions = (options: any): any => {
  const serialized = {};

  for (const key in options) {
    if (typeof options[key] === "function") {
      serialized[key + 'FuncStr'] = options[key].toString();
    } else {
      serialized[key] = options[key];
    }
  }

  return serialized;
};

export default (options = {}): Plugin => {

  return {
    name: "vuepress-plugin-typedjs2",
    define: {
      TYPED_OPTIONS: serializeFunctions(options),
    },
    clientConfigFile: path.resolve(__dirname, "./client.js")
  };
};
