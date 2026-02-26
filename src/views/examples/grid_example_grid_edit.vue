<template>
  <div class="page_content">
    <header>
      <section>
        <!--        <div class="header-item">-->
        <!--          日期范围：-->
        <!--          <el-date-picker-->
        <!--              v-model="time"-->
        <!--              type="daterange" format="YYYY-MM-DD" value-format="YYYY-MM-DD"-->
        <!--              range-separator="-"-->
        <!--              start-placeholder="开始日期"-->
        <!--              end-placeholder="结束日期">-->
        <!--          </el-date-picker>-->
        <!--        </div>-->
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
        <div class="header-item">
          <upload-http-component
            prop-upload-url=""
            @loadTableData="loadTableData(true)"
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
      <vxe-grid v-bind="gridOptions" ref="xTable"> </vxe-grid>
    </article>
  </div>
</template>

<script>
import table_mixin from "@/mixin/table_mixin.jsx";
import exampleApi from "@/api/table-example-api.js";
import UploadHttpComponent from "@/components/UploadHttpComponent.vue";
import validateRules from "@/utils/validateRules.js";

export default {
  name: "grid_example",
  mixins: [table_mixin],
  components: { UploadHttpComponent },
  data() {
    return {
      time: ["", ""],
      total: 0,
      searchParams: {
        keyword: "",
        startTime: "",
        endTime: "",
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
          field: "name",
          title: "名字",
          minWidth: 120,
          editRender: { name: "ElInput", props: { clearable: true } },
        },
        {
          field: "sex",
          title: "性别",
          width: 100,
          filters: [
            { label: "男", value: "男" },
            { label: "女", value: "女" },
          ],
          editRender: {
            name: "ElSelect",
            options: [
              { label: "男", value: "男" },
              { label: "女", value: "女" },
            ],
            props: { multiple: true, clearable: true },
          },
        },
        {
          field: "money",
          title: "金钱（元）",
          minWidth: 120,
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
          field: "dydj",
          title: "电压等级",
          minWidth: 120,
          sortable: true,
          headerAlign: "center",
          align: "right",
          formatter: ["formatterNumber", 0],
          editRender: {
            name: "ElInput",
            props: { type: "number", min: 0, step: 1, clearable: true },
          },
        },
        {
          field: "birthday",
          title: "生日",
          width: 150,
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
          field: "remark",
          title: "备注",
          minWidth: 120,
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
      ];
    },
    editRules() {
      return {
        name: [{ required: true, message: "名字不能为空" }],
        sex: [{ required: true, message: "性别不能为空" }],
        money: [
          { required: true, message: "金钱（元）不能为空" },
          validateRules.positive_number.rule,
        ],
        date: [
          { required: true, message: "日期不能为空" },
          validateRules.date.rule,
        ],
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
          filename: "运行方式模版管理表",
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
        editRules: this.editRules,
        columns: this.tableHeaderList,
      };
    },

    defaultLeftButtons() {
      return [
        { type: "gradientGreen", name: "查询" },
        { type: "gradientDarkGreen", name: "重置" },
        { type: "gradientDarkGreen", name: "刷新" },
        { type: "gradientGreen", name: "导出当前页" },
        { type: "gradientGreen", name: "导出全部" },
      ];
    },
    defaultRightButtons() {
      return [
        { type: "gradientBlue", name: "下载导入模版" },
        { type: "gradientBlue", name: "新增" },
        { type: "gradientBlue", name: "保存" },
        { type: "gradientRed", name: "删除" },
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
      return new Promise((resolve, reject) => {
        exampleApi.loadTableDataService(params).then((res) => {
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
      let record = {};
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
        exampleApi
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
        exampleApi
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
      exampleApi.downloadModuleService();
    },

    beforeEditMethod({ row, column }) {
      return true;
    },
    resetParams() {
      this.searchParams.keyword = "";
      this.searchParams.sortOrder = "";
      this.searchParams.sortColumn = "";
      this.time = ["", ""];
      this.$nextTick(function () {
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
