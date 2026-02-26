import CloudService from "@/enums/CloudService.js";
import request from "@/utils/request";
import {downloadFileByBlob} from "@/utils/tools.js";
let baseUrl = CloudService.base;

const zydlkhmdApi = {
  /**
   * 查询表格接口
   * @param params
   * @returns {Promise<*>}
   */
  loadTableDataService(params) {
    return request({
      url: `${baseUrl}/khmd/getPageData`,
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
      url: `${baseUrl}/khmd/getVersion`,
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
      url: `${baseUrl}/khmd/save`,
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
      url: `${baseUrl}/khmd/delete`,
      method: "post",
      data: params,
      showLoading: true,
    });
  },
}
export default zydlkhmdApi;

