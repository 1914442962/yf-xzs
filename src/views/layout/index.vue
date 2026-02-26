<template>
  <div class="main-index-outer">
    <div class="header-div" v-if="!isNoHeader">

      <div class="left_div1">
        <div class="header_nav1" :class="activeIndex == 'gzt'?'select_nav':''" @click="handleSelect('gzt')">我的工作台</div>
        <div class="header_nav1" :class="activeIndex == 'homepage'?'select_nav':''" @click="handleSelect('homepage')">首页</div>
      </div>
      <div class="middle_div">
                <div class="logo-div"></div>
                <div class="title-div">{{projectName}}</div>
      </div>
      <div class="right_div1">
        <div class="header_nav2" :class="activeIndex == 'announcement'?'select_nav':''" @click="handleSelect('announcement')">系统公告</div>
        <div class="header_nav2" :class="activeIndex == 'internet'?'select_nav':''" @click="handleSelect('internet')">门户网站</div>
      </div>
      <div class="flex-item" id="homepage">
      </div>
      <div class="right_div">
        <div class="right-div">
          <div class="log-user"></div>

        </div>
        <div class="right-div" v-if="$store.state.userInfo.sysUser && $store.state.userInfo.sysUser.nickName">
          {{ this.$store.state.userInfo.sysUser.nickName }}
        </div>
        <div class="right-div">
          <el-popover
              class="box-item"
              title="版本号"
              :content="version"
              trigger="click"
              placement="top-start">
            <template #reference>
              <div class="user-down"></div>
            </template>
          </el-popover>
        </div>
        <div class="right-div">
          <div class="log-out" @click="loginOut"></div>
        </div>
      </div>
    </div>
    <div class="content-div" :style="isNoHeader?{height:'100%'}:{}">
      <router-view/>
    </div>
  </div>
</template>

<script>

import CookiesUtil from "@/utils/cookies.utils";
import router from "@/router";
import {TOKEN_KEY} from "@/enums/CacheEnum.js";
import DefaultSettingMixin from "@/mixin/default-setting-mixin.js";
import store from "@/store/index.js";

export default {
  name: "index",
  components: {},
  mixins: [DefaultSettingMixin],
  data() {
    return {
      activeIndex: "",
      menuList: [],
      version: 'v' + process.env.VUE_APP_VERSION,
      pathArr: ['gzt','homepage','announcement','internet'],
    };
  },
  watch: {
    activeIndex: {
      handler(val) {
        if (val) {
          router.push({
            path: `/${val}`,
          });
        } else {
        }
      },
      immediate: false
    },

  },
  computed:{
    isNoHeader(){
      return this.$store.state.noHeader
    }
  },
  created() {
    this.getMenuList();
    store.dispatch('getSelectOptions')
  },
  mounted() {
    let path = this.$route.path.replace('/','');
    if(path == 'index'){
      this.activeIndex = 'homepage';
    }else{
      if(this.pathArr.includes(path)){
        this.activeIndex = path;
      }else{
        if(this.$route.matched.length == 3 && this.pathArr.includes(this.$route.matched[1].path.replace('/',''))){
          this.activeIndex = this.$route.matched[1].path.replace('/','');
        }
      }
    }
  },
  methods: {
    // 菜单点击
    handleSelect(val) {
      this.activeIndex = val
    },

    loginOut() {
      CookiesUtil.remove(TOKEN_KEY);
      this.$store.dispatch("clearState");
    },
    getMenuList(){
      this.menuList = [
        {
          title: "table管理",
          path: "table",
          children: [
            {
              title: "table表格编辑",
              path: "table-menu1",
            },
            {
              title: "table表单编辑",
              path: "table-menu2",
            },
          ]
        },
        {
          title: "检修批复",
          path: "grid-example",
        },
        {
          title: "grid管理",
          path: "grid",
          children: [
            {
              title: "grid表格编辑",
              path: "grid-menu1",
            },
            {
              title: "grid表单编辑",
              path: "grid-menu2",
            },
          ]
        },
      ]
    },
  },

};
</script>
<style>

