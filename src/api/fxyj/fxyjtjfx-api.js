import CloudService from "@/enums/CloudService.js";
import request from "@/utils/request";
import { downloadFileByBlob } from "@/utils/tools.js";
let baseUrl = CloudService.base;

const fxyjtjfx = {
  /**
   * 查询表格接口
   * @param params
   * @returns {Promise<*>}
   */
  loadTableDataService(params) {
    return request({
      url: `${baseUrl}/fxyj/getFxyjTj`,
      method: "post",
      data: params,
      showLoading: true,
    });
  },
};
export default fxyjtjfx;
