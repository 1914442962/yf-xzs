<template>
  <div class="page_content">
    <header>
      <section>
        <div class="header-item">
          日期范围：
          <el-date-picker
            v-model="time"
            type="daterange"
            format="YYYY-MM-DD"
            value-format="YYYY-MM-DD"
            range-separator="-"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
            style="width: 250px"
          >
          </el-date-picker>
        </div>
        <div class="header-item">
          <el-input
            placeholder="请输入关键字"
            v-model="searchParams.keyword"
            @keydown.enter="loadTableData"
            :title="searchParams.keyword"
            clearable
            style="width: 150px"
          >
          </el-input>
        </div>
        <div class="header-item">
          <el-button
            :type="item.type"
            :plain="item.plain"
            v-for="(item, index) in defaultDefaultButtons"
            :key="index + 'defaultDefaultButtons'"
            @click="btnClick(item)"
          >
            {{ item.name }}
          </el-button>

          <el-dropdown style="margin: 0 10px">
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
        v-on="{ cellDblclick: cellDblclick }"
        @menu-click="(e) => menuClickEvent(e, '设备检修')"
      >
        <template #dqzt="{ row, column }">
          <vxe-tag
            status="error"
            v-if="row.dqzt == '已退回' || row.dqzt == '已作废'"
            >{{ row.dqzt }}</vxe-tag
          >
          <vxe-tag status="success" v-else-if="row.dqzt.includes('已')">{{
            row.dqzt
          }}</vxe-tag>
          <vxe-tag status="info" v-else>{{ row.dqzt }}</vxe-tag>
        </template>
      </vxe-grid>
    </article>
  </div>
</template>

<script>
import table_mixin from "@/mixin/table_mixin.jsx";
import dynamic_form from "@/views/vxeModal/dynamic_form.vue";
import fsbgdApi from "@/api/fsbgd-api.js";
import commonApi from "@/api/common-api.js";
import view_simple_table from "@/views/vxeModal/view_simple_table.vue";
import view_flow from "@/views/vxeModal/view_flow.vue";
import view_prompt from "@/views/vxeModal/view_prompt.vue";

