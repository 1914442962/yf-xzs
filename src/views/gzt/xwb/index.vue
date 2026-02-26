<template>
  <div class="page_content">
    <header>
      <section>
        <div class="header-item">
          年：
          <el-date-picker
            style="width: 120px"
            v-model="searchParams.year"
            type="year"
            format="YYYY"
            value-format="YYYY"
          >
          </el-date-picker>
        </div>
        <div class="header-item">
          变电站名称：
          <el-select
            v-model="searchParams.bdzmcList"
            placeholder="请选择"
            clearable
            filterable
            multiple
            collapse-tags
            collapse-tags-tooltip
            tag-type=""
            style="width: 180px"
          >
            <el-option
              v-for="item in this.$store.state.selectOptionsObj.bdz"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            >
            </el-option>
          </el-select>
        </div>
        <div class="header-item">
          <el-tooltip effect="dark" content="筛选没有有功负荷值的开关">
            <el-icon :size="16">
              <QuestionFilled />
            </el-icon>
          </el-tooltip>
          是否采样缺失：
          <el-switch
            v-model="searchParams.sfcyqs"
            inline-prompt
            active-text="是"
            inactive-text="否"
          />
        </div>
        <div class="header-item">
          备注：
          <el-select
            style="width: 130px"
            v-model="searchParams.bz"
            placeholder="请选择"
            clearable
          >
            <el-option
              v-for="item in this.$store.state.staticOptionsObj.bz"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            >
            </el-option>
          </el-select>
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
            prop-upload-url="/xwb/import-xwb"
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
        @menu-click="(e) => menuClickEvent(e, '序位表')"
        @edit-closed="editClosed"
      >
        <template #action="{ row }">
          <vxe-button
            mode="text"
            status="primary"
            @click="doViewLog(row)"
            v-if="row.id"
            >日志
          </vxe-button>
        </template>
        <template #llkg="{ row }">
          <!--          <vxe-select v-model="row.llkg" :options="row.llkgOptions" filterable remote :remote-method="(query)=> this.remoteMethod(query,row)"></vxe-select>-->
          <el-select
            v-model="row.llkg"
            filterable
            remote
            :remote-method="(query) => this.remoteMethod(query, row)"
          >
            <el-option
              v-for="item in row.llkgOptions"
              :value="item.value"
              :label="item.label"
            ></el-option>
          </el-select>
        </template>
        <template #pagerLeft>
          <DataTextComponent :text-arr="textArr"></DataTextComponent>
        </template>
      </vxe-grid>
    </article>
  </div>
</template>

<script>
import table_mixin from "@/mixin/table_mixin.jsx";
import UploadHttpComponent from "@/components/UploadHttpComponent.vue";
import dayjs from "dayjs";
import xwbApi from "@/api/xwb-api.js";
import view_simple_table from "@/views/vxeModal/view_simple_table.vue";
import commonApi from "@/api/common-api.js";
import { QuestionFilled } from "@element-plus/icons-vue";
import dynamic_form from "@/views/vxeModal/dynamic_form.vue";
import validateRules from "@/utils/validateRules.js";
import DataTextComponent from "@/components/DataTextComponent.vue";
import { ElMessageBox } from "element-plus";

