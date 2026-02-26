import CloudService from "@/enums/CloudService.js";
import request from "@/utils/request.js";
import { downloadFileByBlob } from "@/utils/tools.js";
let baseUrl = CloudService.base;

const ydfxApi = {
  /**
   * 查询表格接口
   * @param params
   * @returns {Promise<*>}
   */
  loadTableDataService(params) {
    return request({
      url: `${baseUrl}/fxyj/queryYdFxyj`,
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
      url: `${baseUrl}/fxyj/getYFxgkIsExist`,
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
      url: `${baseUrl}/fxyj/getYFxgk`,
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
      url: `${baseUrl}/fxyj/getYFxgkWord`,
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
      url: `${baseUrl}/fxyj/saveYdFxyjList`,
      method: "post",
      data: params,
      showLoading: true,
    });
  },
  /**
   * 保存Oms表格接口
   * @param params
   * @returns {Promise<*>}
   */
  saveOmsTableDataService(params) {
    return request({
      url: `${baseUrl}/fxyj/saveOMS`,
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
      url: `${baseUrl}/fxyj/initYdFxyj`,
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
      url: `${baseUrl}/fxyj/deleteYdFxyj`,
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
      url: `${baseUrl}/fxyj/download-ydfxyj-tpl`,
      method: "post",
      data: params,
      responseType: "blob",
      showLoading: true,
    }).then((res) => {
      downloadFileByBlob(res, "月度风险预警导入模板", "xlsx");
    });
  },
};
export default ydfxApi;
