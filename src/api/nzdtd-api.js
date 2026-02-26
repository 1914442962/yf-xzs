import CloudService from "@/enums/CloudService.js";
import request from "@/utils/request";
import {downloadFileByBlob} from "@/utils/tools.js";
let baseUrl = CloudService.base;

const nzdtdApi = {
  /**
   * 查询表格接口
   * @param params
   * @returns {Promise<*>}
   */
  loadTableDataService(params) {
    return request({
      url: `${baseUrl}/jxjh/ndjxZdtd`,
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
      url: `${baseUrl}/jxjh/saveNdjxZdtd`,
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
      url: `${baseUrl}/jxjh/deleteNdjxZdtd`,
      method: "post",
      data: params,
      showLoading: true,
    });
  },
  /**
   * 从年计划中抽取
   * @param params
   * @returns {Promise<*>}
   */
  importDataService(params) {
    return request({
      url: `${baseUrl}/jxjh/initNdjxZdtd`,
      method: "post",
      data: params,
      showLoading: true,
    });
  },
  /**
   * 生成风险预警
   * @param params
   * @returns {Promise<*>}
   */
  createFxyjDataService(params) {
    return request({
      url: `${baseUrl}/jxjh/sgNdFxyj`,
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
  exportTableDataFileService(params,name) {
    return request({
      url: `${baseUrl}/common/deleteById`,
      method: "post",
      data: params,
      responseType: "blob",
      showLoading: true,
    }).then(res => {
      downloadFileByBlob(res, name, 'xlsx')
    });
  },
  /**
   * 下载文件流下载导入模版
   * @param params
   * @returns {Promise<*>}
   */
  downloadModuleService(params) {
    return request({
      url: `${baseUrl}/common/downLoadModule`,
      method: "post",
      data: params,
      responseType: "blob",
      showLoading: true,
    }).then(res => {
      downloadFileByBlob(res, '导入模板', 'xlsx')
    });
    // return doPost(`${baseUrl}/common/downLoadModule`, params,true,{responseType:'blob',showLoading:true});
  }
}
export default nzdtdApi;

