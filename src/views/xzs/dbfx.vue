<template>
  <div class="page_content">
    <header>
      <section>
        <div class="header-item">
          截止时间：
          <el-date-picker
            v-model="time"
            type="daterange"
            format="YYYY-MM-DD"
            value-format="YYYY-MM-DD"
            range-separator="-"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
          >
          </el-date-picker>
        </div>
        <div class="header-item">
          状态：
          <el-select
            v-model="searchParams.stateList"
            placeholder="请选择"
            clearable
            filterable
            multiple
            collapse-tags
            collapse-tags-tooltip
            tag-type=""
          >
            <el-option
              v-for="item in stateOptions"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            >
            </el-option>
          </el-select>
        </div>
        <div class="header-item">
          <div class="header-item">
            <el-button type="gradientGreen" @click="loadPageData"
              >查询</el-button
            >
            <el-button type="gradientGreen" @click="doExport"
              >导出表格</el-button
            >
          </div>
        </div>
      </section>
      <section></section>
    </header>
    <article>
      <section>
        <echarts-component :data-obj="echartsObj"></echarts-component>
      </section>
      <section>
        <vxe-grid v-bind="gridOptions" ref="xTable">
          <template #toolbarButtons>
            <el-button-group>
              <el-button
                v-for="(item, index) in tabList"
                :key="'tabList' + index"
                @click="searchParams.type = item.name"
                :type="searchParams.type === item.name ? 'gradientBlue' : ''"
                >{{ item.name + "（" + item.total + "）" }}</el-button
              >
            </el-button-group>
          </template>
        </vxe-grid>
      </section>
    </article>
  </div>
</template>
<script>
import EchartsComponent from "@/components/EchartsComponent.vue";
import dayjs from "dayjs";
import dbfxApi from "@/api/xzs/dbfx-api.js";
import commonApi from "@/api/common-api.js";
import table_mixin from "@/mixin/table_mixin.jsx";

export default {
  name: "dbfx",
  components: { EchartsComponent },
  mixins: [table_mixin],
  data() {
    return {
      time: ["", ""],
      total: 0,
      sdt: "",
      edt: "",
      tabList: [],
      stateOptions: [
        {
          label: "未处理",
          value: "未处理",
        },
        {
          label: "已读",
          value: "已读",
        },
        {
          label: "已处理",
          value: "已处理",
        },
      ],
      searchParams: {
        stateList: [], //未处理   已处理   不传是全查
        type: "",
        sortOrder: "",
        sortColumn: "",
      },
      echartsObj: {
        legend: {},
        tooltip: {
          trigger: "axis",
        },
        xAxis: {
          type: "category",
          data: [],
        },
        yAxis: {
          type: "value",
        },
        series: [],
      },
    };
  },
  watch: {
    "searchParams.type": {
      handler(val) {
        if (val) {
          this.loadTableData();
        }
      },
      immediate: false,
    },
    time: {
      handler(val) {
        if (val) {
          this.sdt = val[0];
          this.edt = val[1];
        } else {
          this.sdt = "";
          this.edt = "";
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
          field: "MOULD_NAME",
          title: "模块",
          width: 150,
        },
        {
          field: "PAR_MODULE",
          title: "名称",
          width: 150,
        },

        {
          field: "DBNR",
          title: "详情",
          minWidth: 120,
          headerAlign: "center",
          align: "left",
        },
        {
          field: "JZSJ",
          title: "截止时间",
          width: 150,
          sortable: true,
        },
        {
          field: "DQZT",
          title: "状态",
          width: 150,
        },
      ];
    },
    gridOptions() {
      return {
        height: "auto",
        keepSource: true,
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
        toolbarConfig: {
          slots: {
            buttons: "toolbarButtons",
          },
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
        showOverflow: this.isAutoWrap,
        headerCellClassName: "row-class",
        pagerConfig: this.pagerConfig,
        proxyConfig: {
          seq: true,
          showResponseMsg: false, //不展示提示消息
          showActionMsg: false,
          sort: true,
          filter: true,
          autoLoad: false,
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
          filename: "测试表格",
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
      };
    },

    defaultLeftButtons() {
      return [
        { type: "gradientGreen", name: "查询" },
        { type: "gradientGreen", name: "导出表格" },
      ];
    },
  },
  mounted() {
    this.time = [
      dayjs().startOf("month").format("YYYY-MM-DD"),
      dayjs().endOf("month").format("YYYY-MM-DD"),
    ];
    this.sdt = dayjs().startOf("month").format("YYYY-MM-DD");
    this.edt = dayjs().endOf("month").format("YYYY-MM-DD");
    this.loadPageData();
  },
  methods: {
    getTabList() {
      dbfxApi
        .loadTabDataService({
          sdt: this.sdt,
          edt: this.edt,
          stateList: this.searchParams.stateList,
        })
        .then((res) => {
          this.tabList = res.data;
          if (this.tabList.length > 0) {
            if (!this.searchParams.type) {
              this.searchParams.type = this.tabList[0].name;
            } else {
              this.loadTableData();
            }
          }
        });
    },
    loadPageData() {
      this.getTabList();
      this.getEchartsData();
    },
    reloadTableData() {
      this.$refs.xTable.commitProxy("query"); //不重置分页
    },
    loadTableData() {
      this.$refs.xTable.commitProxy("reload"); //重置分页
    },
    loadTableApi(page, sorts, filters) {
      let params = this.getRealParams(
        { sdt: this.sdt, edt: this.edt, ...this.searchParams },
        page,
        sorts,
        filters,
      );
      return new Promise((resolve) => {
        dbfxApi.loadTableDataService(params).then((res) => {
          if (page.pageSize === 100000) {
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
    getEchartsData() {
      dbfxApi
        .loadEchartsDataService({
          sdt: this.sdt,
          edt: this.edt,
          stateList: this.searchParams.stateList,
        })
        .then((res) => {
          this.echartsObj.xAxis.data = res.data.xAxisData;
          // res.data.series.forEach(item=>{
          //   item.label= {
          //     show: true,
          //     position: 'outside'
          //   }
          // })
          this.echartsObj.series = res.data.series;
        });
    },

    doExport(flag) {
      commonApi.exportFileService(
        "/first/exportDb",
        {
          ...this.searchParams,
          userName: this.$store.state.userInfo.sysUser.nickName,
          userId: this.$store.state.userInfo.sysUser.id,
        },
        flag,
        this.pagerParam,
      );
    },
  },
};
</script>
<style scoped lang="scss">
.page_content {
  article {
    height: calc(100% - 48px);
    section {
      height: 50%;
    }
  }
}
</style>
