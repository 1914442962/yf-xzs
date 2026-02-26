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
        @menu-click="(e) => menuClickEvent(e, '设备启动')"
      >
        <!--        <template #dqzt="{row,column}">-->
        <!--          <vxe-tag status="error" v-if="row.dqzt=='已退回' || row.dqzt=='已作废'">{{row.dqzt}}</vxe-tag>-->
        <!--          <vxe-tag status="success" v-else-if="row.dqzt.includes('已')">{{row.dqzt}}</vxe-tag>-->
        <!--          <vxe-tag status="info" v-else>{{row.dqzt}}</vxe-tag>-->
        <!--        </template>-->
      </vxe-grid>
    </article>
  </div>
</template>

<script>
import table_mixin from "@/mixin/table_mixin.jsx";
import commonApi from "@/api/common-api.js";
import view_simple_table from "@/views/vxeModal/view_simple_table.vue";
import view_flow from "@/views/vxeModal/view_flow.vue";
import view_prompt from "@/views/vxeModal/view_prompt.vue";
import qdfaApi from "@/api/qdfa-api.js";
import dynamic_form_plus from "@/views/vxeModal/dynamic_form_plus.vue";
import view_transfer from "@/views/vxeModal/view_transfer.vue";

export default {
  name: "mmlc_table",
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
        // keyword: '',
        // sdt: '',
        // edt: '',
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
          width: 220,
          fixed: "left",
        },
        {
          field: "gcmc",
          title: "工程名称",
          width: 120,
        },
        {
          field: "mc",
          title: "名称",
          width: 120,
        },
        {
          field: "yjqdsj",
          title: "预计启动时间",
          sortable: true,
          width: 160,
          formatter: ["formatterTime"],
        },
        {
          field: "fileList",
          title: "附件名称",
          width: 180,
          showOverflow: "tooltip",
          editRender: {
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
          field: "sfpd",
          title: "是否配调流程",
          width: 110,
        },

        {
          field: "bzsj",
          title: "编制时间",
          sortable: true,
          width: 150,
          formatter: ["formatterTime"],
        },

        {
          field: "jbhqyj",
          title: "继保专业会签意见",
          minWidth: 250,
          headerAlign: "center",
          align: "left",
        },
        {
          field: "jbhqqz",
          title: "继保专业会签签字",
          width: 140,
        },
        {
          field: "jbhqsj",
          title: "继保专业会签签字时间",
          width: 180,
          sortable: true,
          formatter: ["formatterTime"],
        },
        // {
        //   field: "yfzgyj",
        //   title: "运方主管意见",
        //   minWidth: 250,
        //   headerAlign: 'center',
        //   align: 'left',
        // },
        // {
        //   field: "yfzgqz",
        //   title: "运方主管签字",
        //   width: 120,
        // },
        // {
        //   field: "yfzgqzsj",
        //   title: "运方主管签字时间",
        //   width: 160,
        //   sortable: true,
        //   formatter: ['formatterTime'],
        // },
        //
        // {
        //   field: "ddhqyj",
        //   title: "调度专业会签意见",
        //   minWidth: 250,
        //   headerAlign: 'center',
        //   align: 'left',
        // },
        // {
        //   field: "ddhqqz",
        //   title: "调度专业会签签字",
        //   width: 140,
        // },
        // {
        //   field: "ddhqsj",
        //   title: "调度专业会签签字时间",
        //   width: 180,
        //   sortable: true,
        //   formatter: ['formatterTime'],
        // },
        {
          field: "zryj",
          title: "主任审批意见",
          minWidth: 250,
          headerAlign: "center",
          align: "left",
        },
        {
          field: "zrqz",
          title: "主任审批签字",
          width: 120,
        },
        {
          field: "zrqzsj",
          title: "主任审批签字时间",
          width: 160,
          sortable: true,
          formatter: ["formatterTime"],
        },
        {
          field: "zxrqz",
          title: "执行人",
          width: 120,
        },
        {
          field: "zxsj",
          title: "执行时间",
          width: 160,
          sortable: true,
          formatter: ["formatterTime"],
        },
        {
          field: "status",
          title: "状态",
          width: 100,
        },
      ];
    },
    tableDetailHeaderList() {
      return [
        {
          title: "运方编制",
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
              field: "sfpd",
              title: "是否配调流程",
              width: "calc(50% - 25px)",
              itemClass: "borderRight child",
              disabled: true,
              editRender: {
                name: "$radio",
                options: [
                  { label: "是", value: "是" },
                  { label: "否", value: "否" },
                ],
              },
            },
            {
              field: "gcmc",
              title: "工程名称",
              width: "calc(100% - 50px)",
              disabled: true,
              itemClass: "whole_row borderRight child",
              editRender: { name: "ElInput", props: { clearable: true } },
            },
            {
              field: "mc",
              title: "名称",
              width: "calc(100% - 50px)",
              disabled: true,
              itemClass: "whole_row borderRight child",
              editRender: { name: "ElInput", props: { clearable: true } },
            },

            {
              field: "yjqdsj",
              title: "预计启动时间",
              width: "calc(100% - 50px)",
              disabled: true,
              itemClass: "whole_row borderRight child",
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
                  type: "qdfa",
                  limitSize: 50,
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
                associateField: "bzsj",
              },
            },
            {
              field: "bzsj",
              title: "编制时间",
              width: "calc(50% - 25px)",
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
          ],
        },

        {
          title: "继保专业会签意见",
          width: "50px",
          children: [
            {
              field: "jbhqyj",
              title: "继保专业会签意见",
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
              field: "jbhqqz",
              title: "继保专业会签签字",
              width: "calc(50% - 25px)",
              disabled: true,
              itemClass: "child",
              editRender: {
                name: "ElInput",
                props: { clearable: true },
                icons: [],
                associateField: "jbhqsj",
              },
            },
            {
              field: "jbhqsj",
              title: "继保专业会签签字时间",
              width: "calc(50% - 25px)",
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
          ],
        },

        // {
        //   title: "运方主管意见",
        //   width: "50px",
        //   children: [
        //     {
        //       field: "yfzgyj",
        //       title: "运方主管意见",
        //       width: "calc(100% - 50px)",
        //       disabled:true,
        //       itemClass: "whole_row borderRight child height2",
        //       editRender: {name: 'ElInput', props: {type: 'textarea', clearable: true, }}
        //     },
        //     {
        //       field: "yfzgqz",
        //       title: "运方主管签字",
        //       width: "calc(50% - 25px)",
        //       disabled:true,
        //       itemClass: "child",
        //       editRender: {name: 'ElInput', props: {clearable: true,},icons:[],associateField:'yfzgqzsj'}
        //     },
        //     {
        //       field: "yfzgqzsj",
        //       title: "运方主管签字时间",
        //       width: "calc(50% - 25px)",
        //       disabled:true,
        //       itemClass: "borderRight child",
        //       editRender: {name: 'ElDatePicker', props: {type: 'datetime', labelFormat: "YYYY-MM-DD HH:mm:ss", valueFormat: "YYYY-MM-DD HH:mm:ss",}},
        //     },
        //   ]
        // },
        // {
        //   title: "调度专业会签意见",
        //   width: "50px",
        //   children: [
        //     {
        //       field: "ddhqyj",
        //       title: "调度专业会签意见",
        //       width: "calc(100% - 50px)",
        //       disabled:true,
        //       itemClass: "whole_row borderRight child height2",
        //       editRender: {name: 'ElInput', props: {type: 'textarea', clearable: true, }}
        //     },
        //     {
        //       field: "ddhqqz",
        //       title: "调度专业会签签字",
        //       width: "calc(50% - 25px)",
        //       disabled:true,
        //       itemClass: "child",
        //       editRender: {name: 'ElInput', props: {clearable: true,},icons:[],associateField:'ddhqqzsj'}
        //     },
        //     {
        //       field: "ddhqqzsj",
        //       title: "调度专业会签签字时间",
        //       width: "calc(50% - 25px)",
        //       disabled:true,
        //       itemClass: "borderRight child",
        //       editRender: {name: 'ElDatePicker', props: {type: 'datetime', labelFormat: "YYYY-MM-DD HH:mm:ss", valueFormat: "YYYY-MM-DD HH:mm:ss",}},
        //     },
        //   ]
        // },
        {
          title: "主任审批意见",
          width: "50px",
          itemClass: "borderBottom",
          children: [
            {
              field: "zryj",
              title: "主任审批意见",
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
              field: "zrqz",
              title: "主任审批签字",
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
              field: "zrqzsj",
              title: "主任审批签字时间",
              width: "calc(50% - 25px)",
              disabled: true,
              itemClass: "borderBottom borderRight child",
              editRender: {
                name: "ElDatePicker",
                props: {
                  type: "datetime",
                  labelFormat: "YYYY-MM-DD HH:mm:ss",
                  valueFormat: "YYYY-MM-DD HH:mm:ss",
                },
              },
            },
          ],
        },
      ];
    },
    editRules() {
      return {
        // bgdmc: [
        //   {required: true, message: '变更单名称不能为空'}
        // ],
        // fslx: [
        //   {required: true, message: '方式类型不能为空'},
        // ],
        // tzsj: [
        //   {required: true, message: '预计启动时间不能为空'},
        // ],
        // bgdnr: [
        //   {required: true, message: '变更单内容不能为空'},
        // ],
        // fszt: [
        //   {required: true, message: '变更单内容不能为空'},
        // ],
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
      qdfaApi.loadButtonDataService({ nodeId: this.node.id }).then((res) => {
        this.defaultLeftButtons = res.data.outerBtns.filter(
          (i) => i.position == "left",
        );
        this.defaultRightButtons = res.data.outerBtns.filter(
          (i) => i.position == "right",
        );
        this.innerButtons = res.data.insideBtns;
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
        qdfaApi
          .loadTableDataService({
            ...params,
            nodeId: this.node.id,
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
        qdfaApi
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
    async doAdd() {
      let newId = await commonApi.getAddIdService().then((res) => {
        return res.data;
      });
      let bh = await commonApi.getAddNumService().then((res) => {
        return res.data;
      });
      qdfaApi.getTableConfigService({ nodeId: this.node.id }).then((res) => {
        let enabledFieldArr = res.data.enabledField.split(",");
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
        this.$vxeModal.show(
          dynamic_form_plus,
          {
            tableHeaderList: tableDetailHeaderList,
            validateRules: this.editRules,
            row: { bh: bh, id: newId, fileList: [] },
            labelWidth: "120px",
            footerButtonList: this.innerButtons.filter((i) => i.name != "发送"),
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
              res.opNodeId = this.node.id;
              res.isAdd = true;
              qdfaApi.saveTableDataService(res).then((res) => {
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
      qdfaApi.getTableConfigService({ nodeId: this.node.id }).then((res) => {
        let enabledFieldArr = res.data.enabledField.split(",");
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
        this.$vxeModal.show(
          dynamic_form_plus,
          {
            tableHeaderList: tableDetailHeaderList,
            validateRules: this.editRules,
            row: row,
            labelWidth: "120px",
            footerButtonList: this.innerButtons,
          },
          {
            width: 1200,
            title: "详情",
            height: window.innerHeight - 20,
          },
          {
            close: () => {},
            doSubmit: (res) => {
              res.opNodeId = this.node.id;
              res.isAdd = false;
              qdfaApi.saveTableDataService(res).then((res) => {
                this.$message.success(res.data);
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
                res.data.opNodeId = this.node.id;
                res.data.isAdd = false;
                qdfaApi.saveTableDataService(res.data).then(() => {
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
        qdfaApi
          .loadDialogDataService({ businessId: `qdfadd.${rows[0].id}` })
          .then((res) => {
            this.$vxeModal.show(
              view_simple_table,
              {
                tableHeaderList: [
                  {
                    type: "seq",
                    width: 60,
                  },
                  {
                    field: "op",
                    title: "操作",
                    width: "80",
                  },
                  {
                    field: "opTime",
                    title: "操作时间",
                    width: "150",
                    sortable: true,
                    formatter: ["formatterTime"],
                  },
                  {
                    field: "opUser",
                    title: "操作人",
                    width: "100",
                  },
                  {
                    field: "leftNodeName",
                    title: "开始节点",
                  },

                  {
                    field: "rightNodeName",
                    title: "结束节点",
                  },
                  // {
                  //   field: 'yj',
                  //   title: '意见',
                  // },
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

    doViewFlow() {
      qdfaApi.loadFlowDataService({ nodeName: this.node.name }).then((res) => {
        this.$vxeModal.show(
          view_flow,
          {
            originNodes: this.nodes,
            originEdges: this.edges,
          },
          {
            width: 800,
            height: window.innerHeight - 20,
            title: "查看流程图",
            resize: false,
          },
          {
            // close: () => {
            //   this.loadTableData();
            // },
          },
        );
      });
    },
    doOperation(item, rows = []) {
      if (!rows || rows.length == 0) {
        if (item.name == "退回") {
          rows = this.getCheckboxRecord();
        } else {
          rows = this.getCheckboxRecords();
        }
      }
      if (rows && rows.length > 0) {
        if (item.name == "归档") {
          let params = rows.map((i) => {
            return {
              businessId: `qdfadd.${i.id}`,
              leftNode: this.node.id,
              state: "归档",
            };
          });
          qdfaApi.doOperateSendService(params).then((res0) => {
            this.$message.success(res0.data);
            this.$vxeModal.closeAll();
            this.loadTableData();
            this.$emit("loadTree");
          });
        } else {
          qdfaApi
            .getTargetNodeService({ nodeId: this.node.id, lineIds: item.id })
            .then((res) => {
              this.$vxeModal.show(
                view_transfer,
                {
                  transferData: res.data[0].children[0].children,
                  defaultValue: [],
                  transferProps: {
                    key: "id",
                    label: "name",
                  },
                },
                {
                  width: 600,
                  height: 500,
                  title: `${item.name}到${res.data[0].name}`,
                },
                {
                  returnData: (selectValue) => {
                    let insertRecords = [];
                    for (let i = 0; i < selectValue.length; i++) {
                      insertRecords.push(
                        selectValue[i].split("&")[
                          selectValue[i].split("&").length - 1
                        ],
                      );
                    }
                    let targetUserId = insertRecords.join(",");
                    let params = rows.map((i) => {
                      return {
                        businessId: `qdfadd.${i.id}`,
                        leftNode: this.node.id,
                        rightNode: res.data[0].id,
                        targetUserId: targetUserId,
                      };
                    });

                    if (item.name == "退回") {
                      qdfaApi.doOperateReturnService(params[0]).then((res0) => {
                        this.$message.success(res0.data);
                        this.$vxeModal.closeAll();
                        this.loadTableData();
                        this.$emit("loadTree");
                      });
                    } else {
                      qdfaApi.doOperateSendService(params).then((res0) => {
                        this.$message.success(res0.data);
                        this.$vxeModal.closeAll();
                        this.loadTableData();
                        this.$emit("loadTree");
                      });
                    }

                    // this.$refs.xTable.remove(removeRecords)
                    // this.$refs.xTable.insertAt(insertRecords,-1).then((row) => {
                    //   this.$refs.xTable.setEditRow(row)
                    // })
                  },
                },
              );
            });
        }
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
