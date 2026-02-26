<template>
  <div class="page_content">
    <header>
      <section>
        <DateRangerPickerComponent
          :start-time="searchParams.sdt"
          :end-time="searchParams.edt"
          v-model:updateStartTime="searchParams.sdt"
          v-model:updateEndTime="searchParams.edt"
        ></DateRangerPickerComponent>
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
        @menu-click="(e) => menuClickEvent(e, '年度方式')"
      >
      </vxe-grid>
    </article>
  </div>
</template>

<script>
import table_mixin from "@/mixin/table_mixin.jsx";
import ndfsApi from "@/api/ndfs-api.js";
import dayjs from "dayjs";
import commonApi from "@/api/common-api.js";
import DateRangerPickerComponent from "@/components/DateRangerPickerComponent.vue";

export default {
  name: "dmxe",
  mixins: [table_mixin],
  components: { DateRangerPickerComponent },
  data() {
    return {
      total: 0,
      searchParams: {
        sdt: "",
        edt: "",
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
        // {
        //   type: 'checkbox',
        //   width: 50,
        // },
        {
          type: "seq",
          width: 60,
        },
        {
          field: "dateTime",
          title: "日期",
          width: 120,
          sortable: true,
        },
        {
          field: "mc",
          title: "潮流名称",
          minWidth: 120,
        },
        {
          field: "xe",
          title: "稳定限额（万千瓦）",
          width: 200,
          sortable: true,
          headerAlign: "center",
          align: "right",
        },
        {
          field: "zdz",
          title: "最大潮流值（万千瓦）",
          width: 200,
          sortable: true,
          headerAlign: "center",
          align: "right",
        },
        {
          field: "xeb",
          title: "最大越限率（%）",
          width: 200,
          sortable: true,
          headerAlign: "center",
          align: "right",
        },
        {
          field: "sj",
          title: "最大越限率时刻",
          width: 200,
          sortable: true,
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
          },
        },
        exportConfig: {
          // remote: true,
          filename: "断面限额表格",
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
      };
    },

    defaultLeftButtons() {
      return [
        { type: "gradientGreen", name: "查询" },
        { type: "gradientDarkGreen", name: "重置" },
        // {type: 'gradientGreen', name: '导出当前页'},
        // {type: 'gradientGreen', name: '导出全部'},
      ];
    },
    defaultRightButtons() {
      return [];
    },
  },
  mounted() {
    this.searchParams.sdt = dayjs().startOf("month").format("YYYY-MM-DD");
    this.searchParams.edt = dayjs().endOf("month").format("YYYY-MM-DD");
  },
  methods: {
    reloadTableData() {
      this.$refs.xTable.commitProxy("query"); //不重置分页
    },
    loadTableData() {
      // this.searchParams.sortOrder = "";
      // this.searchParams.sortColumn = "";
      this.$refs.xTable.commitProxy("reload"); //重置分页
    },
    loadTableApi(page, sorts, filters) {
      let params = this.getRealParams(this.searchParams, page, sorts, filters);
      return new Promise((resolve) => {
        ndfsApi.loadDmxeDataService(params).then((res) => {
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
    doExport(flag) {
      commonApi.exportFileService(
        "/ndfs/exportDmxe",
        this.searchParams,
        flag,
        this.pagerParam,
      );
    },

    resetParams() {
      this.searchParams.sdt = dayjs().startOf("month").format("YYYY-MM-DD");
      this.searchParams.edt = dayjs().endOf("month").format("YYYY-MM-DD");
      this.searchParams.sortOrder = "";
      this.searchParams.sortColumn = "";
      this.$nextTick(function () {
        this.loadTableData();
      });
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
