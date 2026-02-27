import axios from "axios";
import { ElLoading, ElMessage } from "element-plus";
import CookiesUtil from "./cookies.utils";
import store from "@/store";
import { TOKEN_KEY } from "@/enums/CacheEnum.js";
import { ResultEnum } from "@/enums/ResultEnum.js";
// 创建 axios 实例
const service = axios.create({
  baseURL: "/yfxzs",
  timeout: 50 * 1000,
  // headers: { "Content-Type": "application/json;charset=utf-8" },//注释掉不然上传文件不生效
});
let loadingInstance = {
  close() {},
};

// 请求拦截器
service.interceptors.request.use(
  (config) => {
    const accessToken = CookiesUtil.get(TOKEN_KEY);
    if (accessToken) {
      config.headers.Authorization = accessToken;
    }
    if (config.showLoading) {
      loadingInstance = ElLoading.service({
        target: window.document.body,
        text: config.loadingText,
        lock: true,
      });
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  },
);

// 响应拦截器
service.interceptors.response.use(
  (response) => {
    setTimeout(() => {
      loadingInstance.close();
    }, 300);

    // 检查配置的响应类型是否为二进制类型（'blob' 或 'arraybuffer'）, 如果是，直接返回响应对象
    if (
      response.config.responseType === "blob" ||
      response.config.responseType === "arraybuffer"
    ) {
      return Promise.resolve(response.data);
    }
    const { code, data, msg } = response.data;
    if (code === ResultEnum.SUCCESS) {
      return Promise.resolve(response.data);
    }
    if (code === ResultEnum.TOKEN_INVALID) {
      ElMessage({
        title: "提示",
        message: "您的会话已过期，请重新登录",
        type: "error",
      });
      store.dispatch("clearState").then(() => {
        location.reload();
      });
    } else {
      ElMessage.error(msg || "系统错误");
    }
    return Promise.reject(msg || "系统错误");
  },
  (error) => {
    setTimeout(() => {
      loadingInstance.close();
    }, 300);
    // 异常处理
    if (error.response.data) {
      const { code, msg } = error.response.data;
      if (code === ResultEnum.TOKEN_INVALID) {
        ElMessage({
          title: "提示",
          message: "您的会话已过期，请重新登录",
          type: "error",
        });
        store.dispatch("clearState").then(() => {
          location.reload();
        });
      } else {
        ElMessage.error(msg || "系统错误");
      }
    }
    return Promise.reject(error.message);
  },
);

// 导出 axios 实例
export default service;
