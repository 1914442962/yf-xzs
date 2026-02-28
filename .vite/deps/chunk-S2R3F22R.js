import {
  computed,
  createCommentVNode,
  h,
  inject,
  provide,
  reactive
} from "./chunk-PXUTNTA2.js";
import {
  require_xe_utils
} from "./chunk-OZ7H3HZS.js";
import {
  __toESM
} from "./chunk-PR4QN5HX.js";

// node_modules/@vxe-ui/core/es/src/core.js
var coreVersion = "4.3.1";
var VxeCore = {
  coreVersion,
  uiVersion: "",
  tableVersion: "",
  designVersion: "",
  ganttVersion: ""
};

// node_modules/@vxe-ui/core/es/src/themeStore.js
var themeConfigStore = {
  theme: ""
};

// node_modules/@vxe-ui/core/es/src/theme.js
function setTheme(name) {
  const theme = !name || name === "default" ? "light" : name;
  themeConfigStore.theme = theme;
  if (typeof document !== "undefined") {
    const documentElement = document.documentElement;
    if (documentElement) {
      documentElement.setAttribute("data-vxe-ui-theme", theme);
    }
  }
  return VxeCore;
}
function getTheme() {
  return themeConfigStore.theme;
}

// node_modules/@vxe-ui/core/es/src/config.js
var import_xe_utils = __toESM(require_xe_utils());

// node_modules/dom-zindex/es/index.esm.js
var winDom = null;
var bodyEl = null;
var storeEl = null;
var storeId = "z-index-manage";
var styleEl = null;
var styleId = "z-index-style";
var storeMainKey = "m";
var storeSubKey = "s";
var storeData = {
  m: 1e3,
  s: 1e3
};
function getDocument() {
  if (!winDom) {
    if (typeof document !== "undefined") {
      winDom = document;
    }
  }
  return winDom;
}
function getBody() {
  if (winDom && !bodyEl) {
    bodyEl = winDom.body || winDom.getElementsByTagName("body")[0];
  }
  return bodyEl;
}
function getDomMaxZIndex() {
  var max = 0;
  var dom = getDocument();
  if (dom) {
    var body = getBody();
    if (body) {
      var allElem = body.getElementsByTagName("*");
      for (var i = 0; i < allElem.length; i++) {
        var elem = allElem[i];
        if (elem && elem.style && elem.nodeType === 1) {
          var zIndex = elem.style.zIndex;
          if (zIndex && /^\d+$/.test(zIndex)) {
            max = Math.max(max, Number(zIndex));
          }
        }
      }
    }
  }
  return max;
}
function getStyle() {
  if (!styleEl) {
    var dom = getDocument();
    if (dom) {
      styleEl = dom.getElementById(styleId);
      if (!styleEl) {
        styleEl = dom.createElement("style");
        styleEl.id = styleId;
        dom.getElementsByTagName("head")[0].appendChild(styleEl);
      }
    }
  }
  return styleEl;
}
function updateVar() {
  var styEl = getStyle();
  if (styEl) {
    var prefixes = "--dom-";
    var propKey = "-z-index";
    styEl.innerHTML = ":root{" + prefixes + "main" + propKey + ":" + getCurrent() + ";" + prefixes + "sub" + propKey + ":" + getSubCurrent() + "}";
  }
}
function getStoreDom() {
  if (!storeEl) {
    var dom = getDocument();
    if (dom) {
      storeEl = dom.getElementById(storeId);
      if (!storeEl) {
        var body = getBody();
        if (body) {
          storeEl = dom.createElement("div");
          storeEl.id = storeId;
          storeEl.style.display = "none";
          body.appendChild(storeEl);
          setCurrent(storeData.m);
          setSubCurrent(storeData.s);
        }
      }
    }
  }
  return storeEl;
}
function createSetHandle(key) {
  return function(value) {
    if (value) {
      value = Number(value);
      storeData[key] = value;
      var el = getStoreDom();
      if (el) {
        if (el.dataset) {
          el.dataset[key] = value + "";
        } else {
          el.setAttribute("data-" + key, value + "");
        }
      }
    }
    updateVar();
    return storeData[key];
  };
}
var setCurrent = createSetHandle(storeMainKey);
function createGetHandle(key, nextMethod) {
  return function getCurrent2(currZindex) {
    var zIndex;
    var el = getStoreDom();
    if (el) {
      var domVal = el.dataset ? el.dataset[key] : el.getAttribute("data-" + key);
      if (domVal) {
        zIndex = Number(domVal);
      }
    }
    if (!zIndex) {
      zIndex = storeData[key];
    }
    if (currZindex) {
      if (Number(currZindex) < zIndex) {
        return nextMethod();
      }
      return currZindex;
    }
    return zIndex;
  };
}
var getCurrent = createGetHandle(storeMainKey, getNext);
function getNext() {
  return setCurrent(getCurrent() + 1);
}
var setSubCurrent = createSetHandle(storeSubKey);
var _getSubCurrent = createGetHandle(storeSubKey, getSubNext);
function getSubCurrent() {
  return getCurrent() + _getSubCurrent();
}
function getSubNext() {
  setSubCurrent(_getSubCurrent() + 1);
  return getSubCurrent();
}
var DomZIndex = {
  setCurrent,
  getCurrent,
  getNext,
  setSubCurrent,
  getSubCurrent,
  getSubNext,
  getMax: getDomMaxZIndex
};
updateVar();
var index_esm_default = DomZIndex;

