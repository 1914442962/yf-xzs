<template>
  <div class="page_content">
    <header>
      <section>
        <div class="header-item">
          年：
          <el-date-picker
            v-model="searchParams.year"
            type="year"
            format="YYYY"
            value-format="YYYY"
          >
          </el-date-picker>
        </div>
        <!--        <div class="header-item">-->
        <!--          <el-input placeholder="请输入关键字" v-model="searchParams.keyword" @keydown.enter="loadTableData" :title="searchParams.keyword" clearable>-->
        <!--          </el-input>-->
        <!--        </div>-->
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
        <!--        <template #jump="{currentPage, total, pageCount}">-->
        <!--          <span class="vxe-pager&#45;&#45;jump"><span class="vxe-pager&#45;&#45;goto-text">前往</span><vxe-number-input class="vxe-pager&#45;&#45;goto" v-model="this.pagerConfig.currentPage" align="center" type="integer" :max="pageCount" :min="1" :controls="false" @keydown="(evt)=>jumpKeydownEvent(evt,total)"></vxe-number-input><span class="vxe-pager&#45;&#45;classifier-text">页</span></span>-->
        <!--        </template>-->
      </vxe-grid>
    </article>
  </div>
</template>

<script>
import table_mixin from "@/mixin/table_mixin.jsx";
import dayjs from "dayjs";
import xwbApi from "@/api/xwb-api.js";
import { VxeUI } from "vxe-table";
import view_simple_table from "@/views/vxeModal/view_simple_table.vue";
import commonApi from "@/api/common-api.js";
import { QuestionFilled } from "@element-plus/icons-vue";

export default {
  name: "xwb_readonly",
  components: { QuestionFilled },
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
      },
      tableData: [],
      isAutoWrap: false,
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
    tableHeaderList() {
      return [
        {
          type: "seq",
          width: 60,
          fixed: "left",
        },
        {
          field: "bdzmc",
          title: "变电站名称",
          width: 120,
        },
        {
          field: "bdzdydj",
          title: "变电站电压等级（kV）",
          width: 120,
          sortable: true,
        },
        {
          field: "llkg",
          title: "拉路开关",
          minWidth: 200,
          filters: [{ data: "" }],
          filterRender: { name: "VxeInput" },
        },
        {
          field: "kgdydj",
          title: "开关电压等级（kV）",
          width: 120,
          sortable: true,
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
            content: "表格值",
          },
        },
        {
          field: "ygFhz",
          title: "有功负荷值（万千瓦）",
          width: 120,
          sortable: true,
          headerAlign: "center",
          align: "right",
          formatter: ["formatterNumber", 2],
          titleSuffix: {
            content: "D5000最大采样值",
          },
        },
        {
          field: "ssdwfq",
          title: "所属电网分区",
          width: 130,
          filters: this.$store.state.selectOptionsObj.fq,
        },

        {
          field: "zyfh",
          title: "主要负荷【用户名称】",
          minWidth: 180,
          filters: [{ data: "" }],
          filterRender: { name: "VxeInput" },
        },
        {
          field: "ssxzqy",
          title: "所属行政区域",
          width: 120,
          filters: this.$store.state.selectOptionsObj.xzqy,
        },
        {
          field: "sz220bdz",
          title: "所在220千伏变电站",
          width: 110,
        },
        {
          field: "fhxz",
          title: "负荷性质",
          width: 140,
        },
        {
          field: "fd",
          title: "分档",
          width: 100,
        },
        {
          field: "bz",
          title: "备注",
          minWidth: 180,
          headerAlign: "center",
          align: "left",
        },
        {
          title: "日志",
          width: 100,
          fixed: "right",
          slots: { default: "action" },
        },
      ];
    },
    gridOptions() {
      return {
        height: "auto",
        border: true, //边框
        round: true, //圆角边框
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
        pagerConfig: {
          ...this.pagerConfig,
          pageSize: 100,
          pageSizes: [20, 50, 100, 200, 300, 500],
        },
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
          return null;
        },
        columns: this.tableHeaderList,
        // spanMethod({ row, rowIndex, column, visibleData }) {
        //   const spanFields = ["bdzmc", "bdzdydj"];
        //   const cellValue = row.bdzmc;
        //   if (cellValue && spanFields.includes(column.field)) {
        //     const prevRow = visibleData[rowIndex - 1];
        //     let nextRow = visibleData[rowIndex + 1];
        //     if (prevRow && prevRow.bdzmc === cellValue) {
        //       return { rowspan: 0, colspan: 0 };
        //     } else {
        //       let countRowspan = 1;
        //       while (nextRow && nextRow.bdzmc === cellValue) {
        //         nextRow = visibleData[++countRowspan + rowIndex];
        //       }
        //       if (countRowspan > 1) {
        //         return { rowspan: countRowspan, colspan: 1 };
        //       }
        //     }
        //   }
        // },
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
      return [];
    },
  },
  mounted() {},
  methods: {
    jumpKeydownEvent(params) {
      if (
        VxeUI.globalEvents.hasKey(params.$event, VxeUI.GLOBAL_EVENT_KEYS.ENTER)
      ) {
        this.$refs.xTable.setCurrentPageByEvent(params.$event, 10);
      }
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
      };
      this.$nextTick(function () {
        this.loadTableData();
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
