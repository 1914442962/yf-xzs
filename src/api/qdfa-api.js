import CloudService from "@/enums/CloudService.js";
import request from "@/utils/request";
import {downloadFileByBlob} from "@/utils/tools.js";

let baseUrl = CloudService.base;

const qdfaApi = {
    /**
     * 查询树接口
     * @param params
     * @returns {Promise<*>}
     */
    loadTreeDataService(params) {
        return request({
            url: `${baseUrl}/sbqd/getTree?summaryId=98e765da0bec437e8a72701bf712c22b`,
            method: "post",
            data: params,
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
     * 发送接口
     * @param params
     * @returns {Promise<*>}
     */
    doOperateSendService(params) {
        return request({
            url: `${baseUrl}/sbqd/operation`,
            method: "post",
            data: params,
            showLoading: true,
        });
    },
    /**
     * 退回接口
     * @param params
     * @returns {Promise<*>}
     */
    doOperateReturnService(params) {
        return request({
            url: `${baseUrl}/sbqd/flowBack`,
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
            url: `${baseUrl}/sbqd/list`,
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
            url: `${baseUrl}/sbqd/saveOrUpdate`,
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
        return request({
            url: `${baseUrl}/sbqd/queryConfigNodeById`,
            method: "post",
            data: params,
            showLoading: true,
        });
    },

    /**
     * 获取目标节点
     * @param params
     * @returns {Promise<*>}
     */
    getTargetNodeService(params) {
        return request({
            url: `${baseUrl}/sbqd/queryTargetNode`,
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
            url: `${baseUrl}/sbqd/delete`,
            method: "post",
            data: params,
            showLoading: true,
        });
    },
    /**
     * 查看日志接口
     * @param params
     * @returns {Promise<*>}
     */
    loadDialogDataService(params) {
        return request({
            url: `${baseUrl}/sbqd/getRecords`,
            method: "post",
            data: params,
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
export default qdfaApi;

