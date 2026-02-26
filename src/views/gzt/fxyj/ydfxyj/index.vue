<template>
  <div class="page_content">
    <header style="padding-bottom: 0">
      <el-button-group>
        <el-button
          :type="searchParams.lx === '五级风险' ? 'gradientBlue' : ''"
          @click="searchParams.lx = '五级风险'"
          >五级风险</el-button
        >
        <el-button
          :type="searchParams.lx === '六级风险' ? 'gradientBlue' : ''"
          @click="searchParams.lx = '六级风险'"
          >六级风险</el-button
        >
        <el-button
          v-if="!isModal"
          :type="searchParams.lx === '月管控' ? 'gradientBlue' : ''"
          @click="searchParams.lx = '月管控'"
          >月风险管控</el-button
        >
      </el-button-group>
    </header>
    <header v-if="searchParams.lx !== '月管控'">
      <section>
        <div class="header-item" v-if="!isModal">
          月份：
          <el-date-picker
            v-model="searchParams.month"
            type="month"
            format="YYYY-MM"
            value-format="YYYY-MM"
          ></el-date-picker>
        </div>

        <DateRangerPickerComponent
          v-if="isModal"
          :start-time="searchParams.sdt"
          :end-time="searchParams.edt"
          v-model:updateStartTime="searchParams.sdt"
          v-model:updateEndTime="searchParams.edt"
        ></DateRangerPickerComponent>

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
            prop-upload-url="/fxyj/import-ydfxyj"
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
    <yfxgk
      v-if="searchParams.lx === '月管控'"
      style="height: calc(100% - 48px)"
    ></yfxgk>
    <article v-else>
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
import ydfxApi from "@/api/fxyj/ydfxyj-api.js";
import ndfxyj from "@/views/gzt/fxyj/ndfxyj/index.vue";
import dayjs from "dayjs";
import validateRules from "@/utils/validateRules.js";
import view_simple_table from "@/views/vxeModal/view_simple_table.vue";
import czsb_mixin from "@/mixin/czsb_mixin.js";
import commonApi from "@/api/common-api.js";
import { fileToBlobUrl } from "@/utils/tools.js";
import view_file from "@/views/vxeModal/view_file.vue";
import modal_select from "@/views/vxeModal/modal_select.vue";
import DateRangerPickerComponent from "@/components/DateRangerPickerComponent.vue";
import Yfxgk from "@/views/gzt/fxyj/ydfxyj/yfxgk.vue";

