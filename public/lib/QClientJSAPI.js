/**
 * qclient-tools-jsapi - JSAPI for CEF client, base on Hua Wei
 * @version v1.0.9-9
 * @author wangding <wangding@binfo-tech.com>
 * @date 2019-11-07 09:46:03
 */
(function (global, factory) {
  if (typeof define === 'function' && define.amd) {
    define('QClientJSAPI', ['exports', 'xe-utils'], factory);
  } else if (typeof exports !== 'undefined') {
    factory(exports, require('xe-utils'));
  } else {
    var mod = {
      exports: {},
    };
    factory(mod.exports, global.XEUtils);
    global.QClientJSAPI = mod.exports.default;
  }
})(this, function (_exports, _xeUtils) {
  'use strict';

  Object.defineProperty(_exports, '__esModule', {
    value: true,
  });
  _exports['default'] = void 0;
  _xeUtils = _interopRequireDefault(_xeUtils);

  function _interopRequireDefault(obj) {
    return obj && obj.__esModule ? obj : { default: obj };
  }

  var GLOBAL_CONSTANT = {
    /**
     * 下载管理器窗口id
     */
    DOWNLOADER_NAME: 'downloader-manager',

    /**
     * 悬浮球页面id
     */
    SUSPEND_BALL_NAME: 'suspend-ball',

    /**
     * 提示弹出页面id
     */
    POP_NOTIFY_NAME: 'pop-notify-page',
  };
  /**
   * QClientJSAPI
   * @type {{cache: {}, test: QClientJSAPI.test, sqlite: {}, util: {}, resource: {}, ini: {},
   *          client: {}, window: {}, message: {}, downloader: {}}}
   */

  var QClientJSAPI = {
    /**
     * 封装测试
     */
    test: function test() {
      console.log('This is QClientJSAPI.');
    },

    /**
     * 常量
     */
    constant: GLOBAL_CONSTANT,
    window: {},
    client: {},
    downloader: {},
    sqlite: {},
    cache: {},
    ini: {},
    resource: {},
    message: {},
    util: {},
  };
  /**
   * 窗口相关
   * @type {{minimize(): void, maximize(): void, active(): void, changeTitle(*=, *=): void, drag(): void, close(): void, openCef(*, *=, *, *=, *=, *): void, startFlicker(*=): void}}
   */

  QClientJSAPI.window = {
    /**
     * 关闭当前窗口
     */
    close: function close() {
      QClient.Base.Utils.invokeMethod('QCloseWindow', '');
    },

    /**
     * 根据窗口id关闭指定窗口
     * @param wid
     */
    closeById: function closeById(wid) {
      QClient.Base.Utils.invokeMethod('QCloseWindow', wid);
    },

    /**
     * 窗口最小化
     */
    minimize: function minimize() {
      var wid =
        arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : '';
      QClient.Base.Utils.invokeMethod('QMinimizeWindow', wid);
    },

    /**
     * 窗口最大化/还原
     */
    maximize: function maximize() {
      var wid =
        arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : '';
      QClient.Base.Utils.invokeMethod('QMaximizeWindow', wid);
    },

    /**
     * 激活窗口
     */
    active: function active() {
      var wid =
        arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : '';
      QClient.Base.Utils.invokeMethod('QActivateWindow', wid);
    },

    /**
     * 窗口拖动
     */
    drag: function drag() {
      QClient.Base.Utils.invokeMethod('QOnDragPage', '');
    },

    /**
     * 打开cef（chrome）窗口
     * @param wid 窗口id
     * @param path 路径
     * @param name 窗口标题
     * @param haveFlicker 是否带窗口闪烁功能效果
     * @param showTitleBar 是否显示标题
     * @param size 窗口尺寸，{width: xxx, height: xxx}
     * @param draggable 是否支持拖拽文件功能
     */
    openCef: function openCef(
      wid,
      path,
      name,
      haveFlicker,
      showTitleBar,
      size,
      draggable,
      onCompleted
    ) {
      if (!size) {
        size = {
          width: 800,
          height: 600,
        };
      }

      var param = {
        wid: wid,
        location: path,
        name: name,
        render_engine: 0,
        modal: false,
        titlebar: showTitleBar,
        width: size.width,
        height: size.height,
        draggable: draggable,
      };

      if (haveFlicker) {
        param.win_type = 2;
      }

      QClient.Base.Utils.invokeMethod('QOpenWebPage', JSON.stringify(param));
    },

    /**
     * 窗口闪烁
     * @param wid
     */
    startFlicker: function startFlicker(wid) {
      QClient.Base.Utils.invokeGMethod(wid, 'beginFlicker');
    },

    /**
     * 修改窗口标题
     * @param wid 窗口id
     * @param title 窗口标题
     */
    changeTitle: function changeTitle(wid, title) {
      QClient.Base.Utils.invokeGMethod(wid, 'changeWindowTitle', title);
    },

    /**
     * 打开窗口（IE内核）
     * @param name 窗口名称
     * @param url 页面地址（http/res）
     * @param wid 窗口id
     * @param size 窗口尺寸，{width: xxx, height: xxx}
     * @param completed 窗口打开后回调
     */
    openByIE: function openByIE(name, url, wid, size, completed) {
      if (!size) {
        size = {
          width: 800,
          height: 600,
        };
      }

      var params = {
        wid: wid,
        location: url,
        render_engine: 1,
        titlebar: true,
        name: name,
        modal: false,
        width: size.width,
        height: size.height,
        completed: completed,
      };
      QClient.Base.Utils.invokeMethod('QOpenWebPage', JSON.stringify(params));
    },

    /**
     * 打开窗口（Chrome内核）
     * @param name 窗口名称
     * @param url 页面地址（http/res）
     * @param wid 窗口id
     * @param size  {width: xxx, height: xxx}
     * @param completed 窗口打开后回调
     */
    openByChrome: function openByChrome(name, url, wid, size, completed) {
      QClientJSAPI.window.openCef(wid, url, name, false, true, size, completed);
    },

    /**
     * 打开底部带按钮窗口
     * @param option
     * option = {
     *     wid: String
     *     name: String,
     *     url: {
     *         chrome：String, // chrome窗口地址
     *         ie: String // ie窗口地址
     *     }
     *     max: boolean,
     *     width: int,
     *     height：int
     * }
     * @param button
     */
    openWithBtn: function openWithBtn(option, button) {
      var toolbarHeight = 50;

      if (0 === button.length) {
        toolbarHeight = 0;
      } else {
        button.forEach(function (btn) {
          if (null == btn.css) {
            btn.css =
              'padding: 0 8px; height: 30px; font-size: 14px;  ' +
              'border: none; color: #FFFFFF; background-color: #0284d4; border-radius: 3px; cursor: point;';
          }
        });
      }

      if (!option.width && !option.height) {
        option.width = 800;
        option.height = 600;
      }

      var params = {
        wid: option.wid,
        location: option.url,
        name: option.name,
        modal: false,
        titlebar: true,
        showmax: option.max,
        width: option.width,
        height: option.height,
        render_engine: option.render_engine,
        win_type: 1,
        toolbar: {
          height: toolbarHeight,
          css: 'background-color:#F0f5fc;',
          //工具栏背景色,默认 :#0154BA
          spacing: 15,
          //按钮间距, 默认15,
          button: button,
        },
      };
      QClient.Base.Utils.invokeMethod('QOpenWebPage', JSON.stringify(params));
    },

    /**
     * 打开混合窗口（双页面窗口）
     * @param option
     * @param button
     */
    openMix: function openMix(option, button) {
      var toolbarHeight = 50;

      if (0 === button.length) {
        toolbarHeight = 0;
      } else {
        button.forEach(function (btn) {
          if (null == btn.css) {
            btn.css =
              'padding: 0 8px; height: 30px; font-size: 14px;  ' +
              'border: none; color: #FFFFFF; background-color: #0284d4; border-radius: 3px; cursor: point;';
          }
        });
      }

      if (!option.width && !option.height) {
        option.width = 800;
        option.height = 600;
      }

      var left = {
        location: option.url.chrome,
      };
      var right = {
        location: option.url.ie,
      };
      var params = {
        wid: option.wid,
        name: option.name,
        modal: false,
        titlebar: option.titlebar,
        showmax: option.max,
        width: option.width,
        height: option.height,
        render_engine: 2,
        win_type: 0,
        params: JSON.stringify([left, right]),
        toolbar: {
          height: toolbarHeight,
          css: 'background-color:#F0f5fc;',
          //工具栏背景色,默认 :#0154BA
          spacing: 15,
          //按钮间距, 默认15,
          button: button,
        },
      };
      QClient.Base.Utils.invokeMethod('QOpenWebPage', JSON.stringify(params));
    },
  };
  /**
   * 客户端功能
   * @type {{reboot(): void, getVersion(): *, tray: {init(*=): void, startFlicker(): void, stopFlicker(): void},
   * suspendBall: {init(*=): void, hide(): void, show(): void, setNumber(*=): void}, isClientEnv(): boolean,
   * goHome(*, *, *, *): void, update: {}, quit(): void}}
   */

  QClientJSAPI.client = {
    /**
     * 判断当前是否为客户端环境
     * @return {boolean}
     */
    isClientEnv: function isClientEnv() {
      return typeof QCefClient !== 'undefined';
    },

    /**
     * 跳转至主窗口
     * @param path 路径，绝对路径
     * @param name 窗口名称
     * @param width 窗口宽度
     * @param height 窗口高度
     * @param draggable 主窗口是否支持拖拽文件
     */
    goHome: function goHome(path, name, width, height) {
      var draggable =
        arguments.length > 4 && arguments[4] !== undefined
          ? arguments[4]
          : false;
      var args = [
        'location=' + path,
        'name=' + name,
        'height=' + height,
        'width=' + width,
        'modal=false',
        'draggable=' + draggable,
      ];
      QClient.Base.Utils.invokeMethod('goHome', args);
    },

    /**
     * 退出客户端
     * @param message 提示信息
     */
    quit: function quit(message) {
      QClient.Base.Utils.invokeGMethod('', 'QQuitClient', message);
    },

    /**
     * 重启客户端
     * @param message 提示信息
     */
    reboot: function reboot(message) {
      QClient.Base.Utils.invokeGMethod('', 'QRebootClient', message);
    },

    /**
     * 获取客户端版本
     */
    getVersion: function getVersion() {
      return new Promise(function (resolve) {
        QClient.Base.Utils.executeQuery(
          'QGetCurrentVersion',
          '',
          function (value) {
            resolve(value);
          }
        );
      });
    },

    /**
     * 获取操作系统信息
     * @return {Promise<unknown>}
     */
    getSystemInfo: function getSystemInfo() {
      return new Promise(function (resolve) {
        QClient.Base.Utils.executeQuery('QGetSysInfo', '', function (data) {
          resolve(data);
        });
      });
    },

    /**
     * 更新客户端
     * @param url 升级包下载地址
     * @param channel 升级通道, 0-客户端, 1-前端页面
     * @param version 版本，channel=0时必选
     */
    update: function update(url, channel, version) {
      var args = {
        location: url,
        channel: channel,
        version: version,
      };
      QClient.Base.Utils.invokeMethod('upgradeClient', JSON.stringify(args));
    },

    /**
     * 清理本地缓存
     */
    cleanCache: function cleanCache() {
      if (confirm('清除缓存：此操作将关闭客户端，确认继续？')) {
        QClientJSAPI.resource.getCurrentPath().then(function (path) {
          path += '/AutoCleanCache.exe';
          QClientJSAPI.resource.openLocalFile(path);
        });
      }
    },

    /**
     * 系统托盘相关（右下状态栏）
     */
    tray: {
      /**
       * 初始化
       * @param menuList
       */
      init: function init(menuList) {
        QClient.Base.Utils.invokeMethod(
          'initTrayMenu',
          JSON.stringify(menuList)
        );
      },

      /**
       * 开始闪烁
       */
      startFlicker: function startFlicker() {
        QClient.Base.Utils.invokeMethod('startTrayFlicker', '');
      },

      /**
       * 停止闪烁
       */
      stopFlicker: function stopFlicker() {
        QClient.Base.Utils.invokeMethod('stopTrayFlicker', '');
      },

      /**
       * 设置托盘显示名称（鼠标悬浮）
       * @param name
       */
      setName: function setName(name) {
        QClient.Base.Utils.invokeMethod('setTrayName', name);
      },
    },

    /**
     * 客户端悬浮球
     */
    suspendBall: {
      /**
       * 初始化
       * @param path 悬浮球弹出页面路径
       * @param size 窗口尺寸，{width: xxx, height: xxx}， 默认300*470
       */
      init: function init(path, size) {
        if (!size) {
          size.width = 300;
          size.height = 470;
        }

        var params = {
          wid: GLOBAL_CONSTANT.SUSPEND_BALL_NAME,
          location: path,
          width: size.width,
          height: size.height,
        };
        QClient.Base.Utils.invokeMethod('initBall', JSON.stringify(params));
      },

      /**
       * 显示悬浮球
       */
      show: function show() {
        QClient.Base.Utils.invokeGMethod(
          GLOBAL_CONSTANT.SUSPEND_BALL_NAME,
          'setBallVisible',
          '1'
        );
      },

      /**
       * 隐藏悬浮球
       */
      hide: function hide() {
        QClient.Base.Utils.invokeGMethod(
          GLOBAL_CONSTANT.SUSPEND_BALL_NAME,
          'setBallVisible',
          '0'
        );
      },

      /**
       * 设置显示数字
       * @param val
       */
      setNumber: function setNumber(val) {
        QClient.Base.Utils.invokeGMethod(
          GLOBAL_CONSTANT.SUSPEND_BALL_NAME,
          'setBallCount',
          val
        );
      },

      /**
       * 获取悬浮球当前配置参数
       */
      getConfig: function getConfig() {
        QClientJSAPI.cache
          .getCache('ROOT_HUAWEI', 'ball')
          .then(function (value) {
            return _xeUtils['default'].toStringJSON(value);
          });
      },
    },

    /**
     * 客户端右下弹窗
     */
    popNotify: {
      init: function init(url, option) {
        var params = {
          wid: GLOBAL_CONSTANT.POP_NOTIFY_NAME,
          location: url,
          left: window.screen.width - option.width - 20,
          top: window.screen.height - option.height - 60,
          width: option.width,
          height: option.height,
        };
        QClient.Base.Utils.invokeMethod('initHint', JSON.stringify(params));
      },
      show: function show() {
        QClient.Base.Utils.invokeGMethod(
          GLOBAL_CONSTANT.POP_NOTIFY_NAME,
          'openFrame',
          'true'
        );
      },
      hide: function hide() {
        QClient.Base.Utils.invokeGMethod(
          GLOBAL_CONSTANT.POP_NOTIFY_NAME,
          'openFrame',
          'false'
        );
      },
    },
  };
  /**
   * 下载管理器
   * @type {{init(*=): void, removeTask(*): Promise<any>, close(): void, open(): void, addTask(*, *=, *): void}}
   */

  QClientJSAPI.downloader = {
    /**
     * 下载管理器初始化
     * @param path 管理器页面路径
     */
    init: function init(path) {
      var param = {
        wid: GLOBAL_CONSTANT.DOWNLOADER_NAME,
        location: path,
        width: 500,
        height: 600,
        name: '下载管理器',
      };
      QClient.Base.Utils.invokeMethod('initDownPage', JSON.stringify(param));
    },

    /**
     * 激活下载管理器
     */
    open: function open() {
      QClient.Base.Utils.invokeGMethod(
        GLOBAL_CONSTANT.DOWNLOADER_NAME,
        'openFrame',
        'true'
      );
    },

    /**
     * 关闭下载管理器
     */
    close: function close() {
      QClient.Base.Utils.invokeGMethod(
        GLOBAL_CONSTANT.DOWNLOADER_NAME,
        'openFrame',
        'false'
      );
    },

    /**
     * （从主窗口）添加下载任务
     * @param id 任务id
     * @param url 文件下载地址
     * @param directOpen 下载后是否打开
     * @param active 是否显示下载管理器（默认显示）
     */
    addTask: function addTask(id, url, directOpen, savePath) {
      var active =
        arguments.length > 4 && arguments[4] !== undefined
          ? arguments[4]
          : true;
      var params = {
        id: id,
        remoteUrl: url,
        savePath: savePath,
        directOpen: directOpen,
        active: active,
      };
      QClient.Base.Utils.invokeGMethod(
        GLOBAL_CONSTANT.DOWNLOADER_NAME,
        'addDownTask',
        JSON.stringify(params)
      );
    },

    /**
     * 移除/暂停下载任务
     * @param id
     * @return {Promise<any>}
     */
    removeTask: function removeTask(id) {
      var params = {
        id: id,
      };
      return new Promise(function (resolve) {
        QClient.Base.Utils.executeQuery(
          'QAbortDownTask',
          params,
          function (data) {
            resolve(data);
          }
        );
      });
    },

    /**
     * 选择下载保存路径
     * @return {Promise<unknown>}
     */
    selectSavePath: function selectSavePath() {
      return new Promise(function (resolve) {
        QClient.Base.Utils.executeQuery(
          'QGetExistingDirectory',
          '',
          function (data) {
            resolve(data);
          }
        );
      });
    },
  };
  /**
   * sqlite
   * @type {{executeBatch(*=): Promise<any>, update(*): Promise<any>, insert(*): *, execute(*): Promise<any>}}
   */

  QClientJSAPI.sqlite = {
    /**
     * 单条sql
     * @param sql
     * @return {Promise<any>}
     */
    execute: function execute(sql) {
      return new Promise(function (resolve) {
        QClient.Base.Utils.executeQuery(
          'QDBQuery',
          {
            sql: sql,
          },
          function (data) {
            data = _xeUtils['default'].toStringJSON(data);
            resolve(data);
          }
        );
      });
    },

    /**
     * 更新
     * @param sql
     * @return {Promise<any>}
     */
    update: function update(sql) {
      return new Promise(function (resolve) {
        QClient.Base.Utils.executeQuery(
          'QDBUpdate',
          {
            sql: sql,
          },
          function (data) {
            resolve(data);
          }
        );
      });
    },

    /**
     * 批量执行
     * @param sqls []
     * @return {Promise<any>}
     */
    executeBatch: function executeBatch(sqls) {
      return new Promise(function (resolve) {
        QClient.Base.Utils.executeQuery(
          'QDBBatch',
          {
            sql: sqls,
          },
          function (data) {
            resolve(data);
          }
        );
      });
    },
    insert: function insert(sql) {
      return QClientJSAPI.sqlite.executeBatch([sql]);
    },
  };
  /**
   * 本地缓存
   * @type {{getCache(*, *): Promise<any>, deleteCache(*, *): *, clear(*): *, setCache(*, *, *=): Promise<any>}}
   */

  QClientJSAPI.cache = {
    /**
     * 设置值
     * @param name 存储区名称
     * @param key
     * @param value
     * @return {Promise<any>}
     */
    setCache: function setCache(name, key, value) {
      if (_xeUtils['default'].isObject(value)) {
        value = _xeUtils['default'].toJSONString(value);
      }

      return new Promise(function (resolve) {
        QClient.Base.Utils.executeQuery(
          'QDBSetCache',
          {
            name: name,
            key: key,
            value: value,
          },
          function (data) {
            resolve(data);
          }
        );
      });
    },

    /**
     * 取值
     * @param name
     * @param key
     * @return {Promise<any>}
     */
    getCache: function getCache(name, key) {
      return new Promise(function (resolve) {
        QClient.Base.Utils.executeQuery(
          'QDBGetCache',
          {
            name: name,
            key: key,
          },
          function (data) {
            data = _xeUtils['default'].toStringJSON(data);

            if (data && data.length > 0) {
              var value = data[0]['DICT_VALUE'];

              if (value.indexOf('{') === 0 || value.indexOf('[') === 0) {
                resolve(_xeUtils['default'].toStringJSON(value));
              } else {
                resolve(value);
              }
            } else {
              resolve(null);
            }
          }
        );
      });
    },
    deleteCache: function deleteCache(name, key) {
      return new Promise(function (resolve) {
        QClient.Base.Utils.executeQuery(
          'QDBDelCache',
          {
            name: name,
            key: key,
          },
          function (data) {
            resolve(data);
          }
        );
      });
    },
    clear: function clear(name) {
      return new Promise(function (resolve) {
        QClient.Base.Utils.executeQuery('QDBDelCache', {
          name: name,
        });
      });
    },
  };
  /**
   * 本地磁盘操作
   * @type {{getCurrentPath(): Promise<any>, compressDir(*), getExeLaunchPath(): Promise<any>,
   * getDocumentPath(): Promise<any>, getDownloadPath(): Promise<any>, openLocalFile(*=): *,
   * getCacheRootPath(): Promise<any>, compressFiles(*)}}
   */

  QClientJSAPI.resource = {
    /**
     * 获取默认下载路径
     * @return {Promise<any>}
     */
    getDownloadPath: function getDownloadPath() {
      return new Promise(function (resolve) {
        QClient.Base.Utils.executeQuery(
          'QGetDownloadPath',
          '',
          function (data) {
            resolve(data);
          }
        );
      });
    },

    /**
     * 获取启动器路径
     * @return {Promise<any>}
     */
    getExeLaunchPath: function getExeLaunchPath() {
      return new Promise(function (resolve) {
        QClient.Base.Utils.executeQuery(
          'QGetExeLaunchPath',
          '',
          function (data) {
            resolve(data);
          }
        );
      });
    },

    /**
     * 获取缓存路径
     * @return {Promise<any>}
     */
    getCacheRootPath: function getCacheRootPath() {
      return new Promise(function (resolve) {
        QClient.Base.Utils.executeQuery(
          'QGetCacheRootPath',
          '',
          function (data) {
            resolve(data);
          }
        );
      });
    },

    /**
     * 获取“我的文档”路径
     * @return {Promise<any>}
     */
    getDocumentPath: function getDocumentPath() {
      return new Promise(function (resolve) {
        QClient.Base.Utils.executeQuery(
          'QGetDocumentPath',
          '',
          function (data) {
            resolve(data);
          }
        );
      });
    },

    /**
     * 获取当前路径
     * @return {Promise<any>}
     */
    getCurrentPath: function getCurrentPath() {
      return new Promise(function (resolve) {
        QClient.Base.Utils.executeQuery('QGetCurrentPath', '', function (data) {
          resolve(data);
        });
      });
    },

    /**
     * 打开本地磁盘文件/文件夹
     * @param diskPath 文件/文件夹路径
     */
    openLocalFile: function openLocalFile(diskPath) {
      return new Promise(function (resolve) {
        QClient.Base.Utils.executeQuery(
          'QOpenLocalFile',
          {
            path: diskPath,
          },
          function (data) {
            resolve(data);
          }
        );
      });
    },

    /**
     * 压缩本地文件
     * @param filePathList 本地文件路径列表
     */
    compressFiles: function compressFiles(filePathList) {
      var params = {
        archiveName: '',
        files: filePathList,
      };
      return new Promise(function (resolve) {
        QClient.Base.Utils.executeQuery(
          'QGetCompressFilesZip',
          params,
          function (zipPath) {
            resolve(zipPath);
          }
        );
      });
    },

    /**
     * 压缩本地文件夹
     * @param path 文件夹路径
     */
    compressDir: function compressDir(path) {
      var params = {
        archiveName: '',
        dir: path,
        recursive: true,
      };
      return new Promise(function (resolve) {
        QClient.Base.Utils.executeQuery(
          'QGetCompressDirZip',
          params,
          function (zipPath) {
            resolve(zipPath);
          }
        );
      });
    },
  };
  /**
   * ini文件读写
   * @type {{set(*=, *, *, *=): Promise<unknown>, get(*=, *, *): Promise<unknown>, clear(*): Promise<T>, remove(*, *, *): Promise<unknown>}}
   */

  QClientJSAPI.ini = {
    /**
     * 读取ini文件中的值
     * @param path ini文件路径
     * @param group [group]
     * @param key 键
     * @return {Promise<unknown>}
     */
    get: function get(path, group, key) {
      console.log(path);
      var param = {
        path: path,
        operation: 'get',
        k: ''.concat(group, '/').concat(key),
      };
      return new Promise(function (resolve) {
        QClient.Base.Utils.executeQuery('QSetting', param, function (data) {
          console.log(data);
          resolve(data);
        });
      });
    },

    /**
     * 设置值
     * @param path ini文件路径，支持绝对路径和相对路径
     * @param group [group]
     * @param key 键
     * @param value 值
     * @return {Promise<unknown>}
     */
    set: function set(path, group, key, value) {
      var param = {
        path: path,
        operation: 'set',
        k: ''.concat(group, '/').concat(key),
        v: value,
      };
      return new Promise(function (resolve) {
        QClient.Base.Utils.executeQuery('QSetting', param, function (data) {
          resolve(data);
        });
      });
    },

    /**
     * 删除值
     * @param path
     * @param group
     * @param key
     * @return {Promise<unknown>}
     */
    remove: function remove(path, group, key) {
      var param = {
        path: path,
        operation: 'remove',
        k: ''.concat(group, '/').concat(key),
      };
      return new Promise(function (resolve) {
        QClient.Base.Utils.executeQuery('QSetting', param, function (data) {
          resolve(data);
        });
      });
    },

    /**
     * 清空
     * @param path ini文件路径
     * @return {Promise<T>}
     */
    clear: function clear(path) {
      var param = {
        path: path,
        operation: 'clear',
      };
      return new Promise(function (resolve) {
        QClient.Base.Utils.executeQuery('QSetting', param, function (data) {
          resolve(data);
        });
      });
    },
  };
  /**
   * 窗口通信相关
   * @type {{}}
   */

  QClientJSAPI.message = {
    /**
     * 发送消息
     * @param name
     * @param msg
     */
    postMessage: function postMessage(name, msg) {
      var message = _xeUtils['default'].toJSONString(msg);

      QClient.Base.Utils.sendPageMessage('', name, message);
    },
  };
  /**
   * 其他工具
   * @type {{}}
   */

  QClientJSAPI.util = {
    /**
     * 截图
     * @param hideMainFrame 是否隐藏主窗口
     */
    screenshot: function screenshot(hideMainFrame) {
      return new Promise(function (resolve) {
        QClient.Base.Utils.executeQuery(
          'QScreenShot',
          {
            hide: hideMainFrame,
          },
          function (data) {
            if (data !== '{  }') {
              var v = JSON.parse(data);
              resolve({
                data: 'data:image/png;base64,' + v.data.replace(/"/g, ''),
                event: v.event,
              });
            }
          }
        );
      });
    },

    /**
     * 设置字幕
     * @param params
     */
    setSubtitle: function setSubtitle(params) {
      QClient.Base.Utils.invokeMethod('setSubtitle', JSON.stringify(params));
    },

    /**
     * 关闭字幕
     */
    closeSubtitle: function closeSubtitle() {
      QClient.Base.Utils.invokeMethod('closeSubtitle', '');
    },
  };
  var _default = QClientJSAPI;
  _exports['default'] = _default;
});
