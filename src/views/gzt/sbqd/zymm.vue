<template>
  <div class="page_content">
    <header>
      <section>
        <div class="header-item">
          <el-input
            placeholder="请输入变电站名称"
            v-model="searchParams.bdzmc"
            @keydown.enter="loadTableData"
            :title="searchParams.bdzmc"
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
          <el-button type="gradientGreen" @click="doSync">同步</el-button>
        </div>
      </section>
    </header>
    <article>
      <vxe-grid
        v-bind="gridOptions"
        ref="xTable"
        @menu-click="(e) => menuClickEvent(e, '设备启动')"
      >
      </vxe-grid>
    </article>
  </div>
</template>

<script>
import table_mixin from "@/mixin/table_mixin.jsx";
import exampleApi from "@/api/table-example-api.js";
import zymmApi from "@/api/sbqd/zymm-api.js";

export default {
  name: "grid_example",
  mixins: [table_mixin],
  components: {},
  data() {
    return {
      time: ["", ""],
      total: 0,
      searchParams: {
        bdzmc: "",
      },
      tableData: [],
      isAutoWrap: false,
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
          field: "bdz",
          title: "变电站",
          width: 200,
        },
        {
          field: "d5000Sbmc",
          title: "d5000在运",
          minWidth: 250,
          headerAlign: "center",
          align: "left",
        },
        {
          field: "lsSbmc",
          title: "历史命名文件内容",
          minWidth: 250,
          headerAlign: "center",
          align: "left",
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
        menuConfig: {
          body: {
            options: [[{ code: "collect", name: "标记重点" }]],
          },
        },
        columns: this.tableHeaderList,
      };
    },

    defaultLeftButtons() {
      return [{ type: "gradientGreen", name: "查询" }];
    },
    defaultRightButtons() {
      return [];
    },
  },
  mounted() {},
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
        zymmApi.loadTableDataService(params).then((res) => {
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

    doSync() {
      zymmApi.doSyncTableDataService().then(() => {
        this.loadTableData();
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
      this.searchParams.bdzmc = "";
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
