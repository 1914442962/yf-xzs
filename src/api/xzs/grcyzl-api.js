import CloudService from "@/enums/CloudService.js";
import request from "@/utils/request";
import {downloadFileByBlob} from "@/utils/tools.js";
let baseUrl = CloudService.base;

const grcyzlApi = {
  /**
   * 查询表格接口
   * @param params
   * @returns {Promise<*>}
   */
  loadExcelDataService(params) {
    return request({
      url: `${baseUrl}/first/queryFileByGrzl`,
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
      url: `${baseUrl}/first/download-file-by-id`,
      method: "post",
      data: params,
      showLoading: true,
    });
  },
  /**
   * 通过参数获取导出id
   * @param params
   * @returns {Promise<*>}
   */
  exportGetIdByParamsService(params) {
    return request({
      url: `${baseUrl}/first/prepare-export-data`,
      method: "post",
      data: params,
      showLoading: true,
    });
  },

}
export default grcyzlApi;

