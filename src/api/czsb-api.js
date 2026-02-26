import CloudService from "@/enums/CloudService.js";
import request from "@/utils/request";
let baseUrl = CloudService.base;

let sbUrl = "/fxyj";
/**
 * 自建设备新增接口
 */
export function customAdd(params) {
    return request({
        url: `${baseUrl}${sbUrl}/custom/add`,
        method: "post",
        data: params,
        showLoading: true,
    });
}



export function guid() {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
        let r = Math.random() * 16 | 0,
            v = c === 'x' ? r : (r & 0x3 | 0x8);
        return v.toString(16);
    });
}


/**
 * 加载D5000右侧厂站
 */
export function loadD5000Substation(params) {
    return request({
        url: `${baseUrl}${sbUrl}/d5000/list-substation`,
        method: "post",
        data: params,
        showLoading: true,
    });
}
/**
 * 加载D5000树
 */
export function loadD5000Tree(params) {
    return request({
        url: `${baseUrl}${sbUrl}/d5000/load-area-lazy-tree`,
        method: "post",
        data: params,
        showLoading: true,
    });
}
/**
 * 加载D5000可选设备
 */
export function loadD5000Device(params) {
    return request({
        url: `${baseUrl}${sbUrl}/d5000/list-device`,
        method: "post",
        data: params,
        showLoading: true,
    });
}

/**
 * 当停电场所为线路，加载D5000左侧树
 */
export function loadXlD5000Tree(params) {
    return request({
        url: `${baseUrl}${sbUrl}/d5000/load-line-lazy-tree`,
        method: "post",
        data: params,
        showLoading: true,
    });
}

/**
 * 加载二次设备
 */
export function loadDSecondDevice(params) {
    return request({
        url: `${baseUrl}${sbUrl}/select/get-second`,
        method: "post",
        data: params,
        showLoading: true,
    });
}




/**
 * 加载OMS右侧厂站
 */
export function loadDOMSSubstation(params) {
    return request({
        url: `${baseUrl}${sbUrl}/oms/list-substation`,
        method: "post",
        data: params,
        showLoading: true,
    });
}
/**
 * 加载OMS厂站树
 */
export function loadOMSTree(params) {
    return request({
        url: `${baseUrl}${sbUrl}/oms/load-area-lazy-tree`,
        method: "post",
        data: params,
        showLoading: true,
    });
}

/**
 * 加载OMS可选设备
 */
export function loadOMSDevice(params) {
    return request({
        url: `${baseUrl}${sbUrl}/oms/list-device`,
        method: "post",
        data: params,
        showLoading: true,
    });
}

// 当OMS厂站类型不是CZ，获取OMS左侧展示的节点,懒加载
export function getLeftNode(params) {
    return request({
        url: `${baseUrl}${sbUrl}/oms/load-line-lazy-tree`,
        method: "post",
        data: params,
        showLoading: true,
    });
}









/**
 * 加载DKY设备树
 */
export function loadDkySbTree(params) {
    return request({
        url: `${baseUrl}${sbUrl}/dky/load-device-lazy-tree`,
        method: "post",
        data: params,
        showLoading: true,
    });
}
export function loadDkyTree(params) {
    return request({
        url: `${baseUrl}${sbUrl}/dky/load-station-lazy-tree`,
        method: "post",
        data: params,
        showLoading: true,
    });
}






