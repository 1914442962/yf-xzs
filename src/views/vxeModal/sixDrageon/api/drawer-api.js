import CloudService from "@/enums/CloudService.js";
import request from "@/utils/request";
import {downloadFileByBlob} from "@/utils/tools.js";
let baseUrl = CloudService.base;

const drawApi = {
  /**
   * 查询表格接口
   * @param params
   * @returns {Promise<*>}
   */
  loadJsonDataService(params) {
    return request({
      url: `${baseUrl}/xwb/getDwyxdt`,
      method: "post",
      data: params,
      showLoading: true,
    });
  },
  /**
   * 保存节点接口
   * @param params
   * @returns {Promise<*>}
   */
  saveJsonDataService1(params) {
    return request({
      url: `${baseUrl}/xwb/addOrUpdateDwyxdt`,
      method: "post",
      data: params,
      showLoading: true,
    });
  },
  /**
   * 保存线路接口
   * @param params
   * @returns {Promise<*>}
   */
  saveJsonDataService2(params) {
    return request({
      url: `${baseUrl}/xwb/addOrUpdateDwyxdtxl`,
      method: "post",
      data: params,
      showLoading: true,
    });
  },
}
export default drawApi;

