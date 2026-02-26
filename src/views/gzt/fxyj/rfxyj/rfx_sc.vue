<template>
  <div class="page_content">
    <header>
      <section>
        <div class="header-item">
          <el-input
            placeholder="请输入停电范围"
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
          <el-button type="gradientBlue" @click="doSubmit">提取</el-button>
        </div>
      </section>
    </header>
    <article>
      <vxe-grid v-bind="gridOptions" ref="xTable"> </vxe-grid>
    </article>
  </div>
</template>

<script>
import table_mixin from "@/mixin/table_mixin.jsx";
import exampleApi from "@/api/table-example-api.js";
import rfxApi from "@/api/fxyj/rfxyj-api.js";

export default {
  name: "rfx_sc",
  mixins: [table_mixin],
  components: {},
  data() {
    return {
      time: ["", ""],
      total: 0,
      searchParams: {
        keyword: "",
        sex: "",
        startTime: "",
        endTime: "",
        sortOrder: "",
        sortColumn: "",
      },
      tableData: [],
      isAutoWrap: false,
      sexOptions: [
        { label: "男", value: "男" },
        { label: "女", value: "女" },
      ],
    };
  },
  watch: {
    time: {
      handler(val) {
        if (val) {
          this.searchParams.startTime = val[0];
          this.searchParams.endTime = val[1];
        } else {
          this.searchParams.startTime = "";
          this.searchParams.endTime = "";
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
        },
        {
          type: "seq",
          width: 60,
        },
        {
          field: "dyaqsj",
          title: "主题",
          minWidth: 120,
        },
        {
          field: "fxdj",
          title: "风险等级",
          width: 120,
        },
        {
          field: "zybmyj",
          title: "事由",
          minWidth: 120,
        },

        {
          field: "kssj",
          title: "开始时间",
          width: 150,
          sortable: true,
          editRender: {
            name: "ElDatePicker",
            props: {
              type: "date",
              labelFormat: "YYYY-MM-DD",
              valueFormat: "YYYY-MM-DD",
              clearable: true,
            },
          },
        },
        {
          field: "jssj",
          title: "结束时间",
          width: 150,
          sortable: true,
          editRender: {
            name: "ElDatePicker",
            props: {
              type: "date",
              labelFormat: "YYYY-MM-DD",
              valueFormat: "YYYY-MM-DD",
              clearable: true,
            },
          },
        },

        {
          field: "tzsFxfx",
          title: "风险分析",
          minWidth: 120,
          headerAlign: "center",
          align: "left",
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
          field: "tzsYkcs",
          title: "预控措施",
          minWidth: 120,
          headerAlign: "center",
          align: "left",
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
          field: "tzsBh",
          title: "查看风险预警通知书",
          minWidth: 120,
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
        columns: this.tableHeaderList,
      };
    },

    defaultLeftButtons() {
      return [{ type: "gradientGreen", name: "查询" }];
    },
    defaultRightButtons() {
      return [{ type: "gradientRed", name: "提取" }];
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
        rfxApi
          .loadRfxTableDataService(params)
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
          })
          .catch(() => {
            let data = [];
            if (page.pageSize == 100000) {
              data = [
                { id: 1, name: "1", money: 1, sex: "男" },
                { id: 2, name: "2", money: 2, sex: "女" },
                { id: 3, name: "3", money: 3, sex: "男" },
                { id: 4, name: "4", money: 4, sex: "女" },
                { id: 5, name: "5", money: 5, sex: "男" },
                { id: 6, name: "222", money: 3220, sex: "女" },
                { id: 7, name: "122", money: 222, sex: "男" },
                { id: 8, name: "222", money: 322, sex: "女" },
                { id: 9, name: "122", money: 222, sex: "男" },
                { id: 10, name: "222", money: 322.0, sex: "女" },
                { id: 11, name: "11", money: 11, sex: "男" },
                { id: 12, name: "12", money: 12, sex: "女" },
              ];
              resolve(data);
            } else {
              data = [
                { id: 1, name: "1", money: 1, sex: "男" },
                { id: 2, name: "2", money: 2, sex: "女" },
                { id: 3, name: "3", money: 3, sex: "男" },
                { id: 4, name: "4", money: 4, sex: "女" },
                { id: 5, name: "5", money: 5, sex: "男" },
                { id: 6, name: "222", money: 3220, sex: "女" },
                { id: 7, name: "122", money: 222, sex: "男" },
                { id: 8, name: "222", money: 322, sex: "女" },
                { id: 9, name: "122", money: 222, sex: "男" },
                { id: 10, name: "222", money: 322.0, sex: "女" },
              ];
              this.total = data.length;
              resolve({
                result: data,
                page: {
                  total: 12,
                },
              });
            }
          });
      });
    },

    doSubmit() {
      const rows = this.getCheckboxRecords();
      if (rows && rows.length > 0) {
        this.$confirm(`确认提取勾选的${rows.length}条数据吗？`, "提示", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning",
        }).then(() => {
          this.$emit("doSubmit", rows);
        });
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
