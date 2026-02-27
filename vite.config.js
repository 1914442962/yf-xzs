process.env.VUE_APP_NAME = require("./package").name;
process.env.VUE_APP_VERSION = require("./package.json").version;
process.env.VUE_APP_TITLE = require("./package").title;
import { defineConfig } from "vite";
import legacy from "@vitejs/plugin-legacy";
import vue from "@vitejs/plugin-vue";
import vueJsxPlugin from "@vitejs/plugin-vue-jsx";
import vitePluginVueDevtools from "vite-plugin-vue-devtools";
import path from "path";
import { viteMockServe } from "vite-plugin-mock";
function resolve(dir) {
  return path.join(__dirname, dir); //path.join(__dirname)设置绝对路径
}
// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    vue(),
    vueJsxPlugin(),
    legacy({
      targets: ["defaults", "chrome 52"],
      additionalLegacyPolyfills: [
        "regenerator-runtime/runtime",
        "core-js/features/promise",
        "core-js/features/array/find",
        "core-js/features/object/assign",
      ],
      corejs: {
        version: 3,
        proposal: false,
      },
      external: ["core-js", "regenerator-runtime"],
    }),
    vitePluginVueDevtools(),
    viteMockServe({
      mockPath: "./mock/", //mock文件地址
      enabled: true, // 开发打包开关
    }),
  ],
  /**
   * 在生产中服务时的基本公共路径。
   * @default '/'
   */
  base: "/yf-xzs/",
  define: {
    "process.env": process.env,
  },
  //  构建
  build: {
    outDir: "dist", //指定打包输出路径
    cssCodeSplit: false, //css代码拆分,禁用则所有样式保存在一个css里面
    sourcemap: false, //是否构建source map 文件
    target: ["es2015", "chrome52"],
    minify: "terser",
    rollupOptions: {
      output: {
        manualChunks: {
          polyfill: ["core-js", "regenerator-runtime"],
        },
      },
    },
  },

  // 别名
  resolve: {
    extensions: [".js", ".json", ".vue"],
    alias: {
      "@": resolve("src"),
    },
  },
  // 本地服务-
  server: {
    host: "192.168.4.189",
    port: 9096, // 端口号
    open: false, // 是否自动在浏览器打开
    https: false, // 是否开启 https
    hmr: true,
    // 跨域代理配置
    proxy: {
      "/yfxzs": {
        target: "http://192.168.1.194:9501/", //服务器
        changeOrigin: true,
      },
    },
  },
  //解决sass警告 The legacy JS API is deprecated and will be removed in Dart Sass 2.0.0.
  css: {
    preprocessorOptions: {
      scss: {
        api: "modern-compiler",
      },
    },
  },
});
