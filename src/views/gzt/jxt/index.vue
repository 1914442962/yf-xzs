<template>
  <div class="page_content">
    <header>
      <section>
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
        @menu-click="(e) => menuClickEvent(e, '接线图')"
      >
        <template #action="{ row }">
          <vxe-button
            mode="text"
            status="primary"
            @click="doOpenIframe(row)"
            v-if="row.id"
            >绘图</vxe-button
          >
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
import jxtApi from "@/api/jxt-api.js";
import sixDragon from "@/views/vxeModal/sixDrageon/sixDragon.vue";
import view_simple_table from "@/views/vxeModal/view_simple_table.vue";

export default {
  name: "llt",
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
          field: "mc",
          title: "名称",
          minWidth: 120,
          editRender: { name: "ElInput", props: { clearable: true } },
        },

        {
          field: "updateTime",
          title: "修改时间",
          width: 150,
          sortable: true,
          // editRender: {name: 'ElDatePicker', props: {type: 'date', labelFormat: "YYYY-MM-DD", valueFormat: "YYYY-MM-DD",}},
        },
        {
          title: "操作",
          width: "150",
          slots: { default: "action" },
        },
      ];
    },
    editRules() {
      return {
        mc: [{ required: true, message: "名称不能为空" }],
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
        { type: "gradientDarkGreen", name: "刷新" },
      ];
    },
    defaultRightButtons() {
      return [
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
        jxtApi.loadTableDataService(params).then((res) => {
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
        jxtApi
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
        jxtApi
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

    beforeEditMethod({ row, column }) {
      return true;
    },
    resetParams() {
      this.searchParams.keyword = "";
      this.time = ["", ""];
      this.$nextTick(function () {
        this.loadTableData();
      });
    },
    doOpenIframe(row) {
      this.$vxeModal.show(
        sixDragon,
        {
          id: row.id,
        },
        {
          width: window.innerWidth - 10,
          title: "绘制",
          height: window.innerHeight - 20,
        },
        {},
      );
    },
    doViewLog(row) {
      jxtApi.loadViewDialogService({ id: row.id }).then((res) => {
        this.$vxeModal.show(
          view_simple_table,
          {
            tableHeaderList: [
              {
                type: "seq",
                width: 60,
              },

              {
                field: "czr",
                title: "操作人",
                width: "100",
              },
              {
                field: "time",
                title: "操作时间",
                width: "150",
              },
              {
                field: "nr",
                title: "内容",
              },
            ],
            tableData: res.data,
          },
          {
            width: 800,
            title: "日志",
            height: 600,
          },
          {},
        );
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
