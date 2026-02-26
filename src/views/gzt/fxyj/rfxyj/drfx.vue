<template>
  <div class="page_content">
    <header>
      <section>
        <DateRangerPickerComponent
          :start-time="searchParams.sdt"
          :end-time="searchParams.edt"
          v-model:updateStartTime="searchParams.sdt"
          v-model:updateEndTime="searchParams.edt"
        ></DateRangerPickerComponent>
        <div class="header-item">
          检修编号：
          <el-input
            placeholder="请输入检修编号"
            v-model="searchParams.bh"
            @keydown.enter="loadTableData"
            :title="searchParams.bh"
            clearable
          >
          </el-input>
        </div>
        <div class="header-item">
          <el-input
            placeholder="请输入关键字"
            v-model="searchParams.keyword"
            @keydown.enter="loadTableData"
            :title="searchParams.keyword"
            clearable
          >
          </el-input>
        </div>
        <div class="header-item">
          <el-button
            :type="item.type"
            :plain="item.plain"
            v-for="(item, index) in defaultLeftButtons"
            :key="index + 'defaultLeftButtons'"
            @click="btnClick(item)"
          >
            {{ item.name }}
          </el-button>
        </div>
        <div class="header-item">
          <el-dropdown>
            <el-button type="gradientGreen">
              导出<el-icon class="el-icon--right"><arrow-down /></el-icon>
            </el-button>
            <template #dropdown>
              <el-dropdown-menu>
                <el-dropdown-item @click="doExport"
                  >导出当前页</el-dropdown-item
                >
                <el-dropdown-item @click="doExport(true)"
                  >导出全部</el-dropdown-item
                >
              </el-dropdown-menu>
            </template>
          </el-dropdown>
        </div>
      </section>
      <section>
        <div class="header-item">
          <el-button
            :type="item.type"
            :plain="item.plain"
            v-for="(item, index) in defaultRightButtons"
            :key="index + 'defaultRightButtons'"
            @click="btnClick(item)"
          >
            {{ item.name }}
          </el-button>
        </div>
      </section>
    </header>
    <article>
      <vxe-grid
        v-bind="gridOptions"
        ref="xTable"
        @menu-click="(e) => menuClickEvent(e, '风险预警')"
      >
        <template #action="{ row }">
          <vxe-button mode="text" status="primary" @click="doViewLog(row)"
            >查看</vxe-button
          >
          <vxe-button mode="text" status="primary" @click="doSendMessage(row)"
            >发送短信</vxe-button
          >
        </template>
      </vxe-grid>
    </article>
  </div>
</template>

<script>
import table_mixin from "@/mixin/table_mixin.jsx";
import drfxApi from "@/api/fxyj/drfx-api.js";
import commonApi from "@/api/common-api.js";
import dayjs from "dayjs";
import DateRangerPickerComponent from "@/components/DateRangerPickerComponent.vue";

