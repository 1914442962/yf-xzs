import CloudService from "@/enums/CloudService.js";
import request from "@/utils/request";
import {downloadFileByBlob} from "@/utils/tools.js";
let baseUrl = CloudService.base;

const zymmApi = {
  /**
   * 查询表格接口
   * @param params
   * @returns {Promise<*>}
   */
  loadTableDataService(params) {
    return request({
      url: `${baseUrl}/sbqd/zyMmcc`,
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
  doSyncTableDataService(params) {
    return request({
      url: `${baseUrl}/sbqd/initZyMmcc`,
      method: "get",
      data: params,
      showLoading: true,
    });
  },

}
export default zymmApi;

