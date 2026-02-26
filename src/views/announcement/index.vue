<template>
  <div class="page_content">
    <header>
      <section>
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
        <!--        <div class="header-item">-->
        <!--          <el-dropdown>-->
        <!--            <el-button type="gradientGreen">-->
        <!--              导出<el-icon class="el-icon&#45;&#45;right"><arrow-down /></el-icon>-->
        <!--            </el-button>-->
        <!--            <template #dropdown>-->
        <!--              <el-dropdown-menu>-->
        <!--                <el-dropdown-item @click="doExport">导出当前页</el-dropdown-item>-->
        <!--                <el-dropdown-item @click="doExport(true)">导出全部</el-dropdown-item>-->
        <!--              </el-dropdown-menu>-->
        <!--            </template>-->
        <!--          </el-dropdown>-->
        <!--        </div>-->
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
        v-on="{ cellDblclick: cellDblclick }"
      >
      </vxe-grid>
    </article>
  </div>
</template>

<script>
import table_mixin from "@/mixin/table_mixin.jsx";
import exampleApi from "@/api/table-example-api.js";
import UploadHttpComponent from "@/components/UploadHttpComponent.vue";
import dynamic_form from "@/views/vxeModal/dynamic_form.vue";
import validateRules from "@/utils/validateRules.js";
import announcementApi from "@/api/annoucement-api.js";
import commonApi from "@/api/common-api.js";

export default {
  name: "announcement",
  mixins: [table_mixin],
  components: { UploadHttpComponent },
  data() {
    return {
      time: ["", ""],
      total: 0,
      searchParams: {
        // keyword: '',
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
          field: "ggbt",
          title: "公告标题",
          minWidth: 120,
          // cellRender: {
          //   name: 'FormatTreeSelect',
          //   options: this.$store.state.selectOptionsObj.ggdx
          // }
        },
        {
          field: "yxq",
          title: "公告有效期",
          width: 150,
          sortable: true,
        },
        {
          field: "fbr",
          title: "发布人",
          width: 120,
        },
        {
          field: "fbrq",
          title: "发布日期",
          width: 150,
          sortable: true,
        },
        {
          field: "nr",
          title: "公告内容",
          type: "html",
          minWidth: 120,
          headerAlign: "center",
          align: "left",
        },
      ];
    },
    tableDetailHeaderList() {
      return [
        {
          field: "ggbt",
          title: "公告标题",
          colWidth: "50%",
          editRender: { name: "ElInput", props: { clearable: true } },
        },
        {
          field: "yxq",
          title: "公告有效期",
          colWidth: "50%",
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
          field: "ggdxIdList",
          title: "公告对象",
          colWidth: "50%",
          editRender: {
            name: "$ElTreeSelect",
            data: this.$store.state.selectOptionsObj.ggdx,
            props: { clearable: true, filterable: true, multiple: true },
          },
        },
        {
          field: "fbr",
          title: "发布人",
          colWidth: "50%",
          editRender: {},
          // editRender: {name: 'ElInput', props: {clearable: true,}},
        },
        {
          field: "fbrq",
          title: "发布日期",
          colWidth: "50%",
          editRender: {},
          // editRender: {name: 'ElDatePicker', props: {type: 'date', labelFormat: "YYYY-MM-DD", valueFormat: "YYYY-MM-DD",}},
        },
        {
          field: "fileList",
          title: "文件",
          colWidth: "50%",
          editRender: {
            name: "vxeUpload",
            props: {
              multiple: true,
              types: ["doc", "docx", "xls", "xlsx", "pdf"],
              type: "gg",
              limitSize: 50,
            },
          },
        },
        {
          field: "nr",
          title: "公告内容",
          editRender: { name: "ElTiptap" },
        },
      ];
    },
    editRules() {
      return {
        ggbt: [{ required: true, message: "公告标题不能为空" }],
        yxq: [
          { required: true, message: "公告有效期不能为空" },
          validateRules.date.rule,
        ],
        ggdxId: [{ required: true, message: "公告对象不能为空" }],
      };
    },
    gridOptions() {
      return {
        height: "auto",
        border: true, //边框
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
        headerCellClassName: "row-class",
        pagerConfig: this.pagerConfig,
        editConfig: {}, //必须存在，不然格式化不成功
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
          filename: "系统公告表格",
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
      };
    },

    defaultLeftButtons() {
      return [
        { type: "gradientGreen", name: "查询" },
        // {type: 'gradientGreen', name: '导出当前页'},
        // {type: 'gradientGreen', name: '导出全部'},
      ];
    },
    defaultRightButtons() {
      return [
        // {type: 'gradientBlue', name: '下载导入模版'},
        { type: "gradientBlue", name: "新增" },
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
      //
      let params = this.getRealParams(this.searchParams, page, sorts, filters);
      return new Promise((resolve) => {
        announcementApi.loadTableDataService(params).then((res) => {
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

    doAdd() {
      commonApi.getAddIdService().then((res) => {
        this.$vxeModal.show(
          dynamic_form,
          {
            tableHeaderList: this.tableDetailHeaderList,
            validateRules: this.editRules,
            row: { id: res.data, fileList: [] },
            labelWidth: "120px",
          },
          {
            width: 1200,
            title: "新增",
            height: window.innerHeight - 200,
          },
          {
            // close: () => {
            //   this.loadTableData();
            // },
            doSubmit: (res) => {
              res.ggdxId = res.ggdxIdList.join(",");
              announcementApi
                .saveTableDataService({ data: [res] })
                .then((res) => {
                  this.$message.success(res.data);
                  this.$vxeModal.closeAll();
                  this.loadTableData();
                });
            },
          },
        );
      });
    },
    doSave() {
      this.$refs.xTable.commitProxy("save");
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
        announcementApi
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

    resetParams() {
      this.searchParams.keyword = "";
      this.time = ["", ""];
      this.$nextTick(function () {
        this.loadTableData();
      });
    },
    cellDblclick(e) {
      let { row } = e;
      this.openDetail(row);
    },
    openDetail(row) {
      this.$vxeModal.show(
        dynamic_form,
        {
          tableHeaderList: this.tableDetailHeaderList,
          validateRules: this.editRules,
          row: row,
          labelWidth: "120px",
        },
        {
          width: 1200,
          title: "详情",
          height: window.innerHeight - 200,
        },
        {
          close: () => {},
          doSubmit: (res) => {
            res.ggdxId = res.ggdxIdList.join(",");
            announcementApi
              .saveTableDataService({ data: [res] })
              .then((res) => {
                this.$message.success(res.data);
                this.$vxeModal.closeAll();
                this.loadTableData();
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
    height: calc(100% - 48px);
  }
}
</style>
