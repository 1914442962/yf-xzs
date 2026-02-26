import { createRouter, createWebHashHistory } from "vue-router"; //只能用createWebHashHistory不然会白屏
import CookiesUtil from "@/utils/cookies.utils";
import store from "@/store/index.js";
import { TOKEN_KEY } from "@/enums/CacheEnum.js";
import bmglApi from "@/api/xzs/bmgl-api.js";

const routes = [
  {
    path: "/",
    redirect: "/index",
  },
  {
    path: "/login",
    name: "login",
    component: () => import("../views/login/index.vue"),
  },
  {
    path: "/autologin",
    name: "autologin",
    component: () => import("../views/login/autologin.vue"),
  },
  {
    path: "/index",
    name: "index",
    component: () => import("../views/layout/index.vue"),
    children: [
      {
        path: "/table-menu1",
        name: "table-menu1",
        component: () =>
          import("../views/examples/table_example_table_edit.vue"),
      },
      {
        path: "/table-menu2",
        name: "table-menu2",
        component: () =>
          import("../views/examples/table_example_form_edit.vue"),
      },
      {
        path: "/grid-menu1",
        name: "grid-menu1",
        component: () => import("../views/examples/grid_example_grid_edit.vue"),
      },
      {
        path: "/grid-menu2",
        name: "grid-menu2",
        component: () => import("../views/examples/grid_example_form_edit.vue"),
      },

      {
        path: "/homepage",
        name: "首页",
        component: () => import("../views/homepage"),
      },
      {
        path: "/announcement",
        name: "公告管理",
        component: () => import("../views/announcement"),
      },
      {
        path: "/gzt",
        name: "工作台",
        component: () => import("../views/gzt"),
        children: [
          {
            path: "/ndfxyj",
            name: "年度风险预警",
            component: () => import("../views/gzt/fxyj/ndfxyj"),
          },
          {
            path: "/ydfxyj",
            name: "月度风险预警",
            component: () => import("../views/gzt/fxyj/ydfxyj"),
          },
          {
            path: "/zfxyj",
            name: "周风险预警",
            component: () => import("../views/gzt/fxyj/zfxyj"),
          },
          {
            path: "/rfxcgx",
            name: "日风险草稿箱",
            component: () => import("../views/gzt/fxyj/rfxyj/index_new.vue"),
          },
          {
            path: "/drfx",
            name: "单日风险",
            component: () => import("../views/gzt/fxyj/rfxyj/drfx.vue"),
          },
          {
            path: "/txfx",
            name: "特巡风险",
            component: () => import("../views/gzt/fxyj/rfxyj/txfx.vue"),
          },
          {
            path: "/dwfx",
            name: "电网风险预警（执行中）",
            component: () => import("../views/gzt/fxyj/rfxyj/fxyj.vue"),
          },
          {
            path: "/fxyjtjfx",
            name: "风险预警统计分析",
            component: () => import("../views/gzt/fxyj/rfxyj/fxyjtjfx.vue"),
          },

          {
            path: "/snjh",
            name: "三年检修计划",
            component: () => import("../views/gzt/sbjx/snjh.vue"),
          },
          {
            path: "/njh",
            name: "年度检修计划",
            component: () => import("../views/gzt/sbjx/njh"),
          },
          {
            path: "/yjh",
            name: "月度检修计划",
            component: () => import("../views/gzt/sbjx/yjh"),
          },
          {
            path: "/nph-ndtdfx-zdtd",
            name: "年度计划平衡-年度停电情况分析-重大停电",
            component: () => import("../views/gzt/sbjx/nph_ndtdfx_zdtd.vue"),
          },
          {
            path: "/nph-ndtdfx-cftd",
            name: "年度计划平衡-年度停电情况分析-重复停电",
            component: () => import("../views/gzt/sbjx/nph_ndtdfx_cftd.vue"),
          },
          {
            path: "/yph-ydtdfx-zdtd",
            name: "月度计划平衡-月度停电情况分析-重大停电",
            component: () => import("../views/gzt/sbjx/yph_ydtdfx_zdtd.vue"),
          },
          {
            path: "/yph-ydtdfx-cftd",
            name: "月度计划平衡-月度停电情况分析-重复停电",
            component: () => import("../views/gzt/sbjx/yph_ydtdfx_cftd.vue"),
          },

          {
            path: "/fsgbd",
            name: "方式变更单",
            component: () => import("../views/gzt/fsbgd"),
          },
          {
            path: "/zjh",
            name: "周计划",
            component: () => import("../views/gzt/sbjx/zjh.vue"),
          },
          {
            path: "/xwbsc",
            name: "序位表生成",
            component: () => import("../views/gzt/xwb/index.vue"),
          },
          {
            path: "/xwbcx",
            name: "序位表查询",
            component: () => import("../views/gzt/xwb/index_readonly.vue"),
          },
          {
            path: "/mmcc",
            name: "命名查重",
            component: () => import("../views/gzt/sbqd/mmcc.vue"),
          },
          {
            path: "/mmcg",
            name: "命名初稿",
            component: () => import("../views/gzt/sbqd/mmcg.vue"),
          },
          {
            path: "/mmlc",
            name: "命名流程",
            component: () => import("../views/gzt/sbqd/mmlc"),
          },
          {
            path: "/mmbg",
            name: "命名变更",
            component: () => import("../views/gzt/sbqd/mmbg"),
          },
          {
            path: "/zymm",
            name: "在运命名",
            component: () => import("../views/gzt/sbqd/zymm"),
          },
          // {
          //     path: "/qdfa-gnkzfa",
          //     name: "功能控制方案",
          //     component: () => import("../views/gzt/sbqd/view_iframe_page1.vue"),
          // },
          // {
          //     path: "/qdfa-lcfl",
          //     name: "流程分类",
          //     component: () => import("../views/gzt/sbqd/view_iframe_page2.vue"),
          // },
          // {
          //     path: "/qdfa-lcxpz",
          //     name: "流程线配置",
          //     component: () => import("../views/gzt/sbqd/view_iframe_page3.vue"),
          // },

          {
            path: "/dnfs",
            name: "2-3年方式",
            component: () => import("../views/gzt/ndfs/dnfs.vue"),
          },
          {
            path: "/dwgm",
            name: "电网规模",
            component: () => import("../views/gzt/ndfs/dwgm.vue"),
          },

          {
            path: "/fhqk",
            name: "负荷情况",
            component: () => import("../views/gzt/ndfs/fhqk.vue"),
          },
          {
            path: "/zmzcz",
            name: "主变重超载",
            component: () => import("../views/gzt/ndfs/zbzcz.vue"),
          },
          {
            path: "/dmxe",
            name: "断面限额",
            component: () => import("../views/gzt/ndfs/dmxe.vue"),
          },
          {
            path: "/bwdd",
            name: "并网调度协议",
            component: () => import("../views/gzt/bwdd/bwdd.vue"),
          },

          {
            path: "/jxt",
            name: "接线图",
            component: () => import("../views/gzt/jxt/index.vue"),
          },
        ],
      },
    ],
  },
  // {
  //     path: "/xltg",
  //     name: "线路同杆",
  //     component: () => import("../views/xzs/xltg.vue"),
  // },
  // {
  //     path: "/xlsbdsbgxdw",
  //     name: "线路输变电设备管辖单位",
  //     component: () => import("../views/xzs/xlsbdsbgxdw.vue"),
  // },
  // {
  //     path: "/xlzllxe",
  //     name: "线路载流量限额",
  //     component: () => import("../views/xzs/xlzllxe.vue"),
  // },
  // {
  //     path: "/zydlkhmd",
  //     name: "重要电力客户名单",
  //     component: () => import("../views/xzs/zydlkhmd.vue"),
  // },
  {
    path: "/cyzl",
    name: "常用资料",
    component: () => import("../views/xzs/cyzl/index.vue"),
  },
  {
    path: "/zysx",
    name: "个人重要事项",
    component: () => import("../views/xzs/grzysx.vue"),
  },
  {
    path: "/yjrz",
    name: "邮件日志",
    component: () => import("../views/xzs/yjrz.vue"),
  },
  {
    path: "/dbfx",
    name: "待办分析",
    component: () => import("../views/xzs/dbfx.vue"),
  },
  {
    path: "/dbsx",
    name: "待办事项",
    component: () => import("../views/xzs/dbsx.vue"),
  },
  {
    path: "/grrj",
    name: "个人日记",
    component: () => import("../views/xzs/grrj.vue"),
  },
  {
    path: "/logic",
    name: "图形",
    component: () => import("../components/LogicFlowComponent/index.vue"),
  },
  {
    path: "/konva",
    name: "新图形",
    component: () => import("@/components/Konva/index.vue"),
  },
  {
    path: "/yfdx",
    name: "迎峰度夏",
    component: () => import("../views/xzs/yfdx.vue"),
  },
  {
    path: "/jdpz",
    name: "节点配置",
    component: () => import("../views/xzs/jdpz.vue"),
  },
  {
    path: "/jdshow",
    name: "节点展示",
    component: () => import("../views/xzs/jdshow.vue"),
  },
  {
    path: "/dwjxt",
    name: "电网接线图",
    component: () => import("../views/xzs/dwjxt.vue"),
  },
  {
    path: "/pzgl",
    name: "图形解析",
    component: () => import("../views/xzs/pzgl/index.vue"),
  },
  {
    path: "/bmgl",
    name: "部门管理",
    component: () => import("../views/xzs/bmgl.vue"),
  },
];

const router = createRouter({
  history: createWebHashHistory(process.env.BASE_URL),
  routes,
});
router.beforeEach(async function (to, from, next) {
  const whiteList = [
    "/login",
    "/autologin",
    "/cyzl",
    "/logic",
    "/pzgl",
    "/bmgl",
  ];
  const hasToken = CookiesUtil.get(TOKEN_KEY);
  if (hasToken) {
    if (to.path === "/login") {
      // 如果已登录，跳转到首页
      next({ path: "/" });
    } else {
      if (store.state.userInfo.token) {
        next();
      } else {
        await store.dispatch("getUserInfo");
        next({ ...to, replace: true });
      }
    }
  } else {
    if (whiteList.includes(to.path)) {
      next(); // 在白名单，直接进入
    } else {
      // 不在白名单，重定向到登录页
      next({ path: "/login" });
    }
  }
});

export default router;
/**
 * 重置路由
 */
export function resetRouter() {
  router.replace({ path: "/login" });
}