export default {
  name: "xwb",
  components: { DataTextComponent, QuestionFilled, UploadHttpComponent },
  mixins: [table_mixin],
  data() {
    return {
      time: ["", ""],
      total: 0,
      searchParams: {
        bdzmcList: [],
        sfcyqs: false,
        year: dayjs().format("YYYY"),
        sortOrder: "",
        sortColumn: "",
        bz: "",
      },
      textArr: [],
      tableData: [],
      isAutoWrap: false,
      bdzOptions: [],
      bdzRealOptions: [],
      llkgOptions: [],
      editRow: {},
    };
  },
  watch: {
    "searchParams.sfcyqs": {
      handler() {
        this.loadTableData();
      },
      immediate: false,
    },
  },
  computed: {
    // roleEditRender(){
    //   return {
    //     name: 'ElSelect',
    //     options: [],
    //     props: {
    //       remote: true,
    //       loading: false,
    //       filterable: true,
    //       remoteShowSuffix: true,
    //       remoteMethod: this.remoteMethod
    //     }
    //   }
    // },
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
          field: "bdzmc",
          title: "变电站名称",
          width: 120,
          editRender: {
            name: "ElSelect",
            options: this.bdzRealOptions,
            props: { filterable: true },
          },
        },
        {
          field: "bdzdydj",
          title: "变电站电压等级（kV）",
          width: 120,
          sortable: true,
          editRender: {
            name: "ElSelect",
            options: this.$store.state.staticOptionsObj.bdzdydj,
            props: { clearable: true },
          },
        },
        {
          field: "llkg",
          title: "拉路开关",
          minWidth: 200,
          filters: [{ data: "" }],
          filterRender: { name: "VxeInput" },
          slots: {
            edit: "llkg",
          },
          // editRender: this.roleEditRender,
          editRender: {},
        },
        {
          field: "kgdydj",
          title: "开关电压等级（kV）",
          width: 120,
          sortable: true,
          editRender: {
            name: "ElSelect",
            options: this.$store.state.staticOptionsObj.bdzdydj,
            props: { clearable: true },
          },
        },
        {
          field: "fh",
          title: "负荷（万千瓦）",
          width: 120,
          sortable: true,
          headerAlign: "center",
          align: "right",
          formatter: ["formatterNumber", 2],
          titleSuffix: {
            content:
              "将当前负荷值与去年同期最大负荷值进行比较，取二者中的较大值作为更新后的基准负荷值",
          },
          editRender: {
            name: "ElInput",
            props: { type: "number", min: 0, step: 1 },
          },
        },
        {
          field: "ygFhz",
          title: "有功负荷值（万千瓦）",
          width: 130,
          sortable: true,
          headerAlign: "center",
          align: "right",
          formatter: ["formatterNumber", 2],
          titleSuffix: {
            content: "去年D5000最大采样值",
          },
          // editRender: {
          //   name: "ElInput",
          //   props: { type: "number", min: 0, step: 1 },
          // },
        },

        {
          field: "ssdwfq",
          title: "所属电网分区",
          width: 140,
          editRender: {
            name: "ElSelect",
            options: this.$store.state.selectOptionsObj.fq,
            props: { clearable: true },
          },
          filters: this.$store.state.selectOptionsObj.fq,
        },

        {
          field: "zyfh",
          title: "主要负荷【用户名称】",
          minWidth: 180,
          editRender: { name: "ElInput", props: { clearable: true } },
          filters: [{ data: "" }],
          filterRender: { name: "VxeInput" },
        },
        {
          field: "ssxzqy",
          title: "所属行政区域",
          width: 120,
          editRender: {
            name: "ElSelect",
            options: this.$store.state.selectOptionsObj.xzqy,
            props: { clearable: true },
          },
          filters: this.$store.state.selectOptionsObj.xzqy,
        },
        {
          field: "sz220bdz",
          title: "所在220千伏变电站",
          width: 120,
          editRender: { name: "ElInput", props: { clearable: true } },
        },
        {
          field: "fhxz",
          title: "负荷性质",
          width: 130,
          editRender: { name: "ElInput", props: { clearable: true } },
        },
        {
          field: "fd",
          title: "分档",
          width: 110,
          editRender: { name: "ElInput", props: { clearable: true } },
        },
        {
          field: "bz",
          title: "备注",
          width: 110,
          // headerAlign: "center",
          // align: "left",
          editRender: {
            name: "ElSelect",
            options: this.$store.state.staticOptionsObj.bz,
            props: { clearable: true },
          },
          // filters: this.$store.state.staticOptionsObj.bz,
          // filterMultiple: false,
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
        bdzmc: [{ required: true, message: "变电站名称不能为空" }],
        bdzdydj: [{ required: true, message: "变电站电压等级不能为空" }],
        llkg: [{ required: true, message: "拉路开关不能为空" }],
        kgdydj: [{ required: true, message: "开关电压等级不能为空" }],
        fh: [{ required: true, message: "负荷不能为空" }],
        ssdwfq: [{ required: true, message: "所属电网分区不能为空" }],
        zyfh: [{ required: true, message: "主要负荷不能为空" }],
        ssxzqy: [{ required: true, message: "所属行政区域不能为空" }],
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
        pagerConfig: {
          ...this.pagerConfig,
          pageSize: 100,
          pageSizes: [20, 50, 100, 200, 300, 500],
        },
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
            querySuccess: () => {
              this.loadData();
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
          filename: "序位表",
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
          body: {
            options: [[{ code: "collect", name: "标记重点" }]],
          },
        },
        cellClassName({ row }) {
          if (!row.ygFhz && row.ygFhz !== 0) {
            return "row-red";
          }
          if (row.bz === "增补") {
            return "row-blue";
          }
          if (row.bz === "剔除") {
            return "row-orangered";
          }
          return null;
        },
        editRules: this.editRules,
        columns: this.tableHeaderList,
        spanMethod({ row, rowIndex, column, visibleData }) {
          const spanFields = ["bdzmc", "bdzdydj"];
          const cellValue = row.bdzmc;
          if (cellValue && spanFields.includes(column.field)) {
            const prevRow = visibleData[rowIndex - 1];
            let nextRow = visibleData[rowIndex + 1];
            if (prevRow && prevRow.bdzmc === cellValue) {
              return { rowspan: 0, colspan: 0 };
            } else {
              let countRowspan = 1;
              while (nextRow && nextRow.bdzmc === cellValue) {
                nextRow = visibleData[++countRowspan + rowIndex];
              }
              if (countRowspan > 1) {
                return { rowspan: countRowspan, colspan: 1 };
              }
            }
          }
        },
      };
    },

    defaultLeftButtons() {
      return [
        { type: "gradientGreen", name: "查询" },
        { type: "gradientDarkGreen", name: "重置" },
        // {type: "gradientGreen", name: "导出当前页"},
        // {type: "gradientGreen", name: "导出全部"},
      ];
    },
    defaultRightButtons() {
      return [
        { type: "gradientBlue", name: "下载导入模版" },
        // { type: "gradientBlue", name: "同步" },
        { type: "gradientBlue", name: "新增" },
        { type: "gradientBlue", name: "生成" },
        { type: "gradientBlue", name: "保存" },
        { type: "gradientRed", name: "删除" },
      ];
    },
  },
  created() {
    this.queryBdz();
  },
  mounted() {},
  methods: {
    queryBdz() {
      xwbApi.getD5000BdzService({ bdzmc: "" }).then((res) => {
        this.bdzOptions = res.data;
        this.bdzRealOptions = this.bdzOptions.map((i) => {
          return {
            label: i.bdzmc,
            value: i.bdzmc,
          };
        });
      });
    },
    loadData() {
      xwbApi.loadDataService(this.searchParams.year).then((res) => {
        this.textArr = res.data;
      });
    },
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
        xwbApi.loadTableDataService(params).then((res) => {
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
      if (this.textArr.length > 2) {
        if (this.textArr[2].value > this.textArr[0].value) {
          ElMessageBox.alert(
            `${this.textArr[2].name}大于${this.textArr[0].name}`,
          );
        }
      }
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
        xwbApi
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
        xwbApi
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
    doSync() {
      xwbApi.doSyncDataService({}).then((res) => {
        this.$message.success(res.data);
        this.loadTableData();
      });
    },
    downloadModule() {
      commonApi.exportFileService("/xwb/download-xwb-tpl", {});
      //  xwbApi.downloadModuleService()
    },
    doExport(flag) {
      commonApi.exportFileService(
        "/xwb/exportXwb",
        this.searchParams,
        flag,
        this.pagerParam,
      );
    },

    resetParams() {
      this.searchParams = {
        bdzmcList: [],
        sfcyqs: false,
        year: dayjs().format("YYYY"),
        sortOrder: "",
        sortColumn: "",
        bz: "",
      };
      this.$nextTick(function () {
        this.loadTableData();
      });
    },
    beforeEditMethod({ row, column }) {
      return true;
    },
    editClosed({ row, column }) {
      if (column.field === "bdzmc") {
        let obj = this.bdzOptions.filter((i) => i.bdzmc === row.bdzmc)[0];
        row.bdzdydj = obj.bdzdydj;
        row.llkg = "";
        row.kgdydj = "";
      }
      if (column.field === "llkg") {
        let obj = this.llkgOptions.filter((i) => i.llkg === row.llkg)[0];
        row.kgdydj = obj.kgdydj;
        row.ycb = obj.ycb;
        row.ycy = obj.ycy;
        row.fh = obj.fh;
        row.ygFhz = obj.ygFhz;
      }
    },
    remoteMethod(query, row) {
      if (row.bdzmc) {
        xwbApi
          .getLlkgInfoService({
            bdzmc: row.bdzmc,
            llkg: query,
            saveYear: this.searchParams.year,
          })
          .then((res) => {
            this.llkgOptions = res.data;
            row.llkgOptions = res.data.map((i) => {
              return {
                label: i.llkg,
                value: i.llkg,
              };
            });
          });
      } else {
        this.$message.warning("变电站不存在，请重新选择变电站");
      }
    },

    // cellDblclick(e) {
    //   let {row} = e;
    //   this.openDetail(row)
    // },
    // openDetail(row) {
    //   this.$vxeModal.show(
    //       dynamic_form,
    //       {
    //         tableHeaderList: this.tableHeaderList,
    //         validateRules: this.editRules,
    //         row: row
    //       },
    //       {
    //         width: 800,
    //         title: '详情',
    //         height: window.innerHeight - 100,
    //
    //       },
    //       {
    //         close: () => {
    //         },
    //         doSubmit: (res) => {
    //           this.doRealSave([res])
    //         },
    //       }
    //   );
    // },

    doSc() {
      this.$vxeModal.show(
        dynamic_form,
        {
          tableHeaderList: [
            {
              field: "year",
              title: "参考年份",
              width: 150,
              editRender: {
                name: "ElDatePicker",
                props: {
                  type: "year",
                  labelFormat: "YYYY",
                  valueFormat: "YYYY",
                },
              },
            },
            {
              field: "inputNumber",
              title: "总负荷值（万千瓦）",
              minWidth: 120,
              headerAlign: "center",
              align: "right",
              editRender: {
                name: "ElInput",
                props: { type: "number", min: 0, step: 1 },
              },
            },
          ],
          validateRules: {
            inputNumber: [
              { required: true, message: "总负荷值（万千瓦）不能为空" },
              validateRules.positive_number.rule,
            ],
            year: [{ required: true, message: "参考年份不能为空" }],
          },
          row: {
            year: "2025",
            inputNumber: 0,
          },
          footerButtonList: [{ type: "gradientBlue", name: "保存" }],
        },
        {
          width: 400,
          title: "选择参考年份和输入总负荷值（万千瓦）",
          height: 270,
        },
        {
          // close: () => {
          //   this.loadTableData();
          // },
          doSubmit: (res) => {
            console.log(res);
            xwbApi
              .doScDataService({
                fhTotal: res.inputNumber,
                saveYear: this.searchParams.year,
                copyYear: res.year,
              })
              .then((res) => {
                this.$message.success(res.data);
                this.loadTableData();
              });
          },
        },
      );
      // this.$vxeModal.show(
      //   modal_select,
      //   {
      //     formComponent: ["year", "inputNumber"],
      //     defaultValue: { year: "2025" },
      //   },
      //   {
      //     width: 350,
      //     height: 220,
      //     title: "选择年份和输入总负荷值（万千瓦）",
      //     resize: false,
      //   },
      //   {
      //     submit: (obj) => {
      //       xwbApi
      //         .doScDataService({
      //           fhTotal: obj.inputNumber,
      //           saveYear: this.searchParams.year,
      //           copyYear: obj.year,
      //         })
      //         .then((res) => {
      //           this.$message.success(res.data);
      //           this.loadTableData();
      //         });
      //     },
      //   },
      // );
    },
    doViewLog(row) {
      xwbApi.loadViewDialogService({ id: row.id }).then((res) => {
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
