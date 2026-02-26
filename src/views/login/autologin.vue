<template>
  <div></div>
</template>
<script>
import { mapActions } from "vuex";
import UrlUtils from "@/utils/url-utils.js";
import store from "@/store/index.js";
import router from "@/router/index.js";
let DHClientAPI = DispatchHelperClientAPI.DHClientJSAPI;
export default {
  name: "autologin",
  computed: {},
  data() {
    return {};
  },
  created() {
    this.handleAutoLogin();
  },
  methods: {
    ...mapActions(["setUserInfo", "setToken"]),
    handleAutoLogin() {
      let token = UrlUtils.getUrlHashQueryString("token");
      if (token) {
        // TODO 需要移除地址栏的token参数
        store.dispatch("setToken", "Bearer " + token).then(async () => {
          await store.dispatch("getUserInfo");
          let path = UrlUtils.getUrlHashQueryString("path");
          if (UrlUtils.getUrlHashQueryString("noHeader")) {
            await store.dispatch("setNoHeader", true);
          }
          if (UrlUtils.getUrlHashQueryString("isXzs")) {
            await store.dispatch("setIsXzs", true);
          }
          if (UrlUtils.getUrlHashQueryString("tree")) {
            await store.dispatch(
              "setGztTree",
              UrlUtils.getUrlHashQueryString("tree"),
            );
          }
          await router.push({
            path: `/${path}`,
          });
        });
      } else {
        DHClientAPI.user.getCurrentUser().then((data) => {
          //小助手内获取token
          store
            .dispatch("setToken", "Bearer " + data.extData)
            .then(async () => {
              await store.dispatch("getUserInfo");
              let path = UrlUtils.getUrlHashQueryString("path");
              if (UrlUtils.getUrlHashQueryString("noHeader")) {
                await store.dispatch("setNoHeader", true);
              }
              if (UrlUtils.getUrlHashQueryString("isXzs")) {
                await store.dispatch("setIsXzs", true);
              }
              if (UrlUtils.getUrlHashQueryString("tree")) {
                await store.dispatch(
                  "setGztTree",
                  UrlUtils.getUrlHashQueryString("tree"),
                );
              }
              if (UrlUtils.getUrlHashQueryString("gztPath")) {
                await store.dispatch(
                  "setGztPath",
                  UrlUtils.getUrlHashQueryString("gztPath"),
                );
              }
              await router.push({
                path: `/${path}`,
              });
            });
        });
      }
    },
  },
};
</script>
<style scoped lang="scss"></style>
