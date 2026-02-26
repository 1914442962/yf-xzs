<template>
  <div class="page_content">
    <header>
      <section>
        <div class="header-item" v-if="!isModal">
          年份：
          <el-date-picker
            v-model="searchParams.year"
            type="year"
            format="YYYY"
            value-format="YYYY"
          ></el-date-picker>
        </div>
        <div class="header-item" v-if="isModal">
          月份：
          <el-date-picker
            v-model="searchParams.month"
            type="month"
            format="YYYY-MM"
            value-format="YYYY-MM"
          ></el-date-picker>
        </div>
        <div class="header-item">
          <el-input
            placeholder="请输入停电设备"
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
        <div class="header-item" v-if="!isModal">
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
        <div class="header-item" v-if="!isModal">
          <upload-http-component
            prop-upload-url="/fxyj/import-ndfxyj"
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
      <vxe-grid
        v-bind="gridOptions"
        ref="xTable"
        v-on="{ cellClick: cellClick }"
        @menu-click="(e) => menuClickEvent(e, '风险预警')"
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
        <template #fileList_default="{ row }">
          <vxe-upload
            multiple
            :isDisabeld="this.isModal"
            :file-types="[
              'doc',
              'docx',
              'xls',
              'xlsx',
              'ppt',
              'pptx',
              'pdf',
              'dwg',
            ]"
            v-model="row.fileList"
            :more-config="{ maxCount: 5, layout: 'horizontal' }"
            :show-button-text="false"
            show-download-button
            :upload-method="(e) => uploadMethod(e, row)"
            :download-method="downloadMethod"
            :remove-method="(e) => removeMethod(e, row)"
          >
            <template #corner="{ option }">
              <vxe-button
                mode="text"
                icon="vxe-icon-search"
                status="primary"
                style="padding-right: 0"
                @click="previewMethod({ option })"
              ></vxe-button>
            </template>
          </vxe-upload>
        </template>
      </vxe-grid>
    </article>
  </div>
</template>

<script>
import table_mixin from "@/mixin/table_mixin.jsx";
import UploadHttpComponent from "@/components/UploadHttpComponent.vue";
import ndfxApi from "@/api/fxyj/ndfxyj-api.js";
import dayjs from "dayjs";
import validateRules from "@/utils/validateRules.js";
import view_simple_table from "@/views/vxeModal/view_simple_table.vue";
import czsb_mixin from "@/mixin/czsb_mixin.js";
import commonApi from "@/api/common-api.js";
import modal_select from "@/views/vxeModal/modal_select.vue";
import { fileToBlobUrl } from "@/utils/tools.js";
import view_file from "@/views/vxeModal/view_file.vue";

