import CloudService from "@/enums/CloudService.js";
import request from "@/utils/request.js";
import {downloadFileByBlob} from "@/utils/tools.js";
let baseUrl = CloudService.base;

const mmccApi = {
  /**
   * 查询表格接口
   * @param params
   * @returns {Promise<*>}
   */
  loadTableDataService(params) {
    return request({
      url: `${baseUrl}/sbqd/mmcc`,
      method: "post",
      data: params,
      showLoading: true,
    });
  },
}
export default mmccApi;

