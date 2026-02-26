<template>
  <div class="page_content">
    <header>
      <section>
        <div class="header-item">
          年：
          <el-date-picker
            v-model="searchParams.year"
            type="year"
            format="YYYY"
            value-format="YYYY"
          >
          </el-date-picker>
        </div>
        <!--        <div class="header-item">-->
        <!--          <el-input placeholder="请输入关键字" v-model="searchParams.keyword" @keydown.enter="loadTableData" :title="searchParams.keyword" clearable>-->
        <!--          </el-input>-->
        <!--        </div>-->
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
          <el-button type="gradientBlue" @click="importData"
            >从年计划抽取</el-button
          >
          <el-button
            :type="item.type"
            :plain="item.plain"
            v-for="(item, index) in defaultRightButtons"
            :key="index + 'defaultRightButtons'"
            @click="btnClick(item)"
          >
            {{ item.name }}
          </el-button>
          <el-button type="gradientBlue" @click="createData"
            >生成年度风险预警</el-button
          >
        </div>
      </section>
    </header>
    <article>
      <vxe-grid
        v-bind="gridOptions"
        ref="xTable"
        v-on="{ cellDblclick: cellDblclick }"
        @menu-click="(e) => menuClickEvent(e, '设备检修')"
      >
      </vxe-grid>
    </article>
  </div>
</template>

<script>
import table_mixin from "@/mixin/table_mixin.jsx";
import UploadHttpComponent from "@/components/UploadHttpComponent.vue";
import dynamic_form from "@/views/vxeModal/dynamic_form.vue";
import validateRules from "@/utils/validateRules.js";
import nzdtdApi from "@/api/nzdtd-api.js";
import dayjs from "dayjs";
import commonApi from "@/api/common-api.js";