export default {
  name: "fsbgd_table",
  mixins: [table_mixin],
  components: {},
  props: {
    node: Object,
  },
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
      defaultLeftButtons: [],
      defaultRightButtons: [],
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
          fixed: "left",
        },
        {
          type: "seq",
          width: 60,
          fixed: "left",
        },
        {
          field: "bh",
          title: "编号",
          width: 120,
          fixed: "left",
        },
        {
          field: "fslx",
          title: "方式类型",
          width: 120,
        },
        {
          field: "bgdmc",
          title: "变更单名称",
          width: 120,
        },
        {
          field: "bgdnr",
          title: "变更单内容",
          minWidth: 160,
          headerAlign: "center",
          align: "left",
        },
        {
          field: "bzr",
          title: "编制人",
          width: 90,
        },
        {
          field: "bzsj",
          title: "编制时间",
          sortable: true,
          width: 150,
        },
        {
          field: "tzsj",
          title: "调整时间",
          sortable: true,
          width: 150,
        },
        {
          field: "fszt",
          title: "方式状态",
          width: 100,
        },
        // {
        //   field: "jszt",
        //   title: "接受状态",
        //   width: 90,
        // },
        {
          field: "dqzt",
          title: "处理状态",
          width: 120,
          slots: { default: "dqzt" },
        },
        // {
        //   field: "jsr",
        //   title: "接收人",
        //   width: 100,
        // },
        // {
        //   field: "jssj",
        //   title: "接收时间",
        //   sortable: true,
        //   width: 150,
        // },
      ];
    },
    tableDetailHeaderList() {
      return [
        {
          field: "bh",
          title: "变更单编号",
          colWidth: "50%",
          editRender: {},
        },
        {
          field: "bgdmc",
          title: "变更单名称",
          colWidth: "50%",
          editRender: { name: "ElInput", props: { clearable: true } },
        },
        {
          field: "fslx",
          title: "方式类型",
          colWidth: "50%",
          editRender: {
            name: "$ElTreeSelect",
            data: this.$store.state.staticOptionsObj.fslx,
            props: { clearable: true },
          },
        },
        {
          field: "tzsj",
          title: "调整时间",
          colWidth: "50%",
          editRender: {
            name: "ElDatePicker",
            props: {
              type: "datetime",
              labelFormat: "YYYY-MM-DD HH:mm:ss",
              valueFormat: "YYYY-MM-DD HH:mm:ss",
            },
          },
        },
        {
          field: "bgdnr",
          title: "变更单内容",
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
          field: "fileList",
          title: "附件",
          editRender: {
            name: "vxeUpload",
            props: {
              multiple: true,
              types: ["doc", "docx", "xls", "xlsx", "pdf"],
              type: "fsbgd",
              limitSize: 50,
            },
          },
        },
        // {
        //   field: "bzr",
        //   title: "编制人",
        //   colWidth: '50%',
        //   editRender: {}
        // },
        // {
        //   field: "bzsj",
        //   title: "编制时间",
        //   colWidth: '50%',
        //   editRender: {}
        // },
        {
          field: "fszt",
          title: "方式状态",
          editRender: {
            name: "$ElTreeSelect",
            data: this.$store.state.staticOptionsObj.fszt,
            props: { clearable: true, filterable: true },
          },
        },
      ];
    },
    editRules() {
      return {
        bgdmc: [{ required: true, message: "变更单名称不能为空" }],
        fslx: [{ required: true, message: "方式类型不能为空" }],
        tzsj: [{ required: true, message: "调整时间不能为空" }],
        bgdnr: [{ required: true, message: "变更单内容不能为空" }],
        fszt: [{ required: true, message: "变更单内容不能为空" }],
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
          },
        },
        exportConfig: {
          // remote: true,
          filename: "方式变更单表格",
          sheetName: "sheet1",
          type: "xlsx",
          mode: "all",
          modes: ["current", "selected", "all"],
          message: false,
          columns: this.tableHeaderList.filter((i) => i.type !== "checkbox"),
          exportMethod: this.exportMethod,
          afterExportMethod: this.afterExportMethod,
        },
        columns: this.tableHeaderList,
        menuConfig: {
          body: {
            options: [[{ code: "collect", name: "标记重点" }]],
          },
        },
        cellClassName({ row, column }) {
          if (column.field === "jszt" && row.jszt === "未接收") {
            return "row-red";
          }
          return null;
        },
      };
    },

    defaultDefaultButtons() {
      return [
        { type: "gradientGreen", name: "查询" },
        { type: "gradientDarkGreen", name: "重置" },
        { type: "gradientGreen", name: "自动换行" },
        // { type: "gradientGreen", name: "导出当前页" },
        // { type: "gradientGreen", name: "导出全部" },
      ];
    },
  },
  mounted() {
    this.getButtons();
  },
  methods: {
    getButtons() {
      fsbgdApi
        .loadButtonDataService({ id: this.node.id, title: this.node.title })
        .then((res) => {
          this.defaultLeftButtons = res.data.filter(
            (i) => i.position == "left",
          );
          this.defaultRightButtons = res.data.filter(
            (i) => i.position == "right",
          );
        })
        .catch(() => {
          this.defaultLeftButtons = [
            { type: "gradientBlue", name: "查看日志" },
            { type: "gradientBlue", name: "查看流程图" },
          ];
          this.defaultRightButtons = [
            { type: "gradientBlue", name: "新增" },
            { type: "gradientRed", name: "删除" },
            { type: "gradientBlue", name: "发送" },
          ];
        });
    },
    reloadTableData() {
      this.$refs.xTable.commitProxy("query"); //不重置分页
    },
    loadTableData() {
      this.$refs.xTable.commitProxy("reload"); //重置分页
    },
    loadTableApi(page, sorts, filters) {
      let params = this.getRealParams(this.searchParams, page, sorts, filters);
      return new Promise((resolve) => {
        fsbgdApi
          .loadTableDataService({
            ...params,
            id: this.node.id,
            title: this.node.title,
          })
          .then((res) => {
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
        }).then(async () => {
          await this.$refs.xTable.commitProxy("delete");
          this.loadTableData();
          this.$emit("loadTree");
        });
      }
    },
    doDeleteApi(data) {
      return new Promise((resolve, reject) => {
        let ids = data.map((i) => i.id).join(",");
        fsbgdApi
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

    resetParams() {
      this.searchParams.keyword = "";
      this.searchParams.sortOrder = "";
      this.searchParams.sortColumn = "";
      this.time = ["", ""];
      this.$nextTick(function () {
        this.loadTableData();
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
            width: 800,
            title: "新增",
            height: window.innerHeight - 400,
          },
          {
            // close: () => {
            //   this.loadTableData();
            // },
            doSubmit: (res) => {
              let obj = {
                id: this.node.id,
                title: this.node.title,
                button: "新增",
                data: [res],
              };
              fsbgdApi.saveTableDataService(obj).then((res) => {
                this.$message.success(res.data);
                this.$vxeModal.closeAll();
                this.loadTableData();
                this.$emit("loadTree");
              });
            },
          },
        );
      });
    },
    doExport(flag) {
      commonApi.exportFileService(
        "/jxjh/exportBgd",
        {
          ...this.searchParams,
          userName: this.$store.state.userInfo.sysUser.nickName,
          userId: this.$store.state.userInfo.sysUser.id,
          id: this.node.id,
          title: this.node.title,
        },
        flag,
        this.pagerParam,
      );
    },
    cellDblclick(e) {
      let { row } = e;
      this.openDetail(row);
    },
    openDetail(row) {
      fsbgdApi
        .loadInnerButtonDataService({
          id: this.node.id,
          title: this.node.title,
        })
        .then((res) => {
          let flag = res.data.some((i) => i.name == "保存");
          this.$vxeModal.show(
            dynamic_form,
            {
              tableHeaderList: this.tableDetailHeaderList,
              validateRules: this.editRules,
              row: row,
              isDisabled: !flag,
              labelWidth: "120px",
              footerButtonList: res.data,
            },
            {
              width: 1200,
              title: "详情",
              height: window.innerHeight - 200,
            },
            {
              close: () => {},
              doSubmit: (res) => {
                let obj = {
                  id: this.node.id,
                  title: this.node.title,
                  button: "保存",
                  data: [res],
                };
                fsbgdApi.saveTableDataService(obj).then((res) => {
                  this.$message.success(res.data);
                  this.$vxeModal.closeAll();
                  this.loadTableData();
                  this.$emit("loadTree");
                });
              },
              doOperate: async (res) => {
                await this.doOperation(res.btn, [res.data]);
                this.$vxeModal.closeAll();
              },
            },
          );
        });
    },
    doViewDialog() {
      const rows = this.getCheckboxRecords();
      if (rows && rows.length > 0) {
        fsbgdApi.loadDialogDataService({ bgdId: rows[0].id }).then((res) => {
          this.$vxeModal.show(
            view_simple_table,
            {
              tableHeaderList: [
                {
                  type: "seq",
                  width: 60,
                },
                {
                  field: "cz",
                  title: "操作",
                  width: "80",
                },
                {
                  field: "time",
                  title: "操作时间",
                  width: "150",
                },
                {
                  field: "czr",
                  title: "操作人",
                  width: "100",
                },
                {
                  field: "ksjd",
                  title: "开始节点",
                },

                {
                  field: "jsjd",
                  title: "结束节点",
                },
                {
                  field: "yj",
                  title: "意见",
                },
              ],
              tableData: res.data,
            },
            {
              width: 800,
              title: "日志",
              height: 600,
            },
            {
              // close: () => {
              //   this.loadTableData();
              // },
            },
          );
        });
      }
    },
    // doViewFlow() {
    //   this.$vxeModal.show(
    //       view_flow,
    //       {
    //         node: this.node,
    //       },
    //       {
    //         width: 800,
    //         height: window.innerHeight - 100,
    //         title: "查看流程图",
    //         resize: false,
    //       },
    //       {
    //         // close: () => {
    //         //   this.loadTableData();
    //         // },
    //       }
    //   );
    // },
    doOperation(item, rows = []) {
      if (!rows || rows.length == 0) {
        rows = this.getCheckboxRecords();
      }
      if (rows && rows.length > 0) {
        this.$vxeModal.show(
          view_prompt,
          {},
          {
            width: 360,
            height: 220,
            title: "意见",
            resize: false,
          },
          {
            returnData: (val) => {
              let obj = {
                id: this.node.id,
                title: this.node.title,
                button: item.name,
                yj: val,
                data: rows,
              };
              fsbgdApi.saveTableDataService(obj).then((res) => {
                this.$message.success(res.data);
                this.loadTableData();
                this.$emit("loadTree");
              });
            },
          },
        );
      }
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
