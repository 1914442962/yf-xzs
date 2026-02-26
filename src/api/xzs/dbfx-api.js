import CloudService from "@/enums/CloudService.js";
import request from "@/utils/request";
import {downloadFileByBlob} from "@/utils/tools.js";
let baseUrl = CloudService.base;

const dbfxApi = {

  /**
   * 查询echarts接口
   * @param params
   * @returns {Promise<*>}
   */
  loadEchartsDataService(params) {
    return request({
      url: `${baseUrl}/first/getDbTj`,
      method: "post",
      data: params,
      showLoading: true,
    });
  },
  /**
   * 查询tab接口
   * @param params
   * @returns {Promise<*>}
   */
  loadTabDataService(params) {
    return request({
      url: `${baseUrl}/first/getDbTab`,
      method: "post",
      data: params,
      showLoading: true,
    });
  },
  /**
   * 查询表格接口
   * @param params
   * @returns {Promise<*>}
   */
  loadTableDataService(params) {
    return request({
      url: `${baseUrl}/first/queryDb`,
      method: "post",
      data: params,
      showLoading: true,
    });
  },

}
export default dbfxApi;