export default {
  name: "drfx",
  mixins: [table_mixin],
  components: { DateRangerPickerComponent },
  data() {
    return {
      total: 0,
      searchParams: {
        bh: "",
        keyword: "",
        lx: "单日",
        sortOrder: "",
        sortColumn: "",
        sdt: "",
        edt: "",
      },
      tableData: [],
      isAutoWrap: false,
    };
  },
  watch: {},
  computed: {
    tableHeaderList() {
      return [
        {
          type: "checkbox",
          width: 50,
          fixed: "left",
        },
        {
          type: "seq",
          width: 60,
          fixed: "left",
        },
        {
          field: "bh",
          title: "检修编号",
          width: 180,
        },
        // {
        //   field: "sy",
        //   title: "事由",
        //   minWidth: 120,
        //   headerAlign: "center",
        //   align: "left",
        //   editRender: {
        //     name: "ElInput",
        //     props: {
        //       type: "textarea",
        //       clearable: true,
        //       autosize: this.isAutoWrap ? { maxRows: 1 } : true,
        //       resize: 'none'
        //     },
        //   },
        // },
        {
          field: "tdsb",
          title: "停电设备",
          minWidth: 180,
          headerAlign: "center",
          align: "left",
          editRender: {
            name: "ElInput",
            props: {
              type: "textarea",
              clearable: true,
              autosize: this.isAutoWrap ? { maxRows: 1 } : true,
              resize: "none",
            },
          },
        },
        {
          field: "fxms",
          title: "风险描述",
          minWidth: 200,
          headerAlign: "center",
          align: "left",
          editRender: {
            name: "ElInput",
            props: {
              type: "textarea",
              clearable: true,
              autosize: this.isAutoWrap ? { maxRows: 1 } : true,
              resize: "none",
            },
          },
        },
        {
          field: "fxdj",
          title: "风险等级",
          width: 100,
          editRender: { name: "ElInput", props: { clearable: true } },
        },
        {
          field: "kssj",
          title: "开始时间",
          width: 140,
          sortable: true,
          editRender: {
            name: "ElDatePicker",
            props: {
              type: "datetime",
              labelFormat: "YYYY-MM-DD HH:mm",
              valueFormat: "YYYY-MM-DD HH:mm",
              timeFormat: "HH:mm",
              clearable: true,
            },
          },
        },
        {
          field: "jssj",
          title: "结束时间",
          width: 140,
          sortable: true,
          editRender: {
            name: "ElDatePicker",
            props: {
              type: "datetime",
              labelFormat: "YYYY-MM-DD HH:mm",
              valueFormat: "YYYY-MM-DD HH:mm",
              timeFormat: "HH:mm",
              clearable: true,
            },
          },
        },
        {
          field: "yq",
          title: "要求",
          minWidth: 200,
          headerAlign: "center",
          align: "left",
          editRender: {
            name: "ElInput",
            props: {
              type: "textarea",
              clearable: true,
              autosize: this.isAutoWrap ? { maxRows: 1 } : true,
              resize: "none",
            },
          },
        },
        {
          field: "bm",
          title: "部门",
          minWidth: 120,
          editRender: {
            name: "ElInput",
            props: {
              type: "textarea",
              clearable: true,
              autosize: this.isAutoWrap ? { maxRows: 1 } : true,
              resize: "none",
            },
          },
        },
        {
          title: "操作",
          width: 100,
          fixed: "right",
          slots: { default: "action" },
        },
      ];
    },
    editRules() {
      return {
        // bh: [
        //   {required: true, message: '检修编号不能为空'}
        // ],
        kssj: [
          { required: true, message: "开始时间不能为空" },
          {
            validator({ cellValue, row }) {
              if (cellValue && row.jssj && dayjs(cellValue).isAfter(row.jssj)) {
                return new Error("开始时间必须在结束时间之前");
              }
            },
          },
        ],
        jssj: [
          { required: true, message: "结束时间不能为空" },
          {
            validator({ cellValue, row }) {
              if (
                cellValue &&
                row.kssj &&
                dayjs(cellValue).isBefore(row.kssj)
              ) {
                return new Error("结束时间必须在开始时间之后");
              }
            },
          },
        ],
      };
    },
    gridOptions() {
      return {
        height: "auto",
        border: true, //边框
        round: true, //圆角边框
        stripe: true,
        headerAlign: "center",
        keepSource: true,
        align: "center",
        loading: false,
        rowConfig: {
          isCurrent: true,
          isHover: true,
        },
        columnConfig: {
          resizable: true,
        },
        resizeConfig: {
          isDblclickAutoWidth: true, //双击自适应列宽
        },
        sortConfig: {
          remote: true,
        },
        showOverflow: this.isAutoWrap,
        headerCellClassName: "row-class",
        pagerConfig: this.pagerConfig,
        proxyConfig: {
          seq: true,
          showResponseMsg: false, //不展示提示消息
          showActionMsg: false,
          sort: true,
          filter: true,
          ajax: {
            query: ({ page, sorts, filters }) => {
              return this.loadTableApi(page, sorts, filters);
            },
            queryAll: ({ sorts, filters }) => {
              return this.loadTableApi(
                { pageSize: 100000, currentPage: 1 },
                sorts,
                filters,
              );
            },
            save: ({ body }) => {
              return this.doSaveApi(body);
            },
          },
        },
        editConfig: {
          trigger: "click",
          mode: "cell",
          showStatus: true,
          showIcon: true,
          beforeEditMethod: this.beforeEditMethod,
        },
        editRules: this.editRules,
        columns: this.tableHeaderList,
        menuConfig: {
          body: {
            options: [[{ code: "collect", name: "标记重点" }]],
          },
        },
      };
    },

    defaultLeftButtons() {
      return [
        { type: "gradientGreen", name: "查询" },
        { type: "gradientDarkGreen", name: "重置" },
        { type: "gradientGreen", name: "自动换行" },
        // { type: "gradientGreen", name: "导出当前页" },
        // { type: "gradientGreen", name: "导出全部" },
      ];
    },
    defaultRightButtons() {
      return [
        { type: "gradientBlue", name: "保存" },
        { type: "gradientBlue", name: "发送短信" },
      ];
    },
  },
  mounted() {},
  methods: {
    reloadTableData() {
      this.$refs.xTable.commitProxy("query"); //不重置分页
    },
    loadTableData() {
      this.$refs.xTable.commitProxy("reload"); //重置分页
    },
    loadTableApi(page, sorts, filters) {
      let params = this.getRealParams(this.searchParams, page, sorts, filters);
      return new Promise((resolve) => {
        drfxApi.loadTableDataService(params).then((res) => {
          if (page.pageSize == 100000) {
            this.total = res.total;
            resolve(res.data);
          } else {
            this.total = res.total;
            resolve({
              result: res.data,
              page: {
                total: res.total,
              },
            });
          }
        });
      });
    },

    toggleWrap() {
      if (this.isAutoWrap) {
        this.isAutoWrap = false;
      } else {
        this.isAutoWrap = "tooltip";
      }
    },
    doSave() {
      const rows = this.getUpdateRecords();
      if (rows && rows.length > 0) {
        this.$refs.xTable.commitProxy("save");
      }
    },
    doSaveApi(body) {
      return new Promise((resolve, reject) => {
        let { insertRecords, updateRecords } = body;
        let data = [...insertRecords, ...updateRecords];
        drfxApi
          .saveTableDataService({ data })
          .then((res) => {
            this.$message.success(res.data);
            resolve();
          })
          .catch(() => {
            reject();
          });
      });
    },
    resetParams() {
      this.searchParams.bh = "";
      this.searchParams.keyword = "";
      this.searchParams.sortOrder = "";
      this.searchParams.sortColumn = "";
      this.searchParams.sdt = "";
      this.searchParams.edt = "";
      this.$nextTick(function () {
        this.loadTableData();
      });
    },
    doExport(flag) {
      commonApi.exportFileService(
        "/fxyj/exportDrTx",
        this.searchParams,
        flag,
        this.pagerParam,
      );
    },
    doViewLog(row) {
      let src = "";
      if (
        process.env.NODE_ENV === "production" &&
        !window.origin.includes("192.168.1")
      ) {
        src = `${window.YCJX_WEBSITE_URL}/master/window.html#/spa/ycjx-snjh/public-visit?&flag=3&type=dd&id=${row.jxdId}&parentNodeName=地调调度台`;
      } else {
        src = `http://192.168.1.194:10015/master/window.html#/spa/ycjx-snjh/public-visit?&flag=3&type=dd&id=${row.jxdId}&parentNodeName=地调调度台`;
      }
      window.open(src);
    },
    doSendMessage(row) {
      if (row && row.id) {
        this.doRealSendMessage([row]);
      } else {
        const rows = this.getCheckboxRecords();
        if (rows && rows.length > 0) {
          this.doRealSendMessage(rows);
        }
      }
    },
    doRealSendMessage(rows) {
      drfxApi.doSendMessageService({ data: rows }).then((res) => {
        this.$message.success(res.data);
      });
    },
    beforeEditMethod({ row, column }) {
      return true;
    },
  },
};
</script>

<style scoped lang="scss">
.page_content {
  article {
    height: calc(100% - 48px);
  }
}
</style>