// node_modules/@vxe-ui/core/es/src/configStore.js
var globalConfigStore = {
  size: "",
  version: 1,
  zIndex: 999,
  resizeInterval: 500
};

// node_modules/@vxe-ui/core/es/src/config.js
function setConfig(options) {
  if (options) {
    if (options.zIndex) {
      index_esm_default.setCurrent(options.zIndex);
    }
    if (options.theme) {
      setTheme(options.theme);
    }
    import_xe_utils.default.merge(globalConfigStore, options);
  }
  return VxeCore;
}
function getConfig(key, defaultValue) {
  return arguments.length ? import_xe_utils.default.get(globalConfigStore, key, defaultValue) : globalConfigStore;
}

// node_modules/@vxe-ui/core/es/src/dataStore.js
var globalStore = {};

// node_modules/@vxe-ui/core/es/src/vm.js
var import_xe_utils2 = __toESM(require_xe_utils());
function getSlotVNs(vns) {
  if (import_xe_utils2.default.isArray(vns)) {
    return vns;
  }
  return vns ? [vns] : [];
}

// node_modules/@vxe-ui/core/es/src/icon.js
var import_xe_utils3 = __toESM(require_xe_utils());

// node_modules/@vxe-ui/core/es/src/iconStore.js
var iconConfigStore = {};

// node_modules/@vxe-ui/core/es/src/icon.js
function setIcon(options) {
  if (options) {
    Object.assign(iconConfigStore, options);
  }
  return VxeCore;
}
function getIcon(key) {
  return arguments.length ? import_xe_utils3.default.get(iconConfigStore, key) : iconConfigStore;
}
function renderGlobalIcon(name) {
  const icon = getIcon(name);
  return renderCustomIcon(icon, name);
}
function renderCustomIcon(icon, name) {
  if (import_xe_utils3.default.isFunction(icon)) {
    return h("span", {}, getSlotVNs(icon({ name })));
  }
  return h("i", {
    class: icon
  });
}

