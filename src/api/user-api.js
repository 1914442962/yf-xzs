
import CloudService from "@/enums/CloudService.js";
import request from "@/utils/request.js";
let baseUrl = CloudService.base;
const userApi = {
    /**
     * 登陆
     */
    loginInService(params) {
        return request({
            url: `${baseUrl}/admin/api/user/newLogin`,
            method: "post",
            data: params,
        });
    },
    /**
     * 获取用户信息
     */
    getUseInfoService(params) {
        return request({
            url: `${baseUrl}/login/getSysUserBoByToken`,
            method: "post",
            data: params,
        });
    },
    /**
     * 免登录接口
     * @param params
     */
    autoLoginInService(params) {
        return request({
            url: `${baseUrl}/xzs/loginByXzsData`,
            method: "post",
            data: params,
        });
    },
}


export default userApi;