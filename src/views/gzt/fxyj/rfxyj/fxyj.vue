<template>
  <div class="page_content">
    <header>
      <section>
        <div class="header-item">
          <el-button-group>
            <el-button
              :type="buttonType === '今日执行' ? 'gradientBlue' : ''"
              @click="resetType('今日执行')"
              >今日执行
            </el-button>
            <el-button
              :type="buttonType === '本周执行' ? 'gradientBlue' : ''"
              @click="resetType('本周执行')"
              >本周执行
            </el-button>
            <el-button
              :type="buttonType === '本月执行' ? 'gradientBlue' : ''"
              @click="resetType('本月执行')"
              >本月执行
            </el-button>
          </el-button-group>
        </div>
        <DateRangerPickerComponent
          :start-time="searchParams.sdt"
          :end-time="searchParams.edt"
          v-model:updateStartTime="searchParams.sdt"
          v-model:updateEndTime="searchParams.edt"
        ></DateRangerPickerComponent>
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
        @menu-click="(e) => menuClickEvent(e, '风险预警')"
      >
        <template #action="{ row }">
          <vxe-button mode="text" status="primary" @click="doOpenDetail(row)"
            >查看</vxe-button
          >
          <vxe-button
            mode="text"
            status="primary"
            @click="doViewLog(row)"
            v-if="row.jxdid"
            >查看检修单</vxe-button
          >
          <vxe-button mode="text" status="primary" @click="doSendMessage(row)"
            >发送短信</vxe-button
          >
        </template>
      </vxe-grid>
    </article>
  </div>
</template>

<script>
import table_mixin from "@/mixin/table_mixin.jsx";
import dayjs from "dayjs";
import DateRangerPickerComponent from "@/components/DateRangerPickerComponent.vue";
import fxyjApi from "@/api/fxyj/fxyj-api.js";
import dynamic_form_plus from "@/views/vxeModal/dynamic_form_plus.vue";

