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
        <!--              end-placeholder="结束日期" style="width: 250px">-->
        <!--          </el-date-picker>-->
        <!--        </div>-->
        <!--        <div class="header-item">-->
        <!--          <el-input placeholder="请输入关键字" v-model="searchParams.keyword" @keydown.enter="loadTableData" :title="searchParams.keyword" clearable style="width: 150px">-->
        <!--          </el-input>-->
        <!--        </div>-->
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
          <!--          <el-dropdown style="margin: 0 10px">-->
          <!--            <el-button type="gradientGreen">-->
          <!--              导出<el-icon class="el-icon&#45;&#45;right"><arrow-down /></el-icon>-->
          <!--            </el-button>-->
          <!--            <template #dropdown>-->
          <!--              <el-dropdown-menu>-->
          <!--                <el-dropdown-item @click="doExport"-->
          <!--                  >导出当前页</el-dropdown-item-->
          <!--                >-->
          <!--                <el-dropdown-item @click="doExport(true)"-->
          <!--                  >导出全部</el-dropdown-item-->
          <!--                >-->
          <!--              </el-dropdown-menu>-->
          <!--            </template>-->
          <!--          </el-dropdown>-->
          <el-button
            v-for="item in defaultLeftButtons"
            :type="item.type"
            @click="btnClick(item)"
          >
            {{ item.name }}
          </el-button>
        </div>
      </section>
      <section>
        <div class="header-item">
          <el-button
            v-for="item in defaultRightButtons"
            :type="item.type"
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
        @menu-click="(e) => menuClickEvent(e, '设备启动')"
      >
      </vxe-grid>
    </article>
  </div>
</template>

<script>
import table_mixin from "@/mixin/table_mixin.jsx";
import commonApi from "@/api/common-api.js";
import view_simple_table from "@/views/vxeModal/view_simple_table.vue";
import dynamic_form_plus from "@/views/vxeModal/dynamic_form_plus.vue";
import mmbgApi from "@/api/sbqd/mmbg-api.js";
import view_prompt from "@/views/vxeModal/view_prompt.vue";

