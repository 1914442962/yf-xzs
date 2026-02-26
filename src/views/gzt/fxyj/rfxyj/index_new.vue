<template>
  <div class="page_content">
    <div style="height: 50%">
      <header>
        <section>
          <div class="header-item" style="font-weight: bold; font-size: 20px">
            OMS 草稿箱（日风险）
          </div>
          <DateRangerPickerComponent
            :start-time="searchParams1.sdt"
            :end-time="searchParams1.edt"
            v-model:updateStartTime="searchParams1.sdt"
            v-model:updateEndTime="searchParams1.edt"
          ></DateRangerPickerComponent>
          <div class="header-item">
            <el-input
              placeholder="请输入关键字"
              v-model="searchParams1.keyword"
              :title="searchParams1.keyword"
              clearable
            >
            </el-input>
          </div>
          <div class="header-item">
            <el-button type="gradientGreen" @click="loadTableData1"
              >查询
            </el-button>
            <el-button type="gradientDarkGreen" @click="resetParams1"
              >重置
            </el-button>
            <el-button type="gradientGreen" @click="toggleWrap1"
              >自动换行
            </el-button>
            <el-dropdown style="margin-left: 10px">
              <el-button type="gradientGreen">
                导出
                <el-icon class="el-icon--right">
                  <arrow-down />
                </el-icon>
              </el-button>
              <template #dropdown>
                <el-dropdown-menu>
                  <el-dropdown-item @click="doExport1"
                    >导出当前页</el-dropdown-item
                  >
                  <el-dropdown-item @click="doExport1(true)"
                    >导出全部</el-dropdown-item
                  >
                </el-dropdown-menu>
              </template>
            </el-dropdown>
          </div>
        </section>
        <section>
          <div class="header-item">
            <el-button type="gradientBlue" @click="doSave">保存</el-button>
          </div>
        </section>
      </header>
      <article>
        <vxe-grid
          v-bind="gridOptions1"
          ref="xTable1"
          v-on="{ cellDblclick: cellClick }"
          @menu-click="(e) => menuClickEvent(e, '风险预警')"
        >
        </vxe-grid>
      </article>
    </div>
    <div style="margin-top: 8px">
      <el-button-group>
        <el-button
          :type="buttonType === '月风险匹配记录' ? 'gradientBlue' : ''"
          @click="buttonType = '月风险匹配记录'"
          >月风险匹配记录
        </el-button>
        <el-button
          :type="buttonType === '历史数据' ? 'gradientBlue' : ''"
          @click="buttonType = '历史数据'"
          >历史数据
        </el-button>
      </el-button-group>
    </div>
    <div style="height: calc(50% - 40px)">
      <header v-if="buttonType === '历史数据'">
        <section>
          <DateRangerPickerComponent
            :start-time="searchParams2.sdt"
            :end-time="searchParams2.edt"
            v-model:updateStartTime="searchParams2.sdt"
            v-model:updateEndTime="searchParams2.edt"
          ></DateRangerPickerComponent>
          <div class="header-item">
            <el-input
              placeholder="请输入关键字"
              v-model="searchParams2.keyword"
              :title="searchParams2.keyword"
              clearable
            >
            </el-input>
          </div>
          <div class="header-item">
            <el-button type="gradientGreen" @click="loadTableData2"
              >查询
            </el-button>
            <el-button type="gradientDarkGreen" @click="resetParams2"
              >重置
            </el-button>
            <el-button type="gradientGreen" @click="toggleWrap2"
              >自动换行
            </el-button>
            <el-dropdown style="margin-left: 10px">
              <el-button type="gradientGreen">
                导出
                <el-icon class="el-icon--right">
                  <arrow-down />
                </el-icon>
              </el-button>
              <template #dropdown>
                <el-dropdown-menu>
                  <el-dropdown-item @click="doExport2"
                    >导出当前页</el-dropdown-item
                  >
                  <el-dropdown-item @click="doExport2(true)"
                    >导出全部</el-dropdown-item
                  >
                </el-dropdown-menu>
              </template>
            </el-dropdown>
          </div>
        </section>
        <section>
          <div class="header-item">
            <el-button type="gradientBlue" @click="doPush1"
              >推送至草稿箱
            </el-button>
          </div>
        </section>
      </header>
      <article v-if="buttonType === '历史数据'">
        <vxe-grid
          v-bind="gridOptions2"
          ref="xTable2"
          @menu-click="(e) => menuClickEvent(e, '风险预警')"
        >
        </vxe-grid>
      </article>

      <header v-if="buttonType === '月风险匹配记录'">
        <section>
          <DateRangerPickerComponent
            :start-time="searchParams3.sdt"
            :end-time="searchParams3.edt"
            v-model:updateStartTime="searchParams3.sdt"
            v-model:updateEndTime="searchParams3.edt"
          ></DateRangerPickerComponent>
          <div class="header-item">
            <el-input
              placeholder="请输入停电设备"
              v-model="searchParams3.tdsb"
              :title="searchParams3.tdsb"
              clearable
            >
            </el-input>
          </div>
          <div class="header-item">
            <el-button type="gradientGreen" @click="loadTableData3"
              >查询
            </el-button>
            <el-button type="gradientDarkGreen" @click="resetParams3"
              >重置
            </el-button>
            <el-button type="gradientGreen" @click="toggleWrap3"
              >自动换行
            </el-button>
            <el-dropdown style="margin-left: 10px">
              <el-button type="gradientGreen">
                导出
                <el-icon class="el-icon--right">
                  <arrow-down />
                </el-icon>
              </el-button>
              <template #dropdown>
                <el-dropdown-menu>
                  <el-dropdown-item @click="doExport3"
                    >导出当前页</el-dropdown-item
                  >
                  <el-dropdown-item @click="doExport3(true)"
                    >导出全部</el-dropdown-item
                  >
                </el-dropdown-menu>
              </template>
            </el-dropdown>
          </div>
        </section>
        <section>
          <div class="header-item">
            <el-button type="gradientBlue" @click="doPush2"
              >推送至OMS草稿箱
            </el-button>
          </div>
        </section>
      </header>
      <article v-if="buttonType === '月风险匹配记录'">
        <vxe-grid
          v-bind="gridOptions3"
          ref="xTable3"
          @menu-click="(e) => menuClickEvent(e, '风险预警')"
        >
          <template #action="{ row }">
            <vxe-button mode="text" status="primary" @click="openDetail(row)"
              >查看详情
            </vxe-button>
          </template>
        </vxe-grid>
      </article>
    </div>
  </div>
