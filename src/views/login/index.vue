<template>
  <div class="login-container">
    <div class="login-form">
      <el-form
        ref="loginForm"
        :model="loginForm"
        :rules="loginFormRules"
        autocomplete="on"
        class="form_div"
        label-position="left"
      >
        <!--          <div data-v-21a8e594="" class="login-logo"></div>-->
        <div class="title-container">
          <h3 class="title">欢迎登陆</h3>
        </div>
        <!--        <div class="label">用户名</div>-->
        <el-form-item prop="username">
          <el-input
            size="large"
            ref="username"
            :prefix-icon="User"
            v-model="loginForm.username"
            placeholder="请输入用户名"
            name="username"
            type="text"
            tabindex="1"
            autocomplete="on"
          />
        </el-form-item>
        <!--        <div class="label">密码</div>-->
        <el-form-item prop="password">
          <i-ep-lock class="mx-2" />
          <el-input
            size="large"
            :key="passwordType"
            ref="password"
            :prefix-icon="Lock"
            v-model="loginForm.password"
            :type="passwordType"
            placeholder="请输入密码"
            name="password"
            show-password
            tabindex="2"
            autocomplete="on"
            @keyup.enter.native="handleLogin"
          />
        </el-form-item>
        <el-button
          :loading="loading"
          type="primary"
          class="login_button"
          size="large"
          @click.native.prevent="handleLogin"
          >登 录
        </el-button>
        <!--        <div class="bottom_img">-->

        <!--        </div>-->
      </el-form>
    </div>
    <el-alert
      v-if="isError && !autoToIndex"
      :title="errorMsg"
      type="error"
    ></el-alert>
    <div class="login-page-logo"></div>
    <div class="login-page-name">
      <p>{{ projectName }}</p>
      <p
        style="
          font-size: 16px;
          opacity: 0.8;
          margin-top: 10px;
          font-family: DengXian;
        "
      >
        {{ projectEnglishName }}
      </p>
    </div>
    <div class="version-info">
      {{ version }}
    </div>
  </div>
</template>

<script>
import DefaultSettingMixin from "@/mixin/default-setting-mixin.js";
import LoginThirdSystemMixin from "@/mixin/login-third-system-mixin";
import router from "@/router";
import { SM4Util } from "sm4util";
import { User, Lock } from "@element-plus/icons-vue";
import { loginIn } from "@/store/modules/user.js";
export default {
  name: "login",
  computed: {
    User() {
      return User;
    },
    Lock() {
      return Lock;
    },
  },
  data() {
    return {
      loginForm: {
        username: "",
        password: "",
      },
      loginFormRules: {
        // 验证用户名是否合法
        username: [
          { required: true, message: "请输入登录名称", trigger: "blur" },
          // {
          //   min: 3,
          //   max: 10,
          //   message: '长度在 3 到 10 个字符',
          //   trigger: 'blur',
          // },
        ],
        // 验证密码是否合法
        password: [
          { required: true, message: "请输入登录密码", trigger: "blur" },
        ],
      },
      passwordType: "password",
      capsTooltip: false,
      loading: false,
      showDialog: false,
      redirect: undefined,
      otherQuery: {},
      sysKey: null,
      projectEnglishName: "YUN FANG YE WU ZHI LIAN QU DONG PING TAI",
    };
  },
  mixins: [LoginThirdSystemMixin, DefaultSettingMixin],
  watch: {
    $route: {
      handler: function (route) {
        const query = route.query;
        if (query) {
          this.redirect = query.redirect;
          this.otherQuery = this.getOtherQuery(query);
        }
      },
      immediate: true,
    },
  },
  mounted() {
    if (this.loginForm.username === "") {
      this.$refs.username.focus();
    } else if (this.loginForm.password === "") {
      this.$refs.password.focus();
    }
  },
  methods: {
    handleLogin() {
      this.$refs.loginForm.validate((valid) => {
        if (valid) {
          this.loading = true;
          let sm4 = new SM4Util();
          let password = `{sm4c}${sm4.encryptCustom_CBC(this.loginForm.password, "@$binfo-tech%$&*", "@#binfo-tech!%$*")}`;
          let obj = {
            first: this.loginForm.username,
            pwd: password,
          };
          loginIn(obj)
            .then(() => {
              this.loading = false;
              router.push("/index");
            })
            .catch(() => {
              this.loading = false;
            });
        } else {
          console.log("error submit!!");
          return false;
        }
      });
    },
    getOtherQuery(query) {
      return Object.keys(query).reduce((acc, cur) => {
        if (cur !== "redirect") {
          acc[cur] = query[cur];
        }
        return acc;
      }, {});
    },
  },
};
</script>

<style lang="scss">
/* 修复input 背景不协调 和光标变色 */
/* Detail see https://github.com/PanJiaChen/vue-element-admin/pull/927 */

$bg: #e5e5e5;
$light_gray: #fff;
$cursor: #454545;

@supports (-webkit-mask: none) and (not (caret-color: $cursor)) {
  .login-container .el-input input {
    color: $cursor;
  }
}

input:-webkit-autofill {
  box-shadow: 0 0 0 1000px white inset !important;
}

/* reset element-ui css */
.login-container {
  width: 100%;
  height: 100%;
  //background-image: url(../../assets/img/login-background-light.jpg);
  background-image: url(../../assets/img/login_bg.png);
  background-size: 100% 100%;
  .label {
    text-align: left;
  }

  //.el-input__inner {
  //  height: 36px;
  //}

  .el-form-item {
    border: 1px solid rgba(255, 255, 255, 0.1);
    background: rgba(0, 0, 0, 0.1);
    border-radius: 5px;
    color: #454545;
  }
}

.version-info {
  position: absolute;
  right: 10px;
  bottom: 5px;
  color: #fff;
}
</style>

<style lang="scss" scoped>
$bg: #fff;
$dark_gray: #889aa4;
$light_gray: rgb(31, 45, 61);

.login-page-logo {
  position: absolute;
  top: 60px;
  left: 70px;
  width: 260px;
  height: 90px;
  background: url("../../assets/img/logo/state_grid_logo.png") center no-repeat;
  background-size: 100% 100%;
}
.login-page-name {
  margin-top: 12%;
  text-align: center;
  //left: 350px;
  font-size: 40px;
  color: #fff;
  //color:#03b6fc;
}
.login-container {
  min-height: 100%;
  width: 100%;
  background-color: $bg;
  overflow: hidden;

  .form_div {
    padding: 0 60px;
    position: absolute;
    width: 580px;
    height: 384px;
    //padding: 160px 35px 0;
    left: 50%;
    bottom: 22%;
    margin-left: -290px;
    background-color: #fff;
    box-shadow: var(--el-box-shadow-light);
    border-radius: 16px;
    .title-container {
      position: relative;

      .title {
        font-size: 36px;
        color: #227a80;
        margin: 50px auto 30px auto;
        text-align: center;
        font-weight: bold;
      }
    }
    .login_button {
      width: 100%;
      margin-bottom: 30px;
      background-image: linear-gradient(
        90deg,
        #0a6a72 0%,
        #10938e 30%,
        #15bcaa 100%
      );
    }
  }

  @media only screen and (max-width: 470px) {
    .thirdparty-button {
      display: none;
    }
  }
}
</style>
