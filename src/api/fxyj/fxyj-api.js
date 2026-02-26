import CloudService from "@/enums/CloudService.js";
import request from "@/utils/request";
import { downloadFileByBlob } from "@/utils/tools.js";
let baseUrl = CloudService.base;

const fxyjApi = {
  /**
   * 查询表格接口
   * @param params
   * @returns {Promise<*>}
   */
  loadTableDataService(params) {
    return request({
      url: `${baseUrl}/fxyj/queryRFxyjZxz`,
      method: "post",
      data: params,
      showLoading: true,
    });
  },
  /**
   * 发送短信接口
   * @param params
   * @returns {Promise<*>}
   */
  doSendMessageService(params) {
    return request({
      url: `${baseUrl}/fxyj/sendMessageRFxyj`,
      method: "post",
      data: params,
      showLoading: true,
    });
  },

  /**
   * 推送至年度风险接口
   * @param params
   * @returns {Promise<*>}
   */
  initZxzToNFxyjService(params) {
    return request({
      url: `${baseUrl}/fxyj/initZxzToNFxyj`,
      method: "post",
      data: params,
    });
  },
};
export default fxyjApi;
