import CloudService from "@/enums/CloudService.js";
import request from "@/utils/request";
import {downloadFileByBlob} from "@/utils/tools.js";
let baseUrl = CloudService.base;

const ycftdApi = {
  /**
   * 查询表格接口
   * @param params
   * @returns {Promise<*>}
   */
  loadTableDataService(params) {
    return request({
      url: `${baseUrl}/jxjh/ydjxCftd`,
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
      url: `${baseUrl}/jxjh/saveYdjxCftd`,
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
      url: `${baseUrl}/jxjh/deleteYdjxCftd`,
      method: "post",
      data: params,
      showLoading: true,
    });
  },
  /**
   * 从年计划中抽取
   * @param params
   * @returns {Promise<*>}
   */
  importDataService(params) {
    return request({
      url: `${baseUrl}/jxjh/initYdjxCftd`,
      method: "post",
      data: params,
      showLoading: true,
    });
  },
  /**
   * 生成风险预警
   * @param params
   * @returns {Promise<*>}
   */
  createFxyjDataService(params) {
    return request({
      url: `${baseUrl}/jxjh/sgYdFxyj`,
      method: "post",
      data: params,
      showLoading: true,
    });
  },

}
export default ycftdApi;

