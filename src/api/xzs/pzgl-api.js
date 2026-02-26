import CloudService from "@/enums/CloudService.js";
import request from "@/utils/request";
import { downloadFileByBlob } from "@/utils/tools.js";
let baseUrl = CloudService.base;
const pzglApi = {
  /**
   * 查询数据接口
   * @param params
   * @returns {Promise<*>}
   */
  loadDataService(params) {
    return request({
      url: `${baseUrl}/first/queryAllFst`,
      method: "post",
      data: params,
      showLoading: true,
    });
  },
  /**
   * 查询变电站图数据接口
   * @param params
   * @returns {Promise<*>}
   */
  seletNormalDiagramList(params) {
    return request({
      url: `${baseUrl}/NormalDiagramController/seletNormalDiagramList`,
      method: "post",
      data: params,
      showLoading: true,
    });
  },
  queryInitFstService(params) {
    return request({
      url: `${baseUrl}/first/queryInitFst`,
      method: "post",
      data: params,
      showLoading: true,
    });
  },
  saveDataService(params) {
    return request({
      url: `${baseUrl}/first/saveFst`,
      method: "post",
      data: params,
      showLoading: true,
    });
  },
  setCurrentService(params) {
    return request({
      url: `${baseUrl}/first/changeFst`,
      method: "post",
      data: params,
      showLoading: true,
    });
  },
};
export default pzglApi;
