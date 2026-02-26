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
          :type="searchParams.lx === '' ? 'gradientBlue' : ''"
          @click="searchParams.lx = ''"
          >六级风险</el-button
        >
        <el-button
          :type="searchParams.lx === '周管控' ? 'gradientBlue' : ''"
          @click="searchParams.lx = '周管控'"
          >周风险管控</el-button
        >
      </el-button-group>
    </header>
    <header v-if="searchParams.lx !== '周管控'">
      <section>
        <DateRangerPickerComponent
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
        <div
          class="header-item"
          :style="searchParams.lx === '五级风险' ? { display: 'none' } : {}"
        >
          <upload-http-component
            ref="uploadComponentRef"
            :prop-upload-url="
              searchParams.lx === '五级风险'
                ? '/fxyj/import-new-zfxyj'
                : '/fxyj/import-zfxyj'
            "
            :prop-upload-param="
              searchParams.lx === '五级风险' ? { year: year } : {}
            "
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
    <zfxgk
      v-if="searchParams.lx === '周管控'"
      style="height: calc(100% - 48px)"
    ></zfxgk>
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
      </vxe-grid>
    </article>
  </div>
</template>

<script>
import table_mixin from "@/mixin/table_mixin.jsx";
import UploadHttpComponent from "@/components/UploadHttpComponent.vue";
import validateRules from "@/utils/validateRules.js";
import zfxApi from "@/api/fxyj/zfxyj-api.js";
import ydfxyj from "@/views/gzt/fxyj/ydfxyj/index.vue";
import dayjs from "dayjs";
import view_simple_table from "@/views/vxeModal/view_simple_table.vue";
import czsb_mixin from "@/mixin/czsb_mixin.js";
import commonApi from "@/api/common-api.js";
import DateRangerPickerComponent from "@/components/DateRangerPickerComponent.vue";
import modal_select from "@/views/vxeModal/modal_select.vue";
import Zfxgk from "@/views/gzt/fxyj/zfxyj/zfxgk.vue";

