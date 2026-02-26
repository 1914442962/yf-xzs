import { createStore } from "vuex";
import CookiesUtil from "@/utils/cookies.utils";
import { resetRouter } from "@/router/index.js";
import { TOKEN_KEY } from "@/enums/CacheEnum.js";
import userApi from "@/api/user-api.js";
import commonApi from "@/api/common-api.js";

export default createStore({
  state: {
    userInfo: {},
    staticOptionsObj: {
      gzfs: [
        { label: "N-1", value: "N-1" },
        { label: "N-2", value: "N-2" },
      ],
      glbm: [
        { label: "管理部", value: "管理部" },
        { label: "设备部", value: "设备部" },
      ],
      yjjb: [
        { label: "五级风险", value: "五级风险" },
        { label: "六级风险", value: "六级风险" },
        { label: "七级风险", value: "七级风险" },
        { label: "八级风险", value: "八级风险" },
      ],
      fbcj: [
        { label: "省调", value: "省调" },
        { label: "地调", value: "地调" },
        { label: "县调", value: "县调" },
      ],
      yjfbdw: [
        { label: "省调发布", value: "省调发布" },
        { label: "地调发布", value: "地调发布" },
        { label: "委托地调发布", value: "委托地调发布" },
      ],
      sbgx: [
        {
          label: "国调管辖",
          value: "国调管辖",
        },
        {
          label: "国调许可",
          value: "国调许可",
        },
        {
          label: "网调管辖",
          value: "网调管辖",
        },
        {
          label: "网调许可",
          value: "网调许可",
        },
        {
          label: "省调管辖",
          value: "省调管辖",
        },
        {
          label: "省调许可",
          value: "省调许可",
        },
        {
          label: "地调管辖",
          value: "地调管辖",
        },
        {
          label: "地调许可",
          value: "地调许可",
        },
        {
          label: "配调管辖",
          value: "配调管辖",
        },
        {
          label: "配调许可",
          value: "配调许可",
        },
        {
          label: "县调管辖",
          value: "县调管辖",
        },
        {
          label: "县调许可",
          value: "县调许可",
        },
      ],
      ydydj: [
        { label: "1000", value: "1000" },
        { label: "800", value: "800" },
        { label: "750", value: "750" },
        { label: "660", value: "660" },
        { label: "500", value: "500" },
        { label: "400", value: "400" },
        { label: "330", value: "330" },
        { label: "220", value: "220" },
        { label: "110", value: "110" },
        { label: "66", value: "66" },
        { label: "35", value: "35" },
        { label: "22", value: "22" },
        { label: "20", value: "20" },
        { label: "10", value: "10" },
        { label: "6", value: "6" },
      ],
      ndydj: [
        { label: "110", value: "110" },
        { label: "35", value: "35" },
        { label: "20", value: "20" },
        { label: "10", value: "10" },
      ],
      bdzdydj: [
        { label: "500", value: "500" },
        { label: "220", value: "220" },
        { label: "110", value: "110" },
        { label: "35", value: "35" },
        { label: "20", value: "20" },
        { label: "10", value: "10" },
      ],
      fszt: [
        { label: "临时方式", value: "临时方式" },
        { label: "正常方式", value: "正常方式" },
      ],
      fslx: [
        { label: "事故异常处理", value: "事故异常处理" },
        { label: "设备重载调整", value: "设备重载调整" },
        { label: "其他方式调整", value: "其他方式调整" },
      ],
      sblx: [
        { label: "主变", value: "主变" },
        { label: "母线", value: "母线" },
        { label: "线路", value: "线路" },
        { label: "开关", value: "开关" },
        { label: "机组", value: "机组" },
        { label: "厂站", value: "厂站" },
      ],
      dqList: [
        { value: "江苏", label: "江苏" },
        { value: "常州", label: "常州" },
        { value: "淮安", label: "淮安" },
        { value: "连云港", label: "连云港" },
        { value: "南京", label: "南京" },
        { value: "南通", label: "南通" },
        { value: "苏州", label: "苏州" },
        { value: "宿迁", label: "宿迁" },
        { value: "泰州", label: "泰州" },
        { value: "无锡", label: "无锡" },
        { value: "徐州", label: "徐州" },
        { value: "盐城", label: "盐城" },
        { value: "扬州", label: "扬州" },
        { value: "镇江", label: "镇江" },
      ],
      qx: [
        { value: "鼓楼区", label: "鼓楼区" },
        { value: "秦淮区", label: "秦淮区" },
        { value: "建邺区", label: "建邺区" },
        { value: "玄武区", label: "玄武区" },
        { value: "雨花台区", label: "雨花台区" },
        { value: "栖霞区", label: "栖霞区" },
        { value: "江宁区", label: "江宁区" },
        { value: "江北新区", label: "江北新区" },
        { value: "高淳区", label: "高淳区" },
        { value: "溧水区", label: "溧水区" },
        { value: "六合区", label: "六合区" },
      ],
      colors: [
        "#DC143C",
        "#FF1493",
        "#FF00FF",
        "#9932CC",
        "#6A5ACD",
        "#0000FF",
        "#00008B",
        "#778899",
        "#1E90FF",
        "#00BFFF",
        "#5F9EA0",
        "#00FFFF",
        "#008080",
        "#7FFFAA",
        "#3CB371",
        "#8FBC8F",
        "#008000",
        "#7CFC00",
        "#556B2F",
        "#FFFFE0",
        "#FFFF00",
        "#808000",
        "#EEE8AA",
        "#FFD700",
        "#FFA500",
        "#FF4500",
        "#FA8072",
        "#FF0000",
        "#800000",
        "#C0C0C0",
      ],
      bz: [
        { value: "剔除", label: "剔除" },
        { value: "增补", label: "增补" },
      ],
    },
    selectOptionsObj: {
      ggdx: [], //公告对象
      fq: [], //电网分区
      xzqy: [], //行政区域
      cz: [],
      zrz: [],
      jdpz: [],
      bdz: [],
    },
    staticOMSxl: {
      CZID: "",
      CZMC: "线路",
      DWMC: "",
      SSDW: "",
      czlx: "XL",
      id: "xl",
      label: "线路",
      stationType: "MW_APP.MWT_UD_SB_BDZ",
      tdcslx: "OMS",
    },
    d5000DefaultNode: { id: "113715891127975937", area: "江苏" },
    omsDefaultNode: {
      id: "2A3287A6-6073-48F3-A096-8CD55E3D4A81-00068",
      area: "江苏省电力公司",
    },
    token: "",
    // OMS厂站的前端匹配列表
    OMSCzList: [
      {
        deptId: null,
        id: "2A3287A6-6073-48F3-A096-8CD55E3D4A81-00157",
        isFirst: null,
        isPlant: null,
        isSbmb: null,
        level: null,
        name: "南京供电公司",
        pageFlag: null,
        pid: null,
        pname: null,
        leaf: true,
      },
      {
        deptId: null,
        id: "2A3287A6-6073-48F3-A096-8CD55E3D4A81-00163",
        isFirst: null,
        isPlant: null,
        isSbmb: null,
        level: null,
        name: "苏州供电公司",
        pageFlag: null,
        pid: null,
        pname: null,
        leaf: true,
      },
      {
        deptId: null,
        id: "2A3287A6-6073-48F3-A096-8CD55E3D4A81-00165",
        isFirst: null,
        isPlant: null,
        isSbmb: null,
        level: null,
        name: "徐州供电公司",
        pageFlag: null,
        pid: null,
        pname: null,
        leaf: true,
      },
      {
        deptId: null,
        id: "2A3287A6-6073-48F3-A096-8CD55E3D4A81-00158",
        isFirst: null,
        isPlant: null,
        isSbmb: null,
        level: null,
        name: "无锡供电公司",
        pageFlag: null,
        pid: null,
        pname: null,
        leaf: true,
      },
      {
        deptId: null,
        id: "2A3287A6-6073-48F3-A096-8CD55E3D4A81-00160",
        isFirst: null,
        isPlant: null,
        isSbmb: null,
        level: null,
        name: "常州供电公司",
        pageFlag: null,
        pid: null,
        pname: null,
        leaf: true,
      },
      {
        deptId: null,
        id: "2A3287A6-6073-48F3-A096-8CD55E3D4A81-00168",
        isFirst: null,
        isPlant: null,
        isSbmb: null,
        level: null,
        name: "镇江供电公司",
        pageFlag: null,
        pid: null,
        pname: null,
        leaf: true,
      },
      {
        deptId: null,
        id: "2A3287A6-6073-48F3-A096-8CD55E3D4A81-00167",
        isFirst: null,
        isPlant: null,
        isSbmb: null,
        level: null,
        name: "扬州供电公司",
        pageFlag: null,
        pid: null,
        pname: null,
        leaf: true,
      },
      {
        deptId: null,
        id: "2A3287A6-6073-48F3-A096-8CD55E3D4A81-00159",
        isFirst: null,
        isPlant: null,
        isSbmb: null,
        level: null,
        name: "泰州供电公司",
        pageFlag: null,
        pid: null,
        pname: null,
        leaf: true,
      },
      {
        deptId: null,
        id: "2A3287A6-6073-48F3-A096-8CD55E3D4A81-00169",
        isFirst: null,
        isPlant: null,
        isSbmb: null,
        level: null,
        name: "南通供电公司",
        pageFlag: null,
        pid: null,
        pname: null,
        leaf: true,
      },
      {
        deptId: null,
        id: "2A3287A6-6073-48F3-A096-8CD55E3D4A81-00166",
        isFirst: null,
        isPlant: null,
        isSbmb: null,
        level: null,
        name: "盐城供电公司",
        pageFlag: null,
        pid: null,
        pname: null,
        leaf: true,
      },
      {
        deptId: null,
        id: "2A3287A6-6073-48F3-A096-8CD55E3D4A81-00161",
        isFirst: null,
        isPlant: null,
        isSbmb: null,
        level: null,
        name: "淮安供电公司",
        pageFlag: null,
        pid: null,
        pname: null,
        leaf: true,
      },
      {
        deptId: null,
        id: "2A3287A6-6073-48F3-A096-8CD55E3D4A81-00164",
        isFirst: null,
        isPlant: null,
        isSbmb: null,
        level: null,
        name: "宿迁供电公司",
        pageFlag: null,
        pid: null,
        pname: null,
        leaf: true,
      },
      {
        deptId: null,
        id: "2A3287A6-6073-48F3-A096-8CD55E3D4A81-00162",
        isFirst: null,
        isPlant: null,
        isSbmb: null,
        level: null,
        name: "连云港供电公司",
        pageFlag: null,
        pid: null,
        pname: null,
        leaf: true,
      },
    ],
    // D5000厂站前端匹配列表
    D5000CzList: [
      {
        deptId: null,
        id: "113715891127975942",
        isFirst: null,
        isPlant: null,
        isSbmb: null,
        leaf: true,
        level: "1",
        name: "江苏直属",
        pageFlag: null,
        pid: "113715891127975937",
        pname: null,
      },
      {
        deptId: null,
        id: "113715891127975944",
        isFirst: null,
        isPlant: null,
        isSbmb: null,
        leaf: true,
        level: "1",
        name: "南京",
        pageFlag: null,
        pid: "113715891127975937",
        pname: null,
      },
      {
        deptId: null,
        id: "113715891127975946",
        isFirst: null,
        isPlant: null,
        isSbmb: null,
        leaf: true,
        level: "1",
        name: "苏州",
        pageFlag: null,
        pid: "113715891127975937",
        pname: null,
      },
      {
        deptId: null,
        id: "113715891127975950",
        isFirst: null,
        isPlant: null,
        isSbmb: null,
        leaf: true,
        level: "1",
        name: "徐州",
        pageFlag: null,
        pid: "113715891127975937",
        pname: null,
      },
      {
        deptId: null,
        id: "113715891127975949",
        isFirst: null,
        isPlant: null,
        isSbmb: null,
        leaf: true,
        level: "1",
        name: "无锡",
        pageFlag: null,
        pid: "113715891127975937",
        pname: null,
      },
      {
        deptId: null,
        id: "113715891127975939",
        isFirst: null,
        isPlant: null,
        isSbmb: null,
        leaf: true,
        level: "1",
        name: "常州",
        pageFlag: null,
        pid: "113715891127975937",
        pname: null,
      },
      {
        deptId: null,
        id: "113715891127975953",
        isFirst: null,
        isPlant: null,
        isSbmb: null,
        leaf: true,
        level: "1",
        name: "镇江",
        pageFlag: null,
        pid: "113715891127975937",
        pname: null,
      },
      {
        deptId: null,
        id: "113715891127975952",
        isFirst: null,
        isPlant: null,
        isSbmb: null,
        leaf: true,
        level: "1",
        name: "扬州",
        pageFlag: null,
        pid: "113715891127975937",
        pname: null,
      },
      {
        deptId: null,
        id: "113715891127975948",
        isFirst: null,
        isPlant: null,
        isSbmb: null,
        leaf: true,
        level: "1",
        name: "泰州",
        pageFlag: null,
        pid: "113715891127975937",
        pname: null,
      },
      {
        deptId: null,
        id: "113715891127975945",
        isFirst: null,
        isPlant: null,
        isSbmb: null,
        leaf: true,
        level: "1",
        name: "南通",
        pageFlag: null,
        pid: "113715891127975937",
        pname: null,
      },
      {
        deptId: null,
        id: "113715891127975951",
        isFirst: null,
        isPlant: null,
        isSbmb: null,
        leaf: true,
        level: "1",
        name: "盐城",
        pageFlag: null,
        pid: "113715891127975937",
        pname: null,
      },
      {
        deptId: null,
        id: "113715891127975940",
        isFirst: null,
        isPlant: null,
        isSbmb: null,
        leaf: true,
        level: "1",
        name: "淮安",
        pageFlag: null,
        pid: "113715891127975937",
        pname: null,
      },
      {
        deptId: null,
        id: "113715891127975947",
        isFirst: null,
        isPlant: null,
        isSbmb: null,
        leaf: true,
        level: "1",
        name: "宿迁",
        pageFlag: null,
        pid: "113715891127975937",
        pname: null,
      },
      {
        deptId: null,
        id: "113715891127975943",
        isFirst: null,
        isPlant: null,
        isSbmb: null,
        leaf: true,
        level: "1",
        name: "连云港",
        pageFlag: null,
        pid: "113715891127975937",
        pname: null,
      },
      {
        deptId: null,
        id: "113715890607882253",
        isFirst: null,
        isPlant: null,
        isSbmb: null,
        leaf: true,
        level: "1",
        name: "其他",
        pageFlag: null,
        pid: "113715891127975937",
        pname: null,
      },
    ],
    noHeader: false,
    isXzs: false, //true不展示预览，小助手展示不出来
    gztTree: "",
    gztPath: "",
  },
  getters: {
    staticOMSxl(state) {
      return state.staticOMSxl;
    },
    areaEng(state) {
      let map = {
        江苏: "JS",
        常州: "CZ",
        淮安: "HA",
        连云港: "LYG",
        南京: "NJ",
        南通: "NT",
        宿迁: "SQ",
        苏州: "SZ",
        泰州: "TZ",
        无锡: "WX",
        徐州: "XZ",
        盐城: "YC",
        扬州: "YZ",
        镇江: "ZJ",
      };
      if (state.userInfo.cropJc) {
        return map[state.userInfo.cropJc];
      }
      return null;
    },
  },
  mutations: {
    setUserInfo(state, val) {
      state.userInfo = val;
    },
    setSelectOptionsObj(state, val) {
      state.selectOptionsObj = val;
    },
    setToken(state, val) {
      CookiesUtil.set(TOKEN_KEY, val);
      state.token = val;
    },
    setNoHeader(state, val) {
      state.noHeader = val;
    },
    setIsXzs(state, val) {
      state.isXzs = val;
    },

    setGztTree(state, val) {
      state.gztTree = val;
      window.gztTree = val;
    },
    setGztPath(state, val) {
      state.gztPath = val;
    },

    clearState(state) {
      CookiesUtil.remove(TOKEN_KEY);
      state.userInfo = {};
      state.token = "";
      state.selectOptionsObj = {};
      state.gztTree = "";
      window.gztTree = "";
      state.gztPath = "";
      state.noHeader = false;
      resetRouter();
    },
  },
  actions: {
    setUserInfo({ commit }, val) {
      commit("setUserInfo", val);
    },
    setSelectOptionsObj({ commit }, val) {
      commit("setSelectOptionsObj", val);
    },
    setToken({ commit }, val) {
      commit("setToken", val);
    },
    setNoHeader({ commit }, val) {
      commit("setNoHeader", val);
    },
    setIsXzs({ commit }, val) {
      commit("setIsXzs", val);
    },
    setGztTree({ commit }, val) {
      commit("setGztTree", val);
    },
    setGztPath({ commit }, val) {
      commit("setGztPath", val);
    },

    clearState({ commit }) {
      commit("clearState");
    },
    getUserInfo({ commit }) {
      return new Promise((resolve, reject) => {
        userApi
          .getUseInfoService()
          .then((res) => {
            commit("setUserInfo", res.data);
            // Object.assign(user.value, {...data});
            resolve(res.data);
          })
          .catch((error) => {
            reject(error);
          });
      });
    },
    getSelectOptions({ commit }) {
      return new Promise((resolve, reject) => {
        commonApi
          .getSelectOptionsService()
          .then((res) => {
            commit("setSelectOptionsObj", res.data);
            resolve(res.data);
          })
          .catch((error) => {
            reject(error);
          });
      });
    },
  },
});
