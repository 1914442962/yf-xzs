import XEUtils from "xe-utils";


let UrlUtils = {
    /**
     * 获取hash参数
     * @returns {any}
     */
    getUrlHashQuery: () => {
        let url = window.location.href;
        let data = XEUtils.parseUrl(url);
        return data.hashQuery;
    },
    /**
     * 获取Query参数
     * @returns {any}
     */
    getUrlSearchQuery: () => {
        let url = window.location.href;
        let data = XEUtils.parseUrl(url);
        return data.searchQuery;
    },
    getUrlHashQueryString: (key) => {
        let url = window.location.href;
        return UrlUtils.getUrlHashQuery(url)[key]
    },
    getUrlSearchQueryString: (key) => {
        let url = window.location.href;
        return UrlUtils.getUrlSearchQuery(url)[key]
    },
}

export default UrlUtils;
