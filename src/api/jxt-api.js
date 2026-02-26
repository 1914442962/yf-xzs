import CloudService from "@/enums/CloudService.js";
import request from "@/utils/request";
import { downloadFileByBlob } from "@/utils/tools.js";
let baseUrl = CloudService.base;

const jxtApi = {
  /**
   * 查询表格接口
   * @param params
   * @returns {Promise<*>}
   */
  loadTableDataService(params) {
    return request({
      url: `${baseUrl}/xwb/queryLlt`,
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
      url: `${baseUrl}/xwb/saveLlt`,
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
      url: `${baseUrl}/xwb/deleteLlt`,
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
      url: `${baseUrl}/xwb/lltLog`,
      method: "post",
      data: params,
      showLoading: true,
    });
  },
};

export default jxtApi;
