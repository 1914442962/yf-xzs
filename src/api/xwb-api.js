import CloudService from "@/enums/CloudService.js";
import request from "@/utils/request";
import { downloadFileByBlob } from "@/utils/tools.js";
let baseUrl = CloudService.base;

const xwbApi = {
  /**
   * 查询表格接口
   * @param params
   * @returns {Promise<*>}
   */
  loadTableDataService(params) {
    return request({
      url: `${baseUrl}/xwb/queryXwb`,
      method: "post",
      data: params,
      showLoading: true,
    });
  },

  loadDataService(year) {
    return request({
      url: `${baseUrl}/xwb/getZfh?year=${year}`,
      method: "get",
      showLoading: false,
    });
  },
  /**
   * 获取D5000变电站下拉
   */
  getD5000BdzService(params) {
    return request({
      url: `${baseUrl}/xwb/getStation`,
      method: "post",
      data: params,
      showLoading: true,
    });
  },
  /**
   * 获取拉路开关线路信息
   */
  getLlkgInfoService(params) {
    return request({
      url: `${baseUrl}/xwb/llkgInfo`,
      method: "post",
      data: params,
    });
  },

  /**
   * 查询日志接口
   * @param params
   * @returns {Promise<*>}
   */
  loadViewDialogService(params) {
    return request({
      url: `${baseUrl}/xwb/xwbLog`,
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
      url: `${baseUrl}/xwb/saveXwb`,
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
      url: `${baseUrl}/xwb/deleteXwb`,
      method: "post",
      data: params,
      showLoading: true,
    });
  },
  /**
   * 同步接口
   * @param params
   * @returns {Promise<*>}
   */
  doSyncDataService(params) {
    return request({
      url: `${baseUrl}/xwb/tbXwb`,
      method: "get",
      showLoading: true,
    });
  },

  /**
   * 生成接口
   * @param params
   * @returns {Promise<*>}
   */
  doScDataService(params) {
    return request({
      url: `${baseUrl}/xwb/xwbGenerate`,
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
      url: `${baseUrl}/xwb/download-xwb-tpl`,
      method: "post",
      data: params,
      responseType: "blob",
      showLoading: true,
    }).then((res) => {
      downloadFileByBlob(res, "序位表导入模板", "xlsx");
    });
  },
};
export default xwbApi;
