process.env.VUE_APP_NAME = require("./package").name;
process.env.VUE_APP_VERSION = require("./package.json").version;
process.env.VUE_APP_TITLE = require("./package").title;
import { defineConfig } from "vite";
import legacy from "@vitejs/plugin-legacy";
import vue from "@vitejs/plugin-vue";
import vueJsxPlugin from "@vitejs/plugin-vue-jsx";
import zipPack from "vite-plugin-zip-pack";
import vitePluginVueDevtools from "vite-plugin-vue-devtools";
import vitePluginImageTools from "vite-plugin-image-tools";
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

    //自动打包压缩插件配置
    zipPack({
      inDir: "dist",
      outDir: "archive",
      outFileName: `${process.env.VUE_APP_NAME} ${process.env.VUE_APP_VERSION}.zip`,
    }),

    //打包压缩图片并转成webp格式组件，还有一个是vite-plugin-images-format 1.0.4
    vitePluginImageTools({
      quality: 85,
      enableWebp: true,
      // includes: /\.(png|jpe?g|gif|tiff|bmp)$/i
      includes: /\.(png|jpe?g|tiff|bmp)$/i, //gif压缩后动不了
      webpConfig: {
        limitSize: 51200, //超过50KB才转化成webp
        deleteOriginImg: true, //在转化后删除源图片
      },
    }),
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
      mockPath: "./mock", //模拟数据文件夹路径
      enable: false,
      logger: true, //控制台显示请求日志,默认为true
    }),
  ],
  /**
   * 在生产中服务时的基本公共路径。
   * @default '/'
   */
  base: "./",
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
