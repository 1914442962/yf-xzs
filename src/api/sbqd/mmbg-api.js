import CloudService from "@/enums/CloudService.js";
import request from "@/utils/request";
import { downloadFileByBlob } from "@/utils/tools.js";

let baseUrl = CloudService.base;

const mmbgApi = {
  /**
   * 查询树接口
   * @param params
   * @returns {Promise<*>}
   */
  loadTreeDataService(params) {
    return request({
      url: `${baseUrl}/api/tzbgd/getMenuTree`,
      method: "get",
      showLoading: true,
    });
  },

  /**
   * 查询按钮接口
   * @param params
   * @returns {Promise<*>}
   */
  loadButtonDataService(params) {
    return request({
      url: `${baseUrl}/sbqd/queryButtons`,
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
      url: `${baseUrl}/api/tzbgd/node`,
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
      url: `${baseUrl}/api/tzbgd/submit`,
      method: "post",
      data: params,
      showLoading: true,
    });
  },

  /**
   * 获取权限接口
   * @param params
   * @returns {Promise<*>}
   */
  getTableConfigService(params) {
    return new Promise((resolve, reject) => {
      if (
        params.node.name.includes("已") &&
        params.node.parentName === "相关查询"
      ) {
        resolve({
          data: {
            enabledField: "",
          },
        });
      } else {
        if (params.node.name.includes("编制")) {
          resolve({
            data: {
              enabledField: "xmmc,gznr,yjtysj,bzr,fileList",
            },
          });
        } else {
          resolve({
            data: {
              enabledField: "",
            },
          });
        }
      }
    });
    // return request({
    //     url: `${baseUrl}/sbqd/queryConfigNodeById`,
    //     method: "post",
    //     data: params,
    //     showLoading: true,
    // });
  },

  /**
   * 获取详情
   * @returns {Promise<*>}
   * @param id
   * @param type
   */
  getDetailDataService(id, type) {
    return request({
      url: `${baseUrl}/api/tzbgd/getInfo?id=${id}&type=${type}`,
      method: "get",
      showLoading: true,
    });
  },

  /**
   * 发送接口
   * @param params
   * @returns {Promise<*>}
   */
  doOperateService(params) {
    return request({
      url: `${baseUrl}/api/tzbgd/audit`,
      method: "post",
      data: params,
      showLoading: true,
    });
  },
  /**
   * 删除接口
   * @returns {Promise<*>}
   * @param id
   */
  doDelTableDataService(id) {
    return request({
      url: `${baseUrl}/api/tzbgd/deleteTzbgd?id=${id}`,
      method: "get",
      showLoading: true,
    });
  },
  /**
   * 查看日志接口
   * @returns {Promise<*>}
   * @param id
   */
  loadDialogDataService(id) {
    return request({
      url: `${baseUrl}/api/tzbgd/getLogInfo?id=${id}`,
      method: "get",
      showLoading: true,
    });
  },

  /**
   * 查看流程图接口
   * @param params
   * @returns {Promise<*>}
   */
  loadFlowDataService(params) {
    return request({
      url: `${baseUrl}/sbqd/getLct`,
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
      url: `${baseUrl}/common/deleteById`,
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
      url: `${baseUrl}/common/downLoadModule`,
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
export default mmbgApi;
