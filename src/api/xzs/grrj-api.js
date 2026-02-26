import CloudService from "@/enums/CloudService.js";
import request from "@/utils/request";
import {downloadFileByBlob} from "@/utils/tools.js";
let baseUrl = CloudService.base;

const grrjApi = {

  /**
   * 加入接口
   * @param params
   * @returns {Promise<*>}
   */
  addDataService(params) {
    return request({
      url: `${baseUrl}/first/saveGrrj`,
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
  deleteDataService(params) {
    return request({
      url: `${baseUrl}/first/deleteGrrj`,
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
      url: `${baseUrl}/first/getGrrjTab`,
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
      url: `${baseUrl}/first/queryGrrj`,
      method: "post",
      data: params,
      showLoading: true,
    });
  },

}
export default grrjApi;

