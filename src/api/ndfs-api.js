import CloudService from "@/enums/CloudService.js";
import request from "@/utils/request";
import {downloadFileByBlob} from "@/utils/tools.js";
let baseUrl = CloudService.base;

const ndfsApi = {
  /**
   * 查询表格接口
   * @param params
   * @returns {Promise<*>}
   */
  loadDwgmDataService(params) {
    return request({
      url: `${baseUrl}/ndfs/queryDwgm`,
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
  loadFhqkDataService(params) {
    return request({
      url: `${baseUrl}/ndfs/queryFhqk`,
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
  loadZbzczDataService(params) {
    return request({
      url: `${baseUrl}/ndfs/queryZbzcz`,
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
  loadDmxeDataService(params) {
    return request({
      url: `${baseUrl}/ndfs/queryDmxe`,
      method: "post",
      data: params,
      showLoading: true,
    });
  },
}
export default ndfsApi;