#homepage .el-menu.el-menu--horizontal,#homepage .el-sub-menu__title {
  border-bottom: none !important;
}

#homepage .el-menu-item,#homepage .el-sub-menu__title {
  font-size: 18px;
  font-weight: bold;
}
#homepage .el-sub-menu__title .el-icon{
  font-size: 16px;
  font-weight: bold;
}

#homepage .el-menu--horizontal > .el-menu-item:hover {
  background: transparent !important;
}

#homepage .el-menu--horizontal > .el-menu-item.is-active {
  background: transparent !important;
  border-bottom: none !important;
}
.el-menu--popup{
  background-color: #fff;
}
.el-menu--popup .el-menu-item{
  background-color: #fff!important;
  color: #909399!important;
}
.el-menu--popup .el-menu-item:hover{
  background-color: #ececec!important;
}


</style>
<style scoped lang="scss">
.main-index-outer {
  width: 100%;
  height: 100%;
  background-color: rgb(216,236,231);
  .header-div {
    color: white;
    width: 100%;
    height: 58px;
    margin-bottom: 16px;
    box-sizing: border-box;
    background-color: #d1fcf2;
    background-size: 100% 100%;
    position: relative;
    box-shadow: 0px 4px 6px 0px rgba(0,81,69,0.32);
    .left_div1{
      position: absolute;
      left: 16%;
      top: 18px;
      z-index: 100;
    }
    .middle_div{
      width: 100%;
      height: 86px;
      position: absolute;
      left: 0;
      top: 0;
      background-image: url("@/assets/img/header_middle.png");
      background-size: 100% 100%;
      text-align: center;
      .logo-div {
        width: 44px;
        height: 44px;
        display: inline-block;
        box-sizing: border-box;
        background-image: url(../../assets/img/logo/state-grid-logo.png);
        margin-left: 18px;
        background-size: 100% 100%;
        margin-top: 8px;
      }
      .title-div {
        height: 44px;
        line-height: 44px;
        display: inline-block;
        align-items: center;
        padding: 0 16px;
        box-sizing: border-box;
        font-weight: 600;
        font-size: 28px;
        margin-top: 8px;
      }
    }
    .right_div1{
      position: absolute;
      right: 16%;
      top: 18px;
      z-index: 100;
    }
    .right_div{
      position: absolute;
      right: 10px;
      top: 4px;
      z-index: 100;
      .right-div {
        height: 50px;
        line-height: 50px;
        margin-right: 10px;
        font-size: 14px;
        display: inline-block;
        color:#333;
        font-weight: bold;
        .log-user {
          display: inline-block;
          width: 28px;
          height: 28px;
          background-image: url("../../assets/img/user_icon.png");
        }

        .log-out {
          display: inline-block;
          width: 30px;
          height: 22px;
          box-sizing: content-box;
          //color: #169BD5;
          cursor: pointer;
          background-image: url("../../assets/img/login_out.png");
          background-repeat: no-repeat;
          background-position-x: 50%;
        }
        .user-down{
          display: inline-block;
          width: 13px;
          height: 7px;
          background: url("../../assets/img/user_down.png") 0 0 no-repeat;
        }
      }
    }
    .header_nav1{
      width: 148px;
      height: 34px;
      line-height: 34px;
      text-align: center;
      display: inline-block;
      cursor: pointer;
      background-size: 100% 100%;
      background-image: url('@/assets/img/nav_bg.png');
      &.select_nav{
        background-image: url('@/assets/img/nav_bg_select.png');
      }

    }
    .header_nav2{
      width: 160px;
      height: 34px;
      line-height: 34px;
      text-align: center;
      display: inline-block;
      cursor: pointer;
      background-size: 100% 100%;
      background-image: url('@/assets/img/nav_bg2.png');
      &.select_nav{
        background-image: url('@/assets/img/nav_bg_select2.png');
      }

    }


  }

  .content-div {
    width: 100%;
    height: calc(100% - 76px);
  }


}
</style>