export default {
  name: "fxyj",
  mixins: [table_mixin],
  components: { DateRangerPickerComponent },
  data() {
    return {
      buttonType: "今日执行",
      total: 0,
      searchParams: {
        keyword: "",
        sortOrder: "",
        sortColumn: "",
        sdt: "",
        edt: "",
      },
      tableData: [],
      isAutoWrap: false,
      rqOptions: [
        { label: "今日执行", value: "今日执行" },
        { label: "本周执行", value: "本周执行" },
        { label: "本月执行", value: "本月执行" },
      ],
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
          field: "businessNo",
          title: "项目编号",
          width: 180,
        },
        {
          field: "jxddh",
          title: "检修单编号",
          width: 180,
        },
        {
          field: "topic",
          title: "主题",
          minWidth: 120,
          headerAlign: "center",
          align: "left",
        },
        {
          field: "formattedTimeRange1",
          title: "时段",
          width: 280,
        },
        {
          field: "formattedTimeRange2",
          title: "延期时段",
          width: 280,
        },
        {
          field: "supplyTime",
          title: "发布日期",
          width: 150,
          sortable: true,
          formatter: ["formatterTime"],
        },

        {
          title: "操作",
          width: 160,
          fixed: "right",
          slots: { default: "action" },
        },
      ];
    },
    tableDetailHeaderList() {
      return [
        {
          field: "topic",
          title: "主题",
          width: "100%",
          itemClass: "borderRight",
          editRender: {},
        },
        {
          field: "riskGrade",
          title: "风险等级",
          width: "100%",
          itemClass: "borderRight",
          editRender: {},
        },
        {
          field: "reason",
          title: "停电设备/事由",
          width: "100%",
          itemClass: "borderRight",
          editRender: {},
        },
        {
          field: "formattedTimeRange",
          title: "工期时段",
          width: "100%",
          itemClass: "borderRight",
          editRender: {},
        },
        {
          field: "riskAnalysis",
          title: "运行安全\n风险分析",
          width: "100%",
          itemClass: "borderRight",
          editRender: {},
        },
        {
          field: "ykcs",
          title: "风险管控\n实施要求",
          width: "100%",
          itemClass: "borderRight",
          editRender: {},
        },
        {
          field: "singDepartment",
          title: "签收部门",
          width: "100%",
          itemClass: "borderRight",
          editRender: {},
        },
        {
          field: "staffing",
          title: "编制",
          width: "50%",
          editRender: {},
        },
        {
          field: "zxldUser",
          title: "审核",
          width: "50%",
          itemClass: "borderRight",
          editRender: {},
        },
        {
          field: "ajb",
          title: "安监部",
          width: "100%",
          itemClass: "borderRight",
          editRender: {},
        },
        {
          field: "sbb",
          title: "设备部",
          width: "100%",
          itemClass: "borderRight",
          editRender: {},
        },
        {
          field: "zxldExplan",
          title: "中心领导审核意见",
          width: "100%",
          itemClass: "borderRight",
          editRender: {},
        },
        {
          field: "zxldUser",
          title: "中心领导审核人",
          width: "50%",
          editRender: {},
        },
        {
          field: "zxldTime",
          title: "中心领导审核时间",
          width: "50%",
          itemClass: "borderRight",
          editRender: {},
        },

        {
          field: "gsldExplan",
          title: "公司领导审核意见",
          width: "100%",
          itemClass: "borderRight",
          editRender: {},
        },
        {
          field: "gsldUser",
          title: "公司领导审核人",
          width: "50%",
          itemClass: "borderBottom",
          editRender: {},
        },
        {
          field: "gsldTime",
          title: "公司领导审核时间",
          width: "50%",
          itemClass: "borderRight borderBottom",
          editRender: {},
        },
      ];
    },
    editRules() {
      return {
        // bh: [
        //   {required: true, message: '项目编号不能为空'}
        // ],
        kssj: [
          { required: true, message: "开始时间不能为空" },
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
    gridOptions() {
      return {
        height: "auto",
        border: true, //边框
        round: true, //圆角边框
        stripe: true,
        headerAlign: "center",
        keepSource: true,
        align: "center",
        loading: false,
        rowConfig: {
          isCurrent: true,
          isHover: true,
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
          },
        },

        columns: this.tableHeaderList,
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
        { type: "gradientDarkGreen", name: "重置" },
        { type: "gradientGreen", name: "自动换行" },
      ];
    },
    defaultRightButtons() {
      return [
        { type: "gradientBlue", name: "推送至年度风险" },
        { type: "gradientBlue", name: "发送短信" },
      ];
    },
  },
  mounted() {},
  methods: {
    resetType(type) {
      this.searchParams.sdt = "";
      this.searchParams.edt = "";
      this.buttonType = type;
      this.loadTableData();
    },
    reloadTableData() {
      this.$refs.xTable.commitProxy("query"); //不重置分页
    },
    loadTableData() {
      this.$refs.xTable.commitProxy("reload"); //重置分页
    },
    loadTableApi(page, sorts, filters) {
      let obj = JSON.parse(JSON.stringify(this.searchParams));
      if (!this.searchParams.sdt && !this.searchParams.edt) {
        if (this.buttonType == "今日执行") {
          obj.sdt = dayjs().format("YYYY-MM-DD");
          obj.edt = dayjs().format("YYYY-MM-DD");
        } else if (this.buttonType == "本周执行") {
          obj.sdt = dayjs().startOf("week").format("YYYY-MM-DD");
          obj.edt = dayjs().endOf("week").format("YYYY-MM-DD");
        } else {
          obj.sdt = dayjs().startOf("month").format("YYYY-MM-DD");
          obj.edt = dayjs().endOf("month").format("YYYY-MM-DD");
        }
      }
      let params = this.getRealParams(obj, page, sorts, filters);
      return new Promise((resolve) => {
        fxyjApi.loadTableDataService(params).then((res) => {
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
    resetParams() {
      this.searchParams.keyword = "";
      this.searchParams.sortOrder = "";
      this.searchParams.sortColumn = "";
      this.searchParams.sdt = "";
      this.searchParams.edt = "";
      this.$nextTick(function () {
        this.loadTableData();
      });
    },

    doOpenDetail(row) {
      this.$vxeModal.show(
        dynamic_form_plus,
        {
          tableHeaderList: this.tableDetailHeaderList,
          validateRules: this.editRules,
          labelWidth: "130px",
          showFooter: false,
          row: row,
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
    doViewLog(row) {
      let src = "";
      if (
        process.env.NODE_ENV === "production" &&
        !window.origin.includes("192.168.1")
      ) {
        src = `${window.YCJX_WEBSITE_URL}/master/window.html#/spa/ycjx-snjh/public-visit?&flag=3&type=dd&id=${row.jxdid}&parentNodeName=地调调度台`;
      } else {
        src = `http://192.168.1.194:10015/master/window.html#/spa/ycjx-snjh/public-visit?&flag=3&type=dd&id=${row.jxdid}&parentNodeName=地调调度台`;
      }
      window.open(src);
    },
    doSendMessage(row) {
      if (row && row.id) {
        this.doRealSendMessage([row]);
      } else {
        const rows = this.getCheckboxRecords();
        if (rows && rows.length > 0) {
          this.doRealSendMessage(rows);
        }
      }
    },
    doRealSendMessage(rows) {
      fxyjApi.doSendMessageService({ data: rows }).then((res) => {
        this.$message.success(res.data);
      });
    },
    doPush() {
      const rows = this.getCheckboxRecords();
      if (rows && rows.length > 0) {
        fxyjApi.initZxzToNFxyjService({ data: rows }).then((res) => {
          this.$alert(res.data.replaceAll("\n", "<br />"), "提示信息", {
            showConfirmButton: false,
            dangerouslyUseHTMLString: true,
            // modal: false
          });
        });
      }
    },
    beforeEditMethod({ row, column }) {
      return true;
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