export default {
  name: "ydfxyj",
  mixins: [table_mixin, czsb_mixin],
  components: { Yfxgk, DateRangerPickerComponent, UploadHttpComponent },
  props: {
    isModal: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      time: ["", ""],
      total: 0,
      searchParams: {
        keyword: "",
        month: "",
        sdt: "",
        edt: "",
        sortOrder: "",
        sortColumn: "",
        lx: "五级风险",
      },
      tableData: [],
      isAutoWrap: false,
    };
  },
  watch: {
    "searchParams.lx": {
      handler(val) {
        if (val !== "月管控") {
          this.resetParams();
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
            },
          },
        },
        {
          field: "tdsb",
          title: "停电设备",
          minWidth: 160,
          fixed: "left",
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
          field: "gznr",
          title: "工作内容",
          minWidth: 280,
          fixed: "left",
          align: "left",
          headerAlign: "center",
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
          title: "压降前",
          children: [
            {
              field: "jyqfxms",
              title: "风险描述",
              minWidth: 280,
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
              field: "jyqdyaqsj",
              title: "对应安全事件",
              minWidth: 280,
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
          ],
        },
        {
          field: "fxjycs",
          title: "风险压降措施",
          minWidth: 220,
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
          width: 110,
          editRender: {
            name: "ElSelect",
            options: this.$store.state.staticOptionsObj.yjjb,
            props: { clearable: true },
          },
        },
        {
          title: "压降后",
          children: [
            {
              field: "jyhfxms",
              title: "风险描述",
              minWidth: 220,
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
              field: "jyhdyaqsj",
              title: "对应安全事件",
              minWidth: 220,
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
              field: "yjsblx",
              title: "预警设备类型",
              width: 130,
              editRender: { name: "ElInput", props: { clearable: true } },
            },
            {
              field: "bdsb",
              title: "保电设备",
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
              field: "jgfhfx",
              title: "减供负荷风险（万千瓦）",
              width: 140,
              sortable: true,
              headerAlign: "center",
              align: "right",
              editRender: {
                name: "ElInput",
                props: { type: "number", min: 0, step: 1 },
              },
            },
            {
              field: "jclfx",
              title: "减出力风险(万千瓦)",
              width: 120,
              headerAlign: "center",
              align: "right",
              sortable: true,
              editRender: {
                name: "ElInput",
                props: { type: "number", min: 0, step: 1 },
              },
            },
            {
              field: "sjzyyh",
              title: "涉及全停重要用户",
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
              field: "fbdw",
              title: "发布单位",
              minWidth: 200,
              editRender: { name: "ElInput", props: { clearable: true } },
            },
          ],
        },
        {
          field: "sc",
          title: "时长（天）",
          width: 100,
          sortable: true,
          headerAlign: "center",
          align: "right",
          editRender: {
            name: "ElInput",
            props: { type: "number", min: 0, step: 1 },
          },
        },
        {
          field: "dydj",
          title: "电压等级（kV）",
          width: 110,
          sortable: true,
          editRender: {
            name: "ElSelect",
            options: this.$store.state.staticOptionsObj.bdzdydj,
            props: { clearable: true },
          },
        },
        {
          field: "fbcj",
          title: "发布层级",
          width: 100,
          editRender: {
            name: "ElSelect",
            options: this.$store.state.staticOptionsObj.fbcj,
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
          title: "日志",
          width: 100,
          fixed: "right",
          slots: { default: "action" },
        },
        {
          field: "bz",
          title: "备注",
          minWidth: 220,
          align: "left",
          headerAlign: "center",
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
          field: "ly",
          title: "来源",
          width: 120,
          editRender: {
            name: "ElSelect",
            options: [
              { label: "年度带出", value: "年度带出" },
              { label: "月度新增", value: "月度新增" },
              { label: "年度调整", value: "年度调整" },
              { label: "配合", value: "配合" },
            ],
            props: { clearable: true },
          },
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
          field: "fxdj",
          title: "风险等级",
          width: "50%",
          editRender: {
            name: "ElSelect",
            options: this.$store.state.staticOptionsObj.yjjb,
            props: { clearable: true },
          },
        },
        {
          field: "fbdw",
          title: "风险发布单位",
          width: "50%",
          itemClass: "borderRight",
          editRender: {},
        },
        {
          field: "gznr",
          title: "工作内容",
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
          title: "压降前",
          width: "50px",
          children: [
            {
              field: "jyqfxms",
              title: "风险描述",
              width: "calc(100% - 50px)",
              itemClass: "whole_row borderRight child",
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
              field: "jyqdyaqsj",
              title: "对应安全事件",
              width: "calc(100% - 50px)",
              itemClass: "whole_row borderRight child",
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
          ],
        },

        {
          field: "fxjycs",
          title: "风险压降措施",
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
          title: "压降后",
          width: "50px",
          itemClass: "borderBottom child",
          children: [
            {
              field: "jyhfxms",
              title: "风险描述",
              width: "calc(100% - 50px)",
              itemClass: "whole_row borderRight child",
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
              field: "jyhdyaqsj",
              title: "对应安全事件",
              width: "calc(100% - 50px)",
              itemClass: "whole_row borderRight child",
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
              field: "bdsb",
              title: "保电设备",
              width: "calc(50% - 80px)",
              itemClass: "child",
              editRender: { name: "ElInput", props: { clearable: true } },
            },
            {
              field: "sjzyyh",
              title: "涉及重要用户",
              width: "50%",
              itemClass: "borderRight",
              editRender: { name: "ElInput", props: { clearable: true } },
            },
            {
              field: "jgfhfx",
              title: "减供负荷风险",
              width: "calc(50% - 80px)",
              itemClass: "borderBottom child",
              editRender: {
                name: "ElInput",
                props: { type: "number", min: 0, step: 1 },
              },
            },
            {
              field: "jclfx",
              title: "减出力风险",
              width: "50%",
              itemClass: "borderRight borderBottom",
              editRender: {
                name: "ElInput",
                props: { type: "number", min: 0, step: 1 },
              },
            },
          ],
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
        tdsb: [{ required: true, message: "停电设备不能为空" }],
        fxdj: [{ required: true, message: "风险等级不能为空" }],
        fbdw: [{ required: true, message: "发布单位不能为空" }],
        gznr: [{ required: true, message: "主要工作不能为空" }],
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
          filename: "月度风险预警表",
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
          { type: "gradientBlue", name: "初始化" },
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
      this.time = [
        dayjs().startOf("month").format("YYYY-MM-DD"),
        dayjs().endOf("month").format("YYYY-MM-DD"),
      ];
      this.searchParams.flag = "1";
    } else {
      this.searchParams.month = dayjs().format("YYYY-MM");
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
      //
      let params = this.getRealParams(this.searchParams, page, sorts, filters);
      return new Promise((resolve) => {
        ydfxApi.loadTableDataService(params).then((res) => {
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
      commonApi.getAddIdService().then((res) => {
        let record = {
          id: res.data,
        };
        this.$refs.xTable.insertAt(record).then((row) => {
          this.$refs.xTable.setEditRow(row);
        });
      });
    },
    doInit() {
      this.$vxeModal.show(
        ndfxyj,
        {
          isModal: true,
        },
        {
          width: window.innerWidth - 200,
          title: "年度风险预警选择",
          height: window.innerHeight - 100,
        },
        {
          // close: () => {
          //   this.loadTableData();
          // },
          doSubmit: (rows) => {
            ydfxApi.initTableDataService({ data: rows }).then((res) => {
              this.$message.success(res.data);
              this.$vxeModal.closeAll();
              this.loadTableData();
            });
          },
        },
      );
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
        ydfxApi
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
        ydfxApi
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
        this.$vxeModal.show(
          modal_select,
          {
            formComponent: ["checkbox"],
            checkboxList: this.tableHeaderList
              .filter((i) => i.title)
              .map((i) => i.title),
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
                .filter(
                  (i) => obj.checkList.includes(i.title) && i.title != "日志",
                )
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
      commonApi.exportFileService("/fxyj/download-ydfxyj-tpl", {});
      // ydfxApi.downloadModuleService()
    },
    doExport(flag) {
      commonApi.exportFileService(
        "/fxyj/exportYdFxyj",
        this.searchParams,
        flag,
        this.pagerParam,
      );
    },
    cellDblclick(e) {
      let { row } = e;
      this.openDetail(row);
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
    // doRealSave(data){
    //   ydfxApi.saveTableDataService({data}).then(res => {
    //     this.$message.success(res.data);
    //     this.$vxeModal.closeAll();
    //     this.loadTableData()
    //   })
    // },
    cellClick(e) {
      let { row, column } = e;
      if (column.field == "tdcs") {
        this.selectCs(row, column);
      }
      // if(column.field == 'tdsb'){
      //   this.selectSb(row,column)
      // }
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
      ydfxApi.loadViewDialogService({ id: row.id }).then((res) => {
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
        this.time = [
          dayjs().startOf("month").format("YYYY-MM-DD"),
          dayjs().endOf("month").format("YYYY-MM-DD"),
        ];
        this.searchParams.flag = "1";
      } else {
        this.searchParams.month = dayjs().format("YYYY-MM");
      }
      this.searchParams.keyword = "";
      this.searchParams.sortOrder = "";
      this.searchParams.sortColumn = "";
      this.$nextTick(function () {
        this.loadTableData();
      });
    },
    beforeEditMethod({ row, column }) {
      return !this.isModal;
    },
  },
};
</script>

<style scoped lang="scss">
.page_content {
  background-color: rgb(239, 247, 245);

  article {
    height: calc(100% - 88px);
  }
}
</style>
