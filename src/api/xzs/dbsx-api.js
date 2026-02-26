import CloudService from "@/enums/CloudService.js";
import request from "@/utils/request";
import { downloadFileByBlob } from "@/utils/tools.js";
let baseUrl = CloudService.base;

const dbsxApi = {
  /**
   * 查询tab接口
   * @param params
   * @returns {Promise<*>}
   */
  loadTabDataService(params) {
    return request({
      url: `${baseUrl}/first/getDbSxTab`,
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
      url: `${baseUrl}/first/queryDbSx`,
      method: "post",
      data: params,
      showLoading: true,
    });
  },
  /**
   * 修改状态接口
   * @param params
   * @returns {Promise<*>}
   */
  editStatusDataService(params) {
    return request({
      url: `${baseUrl}/first/changeDbSx`,
      method: "post",
      data: params,
      showLoading: true,
    });
  },
  /**
   * 获取node节点
   * @param params
   * @returns {Promise<*>}
   */
  getNodeService(params) {
    return request({
      url: `${baseUrl}/first/queryJxdId`,
      method: "post",
      data: params,
      showLoading: true,
    });
  },

  /**
   * 获取node节点
   * @param params
   * @returns {Promise<*>}
   */
  changeDbSxService(params) {
    return request({
      url: `${baseUrl}/first/changeDbSxNew`,
      method: "post",
      data: params,
      showLoading: true,
    });
  },
};
export default dbsxApi;