export default {
  name: "zfxyj",
  mixins: [table_mixin, czsb_mixin],
  components: { Zfxgk, DateRangerPickerComponent, UploadHttpComponent },
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
        sdt: "",
        edt: "",
        sortOrder: "",
        sortColumn: "",
        lx: "五级风险",
      },
      tableData: [],
      isAutoWrap: false,
      year: dayjs().format("YYYY"),
    };
  },
  watch: {
    "searchParams.lx": {
      handler(val) {
        if (val !== "周管控") {
          this.resetParams();
        }
      },
      immediate: false,
    },
  },
  computed: {
    tableHeaderList() {
      if (this.searchParams.lx == "五级风险") {
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
            field: "dwfxmc",
            title: "风险名称",
            minWidth: 200,
            fixed: "left",
            titleSuffix: {
              content:
                "开始时间和结束时间需要以（01.12-01.18）跟在风险名称之后，年份默认当前年。",
            },
            editRender: {
              name: "ElInput",
              props: {
                type: "textarea",
                clearable: true,
                autosize: this.isAutoWrap ? { maxRows: 1 } : true,
                resize: "none",
                placeholder:
                  "南京地区汊河变220千伏副母线压变停役（01.12-01.18）",
              },
            },
          },
          {
            field: "gznr",
            title: "工作内容",
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
            field: "jyhfxms",
            title: "风险描述（压降后）",
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
            field: "dwfxgkcs",
            title: "电网风险管控措施",
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
            field: "jgfh",
            title: "减供负荷（万千瓦）",
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
            field: "fdcjcl",
            title: "发电厂减出力(万千瓦)",
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
            field: "fqqk",
            title: "分区缺口(万千瓦)",
            width: 120,
            sortable: true,
            headerAlign: "center",
            align: "right",
            editRender: {
              name: "ElInput",
              props: { type: "number", min: 0, step: 1 },
            },
          },
          {
            field: "zyyh",
            title: "重要用户",
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
            title: "日志",
            width: 100,
            fixed: "right",
            slots: { default: "action" },
          },
        ];
      } else {
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
            field: "dwfxmc",
            title: "电网风险名称",
            minWidth: 130,

            editRender: { name: "ElInput", props: { clearable: true } },
          },
          {
            field: "dyaqsj",
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
            field: "zyyh",
            title: "重要用户",
            minWidth: 130,
            editRender: { name: "ElInput", props: { clearable: true } },
          },
          {
            field: "bdsb",
            title: "保电设备",
            minWidth: 120,
            editRender: { name: "ElInput", props: { clearable: true } },
          },
          {
            field: "kssj",
            title: "电网风险或作业风险开始时间",
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
            field: "jssj",
            title: "电网风险或作业风险结束时间",
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
            field: "fxdj",
            title: "电网、作业风险等级",
            width: 120,
            editRender: {
              name: "ElSelect",
              options: this.$store.state.staticOptionsObj.yjjb,
              props: { clearable: true },
            },
          },
          {
            field: "jhsqdw",
            title: "计划申请单位",
            minWidth: 130,
            editRender: { name: "ElInput", props: { clearable: true } },
          },
          {
            field: "zy",
            title: "专业",
            minWidth: 120,
            editRender: { name: "ElInput", props: { clearable: true } },
          },
          {
            field: "gznr",
            title: "工作内容",
            minWidth: 220,
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
            field: "zybmyj",
            title: "专业部门意见",
            minWidth: 220,
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
            title: "日志",
            width: 100,
            fixed: "right",
            slots: { default: "action" },
          },
        ];
      }
    },
    tableDetailHeaderList() {
      return [
        {
          field: "dwfxmc",
          title: "电网风险名称",
          width: "50%",
          editRender: { name: "ElInput", props: { clearable: true } },
        },
        {
          field: "zyyh",
          title: "重要用户",
          width: "50%",
          itemClass: "borderRight",
          editRender: { name: "ElInput", props: { clearable: true } },
        },
        {
          field: "dyaqsj",
          title: "对应安全事件",
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
          field: "zy",
          title: "专业",
          width: "50%",
          editRender: { name: "ElInput", props: { clearable: true } },
        },
        {
          field: "bdsb",
          title: "保电设备",
          width: "50%",
          itemClass: "borderRight",
          editRender: { name: "ElInput", props: { clearable: true } },
        },
        {
          field: "kssj",
          title: "电网风险或作业风险开始时间",
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
          title: "电网风险或作业风险结束时间",
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
          field: "fxdj",
          title: "电网、作业风险等级",
          width: "50%",
          editRender: {
            name: "ElSelect",
            options: this.$store.state.staticOptionsObj.yjjb,
            props: { clearable: true },
          },
        },
        {
          field: "jhsqdw",
          title: "计划申请单位",
          width: "50%",
          itemClass: "borderRight",
          editRender: { name: "ElInput", props: { clearable: true } },
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
          field: "zybmyj",
          title: "专业部门意见",
          width: "100%",
          itemClass: "whole_row borderRight borderBottom",
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
        dwfxmc: [
          { required: true, message: "电网风险名称不能为空" },
          {
            validator({ cellValue, row }) {
              if (
                cellValue &&
                !row.id &&
                row.fxdj === "五级风险" &&
                !cellValue.includes("(") &&
                !cellValue.includes(")") &&
                !cellValue.includes("（") &&
                !cellValue.includes("）")
              ) {
                return new Error("五级风险新增数据必须含有括号");
              }
            },
          },
        ],
        zyyh: [{ required: true, message: "重要用户不能为空" }],
        zy: [{ required: true, message: "专业事件不能为空" }],
        dyaqsj: [{ required: true, message: "对应安全事件不能为空" }],
        bdsb: [{ required: true, message: "保电设备不能为空" }],
        kssj: [
          { required: true, message: "电网风险或作业风险开始时间不能为空" },
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
          { required: true, message: "电网风险或作业风险结束时间不能为空" },
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
        fxdj: [{ required: true, message: "电网、作业风险等级不能为空" }],
        jhsqdw: [{ required: true, message: "计划申请单位不能为空" }],
        gznr: [{ required: true, message: "工作内容不能为空" }],
        zybmyj: [{ required: true, message: "专业部门意见不能为空" }],
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
          filename: "周风险预警表",
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
          // {type: 'gradientDarkGreen', name: '重置'},
        ];
      } else {
        return [
          { type: "gradientGreen", name: "查询" },
          // {type: 'gradientDarkGreen', name: '重置'},
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
        if (this.searchParams.lx == "五级风险") {
          return [
            { type: "gradientBlue", name: "导入" },
            { type: "gradientBlue", name: "下载导入模版" },
            { type: "gradientBlue", name: "初始化" },
            { type: "gradientBlue", name: "新增" },
            { type: "gradientBlue", name: "保存" },
            { type: "gradientRed", name: "删除" },
          ];
        } else {
          return [
            { type: "gradientBlue", name: "下载导入模版" },
            { type: "gradientBlue", name: "初始化" },
            { type: "gradientBlue", name: "新增" },
            { type: "gradientBlue", name: "保存" },
            { type: "gradientRed", name: "删除" },
          ];
        }
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
      this.searchParams.sdt = "";
      this.searchParams.edt = "";
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
        zfxApi.loadTableDataService(params).then((res) => {
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
      let record = {
        fxdj: this.searchParams.lx,
      };
      this.$refs.xTable.insertAt(record).then((row) => {
        this.$refs.xTable.setEditRow(row);
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
        ydfxyj,
        {
          isModal: true,
        },
        {
          width: window.innerWidth - 200,
          title: "月度风险预警选择",
          height: window.innerHeight - 100,
        },
        {
          // close: () => {
          //   this.loadTableData();
          // },
          doSubmit: (rows) => {
            zfxApi.initTableDataService({ data: rows }).then((res) => {
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
        zfxApi
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
        zfxApi
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

    doViewLog(row) {
      zfxApi.loadViewDialogService({ id: row.id }).then((res) => {
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
    downloadModule() {
      if (this.searchParams.lx == "五级风险") {
        commonApi.exportFileService("/fxyj/download-zfxyj-tpl-new", {});
      } else {
        commonApi.exportFileService("/fxyj/download-zfxyj-tpl", {});
      }

      // zfxApi.downloadModuleService()
    },
    doImport() {
      this.$vxeModal.show(
        modal_select,
        {
          formComponent: ["year"],
          defaultValue: { year: this.year },
        },
        {
          width: 350,
          height: 170,
          title: "选择年",
          resize: false,
        },
        {
          submit: (obj) => {
            this.year = obj.year;
            this.$refs.uploadComponentRef.selectEvent();
          },
        },
      );
    },
    doExport(flag) {
      let obj = JSON.parse(JSON.stringify(this.searchParams));
      if (this.searchParams.lx == "五级风险") {
        commonApi.exportFileService(
          "/fxyj/exportZFxyjNew",
          obj,
          flag,
          this.pagerParam,
        );
      } else {
        commonApi.exportFileService(
          "/fxyj/exportZFxyj",
          obj,
          flag,
          this.pagerParam,
        );
      }
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
    //
    //         },
    //       }
    //   );
    // },
    // doRealSave(data){
    //   zfxApi.saveTableDataService({data}).then(res => {
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
    resetParams() {
      if (this.isModal) {
        this.time = [
          dayjs().startOf("month").format("YYYY-MM-DD"),
          dayjs().endOf("month").format("YYYY-MM-DD"),
        ];
        this.searchParams.flag = "1";
      } else {
        this.searchParams.sdt = "";
        this.searchParams.edt = "";
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
  position: relative;
  article {
    height: calc(100% - 88px);
  }
}
</style>