export default {
  name: "nph_ndtdfx_zdtd",
  mixins: [table_mixin],
  components: { UploadHttpComponent },
  data() {
    return {
      time: ["", ""],
      total: 0,
      searchParams: {
        year: "",
        // keyword: '',
        sortOrder: "",
        sortColumn: "",
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
        },
        {
          type: "seq",
          width: 60,
        },
        {
          field: "sbdydj",
          title: "电压等级",
          width: 100,
          sortable: true,
          editRender: {
            name: "ElSelect",
            options: [
              { label: "110", value: "110" },
              { label: "35", value: "35" },
              { label: "20", value: "20" },
              { label: "10", value: "10" },
            ],
            props: { clearable: true },
          },
        },
        {
          field: "ssdq",
          title: "所属地区",
          width: 100,
          editRender: {},
        },
        {
          field: "tdcs",
          title: "停电场所",
          width: 100,
          editRender: {
            name: "$modal",
            props: {
              type: "tdcs",
            },
          },
        },
        {
          field: "tdsb",
          title: "停电设备",
          minWidth: 200,
          editRender: {
            name: "$modal",
            props: {
              type: "tdsb",
            },
          },
        },
        {
          field: "gznr",
          title: "工作内容",
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
          field: "tdkssj",
          title: "停电开始时间",
          width: 125,
          sortable: true,
          editRender: {
            name: "ElDatePicker",
            props: {
              type: "date",
              labelFormat: "YYYY-MM-DD",
              valueFormat: "YYYY-MM-DD",
            },
          },
        },
        {
          field: "tdjssj",
          title: "停电结束时间",
          width: 125,
          sortable: true,
          editRender: {
            name: "ElDatePicker",
            props: {
              type: "date",
              labelFormat: "YYYY-MM-DD",
              valueFormat: "YYYY-MM-DD",
            },
          },
        },
        {
          field: "ts",
          title: "停电天数",
          width: 100,
          sortable: true,
          headerAlign: "center",
          align: "right",
          formatter: ["formatterNumber", 0],
          editRender: {},
        },
        {
          field: "isGlYjh",
          title: "是否关联月度计划",
          width: 80,
          editRender: {},
        },
        {
          field: "xmmc",
          title: "项目名称",
          width: 120,
          editRender: {},
        },
        {
          field: "xmlx",
          title: "项目类型",
          width: 100,
          editRender: {},
        },
        {
          field: "sqr",
          title: "计划申请人",
          width: 100,
          editRender: {},
        },
        {
          field: "jhsqdw",
          title: "计划申请单位",
          width: 120,
          editRender: {},
        },
        {
          field: "jhsbbm",
          title: "计划申请部门",
          width: 120,
          editRender: {},
        },
        {
          field: "ssfq",
          title: "所属分区",
          width: 100,
          editRender: {},
        },
        {
          field: "jhbh",
          title: "计划编号",
          width: 140,
          editRender: {},
        },
        {
          field: "flowState",
          title: "流程状态",
          width: 100,
          editRender: {},
        },
      ];
    },
    editRules() {
      return {
        sbdydj: [{ required: true, message: "电压等级不能为空" }],
        tdcs: [{ required: true, message: "停电场所不能为空" }],
        tdsb: [{ required: true, message: "停电设备不能为空" }],
        gznr: [{ required: true, message: "工作内容不能为空" }],
        tdkssj: [
          { required: true, message: "日期不能为空" },
          validateRules.date.rule,
        ],
        tdjssj: [
          { required: true, message: "日期不能为空" },
          validateRules.date.rule,
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
        align: "center",
        loading: false,
        rowConfig: {
          isCurrent: true,
          isHover: true,
        },
        radioConfig: {
          highlight: true,
        },
        checkboxConfig: {
          highlight: true,
        },
        columnConfig: {
          resizable: true,
        },
        sortConfig: {
          remote: true,
        },
        filterConfig: {
          remote: true,
        },
        showOverflow: this.isAutoWrap,
        headerCellClassName: "row-class",
        pagerConfig: this.pagerConfig,
        // editConfig:{},//必须存在，不然格式化不成功
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
            delete: ({ body }) => {
              return this.doDeleteApi(body.removeRecords);
            },
          },
        },
        exportConfig: {
          // remote: true,
          filename: "年度重大停电表",
          sheetName: "sheet1",
          type: "xlsx",
          mode: "all",
          modes: ["current", "selected", "all"],
          message: false,
          columns: this.tableHeaderList.filter((i) => i.type !== "checkbox"),
          exportMethod: this.exportMethod,
          afterExportMethod: this.afterExportMethod,
        },
        menuConfig: {
          body: {
            options: [[{ code: "collect", name: "标记重点" }]],
          },
        },
        editRules: this.editRules,
        columns: this.tableHeaderList,
      };
    },

    defaultLeftButtons() {
      return [
        { type: "gradientGreen", name: "查询" },
        { type: "gradientGreen", name: "自动换行" },
        // { type: "gradientGreen", name: "导出当前页" },
        // { type: "gradientGreen", name: "导出全部" },
      ];
    },
    defaultRightButtons() {
      return [{ type: "gradientRed", name: "删除" }];
    },
  },
  mounted() {
    this.searchParams.year = dayjs().format("YYYY");
  },
  methods: {
    reloadTableData() {
      this.$refs.xTable.commitProxy("query"); //不重置分页
    },
    loadTableData() {
      this.$refs.xTable.commitProxy("reload"); //重置分页
    },
    loadTableApi(page, sorts, filters) {
      //
      let params = this.getRealParams(this.searchParams, page, sorts, filters);
      return new Promise((resolve) => {
        nzdtdApi.loadTableDataService(params).then((res) => {
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

    doDelete() {
      const rows = this.getCheckboxRecords();
      if (rows && rows.length > 0) {
        this.$confirm(`确认删除勾选的${rows.length}条数据吗？`, "提示", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning",
        }).then(() => {
          this.$refs.xTable.commitProxy("delete");
        });
      }
    },
    doDeleteApi(data) {
      return new Promise((resolve, reject) => {
        let ids = data.map((i) => i.id).join(",");
        nzdtdApi
          .doDelTableDataService({ ids })
          .then((res) => {
            this.$message.success(res.data);
            resolve();
          })
          .catch(() => {
            reject();
          });
      });
    },
    importData() {
      nzdtdApi.importDataService({}).then((res) => {
        this.$message.success(res.data);
        this.loadTableData();
      });
    },
    createData() {
      const rows = this.getCheckboxRecords();
      if (rows && rows.length > 0) {
        nzdtdApi.createFxyjDataService({ data: rows }).then((res) => {
          this.$message.success(res.data);
        });
      }
    },
    doExport(flag) {
      commonApi.exportFileService(
        "/jxjh/exportNdjxZdtd",
        this.searchParams,
        flag,
        this.pagerParam,
      );
    },
    cellDblclick(e) {
      let { row } = e;
      this.openDetail(row);
    },
    resetParams() {
      // this.searchParams.keyword = '';
      this.time = ["", ""];
      this.$nextTick(function () {
        this.loadTableData();
      });
    },
    openDetail(row) {
      this.$vxeModal.show(
        dynamic_form,
        {
          tableHeaderList: this.tableHeaderList,
          validateRules: this.editRules,
          row: row,
        },
        {
          width: 800,
          title: "详情",
          height: window.innerHeight - 100,
        },
        {
          close: () => {},
          doSubmit: (res) => {
            if (res.tdkssj && res.tdjssj) {
              if (dayjs(res.tdkssj).isAfter(res.tdjssj)) {
                this.$message.error("停电开始时间不能在停电结束时间之后");
                return;
              }
            }
            res.ts = dayjs(res.tdjssj).diff(res.tdkssj, "day") + 1;
            res.csDataIn = res.tdcsParam;
            res.sbDataIn = res.tdsbList;
            this.doRealSave([res]);
          },
        },
      );
    },
    doSave() {
      this.$refs.xTable.commitProxy("save");
    },
    doRealSave(data) {
      nzdtdApi.saveTableDataService({ data }).then((res) => {
        this.$message.success(res.data);
        this.$vxeModal.closeAll();
        this.loadTableData();
      });
    },
  },
};
</script>

<style scoped lang="scss">
.page_content {
  background-color: rgb(239, 247, 245);
  article {
    height: calc(100% - 48px);
  }
}
</style>
