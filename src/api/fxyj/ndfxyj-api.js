import CloudService from "@/enums/CloudService.js";
import request from "@/utils/request.js";
import { downloadFileByBlob } from "@/utils/tools.js";
let baseUrl = CloudService.base;

const ndfxApi = {
  /**
   * 查询表格接口
   * @param params
   * @returns {Promise<*>}
   */
  loadTableDataService(params) {
    return request({
      url: `${baseUrl}/fxyj/queryNdFxyj`,
      method: "post",
      data: params,
      showLoading: true,
    });
  },
  /**
   * 查询日志接口
   * @param params
   * @returns {Promise<*>}
   */
  loadViewDialogService(params) {
    return request({
      url: `${baseUrl}/fxyj/fxyjLog`,
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
      url: `${baseUrl}/fxyj/saveNdFxyjList`,
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
      url: `${baseUrl}/fxyj/deleteNdFxyj`,
      method: "post",
      data: params,
      showLoading: true,
    });
  },
  /**
   * 下载文件流下载导入模版
   * @param params
   * @returns {Promise<*>}
   */
  downloadModuleService(params) {
    return request({
      url: `${baseUrl}/fxyj/download-ndfxyj-tpl`,
      method: "post",
      data: params,
      responseType: "blob",
      showLoading: true,
    }).then((res) => {
      downloadFileByBlob(res, "年度风险预警导入模板", "xlsx");
    });
  },
};
export default ndfxApi;
