/**
 * Created by huawei on 2018-04-10.
 */

var QClient = window.QClient || {};

QClient.Base = new (function () {
  let _self = this;

  /**
   * js 直接调用 qt, 由 Qt 拦截请求方法
   * @param pArgs 请求方法名 + 请求参数列表
   */
  _self.invokeQtEvent = function (pArgs) {
    if (ExistQtEnvironment()) {
      QCefClient.invokeMethod.apply(this, pArgs);
    }
  };

  /**
   * 注册 js 事件名, 由 qt 触发 js 事件
   * @param pMethod   本地事件名称
   * @param pCallback 回调函数:返回JSONObject [text:"custom"]
   */
  _self.addEventListener = function (pMethod, pCallback) {
    if (ExistQtEnvironment()) {
      QCefClient.addEventListener(pMethod, pCallback);
    }
  };

  _self.removeEventListener = function (pMethod, pCallback) {
    if (ExistQtEnvironment()) {
      QCefClient.removeEventListener(pMethod, pCallback);
    }
  };

  /**
   * 调用 Qt 已内置的Query方法
   * @param pArgs     请求参数列表
   * @param success   成功回调事件
   * @param failure   失败回调事件
   */
  _self.executeQuery = function (pArgs, success, failure) {
    if (ExistQtEnvironment()) {
      let query = {
        request: pArgs,
        onSuccess: function (response) {
          if (typeof success === 'function') {
            success(response);
          }
        },
        onFailure: function (error_code, error_message) {
          if (typeof failure === 'function') {
            failure(error_code, error_message);
          }
        },
      };
      window.QCefQuery(query);
    }
  };

  /**
   * 检查运行环境
   * @returns {boolean}
   */
  function ExistQtEnvironment() {
    return typeof QCefClient !== 'undefined';
  }

  return _self;
})();

QClient.Base.Utils = new (function () {
  const _self = this;

  /**
   * 页面直接通信
   * @param obj   string: 信号处理对象名称
   * @param evtName   string: 事件名称
   * @param value     string: 事件值
   */
  _self.sendPageMessage = function (obj, evtName, value) {
    //from page -> to page
    if (obj === '' || obj === null || !obj) {
      obj = '__default__';
    }
    if (typeof evtName !== 'undefined' && evtName)
      QClient.Base.invokeQtEvent([
        'QExecuteInvoke',
        obj,
        'QSendPageSignal',
        evtName,
        value,
      ]);
  };

  /**
   * 执行全局定义的方法
   * @param obj    string: 执行对象名称，当该值不存在时从全局定义(commucate)查找
   * @param signalName    string: 信号名称
   * @param params    array|string: 传递参数, 和callback一起组成QStringList
   * @param callback  function: 回调函数
   * @param callOnce  bool: 回调一次就销毁当前事件注册，还是允许多次
   */
  _self.invokeGMethod = function (
    obj,
    signalName,
    params,
    callback,
    callOnce = true
  ) {
    //"signal name", []
    if (obj === '' || obj === null || !obj) {
      obj = '__default__';
    }
    if (typeof callback === 'function') {
      let callId = QClient.Ext.Utils.createGUID();
      let qtCallback = function (pVal) {
        if (callOnce === true) {
          QClient.Base.removeEventListener(callId, qtCallback);
        }
        let result;
        try {
          result = JSON.parse(pVal['text']);
        } catch (e) {
          result = pVal['text'];
        }
        callback(result);
      };
      QClient.Base.addEventListener(callId, qtCallback);
      QClient.Base.invokeQtEvent(
        ['QExecuteInvoke', obj].concat(signalName).concat(params).concat(callId)
      );
    } else {
      QClient.Base.invokeQtEvent(
        ['QExecuteInvoke', obj].concat(signalName).concat(params)
      );
    }
  };

  /**
   * 执行当前页面方法
   * @param method    string: 方法名称
   * @param params    array|string: 传递参数, 和callback一起组成QStringList
   * @param callback  function: 回调函数
   * @param callOnce  bool: 回调一次就销毁当前事件注册，还是允许多次
   */
  _self.invokeMethod = function (method, params, callback, callOnce = true) {
    if (typeof callback === 'function') {
      let callId = QClient.Ext.Utils.createGUID();
      let qtCallback = function (pVal) {
        if (callOnce === true) {
          QClient.Base.removeEventListener(callId, qtCallback);
        }
        let result;
        try {
          result = JSON.parse(pVal['text']);
        } catch (e) {
          result = pVal['text'];
        }
        callback(result);
      };
      QClient.Base.addEventListener(callId, qtCallback);
      QClient.Base.invokeQtEvent([method].concat(params).concat(callId));
    } else {
      QClient.Base.invokeQtEvent([method].concat(params));
    }
  };

  /**
   *  QCefQuery调用
   * @param method    string: 方法名称
   * @param params    json|"": 参数传递
   * @param success   function: 成功回调函数
   * @param failure   function: 失败回调函数
   */
  _self.executeQuery = function (method, params, success, failure) {
    let vParam = typeof params !== 'object' ? {} : params;
    let object = Object.assign({}, { method }, vParam);
    QClient.Base.executeQuery(JSON.stringify(object), success, failure);
  };

  return _self;
})();

QClient.Ext = {};
QClient.Ext.URL = new (function () {
  const _self = this;

  _self.getQueryString = function () {
    if (arguments.length === 1) {
      return _getQueryString(window.location.search, arguments[0]);
    } else if (arguments.length === 2) {
      return _getQueryString(arguments[0], arguments[1]);
    }
    return null;
  };

  function _getQueryString(location, name) {
    let index = location.indexOf('?');
    if (index === -1) return null;
    let reg = new RegExp('(^|&)' + name + '=([^&]*)(&|$)', 'i');
    let r = location.substr(index + 1).match(reg);
    if (r != null) return decodeURI(r[2]);
    return null;
  }

  return _self;
})();

QClient.Ext.Utils = new (function () {
  const _self = this;

  _self.createGUID = function () {
    //创建UUID
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(
      /[xy]/g,
      function (c) {
        let r = (Math.random() * 16) | 0,
          v = c === 'x' ? r : (r & 0x3) | 0x8;
        return v.toString(16);
      }
    );
  };

  _self.throttle = function (method, context) {
    //重置窗口
    clearTimeout(method.tId);
    method.tId = setTimeout(function () {
      method.call(context);
    }, 100);
  };

  _self.delayExecute = function (method, time) {
    //延迟执行
    if (typeof time === 'undefined' || !time) {
      time = 5;
    }
    setTimeout(method, time);
  };

  return _self;
})();
