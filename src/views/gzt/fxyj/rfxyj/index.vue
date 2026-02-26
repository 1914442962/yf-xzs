<template>
  <div class="page_content" id="rfxyj">
    <header>
      <section>
        <DateRangerPickerComponent
          :start-time="searchParams.sdt"
          :end-time="searchParams.edt"
          v-model:updateStartTime="searchParams.sdt"
          v-model:updateEndTime="searchParams.edt"
        ></DateRangerPickerComponent>

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
      </section>
      <section>
        <!--        <div class="header-item">-->
        <!--          <upload-http-component prop-upload-url="/fxyj/import-rfxyj" @loadTableData="loadTableData(true)"></upload-http-component>-->
        <!--        </div>-->
        <div class="header-item">
          <el-button type="gradientBlue" @click="doAddRfx"
            >快速生成日风险</el-button
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
        </div>
      </section>
    </header>
    <article>
      <vxe-grid
        v-bind="gridOptions"
        ref="xTable"
        v-on="{ cellDblclick: cellDblclick }"
      >
        <template #action="{ row }">
          <vxe-button mode="text" status="success" @click="doDetail(row)"
            >查看</vxe-button
          >
        </template>
      </vxe-grid>
    </article>
  </div>
</template>

<script>
import table_mixin from "@/mixin/table_mixin.jsx";
import UploadHttpComponent from "@/components/UploadHttpComponent.vue";
import validateRules from "@/utils/validateRules.js";
import rfxApi from "@/api/fxyj/rfxyj-api.js";
import dayjs from "dayjs";
import detail from "@/views/gzt/fxyj/rfxyj/detail.vue";
import zfxyj from "@/views/gzt/fxyj/zfxyj/index.vue";
import rfx_sc from "@/views/gzt/fxyj/rfxyj/rfx_sc.vue";
import DateRangerPickerComponent from "@/components/DateRangerPickerComponent.vue";

