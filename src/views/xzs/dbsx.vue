<template>
  <div class="page_content">
    <article>
      <vxe-grid
        v-bind="gridOptions"
        ref="xTable"
        @cell-click="cellClick"
        @cell-dblclick="cellDblclickEvent"
      >
        <template #toolbarButtons>
          <vxe-tabs v-model="searchParams.type" :width="innerWidth">
            <vxe-tab-pane
              :title="item.name"
              :name="item.name"
              v-for="(item, index) in tabList"
              :key="'tabList' + index"
            >
              <template #title-suffix>
                <span>（{{ item.total }}）</span>
              </template>
            </vxe-tab-pane>
          </vxe-tabs>
        </template>
        <template #dqzt="{ row }">
          <span v-if="row.DQZT === '未处理'" class="red_point"></span>
        </template>
      </vxe-grid>
    </article>
  </div>
</template>
<script>
import dayjs from "dayjs";
import table_mixin from "@/mixin/table_mixin.jsx";
import dbsxApi from "@/api/xzs/dbsx-api.js";
import view_iframe from "@/views/vxeModal/view_iframe.vue";
export default {
  name: "dbsx",
  mixins: [table_mixin],
  data() {
    return {
      total: 0,
      tabList: [],
      searchParams: {
        type: "",
      },
      clickTimer: null,
    };
  },
  watch: {
    "searchParams.type": {
      handler(val) {
        if (val) {
          this.loadTableData();
        }
      },
      immediate: false,
    },
  },
  computed: {
    innerWidth() {
      return window.innerWidth;
    },
    tableHeaderList() {
      return [
        {
          field: "DQZT",
          width: 10,
          slots: { default: "dqzt" },
        },

        {
          type: "seq",
          width: 60,
        },
        {
          field: "MOULD_NAME",
          title: "模块",
        },
        {
          field: "PAR_MODULE",
          title: "名称",
        },

        {
          field: "DBNR",
          title: "详情",
          headerAlign: "center",
          align: "left",
        },
        {
          field: "JZSJ",
          title: "截止时间",
        },
      ];
    },
    gridOptions() {
      return {
        height: "auto",
        keepSource: true,
        border: false, //边框
        round: true, //圆角边框
        headerAlign: "center",
        align: "center",
        loading: false,
        rowConfig: {
          isCurrent: true,
          isHover: true,
        },
        radioConfig: {
          highlight: true,
        },
        toolbarConfig: {
          slots: {
            buttons: "toolbarButtons",
          },
        },
        checkboxConfig: {
          highlight: true,
          reserve: true, //分页保留显示状态
          showServeStatus: true, //分页显示保留显示状态
          range: true, //鼠标滑动范围选择
        },
        // columnConfig: {
        //   resizable: true
        // },
        // resizeConfig:{
        //   isDblclickAutoWidth: true,//双击自适应列宽
        // },
        showOverflow: this.isAutoWrap,
        headerCellClassName: "row-class",
        proxyConfig: {
          seq: true,
          showResponseMsg: false, //不展示提示消息
          showActionMsg: false,
          sort: true,
          filter: true,
          autoLoad: false,
          ajax: {
            query: () => {
              return this.loadTableApi();
            },
          },
        },
        cellClassName({ row, column }) {
          if (column.field == "JZSJ" && dayjs(row.JZSJ).isBefore(dayjs())) {
            return "row-red";
          }
          return null;
        },
        columns: this.tableHeaderList,
      };
    },
  },
  created() {
    // this.doConnect();
    // setInterval(()=>{
    //   this.closeModal()
    // },10000)
  },
  mounted() {
    this.getTabList();
  },
  methods: {
    getTabList() {
      dbsxApi.loadTabDataService({}).then((res) => {
        this.tabList = res.data;
        if (this.tabList.length > 0) {
          if (!this.searchParams.type) {
            this.searchParams.type = this.tabList[0].name;
          } else {
            this.loadTableData();
          }
        }
      });
    },
    reloadTableData() {
      this.$refs.xTable.commitProxy("query"); //不重置分页
    },
    loadTableData() {
      this.$refs.xTable.commitProxy("reload"); //重置分页
    },
    loadTableApi() {
      return new Promise((resolve) => {
        dbsxApi.loadTableDataService(this.searchParams).then((res) => {
          resolve(res.data);
        });
      });
    },
    // cellDblclickEvent({ row }) {
    //   if (row.TEMPLET_URL) {
    //     if (row.DQZT === "未处理") {
    //       dbsxApi
    //         .editStatusDataService({
    //           id: row.ID,
    //           eventId: row.EVENTID,
    //           state: "已读",
    //         })
    //         .then((res) => {
    //           this.$message.success(res.data);
    //           this.getTabList();
    //           this.openIframe(row);
    //         });
    //     } else {
    //       this.openIframe(row);
    //     }
    //   } else {
    //     let state = row.DQZT === "未处理" ? "已读" : "已处理";
    //     dbsxApi
    //       .editStatusDataService({ id: row.ID, eventId: row.EVENTID, state })
    //       .then((res) => {
    //         this.$message.success(res.data);
    //         this.getTabList();
    //       });
    //   }
    // },
    cellClick({ row }) {
      clearTimeout(this.clickTimer);
      if (row.DQZT === "未处理") {
        this.clickTimer = setTimeout(() => {
          dbsxApi
            .editStatusDataService({
              id: row.ID,
              eventId: row.EVENTID,
              state: "已读",
            })
            .then((res) => {
              this.$message.success(res.data);
              this.getTabList();
            });
        }, 250);
      }
    },
    cellDblclickEvent({ column, row }) {
      clearTimeout(this.clickTimer);

      dbsxApi.getNodeService({ bh: row.DBNR }).then((res) => {
        if (res.data.jxid) {
          if (row.DQZT === "未处理") {
            dbsxApi.editStatusDataService({
              id: row.ID,
              eventId: row.EVENTID,
              state: "已读",
            });
          }
          this.openIframe(res.data, row);
        } else {
          dbsxApi
            .editStatusDataService({
              id: row.ID,
              eventId: row.EVENTID,
              state: "已处理",
            })
            .then(() => {
              this.getTabList();
            });
        }
      });
    },
    closeModal() {
      QClient.Base.Utils.invokeGMethod(
        "pop-notification-window",
        "openFrame",
        "false",
      );
    },
    openIframe(obj, row) {
      let src = "";
      if (
        process.env.NODE_ENV === "production" &&
        !window.origin.includes("192.168.1")
      ) {
        src = `${window.YCJX_WEBSITE_URL}/master/window.html#/spa/ycjx-rjh/public-visit?flag=13&userName=${this.$store.state.userInfo.sysUser.loginName}&id=${obj.jxid}&nodeName=${obj.nodeName}&parentNodeName=${obj.parentNodeName}&nodeId=${obj.nodeId}&flowNodeId=${obj.flowNodeId}`;
      } else {
        src = `http://192.168.1.194:10015/master/window.html#/spa/ycjx-rjh/public-visit?flag=13&userName=${this.$store.state.userInfo.sysUser.loginName}&id=${obj.jxid}&nodeName=${obj.nodeName}&parentNodeName=${obj.parentNodeName}&nodeId=${obj.nodeId}&flowNodeId=${obj.flowNodeId}`;
      }
      // const childWindow = window.open(src,"_system");
      // const timer = setInterval(()=>{
      //   if(childWindow.closed){
      //     clearInterval(timer);
      //     dbsxApi
      //         .changeDbSxService({
      //           state: obj.state,
      //           jxid: obj.jxid,
      //           dbId: row.ID,
      //           dbState: row.DQZT,
      //           eventId: row.EVENTID,
      //         })
      //         .then(() => {
      //           this.getTabList();
      //         });
      //   }
      // },500)
      this.$vxeModal.show(
        view_iframe,
        {
          src: src,
        },
        {
          width: window.innerWidth - 10,
          title: "检修单详情",
          height: window.innerHeight - 10,
          showZoom: true,
        },
        {
          close: () => {
            dbsxApi
              .changeDbSxService({
                state: obj.state,
                jxid: obj.jxid,
                dbId: row.ID,
                dbState: row.DQZT,
                eventId: row.EVENTID,
              })
              .then(() => {
                this.getTabList();
              });
          },
        },
      );
    },
  },
};
</script>
<style scoped lang="scss">
.page_content {
  background-color: rgb(239, 247, 245);
  article {
    height: 100%;
    .red_point {
      display: inline-block;
      width: 4px;
      height: 4px;
      background-color: red;
      border-radius: 50%;
      position: relative;
      top: -4px;
      right: -48px;
      z-index: 100;
    }
  }
}
</style>
