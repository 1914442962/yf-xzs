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
            button-name="上传"
            prop-upload-url="/bwddxy/analysisWord"
            :accept-str="['doc', 'docx']"
            @loadTableData="doAdd"
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
        @menu-click="(e) => menuClickEvent(e, '并网调度协议')"
      >
        <template #action="{ row }">
          <vxe-button
            mode="text"
            icon="vxe-icon-search"
            status="primary"
            @click="previewMethod(row)"
          ></vxe-button>
          <vxe-button
            mode="text"
            status="primary"
            icon="vxe-icon-download"
            @click="downloadMethod(row)"
          ></vxe-button>
        </template>
      </vxe-grid>
    </article>
  </div>
</template>

<script>
import table_mixin from "@/mixin/table_mixin.jsx";
import UploadHttpComponent from "@/components/UploadHttpComponent.vue";
import dynamic_form from "@/views/vxeModal/dynamic_form.vue";
import validateRules from "@/utils/validateRules.js";
import { VxeUI } from "vxe-table";
import bwddApi from "@/api/bwdd-api.js";
import commonApi from "@/api/common-api.js";
import { fileToBlobUrl } from "@/utils/tools.js";
import view_file from "@/views/vxeModal/view_file.vue";

export default {
  name: "bwdd",
  mixins: [table_mixin],
  components: { UploadHttpComponent },
  data() {
    return {
      time: ["", ""],
      total: 0,
      searchParams: {
        keyword: "",
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
          fixed: "left",
        },
        {
          type: "seq",
          width: 60,
          fixed: "left",
        },
        {
          field: "yfmc",
          title: "乙方名称",
          minWidth: 240,
          editRender: { name: "ElInput", props: { clearable: true } },
        },
        {
          field: "bdzName",
          title: "变电站名称",
          minWidth: 200,
          editRender: { name: "ElInput", props: { clearable: true } },
        },
        {
          field: "dyxlmc1",
          title: "第一路电源线路名称",
          minWidth: 420,
          headerAlign: "center",
          align: "left",
          editRender: { name: "ElInput", props: { clearable: true } },
        },
        {
          field: "dyxlmc2",
          title: "第二路电源线路名称",
          minWidth: 420,
          headerAlign: "center",
          align: "left",
          editRender: { name: "ElInput", props: { clearable: true } },
        },
        {
          field: "zbrl",
          title: "主变容量",
          minWidth: 300,
          headerAlign: "center",
          align: "right",
          // sortable: true,
          // headerAlign: 'center',
          // align: 'right',
          // formatter: ['formatterNumber',0],
          editRender: { name: "ElInput", props: { clearable: true } },
          // editRender: {name: 'ElInput', props: {type: 'number', min: 0, step: 1, clearable: true}},
        },
        {
          field: "yfZydh",
          title: "乙方专用电话",
          minWidth: 300,
          editRender: { name: "ElInput", props: { clearable: true } },
        },
        {
          field: "jjlxr",
          title: "紧急联系人",
          minWidth: 240,
          editRender: { name: "ElInput", props: { clearable: true } },
        },
        {
          title: "操作",
          width: "100",
          slots: { default: "action" },
          fixed: "right",
        },
      ];
    },
    editRules() {
      return {
        // yfmc: [
        //   {required: true, message: '乙方名称不能为空'}
        // ],
        // bdzName: [
        //   {required: true, message: '变电站名称不能为空'}
        // ],
        // dyxlmc1: [
        //   {required: true, message: '第一路电源线路名称不能为空'}
        // ],
        // dyxlmc2: [
        //   {required: true, message: '第二路电源线路名称不能为空'}
        // ],
        // zbrl: [
        //   {required: true, message: '主变容量不能为空'},
        //   // validateRules.positive_number.rule
        // ],
        // yfZydh: [
        //   {required: true, message: '乙方专用电话不能为空'},
        //   // validateRules.cellphone.rule
        // ],
        // jjlxr: [
        //   {required: true, message: '紧急联系人不能为空'}
        // ],
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
            save: ({ body }) => {
              return this.doSaveApi(body);
            },
          },
        },
        exportConfig: {
          // remote: true,
          filename: "并网调度协议表",
          sheetName: "sheet1",
          type: "xlsx",
          mode: "all",
          modes: ["current", "selected", "all"],
          message: false,
          columns: this.tableHeaderList.filter(
            (i) => i.type !== "checkbox" && i.field,
          ),
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
        // { type: "gradientGreen", name: "导出当前页" },
        // { type: "gradientGreen", name: "导出全部" },
      ];
    },
    defaultRightButtons() {
      return [{ type: "gradientRed", name: "删除" }];
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
        bwddApi.loadTableDataService(params).then((res) => {
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

    doAdd(row) {
      this.$vxeModal.show(
        dynamic_form,
        {
          tableHeaderList: this.tableHeaderList.filter(
            (i) => i.type !== "checkbox" && i.field,
          ),
          validateRules: this.editRules,
          row: row,
        },
        {
          width: 800,
          title: "详情",
          height: window.innerHeight - 100,
        },
        {
          // close: () => {
          //   this.loadTableData();
          // },
          doSubmit: (res) => {
            this.doRealSave([res]);
          },
        },
      );
    },
    doRealSave(data) {
      this.$confirm(`确认保存修改的数据吗？`, "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      }).then(() => {
        bwddApi.saveTableDataService({ data }).then((res) => {
          this.$message.success(res.data);
          VxeUI.modal.close();
          this.loadTableData(true);
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
        bwddApi
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

    downloadMethod(row) {
      commonApi.downloadFileGetService({ fileId: row.fileId });
    },
    previewMethod(row) {
      if (this.$store.state.isXzs) {
        commonApi.preViewFileGetService({ fileId: row.fileId });
      } else {
        commonApi.preViewFileService({ fileId: row.fileId }).then((res) => {
          let url = fileToBlobUrl(res, "pdf") + "#toolbar=0";
          this.$vxeModal.show(
            view_file,
            {
              url: url,
            },
            {
              width: 800,
              title: "文件预览",
              height: window.innerHeight - 20,
            },
            {},
          );
        });
      }
    },
    doExport(flag) {
      commonApi.exportFileService(
        "/bwddxy/export",
        this.searchParams,
        flag,
        this.pagerParam,
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