export default {
  name: "ndfxyj",
  mixins: [table_mixin, czsb_mixin],
  components: { UploadHttpComponent },
  props: {
    isModal: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      total: 0,
      searchParams: {
        keyword: "",
        year: "",
        month: "",
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
          field: "ssdq",
          title: "地区",
          width: 80,
          fixed: "left",
        },
        {
          field: "kssj",
          title: "开始时间",
          width: 140,
          fixed: "left",
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
          width: 140,
          fixed: "left",
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
          field: "gq",
          title: "工期",
          width: 100,
          sortable: true,
          headerAlign: "center",
          align: "right",
          fixed: "left",
          formatter: ["formatterNumber", 1],
          editRender: {
            name: "ElInput",
            props: { type: "number", min: 0, step: 1, clearable: true },
          },
        },
        {
          field: "tdcs",
          title: "停电场所",
          width: 120,
          fixed: "left",
          editRender: {},
        },
        {
          field: "tdsb",
          title: "停电设备",
          minWidth: 220,
          editRender: {},
        },
        {
          field: "glbm",
          title: "管理部门",
          width: 120,
          editRender: {
            name: "ElSelect",
            options: this.$store.state.staticOptionsObj.glbm,
            props: { clearable: true },
          },
        },
        {
          field: "zygz",
          title: "主要工作",
          minWidth: 280,
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
          field: "state",
          title: "清单状态",
          width: 120,
          editRender: { name: "ElInput", props: { clearable: true } },
        },
        {
          field: "fxfx",
          title: "风险分析",
          minWidth: 280,
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
          field: "gzfs",
          title: "故障方式",
          width: 100,
          editRender: {
            name: "ElSelect",
            options: this.$store.state.staticOptionsObj.gzfs,
            props: { clearable: true },
          },
        },
        {
          field: "jyqfhss",
          title: "压降前负荷损失（MW）",
          minWidth: 140,
          sortable: true,
          headerAlign: "center",
          align: "right",
          formatter: ["formatterNumber", 2],
          editRender: {
            name: "ElInput",
            props: { type: "number", min: 0, step: 1, clearable: true },
          },
        },
        {
          field: "jyhfhss",
          title: "压降后负荷损失（MW）",
          minWidth: 140,
          sortable: true,
          headerAlign: "center",
          align: "right",
          formatter: ["formatterNumber", 2],
          editRender: {
            name: "ElInput",
            props: { type: "number", min: 0, step: 1, clearable: true },
          },
        },
        {
          field: "jyhfhsshj",
          title: "压降后负荷损失单电源用户合计",
          minWidth: 140,
          sortable: true,
          headerAlign: "center",
          align: "right",
          formatter: ["formatterNumber", 2],
          editRender: {
            name: "ElInput",
            props: { type: "number", min: 0, step: 1, clearable: true },
          },
        },
        {
          field: "jyhzyyh",
          title: "压降后涉及全停重要用户",
          width: 170,
          editRender: { name: "ElInput", props: { clearable: true } },
        },
        {
          field: "yjjb",
          title: "预警级别",
          width: 110,
          editRender: {
            name: "ElSelect",
            options: this.$store.state.staticOptionsObj.yjjb,
            props: { clearable: true },
          },
        },
        {
          field: "yjfbdw",
          title: "预警发布单位",
          width: 140,
          editRender: {
            name: "ElSelect",
            options: this.$store.state.staticOptionsObj.yjfbdw,
            props: { clearable: true },
          },
        },
        {
          field: "fileList",
          title: "风险专报",
          width: 300,
          slots: { default: "fileList_default" },
        },
        {
          field: "ly",
          title: "来源",
          width: 120,
          editRender: {
            name: "ElSelect",
            options: [
              { label: "年度", value: "年度" },
              { label: "年度新增", value: "年度新增" },
              { label: "年度调整", value: "年度调整" },
              { label: "配合", value: "配合" },
            ],
            props: { clearable: true },
          },
        },
        {
          title: "日志",
          width: 100,
          fixed: "right",
          slots: { default: "action" },
        },
      ];
    },
    tableDetailHeaderList() {
      return [
        {
          field: "kssj",
          title: "开始时间",
          width: "50%",
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
          field: "jssj",
          title: "结束时间",
          width: "50%",
          itemClass: "borderRight",
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
          field: "tdcs",
          title: "停电场所",
          width: "100%",
          itemClass: "borderRight",
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
          width: "100%",
          itemClass: "borderRight",
          editRender: {
            name: "$modal",
            props: {
              type: "tdsb",
            },
          },
        },
        {
          field: "glbm",
          title: "管理部门",
          width: "50%",
          editRender: {
            name: "ElSelect",
            options: this.$store.state.staticOptionsObj.glbm,
            props: { clearable: true },
          },
        },
        {
          field: "gq",
          title: "工期",
          width: "50%",
          itemClass: "borderRight",
          editRender: {
            name: "ElInputNumber",
            props: { type: "number", min: 0, step: 1, clearable: true },
          },
        },
        {
          field: "zygz",
          title: "主要工作",
          width: "100%",
          itemClass: "whole_row borderRight",
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
          field: "fxfx",
          title: "风险分析",
          width: "100%",
          itemClass: "whole_row borderRight",
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
          field: "gzfs",
          title: "故障方式",
          width: "50%",
          editRender: {
            name: "ElSelect",
            options: this.$store.state.staticOptionsObj.gzfs,
            props: { clearable: true },
          },
        },
        {
          field: "jyqfhss",
          title: "压降前负荷损失（MW）",
          width: "50%",
          itemClass: "borderRight",
          editRender: {
            name: "ElInput",
            props: { type: "number", min: 0, step: 1 },
          },
        },
        {
          field: "jyhfhss",
          title: "压降后负荷损失（MW）",
          width: "50%",
          itemClass: "height2",
          editRender: {
            name: "ElInput",
            props: { type: "number", min: 0, step: 1 },
          },
        },
        {
          field: "jyhfhsshj",
          title: "压降后负荷损失单电源用户合计",
          width: "50%",
          itemClass: "borderRight",
          editRender: {
            name: "ElInput",
            props: { type: "number", min: 0, step: 1 },
          },
        },
        {
          field: "yjjb",
          title: "预警级别",
          width: "50%",
          editRender: {
            name: "ElSelect",
            options: this.$store.state.staticOptionsObj.yjjb,
            props: { clearable: true },
          },
        },
        {
          field: "jyhzyyh",
          title: "压降后涉及全停重要用户",
          width: "50%",
          itemClass: "borderRight",
          editRender: { name: "ElInput", props: { clearable: true } },
        },
        {
          field: "yjfbdw",
          title: "预警发布单位",
          width: "50%",
          itemClass: "borderBottom",
          editRender: {
            name: "ElSelect",
            options: this.$store.state.staticOptionsObj.yjfbdw,
            props: { clearable: true },
          },
        },
        {
          field: "state",
          title: "清单状态",
          width: "50%",
          itemClass: "borderBottom borderRight",
          editRender: { name: "ElInput", props: { clearable: true } },
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
        tdcs: [{ required: true, message: "停电场所不能为空" }],
        tdsb: [{ required: true, message: "停电设备不能为空" }],
        glbm: [{ required: true, message: "管理部门不能为空" }],
        zygz: [{ required: true, message: "主要工作不能为空" }],
        fxfx: [{ required: true, message: "风险分析不能为空" }],
        yjjb: [{ required: true, message: "预警级别不能为空" }],
        yjfbdw: [{ required: true, message: "预警发布单位不能为空" }],
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
        keepSource: true,
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
          showStatus: !this.isModal,
          showIcon: !this.isModal,
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
          filename: "年度风险预警表",
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
          enabled: !this.isModal,
          body: {
            options: [[{ code: "collect", name: "标记重点" }]],
          },
        },
        editRules: this.editRules,
        columns: this.tableHeaderList,
      };
    },

    defaultLeftButtons() {
      if (this.isModal) {
        return [
          { type: "gradientGreen", name: "查询" },
          { type: "gradientDarkGreen", name: "重置" },
        ];
      } else {
        return [
          { type: "gradientGreen", name: "查询" },
          { type: "gradientDarkGreen", name: "重置" },
          { type: "gradientGreen", name: "自动换行" },
          // { type: "gradientGreen", name: "导出当前页" },
          // { type: "gradientGreen", name: "导出全部" },
        ];
      }
    },
    defaultRightButtons() {
      if (this.isModal) {
        return [{ type: "gradientBlue", name: "确定" }];
      } else {
        return [
          { type: "gradientBlue", name: "下载导入模版" },
          { type: "gradientBlue", name: "复制" },
          { type: "gradientBlue", name: "新增" },
          { type: "gradientBlue", name: "保存" },
          { type: "gradientRed", name: "删除" },
        ];
      }
    },
  },
  created() {
    if (this.isModal) {
      this.searchParams.month = dayjs().format("YYYY-MM");
      this.searchParams.flag = "1";
    } else {
      this.searchParams.year = dayjs().format("YYYY");
    }
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
        ndfxApi.loadTableDataService(params).then((res) => {
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
      // this.$vxeModal.show(
      //     dynamic_form_plus,
      //     {
      //       tableHeaderList: this.tableDetailHeaderList,
      //       validateRules: this.editRules,
      //       labelWidth: '180px',
      //     },
      //     {
      //       width: 1000,
      //       title: '详情',
      //       height: window.innerHeight - 100,
      //
      //     },
      //     {
      //       // close: () => {
      //       //   this.loadTableData();
      //       // },
      //       doSubmit: (res) => {
      //         if (res.kssj && res.jssj) {
      //           if (dayjs(res.kssj).isAfter(res.jssj)) {
      //             this.$message.error('开始时间不能在结束时间之后');
      //             return
      //           }
      //         }
      //         this.doRealSave([res])
      //       },
      //     }
      // );
    },
    // openDetail(row) {
    //   this.$vxeModal.show(
    //       dynamic_form_plus,
    //       {
    //         tableHeaderList: this.tableDetailHeaderList,
    //         validateRules: this.editRules,
    //         row: row,
    //         labelWidth: '180px',
    //       },
    //       {
    //         width: 1000,
    //         title: '详情',
    //         height: window.innerHeight - 100,
    //
    //       },
    //       {
    //         close: () => {
    //         },
    //         doSubmit: (res) => {
    //           if (res.kssj && res.jssj) {
    //             if (dayjs(res.kssj).isAfter(res.jssj)) {
    //               this.$message.error('开始时间不能在结束时间之后');
    //               return
    //             }
    //           }
    //           this.doRealSave([res])
    //         },
    //       }
    //   );
    // },
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
        ndfxApi
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
    // doRealSave(data) {
    //   ndfxApi.saveTableDataService({data}).then(res => {
    //     this.$message.success(res.data);
    //     this.$vxeModal.closeAll();
    //     this.loadTableData()
    //   })
    // },

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
        ndfxApi
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
    doCopy() {
      const rows = this.getCheckboxRecord();
      if (rows && rows.length == 1) {
        let checkboxList = this.tableHeaderList
          .filter((i) => i.title && i.title != "日志")
          .map((i) => i.title);
        this.$vxeModal.show(
          modal_select,
          {
            formComponent: ["checkbox"],
            checkboxList: checkboxList,
            defaultValue: {
              checkList: checkboxList,
            },
          },
          {
            width: 800,
            title: "选择复制列",
            height: 400,
          },
          {
            // close: () => {
            //   this.loadTableData();
            // },
            submit: (obj) => {
              let arr = this.tableHeaderList
                .filter((i) => obj.checkList.includes(i.title))
                .map((i) => i.field);
              let record = {};
              for (let i = 0; i < arr.length; i++) {
                record[arr[i]] = rows[0][arr[i]];
                if (arr[i] == "tdcs") {
                  record[arr[i] + "Id"] = rows[0][arr[i] + "Id"];
                  record[arr[i] + "lx"] = rows[0][arr[i] + "lx"];
                  record[arr[i] + "Param"] = rows[0][arr[i] + "Param"];
                  record[arr[i] + "Param0"] = rows[0][arr[i] + "Param0"];
                  continue;
                }
                if (arr[i] == "tdsb") {
                  record[arr[i] + "Id"] = rows[0][arr[i] + "Id"];
                  record[arr[i] + "List"] = rows[0][arr[i] + "List"];
                  record[arr[i] + "List0"] = rows[0][arr[i] + "List0"];
                }
              }
              this.$refs.xTable.insertAt(record).then((row) => {
                this.$refs.xTable.setEditRow(row);
              });
            },
          },
        );
      }
    },

    downloadModule() {
      commonApi.exportFileService("/fxyj/download-ndfxyj-tpl", {});
      // ndfxApi.downloadModuleService()
    },
    doExport(flag) {
      commonApi.exportFileService(
        "/fxyj/exportNdFxyj",
        this.searchParams,
        flag,
        this.pagerParam,
      );
    },
    cellClick(e) {
      let { row, column } = e;
      if (column.field == "tdcs") {
        this.selectCs(row, column);
      }
      if (column.field == "tdsb") {
        this.selectSb(row, column);
      }
    },
    doConfirm() {
      const rows = this.getCheckboxRecords();
      if (rows && rows.length > 0) {
        this.$confirm(`确认初始化勾选的${rows.length}条数据吗？`, "提示", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning",
        }).then(() => {
          this.$emit("doSubmit", rows);
        });
      }
    },
    doViewLog(row) {
      ndfxApi.loadViewDialogService({ id: row.id }).then((res) => {
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
    uploadMethod({ file }, row) {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("id", row.id);
      formData.append("type", "fxyj");
      return commonApi.uploadFileService(formData).then((res) => {
        return res.data;
      });
    },
    downloadMethod({ option }) {
      commonApi.downloadFileGetService({ fileId: option.id });
    },
    removeMethod({ option }, row) {
      if (option.id) {
        commonApi
          .removeFileService({ fileId: option.id, id: row.id })
          .then(() => {
            this.$message.success("移除成功");
            // this.loadTableData();
          });
      }
    },
    previewMethod({ option }) {
      // this.$vxeModal.show(
      //     view_file_new,
      //     {
      //       params: {fileId:option.id},
      //     },
      //     {
      //       width: 800,
      //       title: "文件预览",
      //       height: window.innerHeight - 20,
      //
      //     },
      //     {}
      // );

      if (this.$store.state.isXzs) {
        commonApi.preViewFileGetService({ fileId: option.id });
      } else {
        commonApi.preViewFileService({ fileId: option.id }).then((res) => {
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
    resetParams() {
      if (this.isModal) {
        this.searchParams.month = dayjs().format("YYYY-MM");
        this.searchParams.flag = "1";
      } else {
        this.searchParams.year = dayjs().format("YYYY");
      }
      this.searchParams.keyword = "";
      this.searchParams.sortOrder = "";
      this.searchParams.sortColumn = "";
      this.$nextTick(function () {
        this.loadTableData();
      });
    },
    beforeEditMethod({ row, column }) {
      if (column.field == "tdcs" || column.field == "tdsb") {
        return false;
      } else {
        return !this.isModal;
      }
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
