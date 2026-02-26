import CloudService from "@/enums/CloudService.js";
import request from "@/utils/request";
import { downloadFileByBlob } from "@/utils/tools.js";
let baseUrl = CloudService.base;

const xlsbdsbgxdwApi = {
  /**
   * 查询表格接口
   * @param params
   * @returns {Promise<*>}
   */
  loadTableDataService(params) {
    return request({
      url: `${baseUrl}/sbdGx/getPageData`,
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
      url: `${baseUrl}/sbdGx/getVersion`,
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
      url: `${baseUrl}/sbdGx/save`,
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
      url: `${baseUrl}/sbdGx/delete`,
      method: "post",
      data: params,
      showLoading: true,
    });
  },
};
export default xlsbdsbgxdwApi;
