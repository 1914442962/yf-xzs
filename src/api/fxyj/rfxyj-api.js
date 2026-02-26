import CloudService from "@/enums/CloudService.js";
import request from "@/utils/request.js";
import { downloadFileByBlob } from "@/utils/tools.js";
let baseUrl = CloudService.base;

const rfxApi = {
  /**
   * 查询表格接口
   * @param params
   * @returns {Promise<*>}
   */
  loadTableDataService(params) {
    return request({
      url: `${baseUrl}/fxyj/queryRFxyj`,
      method: "post",
      data: params,
      showLoading: true,
    });
  },
  loadTableDataService1(params) {
    return request({
      url: `${baseUrl}/fxyj/queryRFxyjCgx`,
      method: "post",
      data: params,
      showLoading: true,
    });
  },
  loadTableDataService2(params) {
    return request({
      url: `${baseUrl}/fxyj/queryRFxyjLs`,
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
      url: `${baseUrl}/fxyj/saveRFxyjList`,
      method: "post",
      data: params,
      showLoading: true,
    });
  },

  /**
   * 推送表格接口
   * @param params
   * @returns {Promise<*>}
   */
  pushTableDataService(params) {
    return request({
      url: `${baseUrl}/fxyj/updateCgx`,
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
      url: `${baseUrl}/fxyj/initRFxyj`,
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
      url: `${baseUrl}/fxyj/deleteRFxyj`,
      method: "post",
      data: params,
      showLoading: true,
    });
  },
  /**
   * 获取通知书接口
   * @param params
   * @returns {Promise<*>}
   */
  getTzsDataService(params) {
    return request({
      url: `${baseUrl}/fxyj/getTzs`,
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
      url: `${baseUrl}/fxyj/download-ZFxyj-tpl`,
      method: "post",
      data: params,
      responseType: "blob",
      showLoading: true,
    }).then((res) => {
      downloadFileByBlob(res, "日风险预警导入模板", "xlsx");
    });
  },

  /**
   * 查询表格接口
   * @param params
   * @returns {Promise<*>}
   */
  loadRfxTableDataService(params) {
    return request({
      url: `${baseUrl}/fxyj/queryRFxyj`,
      method: "post",
      data: params,
      showLoading: true,
    });
  },
  /**
   * 提取表格接口
   * @param params
   * @returns {Promise<*>}
   */
  doTqDataService(params) {
    return request({
      url: `${baseUrl}/fxyj/initRFxyj`,
      method: "post",
      data: params,
      showLoading: true,
    });
  },
};
export default rfxApi;
