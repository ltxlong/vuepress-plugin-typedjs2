import { defineClientConfig } from "@vuepress/client";
import { onMounted, onUnmounted } from "vue";
import { useRouter } from "vue-router";
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
        const router = useRouter();
        let options = deserializeFunctions(TYPED_OPTIONS);
        let timerId = null;
        let retryCount = 0;
        let typedInstance = null;
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
        const destroyTyped = () => {
            if (typedInstance) {
                typedInstance.destroy();
                typedInstance = null;
            }
        };
        const resetRetryCount = () => {
            retryCount = 0;
        };
        const initializeTyped = () => {
            const elements = document.querySelectorAll(options.selector);
            if (elements.length > 0) {
                clearTimer();
                destroyTyped();
                typedInstance = new Typed(options.selector, options);
            }
            else if (retryCount < MAX_RETRIES) {
                retryCount++;
                timerId = setTimeout(initializeTyped, 200);
            }
            else {
                console.error('Typed.js: No element found with selector "' + options.selector + '".');
            }
        };
        const shouldInitialize = (path) => {
            // 如果没有配置白名单，则所有页面都生效
            if (!options.withePathList || !Array.isArray(options.withePathList) || options.withePathList.length === 0) {
                return true;
            }
            // 移除路径中的文件后缀（如 .html, .md 等）
            const normalizedPath = path.replace(/\.[^/.]+$/, '');
            // 检查当前路径是否在白名单中
            return options.withePathList.some(whitePath => {
                // 支持完整匹配和通配符 * 匹配
                if (whitePath === '*')
                    return true;
                // 移除白名单路径中的文件后缀
                const normalizedWhitePath = whitePath.replace(/\.[^/.]+$/, '');
                if (normalizedWhitePath.endsWith('*')) {
                    const prefix = normalizedWhitePath.slice(0, -1);
                    return normalizedPath.startsWith(prefix);
                }
                return normalizedPath === normalizedWhitePath;
            });
        };
        const handleRouteChange = (to) => {
            if (!shouldInitialize(to.path)) {
                clearTimer();
                destroyTyped();
                return;
            }
            resetRetryCount();
            // 给DOM一点时间来更新
            setTimeout(() => {
                initializeTyped();
            }, 100);
        };
        // 监听路由变化
        router.afterEach((to) => {
            handleRouteChange(to);
        });
        onMounted(() => {
            if (shouldInitialize(router.currentRoute.value.path)) {
                initializeTyped();
            }
        });
        onUnmounted(() => {
            clearTimer();
            destroyTyped();
        });
    },
});
//# sourceMappingURL=client.js.map