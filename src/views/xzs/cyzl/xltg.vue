<template>
  <div class="page_content">
    <header>
      <section>
        <div class="header-item">
          版本号：
          <el-select
            v-model="searchParams.version"
            placeholder="请选择"
            filterable
          >
            <el-option
              v-for="item in versionOptions"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            >
            </el-option>
          </el-select>
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
          <upload-http-component
            prop-upload-url="/xltg/importData"
            @loadTableData="refreshData"
          ></upload-http-component>
        </div>
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
        @menu-click="(e) => menuClickEvent(e, '常用资料')"
      >
        <template #action="{ row }">
          <vxe-button
            mode="text"
            status="primary"
            @click="doViewLog(row)"
            v-if="row.id"
            >日志</vxe-button
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
import xltgApi from "@/api/xzs/xltg-api.js";
import commonApi from "@/api/common-api.js";
import cyzl_dialog from "@/views/xzs/cyzl/cyzl_dialog.vue";

export default {
  name: "xltg",
  mixins: [table_mixin],
  components: { UploadHttpComponent },
  data() {
    return {
      time: ["", ""],
      total: 0,
      versionOptions: [],
      searchParams: {
        keyword: "",
        version: "",
        // startTime: '',
        // endTime: '',
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
          this.searchParams.startTime = val[0];
          this.searchParams.endTime = val[1];
        } else {
          this.searchParams.startTime = "";
          this.searchParams.endTime = "";
        }
      },
      immediate: false,
    },
    "searchParams.version": {
      handler(val) {
        if (val) {
          this.loadTableData();
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
          fixed: "left",
        },
        {
          type: "seq",
          width: 60,
          fixed: "left",
        },
        {
          field: "xlmc",
          title: "线路名称",
          minWidth: 120,
          fixed: "left",
          editRender: { name: "ElInput", props: { clearable: true } },
        },
        {
          field: "szss",
          title: "所在省市",
          width: 100,
          editRender: { name: "ElInput", props: { clearable: true } },
        },

        {
          field: "xlcd",
          title: "线路长度",
          width: 120,
          sortable: true,
          headerAlign: "center",
          align: "right",
          formatter: ["formatterNumber", 3],
          editRender: {
            name: "ElInput",
            props: { type: "number", min: 0, step: 1 },
          },
        },
        {
          field: "gtjs",
          title: "杆塔基数",
          width: 120,
          sortable: true,
          headerAlign: "center",
          align: "right",
          formatter: ["formatterNumber", 0],
          editRender: {
            name: "ElInput",
            props: { type: "number", min: 0, step: 1 },
          },
        },
        {
          field: "isTg",
          title: "是否存在同杆",
          width: 100,
          editRender: {
            name: "ElSelect",
            options: [
              { label: "是", value: "是" },
              { label: "否", value: "否" },
            ],
            props: { clearable: true },
          },
        },
        {
          field: "is3tgOrMore",
          title: "是否存在3线及以上同杆",
          width: 110,
          editRender: {
            name: "ElSelect",
            options: [
              { label: "是", value: "是" },
              { label: "否", value: "否" },
            ],
            props: { clearable: true },
          },
        },
        {
          field: "tgxlmc",
          title: "同杆线路名称",
          width: 150,
          editRender: { name: "ElInput", props: { clearable: true } },
        },
        {
          field: "tghs",
          title: "同杆回数",
          width: 120,
          sortable: true,
          headerAlign: "center",
          align: "right",
          formatter: ["formatterNumber", 0],
          editRender: {
            name: "ElInput",
            props: { type: "number", min: 0, step: 1 },
          },
        },
        {
          field: "tgtjs",
          title: "同杆塔基数",
          width: 140,
          sortable: true,
          headerAlign: "center",
          align: "right",
          formatter: ["formatterNumber", 0],
          editRender: {
            name: "ElInput",
            props: { type: "number", min: 0, step: 1 },
          },
        },
        {
          field: "tgbl",
          title: "同杆比例%",
          width: 120,
          // sortable: true,
          headerAlign: "center",
          align: "right",
          // formatter: ['formatterNumber', 2],
          editRender: { name: "ElInput", props: { clearable: true } },
        },
        {
          field: "tgxh",
          title: "同杆序号",
          width: 120,
          editRender: { name: "ElInput", props: { clearable: true } },
        },
        {
          field: "dxxh",
          title: "导线型号",
          minWidth: 150,
          editRender: { name: "ElInput", props: { clearable: true } },
        },
        {
          field: "bz",
          title: "备注",
          minWidth: 200,
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
          field: "ywdw",
          title: "运维单位",
          width: 100,
          editRender: { name: "ElInput", props: { clearable: true } },
        },
        {
          field: "banz",
          title: "班组",
          width: 100,
          editRender: { name: "ElInput", props: { clearable: true } },
        },
        {
          title: "日志",
          width: 100,
          fixed: "right",
          slots: { default: "action" },
        },
      ];
    },
    editRules() {
      return {
        // name: [
        //   {required: true, message: '名字不能为空'}
        // ],
        // sex: [
        //   {required: true, message: '性别不能为空'}
        // ],
        // money: [
        //   {required: true, message: '金钱（元）不能为空'},
        //   validateRules.positive_number.rule
        // ],
        // date: [
        //   {required: true, message: '日期不能为空'},
        //   validateRules.date.rule
        // ],
      };
    },
    gridOptions() {
      return {
        height: "auto",
        keepSource: true,
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
          reserve: true, //分页保留显示状态
          showServeStatus: true, //分页显示保留显示状态
          range: true, //鼠标滑动范围选择
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
        filterConfig: {
          remote: true,
        },
        showOverflow: this.isAutoWrap,
        headerCellClassName: "row-class",
        pagerConfig: this.pagerConfig,
        proxyConfig: {
          seq: true,
          showResponseMsg: false, //不展示提示消息
          showActionMsg: false,
          autoLoad: false,
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
          filename: "线路同杆情况表",
          sheetName: "sheet1",
          type: "xlsx",
          mode: "all",
          modes: ["current", "selected", "all"],
          message: false,
          columns: this.tableHeaderList.filter((i) => i.type !== "checkbox"),
          exportMethod: this.exportMethod,
          afterExportMethod: this.afterExportMethod,
        },
        editConfig: {
          trigger: "click",
          mode: "cell",
          showStatus: true,
          showIcon: true,
          beforeEditMethod: this.beforeEditMethod,
        },
        // spanMethod({ row, rowIndex, column, visibleData }) {
        //   const spanFields = ['xlmc'];
        //   const cellValue = row[column.field];
        //   if (cellValue && spanFields.includes(column.field)) {
        //     const prevRow = visibleData[rowIndex - 1];
        //     let nextRow = visibleData[rowIndex + 1];
        //     if (prevRow && prevRow[column.field] === cellValue) {
        //       return { rowspan: 0, colspan: 0 };
        //     }
        //     else {
        //       let countRowspan = 1;
        //       while (nextRow && nextRow[column.field] === cellValue) {
        //         nextRow = visibleData[++countRowspan + rowIndex];
        //       }
        //       if (countRowspan > 1) {
        //         return { rowspan: countRowspan, colspan: 1 };
        //       }
        //     }
        //   }
        // },
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
        { type: "gradientDarkGreen", name: "重置" },
        { type: "gradientDarkGreen", name: "刷新" },
        // { type: "gradientGreen", name: "导出当前页" },
        // { type: "gradientGreen", name: "导出全部" },
      ];
    },
    defaultRightButtons() {
      return [
        { type: "gradientBlue", name: "下载导入模版" },
        { type: "gradientGreen", name: "新增" },
        { type: "gradientBlue", name: "保存" },
        { type: "gradientRed", name: "删除" },
      ];
    },
  },
  created() {
    this.getVersionOptions();
  },
  mounted() {},
  methods: {
    getVersionOptions() {
      xltgApi.loadVersionDataService().then((res) => {
        this.versionOptions = res.data;
        if (this.versionOptions.length > 0) {
          this.searchParams.version = this.versionOptions[0].value;
        }
      });
    },
    refreshData() {
      this.getVersionOptions();
    },
    reloadTableData() {
      this.$refs.xTable.commitProxy("query"); //不重置分页
    },
    loadTableData() {
      this.$refs.xTable.commitProxy("reload"); //重置分页
    },
    loadTableApi(page, sorts, filters) {
      let params = this.getRealParams(this.searchParams, page, sorts, filters);
      return new Promise((resolve, reject) => {
        xltgApi.loadTableDataService(params).then((res) => {
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
    doAdd() {
      let record = {
        version: this.searchParams.version,
      };
      this.$refs.xTable.insertAt(record).then((row) => {
        this.$refs.xTable.setEditRow(row);
      });
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
        xltgApi
          .saveTableDataService(data)
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
        xltgApi
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

    downloadModule() {
      commonApi.exportFileService("/xltg/export", { exportType: "模板" });
    },
    doExport(flag) {
      commonApi.exportFileService(
        "/xltg/export",
        { exportType: "数据", ...this.searchParams },
        flag,
        this.pagerParam,
      );
    },

    beforeEditMethod({ row, column }) {
      return true;
    },
    resetParams() {
      this.searchParams.keyword = "";
      // this.time = ['', ''];
      this.$nextTick(function () {
        this.loadTableData();
      });
    },
    doViewLog(row) {
      this.$vxeModal.show(
        cyzl_dialog,
        {
          row: row,
          version: this.searchParams.version,
          headerList: this.tableHeaderList.filter((i) => !i.type && !i.slots),
          saveUrl: "/xltg/saveNoLog",
        },
        {
          width: 1000,
          title: "日志",
          height: 800,
        },
        {
          close: () => {
            this.reloadTableData();
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
    height: calc(100% - 48px);
  }
}
</style>