// node_modules/@vxe-ui/core/es/src/event.js
var import_xe_utils4 = __toESM(require_xe_utils());
var GLOBAL_EVENT_KEYS = {
  F2: "F2",
  ESCAPE: "Escape",
  ENTER: "Enter",
  TAB: "Tab",
  DELETE: "Delete",
  BACKSPACE: "Backspace",
  SPACEBAR: " ",
  CONTEXT_MENU: "ContextMenu",
  ARROW_UP: "ArrowUp",
  ARROW_DOWN: "ArrowDown",
  ARROW_LEFT: "ArrowLeft",
  ARROW_RIGHT: "ArrowRight",
  PAGE_UP: "PageUp",
  PAGE_DOWN: "PageDown",
  Control: "Control",
  R: "R",
  P: "P",
  Z: "Z",
  X: "X",
  C: "C",
  V: "V",
  M: "M"
};
var browse = import_xe_utils4.default.browse();
var convertEventKeys = {
  " ": "Spacebar",
  Apps: GLOBAL_EVENT_KEYS.CONTEXT_MENU,
  Del: GLOBAL_EVENT_KEYS.DELETE,
  Up: GLOBAL_EVENT_KEYS.ARROW_UP,
  Down: GLOBAL_EVENT_KEYS.ARROW_DOWN,
  Left: GLOBAL_EVENT_KEYS.ARROW_LEFT,
  Right: GLOBAL_EVENT_KEYS.ARROW_RIGHT
};
var wheelName = browse.firefox ? "DOMMouseScroll" : "mousewheel";
var eventStore = [];
function triggerEvent(evnt) {
  const isWheel = evnt.type === wheelName;
  eventStore.forEach(({ type, cb }) => {
    if (!evnt.cancelBubble) {
      if (type === evnt.type || isWheel && type === "mousewheel") {
        cb(evnt);
      }
    }
  });
}
var VxeComponentEvent = class {
  constructor(evnt, params1, params2) {
    Object.defineProperty(this, "$event", {
      enumerable: true,
      configurable: true,
      writable: true,
      value: void 0
    });
    Object.defineProperty(this, "type", {
      enumerable: true,
      configurable: true,
      writable: true,
      value: ""
    });
    Object.defineProperty(this, "key", {
      enumerable: true,
      configurable: true,
      writable: true,
      value: ""
    });
    Object.defineProperty(this, "code", {
      enumerable: true,
      configurable: true,
      writable: true,
      value: ""
    });
    this.$event = evnt;
    if (evnt) {
      if (evnt.type) {
        this.type = evnt.type;
      }
      if (evnt.key) {
        this.key = evnt.key;
      }
      if (evnt.code) {
        this.code = evnt.code;
      }
    }
    Object.assign(this, params1);
    import_xe_utils4.default.objectEach(params2, (val, key) => {
      if (import_xe_utils4.default.isFunction(val)) {
        let rest = null;
        let isRun = false;
        Object.defineProperty(this, key, {
          get() {
            if (!isRun) {
              isRun = true;
              rest = val();
            }
            return rest;
          }
        });
      } else {
        this[key] = val;
      }
    });
  }
  stopPropagation() {
    const evnt = this.$event;
    if (evnt) {
      evnt.stopPropagation();
    }
  }
  preventDefault() {
    const evnt = this.$event;
    if (evnt) {
      evnt.preventDefault();
    }
  }
};
var createEvent = (evnt, params1, params2) => {
  if (evnt instanceof VxeComponentEvent) {
    evnt = evnt.$event;
  }
  return new VxeComponentEvent(evnt, params1, params2);
};
var globalEvents = {
  on(comp, type, cb) {
    eventStore.push({ comp, type, cb });
  },
  off(comp, type) {
    import_xe_utils4.default.remove(eventStore, (item) => item.comp === comp && item.type === type);
  },
  hasKey(evnt, targetKey) {
    const { key } = evnt;
    targetKey = targetKey.toLowerCase();
    return key ? targetKey === key.toLowerCase() || !!(convertEventKeys[key] && convertEventKeys[key].toLowerCase() === targetKey) : false;
  }
};
if (browse.isDoc) {
  if (!browse.msie) {
    window.addEventListener("copy", triggerEvent, false);
    window.addEventListener("cut", triggerEvent, false);
    window.addEventListener("paste", triggerEvent, false);
  }
  document.addEventListener("keydown", triggerEvent, false);
  document.addEventListener("contextmenu", triggerEvent, false);
  window.addEventListener("mousedown", triggerEvent, false);
  window.addEventListener("blur", triggerEvent, false);
  window.addEventListener("resize", triggerEvent, false);
  window.addEventListener(wheelName, import_xe_utils4.default.throttle(triggerEvent, 100, { leading: true, trailing: false }), { passive: true, capture: false });
}

