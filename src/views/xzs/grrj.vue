<template>
  <div class="page_content">
    <header>
      <section>
        <div class="header-item">
          <el-button-group>
            <el-button
              v-for="(item, index) in tabList"
              :key="'tabList' + index"
              @click="searchParams.type = item.name"
              :type="searchParams.type == item.name ? 'gradientBlue' : ''"
              >{{ item.name + "（" + item.total + "）" }}</el-button
            >
          </el-button-group>
        </div>
      </section>
      <section></section>
    </header>
    <article>
      <vxe-grid v-bind="gridOptions" ref="xTable">
        <template #action="{ row }">
          <vxe-button mode="text" status="primary" @click="doViewLog(row)"
            >详情</vxe-button
          >
          <vxe-button mode="text" status="error" @click="doDelete(row)"
            >移除</vxe-button
          >
        </template>
      </vxe-grid>
    </article>
  </div>
</template>

<script>
import table_mixin from "@/mixin/table_mixin.jsx";
import grrjApi from "@/api/xzs/grrj-api.js";
import view_simple_table from "@/views/vxeModal/view_simple_table.vue";
const channel = new BroadcastChannel("YFZLQD-channel");
export default {
  name: "db",
  mixins: [table_mixin],
  components: {},
  data() {
    return {
      total: 0,
      searchParams: {
        type: "",
        // keyword: '',
        sortOrder: "",
        sortColumn: "",
      },
      tabList: [],
      isAutoWrap: false,
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
          field: "userName",
          title: "标注人",
          width: 180,
        },
        {
          field: "createTime",
          title: "标注时间",
          width: 180,
          sortable: true,
        },

        {
          field: "yy",
          title: "标注原因",
          minWidth: 120,
          headerAlign: "center",
          align: "left",
        },
        {
          title: "操作",
          width: 150,
          fixed: "right",
          slots: { default: "action" },
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
          autoLoad: false,
          ajax: {
            query: ({ page, sorts, filters }) => {
              return this.loadTableApi(page, sorts, filters);
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
  },
  mounted() {
    this.getTabList();
    channel.onmessage = (event) => {
      if (event.data.type === "refresh_grrj") this.getTabList();
    };
  },
  unmounted() {
    channel.onmessage = null;
    channel.close();
  },
  methods: {
    getTabList(flag) {
      grrjApi.loadTabDataService({}).then((res) => {
        this.tabList = res.data;
        if (flag) {
          if (this.tabList.length > 0) {
            this.loadTableData();
          }
        } else {
          if (this.tabList.length > 0) {
            this.searchParams.type = this.tabList[0].name;
          }
        }
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
        grrjApi.loadTableDataService(params).then((res) => {
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
      this.$vxeModal.show(
        view_simple_table,
        {
          tableHeaderList: JSON.parse(row.headerList),
          tableData: JSON.parse(row.data),
        },
        {
          width: window.innerWidth - 100,
          title: "详情",
          height: 400,
        },
        {
          // close: () => {
          //   this.loadTableData();
          // },
        },
      );
    },
    doDelete(row) {
      this.$confirm(`确认移除当前数据吗？`, "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      }).then(() => {
        grrjApi.deleteDataService({ ids: row.id }).then((res) => {
          this.$message.success(res.data);
          this.getTabList(true);
        });
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