export default {
  name: "rfxyj",
  mixins: [table_mixin],
  components: { DateRangerPickerComponent, UploadHttpComponent },
  data() {
    return {
      time: ["", ""],
      total: 0,
      searchParams: {
        keyword: "",
        sdt: "",
        edt: "",
        sortOrder: "",
        sortColumn: "",
      },
      tableData: [],
      isAutoWrap: false,
    };
  },
  watch: {
    time: {
      handler(val) {
        if (val) {
          this.searchParams.sdt = val[0];
          this.searchParams.edt = val[1];
        } else {
          this.searchParams.sdt = "";
          this.searchParams.edt = "";
        }
      },
      immediate: false,
    },
  },
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
          field: "zt",
          title: "主题",
          minWidth: 120,
        },
        {
          field: "fxdj",
          title: "风险等级",
          width: 120,
        },
        {
          field: "sy",
          title: "事由",
          minWidth: 120,
          headerAlign: "center",
          align: "left",
        },

        {
          field: "kssj",
          title: "开始时间",
          width: 150,
          sortable: true,
          editRender: {
            name: "ElDatePicker",
            props: {
              type: "date",
              labelFormat: "YYYY-MM-DD",
              valueFormat: "YYYY-MM-DD",
              clearable: true,
            },
          },
        },
        {
          field: "jssj",
          title: "结束时间",
          width: 150,
          sortable: true,
          editRender: {
            name: "ElDatePicker",
            props: {
              type: "date",
              labelFormat: "YYYY-MM-DD",
              valueFormat: "YYYY-MM-DD",
              clearable: true,
            },
          },
        },

        {
          field: "fxfx",
          title: "风险分析",
          minWidth: 120,
          headerAlign: "center",
          align: "left",
          editRender: {
            name: "ElInput",
            props: { type: "textarea", clearable: true },
          },
        },
        {
          field: "ykcs",
          title: "预控措施",
          minWidth: 120,
          headerAlign: "center",
          align: "left",
          editRender: {
            name: "ElInput",
            props: { type: "textarea", clearable: true },
          },
        },
        {
          title: "查看风险预警通知书",
          minWidth: 120,
          fixed: "right",
          headerAlign: "center",
          align: "left",
          slots: { default: "action" },
        },
      ];
    },
    editRules() {
      return {
        kssj: [
          { required: true, message: "开始时间不能为空" },
          validateRules.date.rule,
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
          validateRules.date.rule,
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
        editConfig: {
          trigger: "click",
          mode: "cell",
          showStatus: true,
          showIcon: true,
          beforeEditMethod: this.beforeEditMethod,
        },
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
            save: ({ body }) => {
              return this.doSaveApi(body);
            },
          },
        },
        exportConfig: {
          // remote: true,
          filename: "日风险预警表",
          sheetName: "sheet1",
          type: "xlsx",
          mode: "all",
          modes: ["current", "selected", "all"],
          message: false,
          columns: this.tableHeaderList.filter((i) => i.type !== "checkbox"),
          exportMethod: this.exportMethod,
          afterExportMethod: this.afterExportMethod,
        },
        editRules: this.editRules,
        columns: this.tableHeaderList,
        cellClassName({ row, column }) {
          if (column.field === "fxyjtzs") {
            return "col-blue";
          }
          return null;
        },
      };
    },

    defaultLeftButtons() {
      return [
        { type: "gradientGreen", name: "查询" },
        { type: "gradientDarkGreen", name: "重置" },
        { type: "gradientGreen", name: "自动换行" },
        { type: "gradientGreen", name: "导出当前页" },
        { type: "gradientGreen", name: "导出全部" },
      ];
    },
    defaultRightButtons() {
      return [
        { type: "gradientBlue", name: "初始化" },
        { type: "gradientBlue", name: "保存" },
        { type: "gradientRed", name: "删除" },
      ];
    },
  },
  created() {
    this.searchParams.sdt = dayjs().format("YYYY-MM-DD");
    this.searchParams.edt = dayjs().add(1, "day").format("YYYY-MM-DD");
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
      //
      let params = this.getRealParams(this.searchParams, page, sorts, filters);
      return new Promise((resolve) => {
        rfxApi.loadTableDataService(params).then((res) => {
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

    doInit() {
      this.$vxeModal.show(
        zfxyj,
        {
          isModal: true,
        },
        {
          width: window.innerWidth - 200,
          title: "周风险预警选择",
          height: window.innerHeight - 100,
        },
        {
          // close: () => {
          //   this.loadTableData();
          // },
          doSubmit: (rows) => {
            rfxApi.initTableDataService({ data: rows }).then((res) => {
              this.$message.success(res.data);
              this.$vxeModal.closeAll();
              this.loadTableData();
            });
          },
        },
      );
    },
    doDetail(row) {
      this.$vxeModal.show(
        detail,
        {
          row: row,
          validateRules: this.editRules,
        },
        {
          width: 900,
          title: "详情",
          height: window.innerHeight - 100,
        },
        {
          // close: () => {
          //   this.loadTableData();
          // },
          doSubmit: (res) => {
            if (res.kssj && res.jssj) {
              if (dayjs(res.kssj).isAfter(res.jssj)) {
                this.$message.error("开始时间不能在结束时间之后");
                return;
              }
            }
            this.doRealSave([res]);
          },
        },
      );
    },
    doAddRfx() {
      this.$vxeModal.show(
        rfx_sc,
        {},
        {
          width: 1400,
          title: "快速生成日风险",
          height: window.innerHeight - 100,
        },
        {
          // close: () => {
          //   this.loadTableData();
          // },
          doSubmit: (rows) => {
            rfxApi.doTqDataService({ data: rows }).then((res) => {
              this.$message.success(res.data);
              this.$vxeModal.closeAll();
              this.loadTableData();
            });
          },
        },
      );
    },
    doRealSave(data) {
      rfxApi.saveTableDataService({ data }).then((res) => {
        this.$message.success(res.data);
        this.$vxeModal.closeAll();
        this.loadTableData();
      });
    },
    doSave() {
      this.$refs.xTable.commitProxy("save");
    },
    doSaveApi(body) {
      return new Promise((resolve, reject) => {
        let { insertRecords, updateRecords } = body;
        let data = [...insertRecords, ...updateRecords];
        rfxApi
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
        rfxApi
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

    cellDblclick(e) {
      let { row, column } = e;
      if (column.field == "fxyjtzs") {
        console.log(row);
      }
    },
    resetParams() {
      this.searchParams.sdt = dayjs().format("YYYY-MM-DD");
      this.searchParams.edt = dayjs().add(1, "day").format("YYYY-MM-DD");
      this.searchParams.keyword = "";
      this.searchParams.sortOrder = "";
      this.searchParams.sortColumn = "";
      this.$nextTick(function () {
        this.loadTableData();
      });
    },
  },
};
</script>
<style>
#rfxyj .col-blue {
  //text-decoration: underline;
  color: #03b6fc;
  cursor: pointer;
}
</style>
<style scoped lang="scss">
.page_content {
  background-color: rgb(239, 247, 245);
  article {
    height: calc(100% - 48px);
  }
}
</style>
