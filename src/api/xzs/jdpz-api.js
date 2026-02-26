import CloudService from "@/enums/CloudService.js";
import request from "@/utils/request";
import { downloadFileByBlob } from "@/utils/tools.js";
let baseUrl = CloudService.base;

const jdpzApi = {
  /**
   * 查询表格接口
   * @param params
   * @returns {Promise<*>}
   */
  loadTableDataService(params) {
    return request({
      url: `${baseUrl}/public/queyLcpz`,
      method: "post",
      data: params,
      showLoading: true,
    });
  },
  loadJdDataService(params) {
    return request({
      url: `${baseUrl}/public/queyLcpzFirst`,
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
      url: `${baseUrl}/public/saveLcpzList`,
      method: "post",
      data: params,
      showLoading: true,
    });
  },
  /**
   * 保存模块接口
   * @param params
   * @returns {Promise<*>}
   */
  saveMkDataService(params) {
    return request({
      url: `${baseUrl}/public/saveLcpzMk`,
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
      url: `${baseUrl}/public/deleteLcpz`,
      method: "post",
      data: params,
      showLoading: true,
    });
  },
  doDelMkDataService(params) {
    return request({
      url: `${baseUrl}/public/deleteLcpzMk`,
      method: "post",
      data: params,
      showLoading: true,
    });
  },
};
export default jdpzApi;
