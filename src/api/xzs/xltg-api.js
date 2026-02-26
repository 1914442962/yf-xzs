import CloudService from "@/enums/CloudService.js";
import request from "@/utils/request";
import {downloadFileByBlob} from "@/utils/tools.js";
let baseUrl = CloudService.base;

const xltgApi = {
  /**
   * 查询表格接口
   * @param params
   * @returns {Promise<*>}
   */
  loadTableDataService(params) {
    return request({
      url: `${baseUrl}/xltg/getPageData`,
      method: "post",
      data: params,
      showLoading: true,
    });
  },
  /**
   * 查询版本号接口
   * @param params
   * @returns {Promise<*>}
   */
  loadVersionDataService(params) {
    return request({
      url: `${baseUrl}/xltg/getVersion`,
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
      url: `${baseUrl}/xltg/save`,
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
      url: `${baseUrl}/xltg/delete`,
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
  loadDialogDataService(params) {
    return request({
      url: `${baseUrl}/first/queryCyzlLog`,
      method: "post",
      data: params,
      showLoading: true,
    });
  },
  saveDialogDataService(params,url) {
    return request({
      url: `${baseUrl}${url}`,
      method: "post",
      data: params,
      showLoading: true,
    });
  },
}
export default xltgApi;