export default {
  name: "mmlc_table",
  mixins: [table_mixin],
  components: {},
  props: {
    node: Object,
    buttons: Array,
  },
  data() {
    return {
      time: ["", ""],
      total: 0,
      searchParams: {
        sortOrder: "",
        sortColumn: "",
      },
      tableData: [],
      isAutoWrap: false,
      defaultLeftButtons: [],
      defaultRightButtons: [],
      innerButtons: [],
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
          field: "bh",
          title: "编号",
          width: 120,
          fixed: "left",
        },
        {
          field: "xmmc",
          title: "项目名称",
          width: 160,
        },
        {
          field: "gznr",
          title: "工作内容",
          minWidth: 250,
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
          field: "yjtysj",
          title: "预计投运时间",
          sortable: true,
          width: 160,
          formatter: ["formatterTime"],
        },
        {
          field: "fileList",
          title: "附件名称",
          minWidth: 180,
          showOverflow: "tooltip",
          cellRender: {
            name: "VxeUpload",
            props: {
              readonly: true,
              moreConfig: {
                maxCount: 1,
                layout: "horizontal",
              },
            },
          },
        },
        {
          field: "bzr",
          title: "编制人",
          width: 90,
        },
        {
          field: "fbsj",
          title: "发布时间",
          sortable: true,
          width: 150,
          formatter: ["formatterTime"],
        },
        {
          field: "status",
          title: "状态",
          width: 100,
          // slots: { default: "dqzt" },
        },
      ];
    },
    tableDetailHeaderList() {
      return [
        {
          title: "变更单编制",
          width: "50px",
          children: [
            {
              field: "bh",
              title: "编号",
              width: "calc(50% - 25px)",
              disabled: true,
              itemClass: "child",
              editRender: {},
            },
            {
              field: "xmmc",
              title: "项目名称",
              width: "calc(50% - 25px)",
              disabled: true,
              itemClass: "borderRight child",
              editRender: { name: "ElInput", props: { clearable: true } },
            },
            {
              field: "gznr",
              title: "工作内容",
              width: "calc(100% - 50px)",
              disabled: true,
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
              field: "yjtysj",
              title: "预计投运时间",
              width: "calc(100% - 50px)",
              disabled: true,
              itemClass: "borderRight child",
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
              field: "bzr",
              title: "编制人",
              width: "calc(50% - 25px)",
              disabled: true,
              itemClass: "child",
              editRender: {
                name: "ElInput",
                props: { clearable: true },
                icons: [],
                associateField: "fbsj",
              },
            },
            {
              field: "fbsj",
              title: "发布时间",
              width: "calc(50% - 25px)",
              disabled: true,
              itemClass: "borderRight child",
              editRender: {},
            },
            {
              field: "fileList",
              title: "附件",
              width: "calc(100% - 50px)",
              disabled: true,
              itemClass: "whole_row borderRight child",
              editRender: {
                name: "vxeUpload",
                props: {
                  multiple: true,
                  types: ["doc", "docx", "xls", "xlsx", "pdf"],
                  type: "sbmmbg",
                  limitSize: 50,
                },
              },
            },
          ],
        },

        {
          title: "运方审核",
          width: "50px",
          children: [
            {
              field: "yfYj",
              title: "运方意见",
              width: "calc(100% - 50px)",
              disabled: true,
              itemClass: "whole_row borderRight child height2",
              editRender: {
                name: "ElInput",
                props: { type: "textarea", clearable: true },
              },
            },
            {
              field: "yfQz",
              title: "运方签字",
              width: "calc(50% - 25px)",
              disabled: true,
              itemClass: "child",
              editRender: {
                name: "ElInput",
                props: { clearable: true },
                icons: [],
                associateField: "yfQzsj",
              },
            },
            {
              field: "yfQzsj",
              title: "运方签字时间",
              width: "calc(50% - 25px)",
              disabled: true,
              itemClass: "borderRight child",
              editRender: {},
              // editRender: {name: 'ElDatePicker', props: {type: 'datetime', labelFormat: "YYYY-MM-DD HH:mm:ss", valueFormat: "YYYY-MM-DD HH:mm:ss",}},
            },
          ],
        },
        {
          title: "继保审核",
          width: "50px",
          children: [
            {
              field: "jbYj",
              title: "继保意见",
              width: "calc(100% - 50px)",
              disabled: true,
              itemClass: "whole_row borderRight child height2",
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
              field: "jbQz",
              title: "继保签字",
              width: "calc(50% - 25px)",
              disabled: true,
              itemClass: "child",
              editRender: {
                name: "ElInput",
                props: { clearable: true },
                icons: [],
                associateField: "jbQzsj",
              },
            },
            {
              field: "jbQzsj",
              title: "继保签字时间",
              width: "calc(50% - 25px)",
              disabled: true,
              itemClass: "borderRight child",
              editRender: {},
              // editRender: {name: 'ElDatePicker', props: {type: 'datetime', labelFormat: "YYYY-MM-DD HH:mm:ss", valueFormat: "YYYY-MM-DD HH:mm:ss",}},
            },
          ],
        },
        {
          title: "调度审核",
          width: "50px",
          children: [
            {
              field: "ddYj",
              title: "调度意见",
              width: "calc(100% - 50px)",
              disabled: true,
              itemClass: "whole_row borderRight child height2",
              editRender: {
                name: "ElInput",
                props: { type: "textarea", clearable: true },
              },
            },
            {
              field: "ddQz",
              title: "调度签字",
              width: "calc(50% - 25px)",
              disabled: true,
              itemClass: "child",
              editRender: {
                name: "ElInput",
                props: { clearable: true },
                icons: [],
                associateField: "ddQzsj",
              },
            },
            {
              field: "ddQzsj",
              title: "调度签字时间",
              width: "calc(50% - 25px)",
              disabled: true,
              itemClass: "borderRight child",
              editRender: {},
              // editRender: {name: 'ElDatePicker', props: {type: 'datetime', labelFormat: "YYYY-MM-DD HH:mm:ss", valueFormat: "YYYY-MM-DD HH:mm:ss",}},
            },
          ],
        },
        {
          title: "自动化审核",
          width: "50px",
          children: [
            {
              field: "zdhYj",
              title: "自动化意见",
              width: "calc(100% - 50px)",
              disabled: true,
              itemClass: "whole_row borderRight child height2",
              editRender: {
                name: "ElInput",
                props: { type: "textarea", clearable: true },
              },
            },
            {
              field: "zdhQz",
              title: "自动化签字",
              width: "calc(50% - 25px)",
              disabled: true,
              itemClass: "child",
              editRender: {
                name: "ElInput",
                props: { clearable: true },
                icons: [],
                associateField: "zdhQzsj",
              },
            },
            {
              field: "zdhQzsj",
              title: "自动化签字时间",
              width: "calc(50% - 25px)",
              disabled: true,
              itemClass: "borderRight child",
              editRender: {},
              // editRender: {name: 'ElDatePicker', props: {type: 'datetime', labelFormat: "YYYY-MM-DD HH:mm:ss", valueFormat: "YYYY-MM-DD HH:mm:ss",}},
            },
          ],
        },
        {
          title: "自动化执行",
          width: "50px",
          children: [
            {
              field: "zdhZxYj",
              title: "自动化执行意见",
              width: "calc(100% - 50px)",
              disabled: true,
              itemClass: "whole_row borderRight child height2",
              editRender: {
                name: "ElInput",
                props: { type: "textarea", clearable: true },
              },
            },
            {
              field: "zdhZxQz",
              title: "自动化执行签字",
              width: "calc(50% - 25px)",
              disabled: true,
              itemClass: "child",
              editRender: {
                name: "ElInput",
                props: { clearable: true },
                icons: [],
                associateField: "zdhZxQzsj",
              },
            },
            {
              field: "zdhZxQzsj",
              title: "自动化执行时间",
              width: "calc(50% - 25px)",
              disabled: true,
              itemClass: "borderRight child",
              editRender: {},
              // editRender: {name: 'ElDatePicker', props: {type: 'datetime', labelFormat: "YYYY-MM-DD HH:mm:ss", valueFormat: "YYYY-MM-DD HH:mm:ss",}},
            },
          ],
        },
        {
          title: "调度确认",
          width: "50px",
          itemClass: "borderBottom",
          children: [
            {
              field: "ddZxsm",
              title: "调度确认说明",
              width: "calc(100% - 50px)",
              disabled: true,
              itemClass: "whole_row borderRight child height2",
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
              field: "zxrQz",
              title: "执行人签字",
              width: "calc(50% - 25px)",
              disabled: true,
              itemClass: "child borderBottom",
              editRender: {
                name: "ElInput",
                props: { clearable: true },
                icons: [],
                associateField: "ddhqqzsj",
              },
            },
            {
              field: "zxrQzsj",
              title: "执行人签字时间",
              width: "calc(50% - 25px)",
              disabled: true,
              itemClass: "borderBottom borderRight child",
              editRender: {},
              // editRender: {name: 'ElDatePicker', props: {type: 'datetime', labelFormat: "YYYY-MM-DD HH:mm:ss", valueFormat: "YYYY-MM-DD HH:mm:ss",}},
            },
          ],
        },
      ];
    },
    editRules() {
      return {
        xmmc: [{ required: true, message: "项目名称不能为空" }],
        gznr: [{ required: true, message: "工作内容不能为空" }],
        yjtysj: [{ required: true, message: "预计投运时间不能为空" }],
        bzr: [{ required: true, message: "编制人不能为空" }],
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
          filename: "设备命名变更表格",
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
        columns: this.tableHeaderList,
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
        // {type: 'gradientDarkGreen', name: '重置'},
        { type: "gradientGreen", name: "自动换行" },
      ];
    },
  },
  mounted() {
    this.getButtons();
  },
  methods: {
    getButtons() {
      let buttons = this.buttons;
      this.defaultLeftButtons = buttons.outerBtns.filter(
        (i) => i.position == "left",
      );
      this.defaultRightButtons = buttons.outerBtns.filter(
        (i) => i.position == "right",
      );
      this.innerButtons = buttons.insideBtns;
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
        mmbgApi
          .loadTableDataService({
            ...params,
            ...this.node,
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
        mmbgApi
          .doDelTableDataService(ids)
          .then(() => {
            this.$message.success("删除成功");
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
    async doAdd() {
      let newId = await commonApi.getAddIdService().then((res) => {
        return res.data;
      });
      let enabledFieldArr = "xmmc,gznr,yjtysj,bzr,fileList".split(",");
      let tableDetailHeaderList = JSON.parse(
        JSON.stringify(this.tableDetailHeaderList),
      );
      for (let i = 0; i < enabledFieldArr.length; i++) {
        for (let j = 0; j < tableDetailHeaderList.length; j++) {
          let children = tableDetailHeaderList[j].children;
          for (let k = 0; k < children.length; k++) {
            if (
              children[k].field == enabledFieldArr[i] ||
              children[k].field + "Btn" == enabledFieldArr[i]
            ) {
              if (enabledFieldArr[i].includes("Btn")) {
                children[k].editRender.icons = ["edit"];
              } else {
                children[k].disabled = false;
              }
            }
          }
        }
      }
      tableDetailHeaderList = this.node.name.includes("编制")
        ? tableDetailHeaderList.filter((i) => i.title.includes("编制"))
        : tableDetailHeaderList;
      let index = tableDetailHeaderList.length - 1;
      let index1 = tableDetailHeaderList[index].children.length - 1;
      tableDetailHeaderList[index].itemClass = "borderBottom";
      tableDetailHeaderList[index].children[index1].itemClass +=
        " borderBottom";
      if (tableDetailHeaderList[index].children[index1].width.includes("50%")) {
        tableDetailHeaderList[index].children[index1 - 1].itemClass +=
          " borderBottom";
      }
      this.$vxeModal.show(
        dynamic_form_plus,
        {
          tableHeaderList: tableDetailHeaderList,
          validateRules: this.editRules,
          row: { id: newId, fileList: [] },
          labelWidth: "120px",
        },
        {
          width: 1200,
          title: "新增",
          height: window.innerHeight - 200,
        },
        {
          doSubmit: (res) => {
            res.isAdd = 1;
            mmbgApi.saveTableDataService(res).then(() => {
              this.$message.success("保存成功");
              this.$vxeModal.closeAll();
              this.loadTableData();
              this.$emit("loadTree");
            });
          },
        },
      );
    },
    doExport(flag) {
      commonApi.exportFileService(
        "/sbqd/export",
        { ...this.searchParams, nodeId: this.node.id },
        flag,
        this.pagerParam,
      );
    },
    cellDblclick(e) {
      let { row } = e;
      this.openDetail(row);
    },
    openDetail(row) {
      mmbgApi.getDetailDataService(row.id, this.node.role).then((res) => {
        let enabledFieldArr = res.data.enabledField
          .replaceAll("Qz", "QzBtn")
          .replaceAll("fj", "fileList")
          .split(",");
        let tableDetailHeaderList = JSON.parse(
          JSON.stringify(this.tableDetailHeaderList),
        );
        for (let i = 0; i < enabledFieldArr.length; i++) {
          for (let j = 0; j < tableDetailHeaderList.length; j++) {
            let children = tableDetailHeaderList[j].children;
            for (let k = 0; k < children.length; k++) {
              if (
                children[k].field == enabledFieldArr[i] ||
                children[k].field + "Btn" == enabledFieldArr[i]
              ) {
                if (enabledFieldArr[i].includes("Btn")) {
                  children[k].editRender.icons = ["edit"];
                } else {
                  children[k].disabled = false;
                }
              }
            }
          }
        }
        tableDetailHeaderList = this.node.name.includes("编制")
          ? tableDetailHeaderList.filter((i) => i.title.includes("编制"))
          : tableDetailHeaderList;
        let index = tableDetailHeaderList.length - 1;
        let index1 = tableDetailHeaderList[index].children.length - 1;
        tableDetailHeaderList[index].itemClass = "borderBottom";
        tableDetailHeaderList[index].children[index1].itemClass +=
          " borderBottom";
        if (
          tableDetailHeaderList[index].children[index1].width.includes("50%")
        ) {
          tableDetailHeaderList[index].children[index1 - 1].itemClass +=
            " borderBottom";
        }

        this.$vxeModal.show(
          dynamic_form_plus,
          {
            tableHeaderList: tableDetailHeaderList,
            validateRules: this.editRules,
            row: res.data,
            labelWidth: "120px",
            footerButtonList: this.innerButtons,
            // disabled: this.node.name.includes('已')
          },
          {
            width: 1200,
            title: "详情",
            height: window.innerHeight - 20,
          },
          {
            close: () => {},
            doSubmit: (res) => {
              res.isAdd = 0;
              mmbgApi.saveTableDataService(res).then(() => {
                this.$message.success("保存成功");
                this.$vxeModal.closeAll();
                this.loadTableData();
                this.$emit("loadTree");
              });
            },
            doOperate: async (res) => {
              if (res.btn.name == "查看流程图") {
                this.doViewFlow();
              } else if (res.btn.name == "查看日志") {
                this.doViewDialog([res.data]);
              } else {
                res.data.isAdd = 0;
                mmbgApi.saveTableDataService(res.data).then(() => {
                  this.doOperation(res.btn, [res.data]);
                });
              }
            },
          },
        );
      });
    },
    doViewDialog(rows = []) {
      if (!rows || rows.length == 0) {
        rows = this.getCheckboxRecords();
      }
      if (rows && rows.length > 0) {
        mmbgApi.loadDialogDataService(rows[0].id).then((res) => {
          this.$vxeModal.show(
            view_simple_table,
            {
              tableHeaderList: [
                {
                  type: "seq",
                  width: 60,
                },
                {
                  field: "action",
                  title: "操作",
                  width: "80",
                },
                {
                  field: "operateTime",
                  title: "操作时间",
                  width: "150",
                  sortable: true,
                  formatter: ["formatterTime"],
                },
                {
                  field: "operator",
                  title: "操作人",
                  width: "90",
                },
                {
                  field: "node",
                  title: "开始节点",
                  width: "100",
                },
                {
                  field: "nextNode",
                  title: "结束节点",
                  width: "100",
                },
                {
                  field: "opinion",
                  title: "意见",
                  align: "left",
                  headerAlign: "center",
                },

                {
                  field: "isUpdate",
                  title: "是否修改",
                  width: "80",
                },
              ],
              tableData: res.data,
            },
            {
              width: 900,
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
    //   qdfaApi.loadFlowDataService({ nodeName: this.node.name }).then((res) => {
    //     this.$vxeModal.show(
    //       view_flow,
    //       {
    //         originNodes: this.nodes,
    //         originEdges: this.edges,
    //       },
    //       {
    //         width: 800,
    //         height: window.innerHeight - 20,
    //         title: "查看流程图",
    //         resize: false,
    //       },
    //       {
    //         // close: () => {
    //         //   this.loadTableData();
    //         // },
    //       },
    //     );
    //   });
    // },
    doOperation(item, rows = []) {
      if (!rows || rows.length == 0) {
        rows = this.getCheckboxRecord();
      }
      if (rows && rows.length > 0) {
        this.$vxeModal.show(
          view_prompt,
          {
            isRequire: false,
          },
          {
            width: 360,
            height: 220,
            title: `输入${item.name}意见`,
            resize: false,
          },
          {
            returnData: (val) => {
              let params = {
                tzbgdId: rows[0].id,
                currentNode: this.node.role,
                action: item.action,
                opinion: val,
                isUpdate: "0",
              };
              mmbgApi.doOperateService(params).then(() => {
                this.$message.success(`${item.name}成功`);
                this.$vxeModal.closeAll();
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
