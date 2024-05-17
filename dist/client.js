import { defineClientConfig } from "@vuepress/client";
import { onMounted } from "vue";
import Typed from "typed.js";
const deserializeFunctions = (options) => {
    const deserialized = {};
    for (const key in options) {
        if (key.endsWith("FuncStr")) {
            deserialized[key.slice(0, -7)] = new Function("return " + options[key])();
        }
        else {
            deserialized[key] = options[key];
        }
    }
    return deserialized;
};
export default defineClientConfig({
    setup() {
        let options = deserializeFunctions(TYPED_OPTIONS);
        let timerId = null;
        let retryCount = 0;
        const MAX_RETRIES = 10;
        if (Object.keys(options).length === 0) {
            console.error("Typed.js: No options provided");
            return;
        }
        const clearTimer = () => {
            if (timerId) {
                clearTimeout(timerId);
                timerId = null;
            }
        };
        const querySelector = () => {
            const elements = document.querySelectorAll(options.selector);
            if (elements.length > 0) {
                clearTimer();
                new Typed(options.selector, options);
            }
            else if (retryCount < MAX_RETRIES) {
                retryCount++;
                timerId = setTimeout(querySelector, 200);
            }
            else {
                console.error('Typed.js: No element found with selector "' + options.selector + '".');
            }
        };
        onMounted(() => {
            querySelector();
        });
    },
});
//# sourceMappingURL=client.js.map