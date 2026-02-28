import "./chunk-PR4QN5HX.js";

// node_modules/@vxe-ui/plugin-validator/es/index.esm.js
var VxeUI;
var reMobile = /^0?(13[0-9]|15[012356789]|17[013678]|18[0-9]|19[0-3,5-9]|14[57])[0-9]{8}$/;
var reEmail = /^([A-Za-z0-9_\-.])+@([A-Za-z0-9_\-.])+\.([A-Za-z]{2,4})$/;
var reIdentityCard = /^[1-9]\d{5}(18|19|20)\d{2}((0[1-9])|(1[0-2]))(([0-2][1-9])|10|20|30|31)\d{3}[0-9Xx]$/;
var reIp = /^(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/;
var reUrl = /^((https?|ftp|file):\/\/)?([\da-z.-]+)\.([a-z.]{2,6})([\w.-]*)*\/?$/;
var rePlateNumber = /^[京津沪渝冀豫云辽黑湘皖鲁新苏浙赣鄂桂甘晋蒙陕吉闽贵粤青藏川宁琼使领A-Z]{1}[A-Z]{1}[A-Z0-9]{4}[A-Z0-9挂学警港澳]{1}$/;
var customRegExpMaps = {};
function createValidRule(checkMethod) {
  const validOpts = {
    tableCellValidatorMethod({ cellValue, rule }) {
      return checkMethod(cellValue, rule);
    },
    formItemValidatorMethod({ itemValue, rule }) {
      return checkMethod(itemValue, rule);
    }
  };
  return validOpts;
}
function pluginConfig(options) {
  if (options) {
    Object.assign(customRegExpMaps, options.customRegExp);
  }
}
var VxeUIPluginValidator = {
  setConfig: pluginConfig,
  install(core, options) {
    VxeUI = core;
    if (VxeUI.checkVersion) {
      const pVersion = 4;
      const sVersion = 7;
      if (!VxeUI.checkVersion(VxeUI.tableVersion, pVersion, sVersion)) {
        console.error(`[@vxe-ui/plugin-validator 4.3.1] ${VxeUI.getI18n("vxe.error.errorVersion", [`vxe-table@${VxeUI.tableVersion || "?"}`, `vxe-table v${pVersion}.${sVersion}+`])} https://vxeui.com/other4/#/plugin-validator/install`);
      }
    } else {
      if (!/^(4)\./.test(VxeUI.uiVersion || VxeUI.tableVersion)) {
        console.error("[@vxe-ui/plugin-validator 4.3.1] Requires vxe-table 4.7.0+ version. https://vxeui.com/other4/#/plugin-validator/install");
      }
    }
    if (options) {
      pluginConfig(options);
    }
    VxeUI.validators.mixin({
      // 手机号码，11位
      MOBILE_NUMBER: createValidRule((value, rule) => {
        if (rule.required || value) {
          if (!(customRegExpMaps.mobile || reMobile).test(value)) {
            return new Error("请输入正确的手机号");
          }
        }
      }),
      // 邮箱
      EMAIL_ADDRESS: createValidRule((value, rule) => {
        if (rule.required || value) {
          if (!(customRegExpMaps.email || reEmail).test(value)) {
            return new Error("请输入正确的邮箱账号");
          }
        }
      }),
      // 身份证号码
      IDENTITY_CARD: createValidRule((value, rule) => {
        if (rule.required || value) {
          if (!(customRegExpMaps.identityCard || reIdentityCard).test(value)) {
            return new Error("请输入正确的身份证号");
          }
        }
      }),
      // IP地址
      IP_ADDRESS: createValidRule((value, rule) => {
        if (rule.required || value) {
          if (!(customRegExpMaps.ip || reIp).test(value)) {
            return new Error("请输入正确的IP地址");
          }
        }
      }),
      // URL
      URL: createValidRule((value, rule) => {
        if (rule.required || value) {
          if (!(customRegExpMaps.url || reUrl).test(value)) {
            return new Error("请输入正确的URL地址");
          }
        }
      }),
      // 车牌号
      PLATE_NUMBER: createValidRule((value, rule) => {
        if (rule.required || value) {
          if (!(customRegExpMaps.plateNumber || rePlateNumber).test(value)) {
            return new Error("请输入正确的车牌号");
          }
        }
      })
    });
  }
};
if (typeof window !== "undefined" && window.VxeUI && window.VxeUI.use) {
  window.VxeUI.use(VxeUIPluginValidator);
}
var index_esm_default = VxeUIPluginValidator;
export {
  VxeUIPluginValidator,
  index_esm_default as default
};
//# sourceMappingURL=@vxe-ui_plugin-validator.js.map
