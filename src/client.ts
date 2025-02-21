import { defineClientConfig } from "@vuepress/client";
import { onMounted, onUnmounted } from "vue";
import { useRouter } from "vue-router";
import Typed from "typed.js";

declare const TYPED_OPTIONS: any;

const deserializeFunctions = (options: any) : any => {
  const deserialized = {};

  for (const key in options) {
    if (key.endsWith("FuncStr")) {
      deserialized[key.slice(0, -7)] = new Function("return " + options[key])();
    } else {
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
      } else if (retryCount < MAX_RETRIES) {
        retryCount++;
        timerId = setTimeout(initializeTyped, 200);
      } else {
        console.error(
          'Typed.js: No element found with selector "' + options.selector + '".'
        );
      }
    };

    const handleRouteChange = (to) => {
      if (to.path === '/') {
        resetRetryCount();
        // 给DOM一点时间来更新
        setTimeout(() => {
          initializeTyped();
        }, 100);
      } else {
        clearTimer();
        destroyTyped();
      }
    };

    // 监听路由变化
    router.afterEach((to) => {
      handleRouteChange(to);
    });

    onMounted(() => {
      if (router.currentRoute.value.path === '/') {
        initializeTyped();
      }
    });

    onUnmounted(() => {
      clearTimer();
      destroyTyped();
    });
  },
});