// node_modules/@vxe-ui/core/es/src/resize.js
var import_xe_utils5 = __toESM(require_xe_utils());
var resizeTimeout;
var eventStore2 = [];
var defaultInterval = 500;
function eventHandle() {
  if (eventStore2.length) {
    eventStore2.forEach((item) => {
      item.tarList.forEach((observer) => {
        const { target, width, heighe } = observer;
        const clientWidth = target.clientWidth;
        const clientHeight = target.clientHeight;
        const rWidth = clientWidth && width !== clientWidth;
        const rHeight = clientHeight && heighe !== clientHeight;
        if (rWidth || rHeight) {
          observer.width = clientWidth;
          observer.heighe = clientHeight;
          setTimeout(item.callback);
        }
      });
    });
    eventListener();
  }
}
function eventListener() {
  clearTimeout(resizeTimeout);
  resizeTimeout = setTimeout(eventHandle, globalConfigStore.resizeInterval || defaultInterval);
}
var XEResizeObserver = class {
  constructor(callback) {
    Object.defineProperty(this, "tarList", {
      enumerable: true,
      configurable: true,
      writable: true,
      value: []
    });
    Object.defineProperty(this, "callback", {
      enumerable: true,
      configurable: true,
      writable: true,
      value: void 0
    });
    this.callback = callback;
  }
  observe(target) {
    if (target) {
      const { tarList } = this;
      if (!tarList.some((observer) => observer.target === target)) {
        tarList.push({
          target,
          width: target.clientWidth,
          heighe: target.clientHeight
        });
      }
      if (!eventStore2.length) {
        eventListener();
      }
      if (!eventStore2.some((item) => item === this)) {
        eventStore2.push(this);
      }
    }
  }
  unobserve(target) {
    import_xe_utils5.default.remove(eventStore2, (item) => item.tarList.some((observer) => observer.target === target));
  }
  disconnect() {
    import_xe_utils5.default.remove(eventStore2, (item) => item === this);
  }
};
var globalResize = {
  create(callback) {
    if (window.ResizeObserver) {
      return new window.ResizeObserver(callback);
    }
    return new XEResizeObserver(callback);
  }
};

// node_modules/@vxe-ui/core/es/src/i18n.js
var import_xe_utils6 = __toESM(require_xe_utils());

// node_modules/@vxe-ui/core/es/src/i18nStore.js
var i18nConfigStore = reactive({
  language: "",
  langMaps: {}
});

// node_modules/@vxe-ui/core/es/src/i18n.js
var checkInstall = false;
var cacheMaps = {};
function getI18n(key, args) {
  const { langMaps, language } = i18nConfigStore;
  const { i18n } = globalConfigStore;
  if (i18n) {
    return `${i18n(key, args) || ""}`;
  }
  if (!checkInstall) {
    if (!langMaps[language]) {
      console.error(`[vxe core] 语言包未安装。Language not installed. https://${VxeCore.uiVersion ? "vxeui.com" : "vxetable.cn"}/#/start/i18n`);
    }
    checkInstall = true;
  }
  if (!args && cacheMaps[key]) {
    return cacheMaps[key];
  }
  const i18nLabel = import_xe_utils6.default.toFormatString(import_xe_utils6.default.get(langMaps[language], key, key), args);
  if (!args) {
    cacheMaps[key] = i18nLabel;
  }
  return i18nLabel;
}
function setLanguage(locale) {
  const { language } = i18nConfigStore;
  const targetlang = locale || "zh-CN";
  if (language !== targetlang) {
    i18nConfigStore.language = targetlang;
    cacheMaps = {};
  }
  return VxeCore;
}
function setI18n(locale, data) {
  i18nConfigStore.langMaps[locale] = Object.assign({}, data);
  return VxeCore;
}
function hasLanguage(language) {
  const { langMaps } = i18nConfigStore;
  return !!langMaps[language];
}
function getLanguage() {
  const { language } = i18nConfigStore;
  return language;
}

// node_modules/@vxe-ui/core/es/src/log.js
function createLog(type, name) {
  return function(key, args) {
    const msg = `[vxe ${name || ""}] ${getI18n(key, args)}`;
    console[type](msg);
    return msg;
  };
}
var version = "4.3.1";
var log = {
  create: createLog,
  warn: createLog("warn", `v${version}`),
  err: createLog("error", `v${version}`)
};

// node_modules/@vxe-ui/core/es/src/renderer.js
var import_xe_utils7 = __toESM(require_xe_utils());
var renderMap = {};
var renderer = {
  mixin(opts) {
    import_xe_utils7.default.each(opts, (options, name) => renderer.add(name, options));
    return renderer;
  },
  get(name) {
    return renderMap[name] || null;
  },
  add(name, options) {
    if (name && options) {
      const renders = renderMap[name];
      if (renders) {
        import_xe_utils7.default.each(options, (val, key) => {
          if (!import_xe_utils7.default.eqNull(renders[key]) && renders[key] !== val) {
            log.warn("vxe.error.coverProp", [`Renderer.${name}`, key]);
          }
        });
        Object.assign(renders, options);
      } else {
        renderMap[name] = options;
      }
    }
    return renderer;
  },
  forEach(callback) {
    import_xe_utils7.default.objectEach(renderMap, callback);
    return renderer;
  },
  delete(name) {
    delete renderMap[name];
    return renderer;
  }
};

