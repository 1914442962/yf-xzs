// 获取信息(用户昵称、头像、角色集合、权限集合)
import userApi from "@/api/user-api.js";
import store from "@/store/index.js";

export const loginIn = (loginData) => {
    return new Promise((resolve, reject) => {
        userApi.loginInService(loginData).then((res) => {
            // @ts-ignore
            store.dispatch('setToken', "Bearer " + res.data).then(() =>{
                resolve();
            })


        }).catch((error) => {
            reject(error);
        });
    });
}
