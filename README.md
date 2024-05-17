# vuePress2.x 打字机效果插件

## 快速开始

### 使用`npm`安装

```bash
npm i vuepress-plugin-typedjs2 -D
```

### 开始使用和配置

> 使用方法

```js
// config.js/ts
// 导入插件
import vuepressPluginTypedjs2 from "vuepress-plugin-typedjs2";

// 配置参数
 plugins: [
    vuepressPluginTypedjs2({
      // 对应的标签选择器
      selector: '#typed',
      // 打字内容
      strings: ["总有一个功能会让你眼前一亮🎉 ^2000", "左下角可以播放音乐喵 ♪ 💕^2000"],
      typeSpeed: 60, // 打字速度
      backSpeed: 30, // 回退速度
      loop: true, // 循环
    }),
  ],
```

## 配置说明

> 本插件直接将typed.js封装了，可以使用 typed 的全部配置
> [typed](https://github.com/mattboldt/typed.js/#customization)

### 使用技巧

> 如果您需要暂停打字效果，请使用`^`+ 时间，就是在该地方停留多久，单位是毫秒


```js
{
    strings: ["Hello ^1000 world.", "The typed npm ^2000"]
}
```