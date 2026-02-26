import CloudService from "@/enums/CloudService.js";
import request from "@/utils/request";
import { downloadFileByBlob } from "@/utils/tools.js";
let baseUrl = CloudService.base;

const drfxApi = {
  /**
   * 查询表格接口
   * @param params
   * @returns {Promise<*>}
   */
  loadTableDataService(params) {
    return request({
      url: `${baseUrl}/fxyj/queryDrTx`,
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
      url: `${baseUrl}/fxyj/saveDrTxList`,
      method: "post",
      data: params,
      showLoading: true,
    });
  },

  /**
   * 发送短信表格接口
   * @param params
   * @returns {Promise<*>}
   */
  doSendMessageService(params) {
    return request({
      url: `${baseUrl}/fxyj/sendMessage`,
      method: "post",
      data: params,
      showLoading: true,
    });
  },

  /**
   * 获取文件Id接口
   * @param params
   * @returns {Promise<*>}
   */
  getFileIdService(params) {
    return request({
      url: `${baseUrl}/fxyj/generate-word`,
      method: "post",
      data: params,
      showLoading: true,
    });
  },
  /**
   * 下载文件流导出
   * @param params
   * @param name
   * @returns {Promise<*>}
   */
  exportTableDataFileService(params, name) {
    return request({
      url: `${baseUrl}/fxyj/deleteById`,
      method: "post",
      data: params,
      responseType: "blob",
      showLoading: true,
    }).then((res) => {
      downloadFileByBlob(res, name, "xlsx");
    });
  },
  /**
   * 下载文件流下载导入模版
   * @param params
   * @returns {Promise<*>}
   */
  downloadModuleService(params) {
    return request({
      url: `${baseUrl}/fxyj/downLoadModule`,
      method: "post",
      data: params,
      responseType: "blob",
      showLoading: true,
    }).then((res) => {
      downloadFileByBlob(res, "导入模板", "xlsx");
    });
    // return doPost(`${baseUrl}/common/downLoadModule`, params,true,{responseType:'blob',showLoading:true});
  },
};
export default drfxApi;
