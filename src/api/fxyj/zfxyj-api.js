import CloudService from "@/enums/CloudService.js";
import request from "@/utils/request.js";
import { downloadFileByBlob } from "@/utils/tools.js";
let baseUrl = CloudService.base;

const zfxApi = {
  /**
   * 查询表格接口
   * @param params
   * @returns {Promise<*>}
   */
  loadTableDataService(params) {
    return request({
      url: `${baseUrl}/fxyj/queryZFxyj`,
      method: "post",
      data: params,
      showLoading: true,
    });
  },

  /**
   * 查询管控情况是否有下周
   * @param params
   * @returns {Promise<*>}
   */
  getZFxgkIsExistService(params) {
    return request({
      url: `${baseUrl}/fxyj/getZFxgkIsExist`,
      method: "post",
      data: params,
      showLoading: true,
    });
  },

  /**
   * 查询管控情况下拉版本
   * @param params
   * @returns {Promise<*>}
   */
  getFxgkService(params) {
    return request({
      url: `${baseUrl}/fxyj/getFxgk`,
      method: "post",
      data: params,
      showLoading: true,
    });
  },

  /**
   * 查询管控情况接口
   * @param params
   * @returns {Promise<*>}
   */
  loadGkDataService(params) {
    return request({
      url: `${baseUrl}/fxyj/getZFxgk`,
      method: "post",
      data: params,
      showLoading: true,
    });
  },

  /**
   * 保存管控情况接口
   * @param params
   * @returns {Promise<*>}
   */
  saveGkDataService(params) {
    return request({
      url: `${baseUrl}/fxyj/getZFxgkWord`,
      method: "post",
      data: params,
      showLoading: true,
    });
  },

  /**
   * 查询日志接口
   * @param params
   * @returns {Promise<*>}
   */
  loadViewDialogService(params) {
    return request({
      url: `${baseUrl}/fxyj/fxyjLog`,
      method: "post",
      data: params,
      showLoading: true,
    });
  },
  /**
   * 保存表格接口
   * @param params
   * @returns {Promise<*>}
   */
  saveTableDataService(params) {
    return request({
      url: `${baseUrl}/fxyj/saveZFxyjList`,
      method: "post",
      data: params,
      showLoading: true,
    });
  },
  /**
   * 初始化表格接口
   * @param params
   * @returns {Promise<*>}
   */
  initTableDataService(params) {
    return request({
      url: `${baseUrl}/fxyj/initZFxyj`,
      method: "post",
      data: params,
      showLoading: true,
    });
  },
  /**
   * 删除接口
   * @param params
   * @returns {Promise<*>}
   */
  doDelTableDataService(params) {
    return request({
      url: `${baseUrl}/fxyj/deleteZFxyj`,
      method: "post",
      data: params,
      showLoading: true,
    });
  },
  /**
   * 下载文件流下载导入模版
   * @param params
   * @returns {Promise<*>}
   */
  downloadModuleService(params) {
    return request({
      url: `${baseUrl}/fxyj/download-zfxyj-tpl`,
      method: "post",
      data: params,
      responseType: "blob",
      showLoading: true,
    }).then((res) => {
      downloadFileByBlob(res, "周风险预警导入模板", "xlsx");
    });
  },
};
export default zfxApi;
