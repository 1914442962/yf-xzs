<template>
  <div class="page_content">
    <header>
      <section>
        <div class="header-item">
          年份：
          <el-date-picker
            v-model="searchParams.year"
            type="year"
            format="YYYY"
            value-format="YYYY"
          ></el-date-picker>
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

export default {
  name: "dwgm",
  mixins: [table_mixin],
  components: {},
  data() {
    return {
      total: 0,
      searchParams: {
        year: "",
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
          field: "lx",
          title: "类型",
          minWidth: 120,
        },
        {
          field: "voltage500",
          title: "500千伏",
          minWidth: 120,
          sortable: true,
          headerAlign: "center",
          align: "right",
          formatter: ["formatterNumber", 0],
        },
        {
          field: "voltage220",
          title: "220千伏",
          minWidth: 120,
          sortable: true,
          headerAlign: "center",
          align: "right",
          formatter: ["formatterNumber", 0],
        },
        {
          field: "voltage110",
          title: "110千伏",
          minWidth: 120,
          sortable: true,
          headerAlign: "center",
          align: "right",
          formatter: ["formatterNumber", 0],
        },
        {
          field: "voltage35",
          title: "35千伏",
          minWidth: 120,
          sortable: true,
          headerAlign: "center",
          align: "right",
          formatter: ["formatterNumber", 0],
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
        menuConfig: {
          body: {
            options: [[{ code: "collect", name: "标记重点" }]],
          },
        },
        exportConfig: {
          // remote: true,
          filename: "电网规模表格",
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
    this.searchParams.year = dayjs().format("YYYY");
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
        ndfsApi.loadDwgmDataService(params).then((res) => {
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
        "/ndfs/exportDwgm",
        this.searchParams,
        flag,
        this.pagerParam,
      );
    },
    resetParams() {
      this.searchParams.year = dayjs().format("YYYY");
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
