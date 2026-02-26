import CloudService from "@/enums/CloudService.js";
import request from "@/utils/request.js";
import {downloadFileByBlob} from "@/utils/tools.js";
let baseUrl = CloudService.base;
import XEUtils from "xe-utils";
const commonApi = {
    /**
     * 获取统一下拉
     */
    getSelectOptionsService(params) {
        return request({
            url: `${baseUrl}/public/spinnerData`,
            method: "post",
            data: params,
        });
    },
    /**
     * 表单里关联下拉
     */
    getAssociateOptionsService(url,params) {
        return request({
            url: `${baseUrl}${url}`,
            method: "post",
            data: params,
        });
    },
    /**
     * 获取新增id
     */
    getAddIdService(url,params) {
        return request({
            url: `${baseUrl}/public/getId`,
            method: "post",
            data: params,
            showLoading: true,
        });
    },
    /**
     * 获取新增编号
     */
    getAddNumService(url,params) {
        return request({
            url: `${baseUrl}/sbqd/getBh`,
            method: "get",
            data: params,
            showLoading: true,
        });
    },
    /**
     * 获取周下拉
     */
    getWeekService(url,params) {
        return request({
            url: `${baseUrl}/public/getWeek`,
            method: "post",
            data: params,
            showLoading: true,
        });
    },
    /**
     * 下载获取文件流
     */
    downloadBlobFileService(url,params) {
        return request({
            url: `${baseUrl}${url}`,
            method: "post",
            data: params,
            responseType: "blob",
            showLoading: true,
        });
    },
    /**
     * window.open导出
     */
    exportFileService(url,params,flag,pageConfig) {
        console.log(pageConfig)
        let obj = JSON.parse(JSON.stringify(params));
        if(flag){
            obj.pageIndex = 0;
            obj.pageSize = 100000;
        }else{
            if(pageConfig){
                obj.pageIndex = pageConfig.currentPage - 1;
                obj.pageSize = pageConfig.pageSize;
            }
        }
        delete obj.sortColumn;
        delete obj.sortOrder;
        let paramsUrl = XEUtils.serialize(obj)?`?${XEUtils.serialize(obj)}`:''
        let exportUrl = `${window.location.origin}/${CloudService.base}${url}${paramsUrl}`;
        window.open(exportUrl, "_system");
    },
    uploadFileByUrlService(params,url) {
        return request({
            url: `${baseUrl}${url}`,
            method: "post",
            data: params,
            showLoading: true,
            loadingText: '文件解析中，可能时间较长，请耐心等待',
            timeout: 180000,
        });
    },
    uploadFileService(params) {
        return request({
            url: `${baseUrl}/public/upload-file`,
            method: "post",
            data: params,
            showLoading: true,
        });
    },
    loadFileService(params) {
        return request({
            url: `${baseUrl}/public/queryFileByType`,
            method: "post",
            data: params,
            showLoading: true,
        });
    },
    downloadFileService(params,option) {
        return request({
            url: `${baseUrl}/public/download-file-by-id`,
            method: "post",
            responseType: "blob",
            data: params,
            showLoading: true,
        }).then(res => {
            downloadFileByBlob(res, option.name,option.type)
        });
    },
    downloadFileGetService(params) {
        let paramsUrl = XEUtils.serialize(params)?`?${XEUtils.serialize(params)}`:''
        window.open(`${window.location.origin}/${CloudService.base}/public/download-file-by-id-get${paramsUrl}`,'_system')
    },
    removeFileService(params) {
        return request({
            url: `${baseUrl}/public/delete-file-by-id`,
            method: "post",
            data: params,
            showLoading: true,
        });
    },
    preViewFileService(params) {
        return request({
            url: `${baseUrl}/public/previewNew`,
            method: "post",
            data: params,
            responseType: "blob",
            showLoading: true,
        });
    },
    preViewFileGetService(params) {
        let paramsUrl = XEUtils.serialize(params)?`?${XEUtils.serialize(params)}`:''
        window.open(`${window.location.origin}/${CloudService.base}/public/previewNewGet${paramsUrl}#toolbar=0`,'_system')
    },
}
export default commonApi;