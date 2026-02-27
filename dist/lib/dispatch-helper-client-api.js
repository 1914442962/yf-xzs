(function webpackUniversalModuleDefinition(root, factory) {
  if (typeof exports === 'object' && typeof module === 'object')
    module.exports = factory(
      require('qclient-tools-jsapi'),
      require('xe-utils')
    );
  else if (typeof define === 'function' && define.amd)
    define(['qclient-tools-jsapi', 'xe-utils'], factory);
  else if (typeof exports === 'object')
    exports['DispatchHelperClientAPI'] = factory(
      require('qclient-tools-jsapi'),
      require('xe-utils')
    );
  else
    root['DispatchHelperClientAPI'] = factory(
      root['QClientJSAPI'],
      root['XEUtils']
    );
})(
  this,
  function (
    __WEBPACK_EXTERNAL_MODULE_qclient_tools_jsapi__,
    __WEBPACK_EXTERNAL_MODULE_xe_utils__
  ) {
    return /******/ (function (modules) {
      // webpackBootstrap
      /******/ // The module cache
      /******/ var installedModules = {};
      /******/
      /******/ // The require function
      /******/ function __webpack_require__(moduleId) {
        /******/
        /******/ // Check if module is in cache
        /******/ if (installedModules[moduleId]) {
          /******/ return installedModules[moduleId].exports;
          /******/
        }
        /******/ // Create a new module (and put it into the cache)
        /******/ var module = (installedModules[moduleId] = {
          /******/ i: moduleId,
          /******/ l: false,
          /******/ exports: {},
          /******/
        });
        /******/
        /******/ // Execute the module function
        /******/ modules[moduleId].call(
          module.exports,
          module,
          module.exports,
          __webpack_require__
        );
        /******/
        /******/ // Flag the module as loaded
        /******/ module.l = true;
        /******/
        /******/ // Return the exports of the module
        /******/ return module.exports;
        /******/
      }
      /******/
      /******/
      /******/ // expose the modules object (__webpack_modules__)
      /******/ __webpack_require__.m = modules;
      /******/
      /******/ // expose the module cache
      /******/ __webpack_require__.c = installedModules;
      /******/
      /******/ // define getter function for harmony exports
      /******/ __webpack_require__.d = function (exports, name, getter) {
        /******/ if (!__webpack_require__.o(exports, name)) {
          /******/ Object.defineProperty(exports, name, {
            enumerable: true,
            get: getter,
          });
          /******/
        }
        /******/
      };
      /******/
      /******/ // define __esModule on exports
      /******/ __webpack_require__.r = function (exports) {
        /******/ if (typeof Symbol !== 'undefined' && Symbol.toStringTag) {
          /******/ Object.defineProperty(exports, Symbol.toStringTag, {
            value: 'Module',
          });
          /******/
        }
        /******/ Object.defineProperty(exports, '__esModule', { value: true });
        /******/
      };
      /******/
      /******/ // create a fake namespace object
      /******/ // mode & 1: value is a module id, require it
      /******/ // mode & 2: merge all properties of value into the ns
      /******/ // mode & 4: return value when already ns object
      /******/ // mode & 8|1: behave like require
      /******/ __webpack_require__.t = function (value, mode) {
        /******/ if (mode & 1) value = __webpack_require__(value);
        /******/ if (mode & 8) return value;
        /******/ if (
          mode & 4 &&
          typeof value === 'object' &&
          value &&
          value.__esModule
        )
          return value;
        /******/ var ns = Object.create(null);
        /******/ __webpack_require__.r(ns);
        /******/ Object.defineProperty(ns, 'default', {
          enumerable: true,
          value: value,
        });
        /******/ if (mode & 2 && typeof value != 'string')
          for (var key in value)
            __webpack_require__.d(
              ns,
              key,
              function (key) {
                return value[key];
              }.bind(null, key)
            );
        /******/ return ns;
        /******/
      };
      /******/
      /******/ // getDefaultExport function for compatibility with non-harmony modules
      /******/ __webpack_require__.n = function (module) {
        /******/ var getter =
          module && module.__esModule
            ? /******/ function getDefault() {
                return module['default'];
              }
            : /******/ function getModuleExports() {
                return module;
              };
        /******/ __webpack_require__.d(getter, 'a', getter);
        /******/ return getter;
        /******/
      };
      /******/
      /******/ // Object.prototype.hasOwnProperty.call
      /******/ __webpack_require__.o = function (object, property) {
        return Object.prototype.hasOwnProperty.call(object, property);
      };
      /******/
      /******/ // __webpack_public_path__
      /******/ __webpack_require__.p = '';
      /******/
      /******/
      /******/ // Load entry module and return exports
      /******/ return __webpack_require__(
        (__webpack_require__.s = './index.js')
      );
      /******/
    })(
      /************************************************************************/
      /******/ {
        /***/ './index.js':
          /*!******************!*\
  !*** ./index.js ***!
  \******************/
          /*! exports provided: default */
          /***/ function (module, __webpack_exports__, __webpack_require__) {
            'use strict';
            eval(
              '__webpack_require__.r(__webpack_exports__);\n/* harmony import */ var _src_CustomBroadcastChannel__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./src/CustomBroadcastChannel */ "./src/CustomBroadcastChannel.js");\n/* harmony import */ var _src_DHClientJSAPI__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./src/DHClientJSAPI */ "./src/DHClientJSAPI.js");\n/* harmony import */ var _src_ChannelEventName__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./src/ChannelEventName */ "./src/ChannelEventName.js");\n/* harmony import */ var _src_ChannelName__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./src/ChannelName */ "./src/ChannelName.js");\n/* harmony import */ var _src_ChannelName__WEBPACK_IMPORTED_MODULE_3___default = /*#__PURE__*/__webpack_require__.n(_src_ChannelName__WEBPACK_IMPORTED_MODULE_3__);\n\r\n\r\n\r\n\r\n\r\n/* harmony default export */ __webpack_exports__["default"] = ({\r\n    CustomBroadcastChannel: _src_CustomBroadcastChannel__WEBPACK_IMPORTED_MODULE_0__["default"],\r\n    DHClientJSAPI: _src_DHClientJSAPI__WEBPACK_IMPORTED_MODULE_1__["default"],\r\n    CHANNEL_NAME: (_src_ChannelName__WEBPACK_IMPORTED_MODULE_3___default()),\r\n    CHANNEL_EVENT: _src_ChannelEventName__WEBPACK_IMPORTED_MODULE_2__["default"]\r\n});\r\n\n\n//# sourceURL=webpack://DispatchHelperClientAPI/./index.js?'
            );

            /***/
          },

        /***/ './src/ChannelEventName.js':
          /*!*********************************!*\
  !*** ./src/ChannelEventName.js ***!
  \*********************************/
          /*! exports provided: default */
          /***/ function (module, __webpack_exports__, __webpack_require__) {
            'use strict';
            eval(
              "__webpack_require__.r(__webpack_exports__);\nconst CHANNEL_EVENT = {\n  /**\r\n   * 强制退出\r\n   */\n  FORCE_REBOOT: 'force-reboot',\n\n  /**\r\n   * 激活网厂平台窗口\r\n   */\n  ACTIVE_NF: 'active-nf',\n\n  /**\r\n   * 设置网厂未读消息数\r\n   */\n  UPDATE_NO_READ_COUNT: 'on-msg-count-update',\n\n  /**\r\n   * 请求网厂发送未读消息数\r\n   */\n  GET_NO_READ_COUNT: 'get-msg-count',\n\n  /**\r\n   * 自动切换当前用户\r\n   */\n  AUTO_CHANGE_USER: 'auto-change-user',\n\n  /**\r\n   * 设置字幕\r\n   */\n  SET_SUBTITLE: 'set-subtitle',\n\n  /**\r\n   * 关闭字幕\r\n   */\n  CLOSE_SUBTITLE: 'close-subtitle',\n\n  /**\r\n   * 添加下载任务\r\n   */\n  ADD_DOWNLOAD_TASK: 'add-download-task',\n\n  /**\r\n   * 获取当前用户信息\r\n   */\n  GET_CURRENT_USER: \"get-current-user\",\n\n  /**\r\n   * 返回用户信息\r\n   */\n  REPLY_GET_CURRENT_USER: \"reply-current-user\",\n\n  /**\r\n   * 打开模拟窗口\r\n   */\n  SHOW_MODAL: 'show-modal',\n\n  /**\r\n   * 关闭模拟窗口（在窗口内）\r\n   */\n  CLOSE_MODAL_SELF: 'close-myself',\n  SEND_TO_MODAL_OPENER: 'send-to-modal-opener'\n};\n/* harmony default export */ __webpack_exports__[\"default\"] = (CHANNEL_EVENT);\n\n//# sourceURL=webpack://DispatchHelperClientAPI/./src/ChannelEventName.js?"
            );

            /***/
          },

        /***/ './src/ChannelName.js':
          /*!****************************!*\
  !*** ./src/ChannelName.js ***!
  \****************************/
          /*! no static exports found */
          /***/ function (module, exports) {
            eval(
              "module.exports = {\n  /**\r\n   * 第三方组件通道\r\n   */\n  THIRD_APP_CHANNEL: 'third-app-channel',\n\n  /**\r\n   * 默认组件通道\r\n   */\n  DEFAULT_APP_CHANNEL: 'default-app-channel',\n  ALL_APP_CHANNEL: 'all-app-channel'\n};\n\n//# sourceURL=webpack://DispatchHelperClientAPI/./src/ChannelName.js?"
            );

            /***/
          },

        /***/ './src/CustomBroadcastChannel.js':
          /*!***************************************!*\
  !*** ./src/CustomBroadcastChannel.js ***!
  \***************************************/
          /*! exports provided: default */
          /***/ function (module, __webpack_exports__, __webpack_require__) {
            'use strict';
            eval(
              '__webpack_require__.r(__webpack_exports__);\n/* harmony import */ var qclient_tools_jsapi__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! qclient-tools-jsapi */ "qclient-tools-jsapi");\n/* harmony import */ var qclient_tools_jsapi__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(qclient_tools_jsapi__WEBPACK_IMPORTED_MODULE_0__);\n/* harmony import */ var xe_utils__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! xe-utils */ "xe-utils");\n/* harmony import */ var xe_utils__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(xe_utils__WEBPACK_IMPORTED_MODULE_1__);\n\n\n/**\r\n * 窗口消息事件封装\r\n * @param name 发送/订阅频道名称\r\n * @constructor\r\n */\n\nfunction CustomBroadcastChannel(name) {\n  let channelName = name;\n  let env = qclient_tools_jsapi__WEBPACK_IMPORTED_MODULE_0___default.a.client.isClientEnv() ? \'client\' : \'web\';\n\n  this.getChannelName = function () {\n    return channelName;\n  };\n\n  this.postMessage = function (message) {\n    let msg = {\n      type: this.getChannelName(),\n      msg: message\n    };\n\n    if (\'client\' === env) {\n      // cef客户端模式\n      qclient_tools_jsapi__WEBPACK_IMPORTED_MODULE_0___default.a.message.postMessage(name, msg);\n    } else {\n      // web模式\n      window.postMessage(msg, "*");\n\n      if (window.opener) {\n        window.opener.postMessage(msg, "*");\n      }\n\n      if (window.top && window.top !== window) {\n        window.top.postMessage(msg, "*");\n\n        if (window.top.frames.length > 0) {\n          for (let i = 0; i < window.top.frames.length; i++) {\n            if (window.top.frames[i] === window) {\n              continue;\n            }\n\n            window.top.frames[i].postMessage(msg, "*");\n          }\n        }\n      }\n\n      if (window.frames.length > 0) {\n        for (let i = 0; i < window.frames.length; i++) {\n          if (window.frames[i] !== window) {\n            window.frames[i].postMessage(msg, "*");\n          }\n        }\n      }\n    }\n  };\n\n  this.onMessage = function (callback) {\n    let self = this;\n\n    if (\'client\' === env) {\n      // cef客户端模式\n      QClient.Base.addEventListener(self.getChannelName(), resp => {\n        let result = resp.text;\n        let msg = xe_utils__WEBPACK_IMPORTED_MODULE_1___default.a.toStringJSON(result);\n\n        if (msg.type === self.getChannelName()) {\n          callback(msg.msg);\n        } else {\n          callback(msg);\n        }\n      });\n    } else {\n      // web模式\n      window.addEventListener("message", function (evt) {\n        if (self.getChannelName() === evt.data.type) {\n          callback(evt.data.msg);\n        }\n      });\n\n      if (window.opener) {\n        window.opener.addEventListener("message", function (evt) {\n          if (self.getChannelName() === evt.data.type) {\n            callback(evt.data.msg);\n          }\n        });\n      }\n    }\n  };\n}\n\n/* harmony default export */ __webpack_exports__["default"] = (CustomBroadcastChannel);\n\n//# sourceURL=webpack://DispatchHelperClientAPI/./src/CustomBroadcastChannel.js?'
            );

            /***/
          },

        /***/ './src/DHClientJSAPI.js':
          /*!******************************!*\
  !*** ./src/DHClientJSAPI.js ***!
  \******************************/
          /*! exports provided: default */
          /***/ function (module, __webpack_exports__, __webpack_require__) {
            'use strict';
            eval(
              '__webpack_require__.r(__webpack_exports__);\n/* harmony import */ var _CustomBroadcastChannel__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./CustomBroadcastChannel */ "./src/CustomBroadcastChannel.js");\n/* harmony import */ var _ChannelEventName__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./ChannelEventName */ "./src/ChannelEventName.js");\n\n\nlet channel = new _CustomBroadcastChannel__WEBPACK_IMPORTED_MODULE_0__["default"](\'dispatch-helper-channel\');\nlet bindEvent = new Set();\nlet DHClientJSAPI = {};\nDHClientJSAPI.user = {\n  /**\r\n   * 获取当前用户\r\n   * @returns {Promise<unknown>}\r\n   */\n  getCurrentUser() {\n    return new Promise(resolve => {\n      channel.onMessage(e => {\n        if (_ChannelEventName__WEBPACK_IMPORTED_MODULE_1__["default"].REPLY_GET_CURRENT_USER === e.type) {\n          resolve(e.data);\n        }\n      });\n      channel.postMessage({\n        type: _ChannelEventName__WEBPACK_IMPORTED_MODULE_1__["default"].GET_CURRENT_USER\n      });\n    });\n  },\n\n  /**\r\n   * 自动切换用户\r\n   * @param username\r\n   * @param password\r\n   */\n  autoChangeUser(username, password) {\n    channel.postMessage({\n      type: _ChannelEventName__WEBPACK_IMPORTED_MODULE_1__["default"].AUTO_CHANGE_USER,\n      data: {\n        username,\n        password\n      }\n    });\n  }\n\n};\nDHClientJSAPI.client = {};\n/**\r\n * 添加下载任务\r\n * @param url 文件下载地址\r\n * @param directOpen 下载后是否打开, 默认不打开\r\n */\n\nDHClientJSAPI.client.addDownloadTask = (url, directOpen = false) => {\n  channel.postMessage({\n    type: _ChannelEventName__WEBPACK_IMPORTED_MODULE_1__["default"].ADD_DOWNLOAD_TASK,\n    data: {\n      url,\n      directOpen\n    }\n  });\n};\n/**\r\n * 显示字幕\r\n * @param option\r\n */\n\n\nDHClientJSAPI.client.setSubtitle = option => {\n  channel.postMessage({\n    type: _ChannelEventName__WEBPACK_IMPORTED_MODULE_1__["default"].SET_SUBTITLE,\n    data: option\n  });\n};\n/**\r\n * 关闭字幕\r\n */\n\n\nDHClientJSAPI.client.closeSubtitle = () => {\n  channel.postMessage({\n    type: _ChannelEventName__WEBPACK_IMPORTED_MODULE_1__["default"].CLOSE_SUBTITLE\n  });\n};\n/**\r\n * 打开主屏幕模拟窗口\r\n * @type {{}}\r\n */\n\n\nDHClientJSAPI.modal = {\n  show: (url, options, onclose) => {\n    options[\'destroy-on-close\'] = true;\n\n    if (!bindEvent.has(_ChannelEventName__WEBPACK_IMPORTED_MODULE_1__["default"].SEND_TO_MODAL_OPENER)) {\n      channel.onMessage(arg => {\n        if (_ChannelEventName__WEBPACK_IMPORTED_MODULE_1__["default"].SEND_TO_MODAL_OPENER === arg.type) {\n          let {\n            data\n          } = arg;\n\n          if (data.url === url && onclose) {\n            onclose(data);\n          }\n        }\n      });\n      bindEvent.add(_ChannelEventName__WEBPACK_IMPORTED_MODULE_1__["default"].SEND_TO_MODAL_OPENER);\n    }\n\n    channel.postMessage({\n      type: _ChannelEventName__WEBPACK_IMPORTED_MODULE_1__["default"].SHOW_MODAL,\n      data: {\n        url,\n        options\n      }\n    });\n  },\n\n  closeMySelf(data) {\n    channel.postMessage({\n      type: _ChannelEventName__WEBPACK_IMPORTED_MODULE_1__["default"].CLOSE_MODAL_SELF,\n      data: {\n        url: window.location.href,\n        ...data\n      }\n    });\n  }\n\n};\n/* harmony default export */ __webpack_exports__["default"] = (DHClientJSAPI);\n\n//# sourceURL=webpack://DispatchHelperClientAPI/./src/DHClientJSAPI.js?'
            );

            /***/
          },

        /***/ 'qclient-tools-jsapi':
          /*!***************************************************************************************************************************************!*\
  !*** external {"commonjs":"qclient-tools-jsapi","commonjs2":"qclient-tools-jsapi","amd":"qclient-tools-jsapi","root":"QClientJSAPI"} ***!
  \***************************************************************************************************************************************/
          /*! no static exports found */
          /***/ function (module, exports) {
            eval(
              'module.exports = __WEBPACK_EXTERNAL_MODULE_qclient_tools_jsapi__;\n\n//# sourceURL=webpack://DispatchHelperClientAPI/external_%7B%22commonjs%22:%22qclient-tools-jsapi%22,%22commonjs2%22:%22qclient-tools-jsapi%22,%22amd%22:%22qclient-tools-jsapi%22,%22root%22:%22QClientJSAPI%22%7D?'
            );

            /***/
          },

        /***/ 'xe-utils':
          /*!*************************************************************************************************!*\
  !*** external {"commonjs":"xe-utils","commonjs2":"xe-utils","amd":"xe-utils","root":"XEUtils"} ***!
  \*************************************************************************************************/
          /*! no static exports found */
          /***/ function (module, exports) {
            eval(
              'module.exports = __WEBPACK_EXTERNAL_MODULE_xe_utils__;\n\n//# sourceURL=webpack://DispatchHelperClientAPI/external_%7B%22commonjs%22:%22xe-utils%22,%22commonjs2%22:%22xe-utils%22,%22amd%22:%22xe-utils%22,%22root%22:%22XEUtils%22%7D?'
            );

            /***/
          },

        /******/
      }
    )['default'];
  }
);
