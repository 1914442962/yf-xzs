import CloudService from "@/enums/CloudService.js";
import request from "@/utils/request";
let baseUrl = CloudService.base;

const dwjxtApi = {
    /**
     * 查询表格接口
     * @param params
     * @returns {Promise<*>}
     */
    loadTableDataService(params) {
        return request({
            url: `${baseUrl}/first/queryAllPic`,
            method: "post",
            data: params,
            showLoading: true,
        });
    },
}
export default dwjxtApi;

