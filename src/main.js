import { createApp } from "vue"; //必须在第一行，不然会报错isFunction is not a function
import "open-props/style";

import * as ElementPlusIconsVue from "@element-plus/icons-vue";
import ElementPlus, { ElMessage, ElMessageBox } from "element-plus";
import ElementTiptapPlugin from "element-tiptap";
import "element-plus/dist/index.css";
import "element-tiptap/lib/style.css";

import locale from "element-plus/dist/locale/zh-cn.mjs";
import XEUtils from "xe-utils";
// import addRouters from '@/utils/utils.js'
import VxeUI from "vxe-pc-ui";
import "vxe-pc-ui/lib/style.css";
import VxeUITable from "vxe-table";
import "vxe-table/lib/style.css";
import VxeUIPluginExportXLSX from "@vxe-ui/plugin-export-xlsx";
import VxeUIPluginValidator from "@vxe-ui/plugin-validator";
import VxeUIPluginRenderElement from "@vxe-ui/plugin-render-element";
import "@vxe-ui/plugin-render-element/dist/style.css";
import "./assets/css/index.scss";
import ExcelJS from "exceljs";
VxeUI.use(VxeUIPluginExportXLSX, { ExcelJS });
VxeUI.use(VxeUIPluginValidator);
VxeUI.use(VxeUIPluginRenderElement);
import VxeModal from "@/packages/index";
import App from "@/App.vue";
import router from "@/router";
import store from "@/store";
import "splitpanes/dist/splitpanes.css";
const app = createApp(App);
import VueKonva from "vue-konva";
import print from "vue3-print-nb";

import dayjs from "dayjs";
import "dayjs/locale/zh-cn";

dayjs.locale("zh-cn");
// import VConsole from 'vconsole';
// const vConsole = new VConsole({theme:"dark"})
// vxeTable的格式化
VxeUI.formats.mixin({
  ["formatterNumber"]: {
    cellFormatMethod({ cellValue }, digits = 2) {
      if (typeof cellValue == "number" || (cellValue && cellValue.trim())) {
        return XEUtils.commafy(XEUtils.toNumber(cellValue), {
          digits,
        }).toLocaleString();
      } else {
        return cellValue;
      }
    },
  },
  ["formatterDate"]: {
    cellFormatMethod({ cellValue }) {
      return XEUtils.toDateString(cellValue, "yyyy-MM-dd");
    },
  },
  ["formatterHm"]: {
    cellFormatMethod({ cellValue }) {
      return XEUtils.toDateString(cellValue, "yyyy-MM-dd HH:mm");
    },
  },
  ["formatterTime"]: {
    cellFormatMethod({ cellValue }) {
      return XEUtils.toDateString(cellValue, "yyyy-MM-dd HH:mm:ss");
    },
  },
});

for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
  app.component(key, component);
}
// app.component(
//     'UploadComponent',{UploadComponent}
// )
// // 菜单项多开
// app.config.globalProperties.addRouters = addRouters

app.provide("$message", ElMessage); //vue3組合式全局注冊方法
app.provide("$confirm", ElMessageBox.confirm); //vue3組合式全局注冊方法
app.config.globalProperties.$message = ElMessage; //vue选项式挂载实例
app.config.globalProperties.$confirm = ElMessageBox.confirm; //vue选项式挂载实例
app.use(store);
app.use(router);
app.use(ElementPlus, { locale }); //设置中文
app.use(ElementTiptapPlugin, { locale });
app.use(VxeUI);
app.use(VxeModal); //注册弹窗组件
app.use(VxeUITable);
app.use(print);
app.use(VueKonva);
import("../mock/mockProdServer.js").then(({ setupProdMockServer }) => {
  setupProdMockServer();
});
app.mount("#app");
// if(process.env.NODE_ENV === 'development'){//vue3-devtools生效
//     if('__VUE_DEVTOOLS_GLOBAL_HOOK__' in window){
//         window.__VUE_DEVTOOLS_GLOBAL_HOOK__.Vue = app;
//     }
// }