// node_modules/@vxe-ui/core/es/src/store.js
var import_xe_utils8 = __toESM(require_xe_utils());
var Store = class {
  constructor() {
    Object.defineProperty(this, "store", {
      enumerable: true,
      configurable: true,
      writable: true,
      value: {}
    });
  }
  mixin(options) {
    import_xe_utils8.default.each(options, (item, key) => {
      this.add(key, item);
    });
    return this;
  }
  has(name) {
    return !!this.get(name);
  }
  get(name) {
    return this.store[name];
  }
  add(name, options) {
    const conf = this.store[name];
    const confKeys = import_xe_utils8.default.keys(conf);
    import_xe_utils8.default.each(options, (item, key) => {
      if (confKeys.includes(key)) {
        log.warn("vxe.error.coverProp", [name, key]);
      }
    });
    this.store[name] = conf ? import_xe_utils8.default.merge(conf, options) : options;
    return this;
  }
  delete(name) {
    delete this.store[name];
  }
  forEach(callback) {
    import_xe_utils8.default.objectEach(this.store, callback);
  }
};
var store_default = Store;

// node_modules/@vxe-ui/core/es/src/validators.js
var validators = new store_default();
Object.assign(validators, { _name: "Validators" });

// node_modules/@vxe-ui/core/es/src/menus.js
var import_xe_utils9 = __toESM(require_xe_utils());
var VXEMenusStore = class {
  constructor() {
    Object.defineProperty(this, "store", {
      enumerable: true,
      configurable: true,
      writable: true,
      value: {}
    });
  }
  mixin(options) {
    import_xe_utils9.default.each(options, (item, key) => {
      this.add(key, item);
    });
    return this;
  }
  has(name) {
    return !!this.get(name);
  }
  get(name) {
    return this.store[name];
  }
  add(name, render) {
    const conf = this.store[name];
    if (import_xe_utils9.default.isFunction(render)) {
      log.warn("vxe.error.delProp", ["menus -> callback", "menuMethod"]);
      render = {
        menuMethod: render
      };
    }
    const confKeys = import_xe_utils9.default.keys(conf);
    import_xe_utils9.default.each(render, (item, key) => {
      if (confKeys.includes(key)) {
        log.warn("vxe.error.coverProp", [name, key]);
      }
    });
    this.store[name] = conf ? import_xe_utils9.default.merge(conf, render) : render;
    return this;
  }
  delete(name) {
    delete this.store[name];
  }
  forEach(callback) {
    import_xe_utils9.default.objectEach(this.store, callback);
  }
};
var menus = new VXEMenusStore();
Object.assign(menus, { _name: "Menus" });

// node_modules/@vxe-ui/core/es/src/formats.js
var import_xe_utils10 = __toESM(require_xe_utils());
var VXEFormatsStore = class {
  constructor() {
    Object.defineProperty(this, "store", {
      enumerable: true,
      configurable: true,
      writable: true,
      value: {}
    });
  }
  mixin(options) {
    import_xe_utils10.default.each(options, (item, key) => {
      this.add(key, item);
    });
    return this;
  }
  has(name) {
    return !!this.get(name);
  }
  get(name) {
    return this.store[name];
  }
  add(name, render) {
    const conf = this.store[name];
    if (import_xe_utils10.default.isFunction(render)) {
      log.warn("vxe.error.delProp", ["formats -> callback", "cellFormatMethod"]);
      render = {
        cellFormatMethod: render
      };
    }
    const confKeys = import_xe_utils10.default.keys(conf);
    import_xe_utils10.default.each(render, (item, key) => {
      if (confKeys.includes(key)) {
        log.warn("vxe.error.coverProp", [name, key]);
      }
    });
    this.store[name] = conf ? import_xe_utils10.default.merge(conf, render) : render;
    return this;
  }
  delete(name) {
    delete this.store[name];
  }
  forEach(callback) {
    import_xe_utils10.default.objectEach(this.store, callback);
  }
};
var formats = new VXEFormatsStore();
Object.assign(formats, { _name: "Formats" });

