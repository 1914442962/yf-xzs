import CloudService from "@/enums/CloudService.js";
import request from "@/utils/request";
import {downloadFileByBlob} from "@/utils/tools.js";
let baseUrl = CloudService.base;

const grzysxApi = {
  /**
   * 查询表格接口
   * @param params
   * @returns {Promise<*>}
   */
  loadTableDataService(params) {
    return request({
      url: `${baseUrl}/zysx/queryZysx`,
      method: "post",
      data: params,
      showLoading: true,
    });
  },
  /**
   * 发送代办接口
   * @param params
   * @returns {Promise<*>}
   */
  sendDataService(params) {
    return request({
      url: `${baseUrl}/zysx/sendDb`,
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
      url: `${baseUrl}/zysx/saveXysx`,
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
      url: `${baseUrl}/zysx/deleteXysx`,
      method: "post",
      data: params,
      showLoading: true,
    });
  },
}
export default grzysxApi;