</template>

<script>
import table_mixin from "@/mixin/table_mixin.jsx";
import rfxyjApi from "@/api/fxyj/rfxyj-api.js";
import commonApi from "@/api/common-api.js";
import dynamic_form_plus from "@/views/vxeModal/dynamic_form_plus.vue";
import dayjs from "dayjs";
import ydfxApi from "@/api/fxyj/ydfxyj-api.js";
import DateRangerPickerComponent from "@/components/DateRangerPickerComponent.vue";
import rfxApi from "@/api/fxyj/rfxyj-api.js";
import modal_select from "@/views/vxeModal/modal_select.vue";

export default {
  name: "rfxyj",
  mixins: [table_mixin],
  components: { DateRangerPickerComponent },
  data() {
    return {
      time: ["", ""],
      total1: 0,
      total2: 0,
      searchParams1: {
        keyword: "",
        sortOrder: "",
        sortColumn: "",
        sdt: "",
        edt: "",
      },
      buttonType: "月风险匹配记录",
      searchParams2: {
        keyword: "",
        sortOrder: "",
        sortColumn: "",
        sdt: "",
        edt: "",
      },
      searchParams3: {
        sdt: "",
        edt: "",
        tdsb: "",
        sortOrder: "",
        sortColumn: "",
      },
      isAutoWrap1: false,
      isAutoWrap2: false,
      isAutoWrap3: false,
    };
  },
  watch: {},
  computed: {
    editRules() {
      return {
        kssj: [
          { required: true, message: "开始时间不能为空" },
          // validateRules.date.rule,
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
          // validateRules.date.rule,
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
      };
    },
    tableHeaderList1() {
      return [
        // {
        //   type: 'checkbox',
        //   width: 50,
        // },
        {
          type: "seq",
          width: 60,
        },
        {
          field: "bh",
          title: "日风险编号",
          width: 160,
        },
        {
          field: "fxdj",
          title: "风险等级",
          width: 95,
          allowPush: true,
          editRender: { name: "ElInput", props: { clearable: true } },
        },
        // {
        //   field: "sy",
        //   title: "事由",
        //   minWidth: 120,
        //   headerAlign: 'center',
        //   align: 'left',
        // },
        {
          field: "tdsb",
          title: "停电设备",
          minWidth: 120,
          headerAlign: "center",
          align: "left",
          editRender: {
            name: "ElInput",
            props: {
              type: "textarea",
              clearable: true,
              autosize: this.isAutoWrap1 ? { maxRows: 1 } : true,
            },
          },
        },
        {
          field: "yjqfhss",
          title: "压降前负荷损失（万千瓦）",
          width: 125,
          sortable: true,
          allowPush: true,
          headerAlign: "center",
          align: "right",
          editRender: {
            name: "ElInput",
            props: { type: "number", min: 0, step: 1, clearable: true },
          },
        },
        {
          field: "yjhfhss",
          title: "压降后负荷损失（万千瓦）",
          width: 125,
          sortable: true,
          allowPush: true,
          headerAlign: "center",
          align: "right",
          editRender: {
            name: "ElInput",
            props: { type: "number", min: 0, step: 1, clearable: true },
          },
        },
        {
          field: "kssj",
          title: "开始时间",
          width: 130,
          sortable: true,
          editRender: {
            name: "ElDatePicker",
            props: {
              type: "datetime",
              labelFormat: "YYYY-MM-DD HH:mm",
              valueFormat: "YYYY-MM-DD HH:mm",
              timeFormat: "HH:mm",
              clearable: true,
            },
          },
        },
        {
          field: "jssj",
          title: "结束时间",
          width: 130,
          sortable: true,
          editRender: {
            name: "ElDatePicker",
            props: {
              type: "datetime",
              labelFormat: "YYYY-MM-DD HH:mm",
              valueFormat: "YYYY-MM-DD HH:mm",
              timeFormat: "HH:mm",
              clearable: true,
            },
          },
        },

        {
          field: "fxfx",
          title: "风险分析",
          headerAlign: "center",
          align: "left",
          allowPush: true,
          minWidth: 250,
          editRender: {
            name: "ElInput",
            props: {
              type: "textarea",
              clearable: true,
              autosize: this.isAutoWrap1 ? { maxRows: 1 } : true,
            },
          },
        },
        {
          field: "ykcs",
          title: "预控措施",
          headerAlign: "center",
          align: "left",
          allowPush: true,
          minWidth: 120,
          //           editRender: {name: 'ElInput', props: {type: 'textarea', clearable: true, autosize: this.isAutoWrap?{maxRows:1}:true}},
        },
        {
          field: "sfhqtzyyh",
          title: "是否含全停重要用户",
          allowPush: true,
          width: 100,
          editRender: {
            name: "ElSelect",
            options: [
              { label: "是", value: "是" },
              { label: "否", value: "否" },
            ],
            props: { clearable: true },
          },
        },

        {
          field: "sfhyzytjyjyh",
          title: "是否含有重要特级或一级用户",
          allowPush: true,
          width: 130,
          editRender: {
            name: "ElSelect",
            options: [
              { label: "是", value: "是" },
              { label: "否", value: "否" },
            ],
            props: { clearable: true },
          },
        },
        {
          field: "sffhn14N210",
          title: "是否符合n-1超4万、n-2超10万",
          allowPush: true,
          width: 130,
          editRender: {
            name: "ElSelect",
            options: [
              { label: "是", value: "是" },
              { label: "否", value: "否" },
            ],
            props: { clearable: true },
          },
        },
        // {
        //   title: "查看风险预警通知书",
        //   minWidth: 120,
        //   fixed: 'right',
        //   slots: { default: 'action' }
        // },
      ];
    },
    //月风险匹配记录有默认排序，后端不好加排序
    tableHeaderList2() {
      return [
        {
          type: "seq",
          width: 60,
        },
        {
          field: "tdsb",
          title: "停电设备",
          minWidth: 160,
          headerAlign: "center",
          align: "left",
        },
        {
          field: "fxdj",
          title: "风险等级",
          allowPush: true,
          width: 80,
        },
        {
          field: "jyqfxms",
          title: "压降前风险描述",
          minWidth: 200,
          // allowPush: true,
          headerAlign: "center",
          align: "left",
        },
        {
          field: "yjqFhss",
          title: "压降前负荷损失（万千瓦）",
          width: 100,
          allowPush: true,
          headerAlign: "center",
          align: "right",
          // sortable: true,
        },
        {
          field: "jyhfxms",
          title: "压降后风险描述",
          minWidth: 220,
          allowPush: true,
          headerAlign: "center",
          align: "left",
        },
        {
          field: "jgfhfx",
          title: "压降后负荷损失（万千瓦）",
          width: 100,
          allowPush: true,
          headerAlign: "center",
          align: "right",
          // sortable: true,
        },
        {
          field: "kssj",
          title: "开始时间",
          width: 100,
          // sortable: true,
        },

        {
          field: "jssj",
          title: "结束时间",
          width: 100,
          // sortable: true,
        },
        {
          field: "sfQt",
          title: "是否含全停重要用户",
          allowPush: true,
          width: 90,
        },

        {
          field: "sfZy",
          title: "是否含有重要特级或一级用户",
          allowPush: true,
          width: 120,
        },
        {
          field: "sfZqj",
          title: "是否符合n-1超4万、n-2超10万",
          allowPush: true,
          width: 130,
        },
        {
          field: "similarity",
          title: "相似度（%）",
          width: 100,
          // sortable: true,
        },

        {
          title: "人工核查",
          type: "radio",
          width: 90,
        },
        {
          title: "操作",
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
              autosize: this.isAutoWrap1 ? { maxRows: 1 } : true,
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
                  autosize: this.isAutoWrap1 ? { maxRows: 1 } : true,
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
                  autosize: this.isAutoWrap1 ? { maxRows: 1 } : true,
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
              autosize: this.isAutoWrap1 ? { maxRows: 1 } : true,
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
                  autosize: this.isAutoWrap1 ? { maxRows: 1 } : true,
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
                  autosize: this.isAutoWrap1 ? { maxRows: 1 } : true,
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
              title: "涉及全停重要用户",
              width: "50%",
              itemClass: "borderRight",
              editRender: { name: "ElInput", props: { clearable: true } },
            },
            {
              field: "jgfhfx",
              title: "负荷损失（万千瓦）",
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
    gridOptions1() {
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
          reserve: true, //分页保留显示状态
          showServeStatus: true, //分页显示保留显示状态
          range: true, //鼠标滑动范围选择
        },
        columnConfig: {
          resizable: true,
        },
        resizeConfig: {
          isDblclickAutoWidth: true, //双击自适应列宽
        },
        sortConfig: {
          remote: true,
        },
        filterConfig: {
          remote: true,
        },
        showOverflow: this.isAutoWrap1,
        headerCellClassName: "row-class",
        pagerConfig: this.pagerConfig,
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
              return this.loadTableApi1(page, sorts, filters);
            },
            queryAll: ({ sorts, filters }) => {
              return this.loadTableApi1(
                { pageSize: 100000, currentPage: 1 },
                sorts,
                filters,
              );
            },
            save: ({ body }) => {
              return this.doSaveApi(body);
            },
          },
        },
        editRules: this.editRules,
        columns: [
          {
            type: "checkbox",
            width: 50,
          },
          ...this.tableHeaderList1,
        ],
        menuConfig: {
          body: {
            options: [[{ code: "collect", name: "标记重点" }]],
          },
        },
      };
    },
    gridOptions2() {
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
          trigger: "row",
        },
        checkboxConfig: {
          highlight: true,
          reserve: true, //分页保留显示状态
          showServeStatus: true, //分页显示保留显示状态
          range: true, //鼠标滑动范围选择
        },
        columnConfig: {
          resizable: true,
        },
        resizeConfig: {
          isDblclickAutoWidth: true, //双击自适应列宽
        },
        sortConfig: {
          remote: true,
        },
        filterConfig: {
          remote: true,
        },
        showOverflow: this.isAutoWrap2,
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
              return this.loadTableApi2(page, sorts, filters);
            },
            queryAll: ({ sorts, filters }) => {
              return this.loadTableApi2(
                { pageSize: 100000, currentPage: 1 },
                sorts,
                filters,
              );
            },
          },
        },
        columns: [
          ...this.tableHeaderList1,
          {
            type: "radio",
            width: 100,
            title: "人工核查",
          },
        ],
        menuConfig: {
          body: {
            options: [[{ code: "collect", name: "标记重点" }]],
          },
        },
      };
    },
    gridOptions3() {
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
          trigger: "row",
        },
        checkboxConfig: {
          highlight: true,
          reserve: true, //分页保留显示状态
          showServeStatus: true, //分页显示保留显示状态
          range: true, //鼠标滑动范围选择
        },
        columnConfig: {
          resizable: true,
        },
        resizeConfig: {
          isDblclickAutoWidth: true, //双击自适应列宽
        },
        sortConfig: {
          remote: true,
        },
        filterConfig: {
          remote: true,
        },
        showOverflow: this.isAutoWrap3,
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
              return this.loadTableApi3(page, sorts, filters);
            },
            queryAll: ({ sorts, filters }) => {
              return this.loadTableApi3(
                { pageSize: 100000, currentPage: 1 },
                sorts,
                filters,
              );
            },
          },
        },
        columns: this.tableHeaderList2,
        menuConfig: {
          body: {
            options: [[{ code: "collect", name: "标记重点" }]],
          },
        },
      };
    },
    defaultLeftButtons() {
      return [
        { type: "gradientGreen", name: "查询" },
        // {type: 'gradientDarkGreen', name: '重置'},
        { type: "gradientGreen", name: "导出当前页" },
        { type: "gradientGreen", name: "导出全部" },
      ];
    },
  },
  mounted() {},
  methods: {
    reloadTableData1() {
      this.$refs.xTable1.commitProxy("query"); //不重置分页
    },
    reloadTableData2() {
      this.$refs.xTable2.commitProxy("query"); //不重置分页
    },
    loadTableData1() {
      this.$refs.xTable1.commitProxy("reload"); //重置分页
    },
    loadTableData2() {
      this.$refs.xTable2.commitProxy("reload"); //重置分页
    },
    loadTableData3() {
      this.$refs.xTable3.commitProxy("reload"); //重置分页
    },
    loadTableApi1(page, sorts, filters) {
      let params = this.getRealParams(this.searchParams1, page, sorts, filters);
      return new Promise((resolve) => {
        rfxyjApi.loadTableDataService1(params).then((res) => {
          if (page.pageSize == 100000) {
            this.total1 = res.total;
            resolve(res.data);
          } else {
            this.total1 = res.total;
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
    loadTableApi2(page, sorts, filters) {
      let params = this.getRealParams(this.searchParams2, page, sorts, filters);
      return new Promise((resolve) => {
        rfxyjApi.loadTableDataService2(params).then((res) => {
          if (page.pageSize == 100000) {
            this.total2 = res.total;
            resolve(res.data);
          } else {
            this.total2 = res.total;
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
    loadTableApi3(page, sorts, filters) {
      let params = this.getRealParams(this.searchParams3, page, sorts, filters);
      return new Promise((resolve) => {
        ydfxApi.loadTableDataService(params).then((res) => {
          if (page.pageSize == 100000) {
            this.total2 = res.total;
            resolve(res.data);
          } else {
            this.total2 = res.total;
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

    doExport1(flag) {
      let contains = this.$refs.xTable1;
      console.log(contains);
      let pagerParam = {
        currentPage: this.$refs.xTable1.getCurrentPage(),
        pageSize: this.$refs.xTable1.getPageSize(),
      };
      commonApi.exportFileService(
        "/fxyj/exportRFxyjCgx",
        this.searchParams1,
        flag,
        pagerParam,
      );
      // this.$refs.xTable1.openExport();
    },
    doExport2(flag) {
      let pagerParam = {
        currentPage: this.$refs.xTable2.getCurrentPage(),
        pageSize: this.$refs.xTable2.getPageSize(),
      };
      commonApi.exportFileService(
        "/fxyj/exportRFxyjLs",
        this.searchParams2,
        flag,
        pagerParam,
      );
      // this.$refs.xTable2.openExport();
    },
    doExport3(flag) {
      let pagerParam = {
        currentPage: this.$refs.xTable3.getCurrentPage(),
        pageSize: this.$refs.xTable3.getPageSize(),
      };
      commonApi.exportFileService(
        "/fxyj/exportYdFxyj",
        this.searchParams3,
        flag,
        pagerParam,
      );
    },
    doPush1() {
      const rows = this.$refs.xTable1.getCheckboxRecords();
      const row = this.$refs.xTable2.getRadioRecord();
      if (!row || row.length == 0) {
        this.$message.warning("请选择一条历史数据");
        return;
      }
      if (!rows || rows.length == 0) {
        this.$message.warning("请选择草稿箱数据！");
        return;
      }
      let ids = rows.map((i) => i.objId).join(",");
      let checkList = this.tableHeaderList1.filter((i) => i.allowPush);
      let checkboxList = checkList.map((i) => i.title);
      this.$vxeModal.show(
        modal_select,
        {
          formComponent: ["checkbox"],
          checkboxList: checkboxList,
          defaultValue: { checkList: checkboxList },
        },
        {
          width: 500,
          height: 400,
          title: "选择列",
          resize: false,
        },
        {
          submit: (obj) => {
            let flag = checkList.filter((i) => obj.checkList.includes(i.title));
            rfxyjApi
              .pushTableDataService({
                lsId: row.objId,
                ids,
                flag: flag.map((i) => i.field).join(","),
              })
              .then((res) => {
                this.$message.success(res.data);
                this.reloadTableData1();
              });
          },
        },
      );
    },

    doPush2() {
      const rows = this.$refs.xTable1.getCheckboxRecords();
      const row = this.$refs.xTable3.getRadioRecord();
      if (!row || row.length == 0) {
        this.$message.warning("请选择一条月风险匹配记录");
        return;
      }
      if (!rows || rows.length == 0) {
        this.$message.warning("请选择草稿箱数据！");
        return;
      }
      let ids = rows.map((i) => i.objId).join(",");
      let checkList = this.tableHeaderList2.filter((i) => i.allowPush);
      let checkboxList = checkList.map((i) => i.title);
      this.$vxeModal.show(
        modal_select,
        {
          formComponent: ["checkbox"],
          checkboxList: checkboxList,
          defaultValue: { checkList: checkboxList },
        },
        {
          width: 500,
          height: 400,
          title: "选择列",
          resize: false,
        },
        {
          submit: (obj) => {
            console.log(obj);
            let flag = checkList.filter((i) => obj.checkList.includes(i.title));
            ydfxApi
              .saveOmsTableDataService({
                data: row,
                ids,
                flag: flag.map((i) => i.field).join(","),
              })
              .then((res) => {
                this.$message.success(res.data);
                this.reloadTableData1();
              });
          },
        },
      );
    },
    doSave() {
      this.$refs.xTable1.commitProxy("save");
    },
    doSaveApi(body) {
      return new Promise((resolve, reject) => {
        let { insertRecords, updateRecords } = body;
        let data = [...insertRecords, ...updateRecords];
        rfxApi
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
    toggleWrap1() {
      if (this.isAutoWrap1) {
        this.isAutoWrap1 = false;
      } else {
        this.isAutoWrap1 = "tooltip";
      }
    },
    toggleWrap2() {
      if (this.isAutoWrap2) {
        this.isAutoWrap2 = false;
      } else {
        this.isAutoWrap2 = "tooltip";
      }
    },
    toggleWrap3() {
      if (this.isAutoWrap3) {
        this.isAutoWrap3 = false;
      } else {
        this.isAutoWrap3 = "tooltip";
      }
    },

    resetParams1() {
      this.searchParams1.sdt = "";
      this.searchParams1.edt = "";
      this.searchParams1.keyword = "";
      this.searchParams1.sortOrder = "";
      this.searchParams1.sortColumn = "";
      this.$nextTick(function () {
        this.loadTableData1();
      });
    },
    resetParams2() {
      this.searchParams2.sdt = "";
      this.searchParams2.edt = "";
      this.searchParams2.keyword = "";
      this.searchParams2.sortOrder = "";
      this.searchParams2.sortColumn = "";
      this.$nextTick(function () {
        this.loadTableData2();
      });
    },
    resetParams3() {
      this.searchParams3.sdt = "";
      this.searchParams3.edt = "";
      this.searchParams3.tdsb = "";
      this.searchParams3.sortOrder = "";
      this.searchParams3.sortColumn = "";
      this.$nextTick(function () {
        this.loadTableData3();
      });
    },
    openDetail(row) {
      this.$vxeModal.show(
        dynamic_form_plus,
        {
          tableHeaderList: this.tableDetailHeaderList,
          row: row,
          labelWidth: "180px",
          showFooter: false,
          disabled: true,
        },
        {
          width: 1000,
          title: "详情",
          height: window.innerHeight - 100,
        },
        {
          close: () => {},
        },
      );
    },
    cellClick(e) {
      let { row, column } = e;
      this.searchParams3.sdt = dayjs(row.kssj).format("YYYY-MM-DD");
      this.searchParams3.edt = dayjs(row.jssj).format("YYYY-MM-DD");
      this.searchParams3.tdsb = row.tdsbAfter;
      this.loadTableData3();
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