// node_modules/@vxe-ui/core/es/src/commands.js
var import_xe_utils11 = __toESM(require_xe_utils());
var VXECommandsStore = class {
  constructor() {
    Object.defineProperty(this, "store", {
      enumerable: true,
      configurable: true,
      writable: true,
      value: {}
    });
  }
  mixin(options) {
    import_xe_utils11.default.each(options, (item, key) => {
      this.add(key, item);
    });
    return this;
  }
  has(name) {
    return !!this.get(name);
  }
  get(name) {
    return this.store[name];
  }
  add(name, render) {
    const conf = this.store[name];
    if (import_xe_utils11.default.isFunction(render)) {
      log.warn("vxe.error.delProp", ["commands -> callback", "commandMethod"]);
      render = {
        commandMethod: render
      };
    }
    const confKeys = import_xe_utils11.default.keys(conf);
    import_xe_utils11.default.each(render, (item, key) => {
      if (confKeys.includes(key)) {
        log.warn("vxe.error.coverProp", [name, key]);
      }
    });
    this.store[name] = conf ? import_xe_utils11.default.merge(conf, render) : render;
    return this;
  }
  delete(name) {
    delete this.store[name];
  }
  forEach(callback) {
    import_xe_utils11.default.objectEach(this.store, callback);
  }
};
var commands = new VXECommandsStore();
Object.assign(commands, { _name: "Commands" });

// node_modules/@vxe-ui/core/es/src/interceptor.js
var import_xe_utils12 = __toESM(require_xe_utils());
var storeMap = {};
var interceptor = {
  mixin(options) {
    import_xe_utils12.default.each(options, (render, type) => {
      interceptor.add(type, render);
    });
    return interceptor;
  },
  get(type) {
    if (type) {
      return storeMap[type] || [];
    }
    return [];
  },
  add(type, render) {
    if (import_xe_utils12.default.isFunction(render)) {
      render = {
        tableInterceptorMethod: render
      };
    }
    const callback = render.tableInterceptorMethod;
    if (callback) {
      let eList = storeMap[type];
      if (!eList) {
        eList = storeMap[type] = [];
      }
      if (eList.indexOf(callback) > -1) {
        log.warn("vxe.error.coverProp", ["Interceptor", type]);
      }
      eList.push(callback);
    }
    return interceptor;
  },
  delete(type, render) {
    const eList = storeMap[type];
    if (eList) {
      if (import_xe_utils12.default.isFunction(render)) {
        render = {
          tableInterceptorMethod: render
        };
      }
      const callback = render ? render.tableInterceptorMethod : null;
      if (callback) {
        import_xe_utils12.default.remove(eList, (fn) => fn === callback);
      } else {
        delete storeMap[type];
      }
    }
  }
};

// node_modules/@vxe-ui/core/es/src/clipboard.js
var import_xe_utils13 = __toESM(require_xe_utils());
var copyElem;
var clipStore = {
  text: "",
  html: ""
};
function handleText(text) {
  if (!copyElem) {
    copyElem = document.createElement("textarea");
    copyElem.id = "$VxeCopy";
    const styles = copyElem.style;
    styles.width = "48px";
    styles.height = "24px";
    styles.position = "fixed";
    styles.zIndex = "0";
    styles.left = "-500px";
    styles.top = "-500px";
    document.body.appendChild(copyElem);
  }
  copyElem.value = text;
}
var clipboard = {
  getStore() {
    return clipStore;
  },
  setStore(data) {
    Object.assign(clipStore, data || {});
  },
  /**
   * 复制内容到剪贴板
   *
   * @param {String} content Text 内容
   */
  copy(content) {
    let result = false;
    try {
      const text = import_xe_utils13.default.toValueString(content);
      handleText(text);
      copyElem.select();
      copyElem.setSelectionRange(0, copyElem.value.length);
      result = document.execCommand("copy");
      copyElem.blur();
      clipStore.text = text;
      clipStore.html = "";
    } catch (e) {
    }
    return result;
  },
  getText() {
    return clipStore.text || "";
  }
};

// node_modules/@vxe-ui/core/es/src/permission.js
var import_xe_utils14 = __toESM(require_xe_utils());
function handleCheckInfo(permissionCode, permissionMethod) {
  let checkVisible = true;
  let checkDisabled = false;
  const checkMethod = permissionMethod || globalConfigStore.permissionMethod;
  if (permissionCode && checkMethod) {
    checkVisible = false;
    checkDisabled = true;
    let vDone = false;
    let dDone = false;
    const codeList = String(permissionCode).split("|");
    for (let i = 0; i < codeList.length; i++) {
      const code = codeList[i];
      let visible = true;
      let disabled = false;
      const rest = checkMethod({ code });
      if (import_xe_utils14.default.isBoolean(rest)) {
        visible = rest;
      } else if (rest) {
        visible = !!rest.visible;
        disabled = !!rest.disabled;
      }
      if (!disabled && !dDone) {
        dDone = true;
        checkDisabled = disabled;
      }
      if (visible && !vDone) {
        vDone = true;
        checkVisible = visible;
      }
      if (vDone && dDone) {
        break;
      }
    }
  }
  const info = {
    code: permissionCode,
    visible: checkVisible,
    disabled: checkDisabled
  };
  return info;
}
var permission = {
  getCheckInfo(code) {
    return handleCheckInfo(code);
  },
  checkVisible(code) {
    const permissionInfo = handleCheckInfo(code);
    return permissionInfo.visible;
  },
  checkDisable(code) {
    const permissionInfo = handleCheckInfo(code);
    return permissionInfo.disabled;
  }
};

// node_modules/@vxe-ui/core/es/src/hooks.js
var hooks = new store_default();

// node_modules/@vxe-ui/core/es/src/useFns.js
function useSize(props) {
  const xeSizeInfo = inject("xeSizeInfo", null);
  const computeSize = computed(() => {
    return props.size || (xeSizeInfo ? xeSizeInfo.value : null);
  });
  provide("xeSizeInfo", computeSize);
  return { computeSize };
}
function usePermission(props) {
  const computePermissionInfo = computed(() => {
    return handleCheckInfo(props.permissionCode, props.permissionMethod);
  });
  return {
    computePermissionInfo
  };
}
var useFns = {
  useSize,
  usePermission
};

// node_modules/@vxe-ui/core/es/index.esm.js
var import_xe_utils15 = __toESM(require_xe_utils());
var installedPlugins = [];
function use(Plugin, options) {
  if (Plugin && Plugin.install) {
    if (installedPlugins.indexOf(Plugin) === -1) {
      Plugin.install(VxeUI, options);
      installedPlugins.push(Plugin);
    }
  }
  return VxeUI;
}
var components = {};
function getComponent(name) {
  return components[name] || null;
}
function hasComponent(name) {
  return !!components[name];
}
function component(comp) {
  if (comp && comp.name) {
    components[comp.name] = comp;
    components[import_xe_utils15.default.kebabCase(comp.name)] = comp;
  }
}
function renderEmptyElement() {
  return createCommentVNode();
}
function checkVersion(version2, pVersion, sVersion) {
  if (version2) {
    const vRest = `${version2}`.match(/(\d+).(\d+).(\d+)/);
    if (vRest) {
      const pV = import_xe_utils15.default.toNumber(vRest[1]);
      if (sVersion) {
        const sV = import_xe_utils15.default.toNumber(vRest[2]);
        return pV >= pVersion && sV >= sVersion;
      }
      return pV >= pVersion;
    }
  }
  return false;
}
var VxeUI = Object.assign(VxeCore, {
  renderEmptyElement,
  setTheme,
  getTheme,
  setConfig,
  getConfig,
  setIcon,
  getIcon,
  renderGlobalIcon,
  renderCustomIcon,
  setLanguage,
  hasLanguage,
  getLanguage,
  setI18n,
  getI18n,
  globalEvents,
  GLOBAL_EVENT_KEYS,
  createEvent,
  globalResize,
  renderer,
  validators,
  menus,
  formats,
  commands,
  interceptor,
  clipboard,
  log,
  permission,
  globalStore,
  hooks,
  component,
  getComponent,
  hasComponent,
  useFns,
  getSlotVNs,
  checkVersion,
  use
});
setTheme();

export {
  coreVersion,
  VxeCore,
  index_esm_default,
  setTheme,
  getTheme,
  setConfig,
  getConfig,
  globalStore,
  getSlotVNs,
  setIcon,
  getIcon,
  renderGlobalIcon,
  renderCustomIcon,
  GLOBAL_EVENT_KEYS,
  createEvent,
  globalEvents,
  globalResize,
  getI18n,
  setLanguage,
  setI18n,
  hasLanguage,
  getLanguage,
  log,
  renderer,
  validators,
  menus,
  formats,
  commands,
  interceptor,
  clipboard,
  handleCheckInfo,
  permission,
  hooks,
  useSize,
  usePermission,
  useFns,
  use,
  getComponent,
  hasComponent,
  component,
  renderEmptyElement,
  checkVersion,
  VxeUI
};
//# sourceMappingURL=chunk-S2R3F22R.js.map
