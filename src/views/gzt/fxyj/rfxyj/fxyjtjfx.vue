<template>
  <div class="page_content">
    <header style="padding-bottom: 0">
      <el-button-group>
        <el-button
          :type="searchParams.lx === '五级风险' ? 'gradientBlue' : ''"
          @click="searchParams.lx = '五级风险'"
          >五级风险</el-button
        >
        <el-button
          :type="searchParams.lx === '六级风险' ? 'gradientBlue' : ''"
          @click="searchParams.lx = '六级风险'"
          >六级风险</el-button
        >
      </el-button-group>
    </header>
    <header>
      <section>
        <div class="header-item">
          月份范围：
          <el-date-picker
            v-model="time"
            type="monthrange"
            format="YYYY-MM"
            value-format="YYYY-MM"
            range-separator="-"
            start-placeholder="开始月份"
            end-placeholder="结束月份"
          >
          </el-date-picker>
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
      <vxe-grid v-bind="gridOptions" ref="xTable">
        <template #header_sdwj="{ column }">
          <div class="header_div">
            <div>省调发布</div>
            <div>五级风险（项）</div>
            <div style="color: red">（仅220kV）</div>
          </div>
        </template>
        <template #header_ddwj="{ column }">
          <div class="header_div">
            <div>地市自己发布</div>
            <div>五级风险（项）</div>
            <div style="color: red">（不包含落实省调风险）</div>
          </div>
        </template>
        <template #header_ddlj="{ column }">
          <div class="header_div">
            <div>地市自己发布</div>
            <div>六级风险（项）</div>
            <div style="color: red">（不包含落实省调风险）</div>
          </div>
        </template>
      </vxe-grid>
    </article>
  </div>
</template>

<script>
import table_mixin from "@/mixin/table_mixin.jsx";
import exampleApi from "@/api/table-example-api.js";
import fxyjtjfx from "@/api/fxyj/fxyjtjfx-api.js";
import dayjs from "dayjs";

export default {
  name: "fxyjtjfx",
  mixins: [table_mixin],
  components: {},
  data() {
    return {
      time: ["", ""],
      total: 0,
      searchParams: {
        keyword: "",
        lx: "五级风险",
        sdt: "",
        edt: "",
        sortOrder: "",
        sortColumn: "",
      },
      tableData: [],
      footerData: [],
      isAutoWrap: false,
      numberColumn: [
        "sdfb5j220",
        "sdwtfb5j",
        "dszjfb5j",
        "fxdj5j220",
        "fxdj5j110",
        "fxdj5jN4",
        "fxdj5jN10",
        "dsfb6j",
        "dszjfb6j",
        "fxdj6j220",
        "fxdj6j110",
        "fxdj6jN4",
        "fxdj6jN10",
      ],
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
        this.loadTableData();
      },
      immediate: false,
    },
  },
  computed: {
    tableHeaderList() {
      if (this.searchParams.lx == "五级风险") {
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
            field: "xgdd",
            title: "相关地调",
            width: 100,
          },
          {
            field: "sj",
            title: "时间",
            width: 120,
            sortable: true,
          },
          {
            field: "fxfblx",
            title: "风险发布类型",
            width: 120,
          },
          {
            field: "sdfb5j220",
            title: "省调发布\n五级风险（项）\n（仅220kV）",
            width: 120,
            // sortable: true,
            headerAlign: "center",
            align: "right",
            formatter: ["formatterNumber", 0],
            slots: { header: "header_sdwj" },
          },
          {
            field: "sdwtfb5j",
            title: "省调委托发布\n五级风险（项）",
            width: 120,
            headerAlign: "center",
            align: "right",
            formatter: ["formatterNumber", 0],
          },
          {
            field: "dszjfb5j",
            title: "地市自己发布\n五级风险（项）\n（不包含落实省调风险）",
            minWidth: 120,
            // sortable: true,
            headerAlign: "center",
            align: "right",
            formatter: ["formatterNumber", 0],
            slots: { header: "header_ddwj" },
          },
          {
            field: "fxdj5j220",
            title: "220kV\n五级风险（项）",
            width: 120,
            headerAlign: "center",
            align: "right",
            formatter: ["formatterNumber", 0],
          },
          {
            field: "fxdj5j110",
            title: "110kV\n五级风险（项）",
            width: 120,
            headerAlign: "center",
            align: "right",
            formatter: ["formatterNumber", 0],
          },
          {
            field: "fxdj5jN4",
            title: "N-1>4\n五级风险（项）",
            width: 120,
            headerAlign: "center",
            align: "right",
            formatter: ["formatterNumber", 0],
          },
          {
            field: "fxdj5jN10",
            title: "N-2>10\n五级风险（项）",
            width: 120,
            headerAlign: "center",
            align: "right",
            formatter: ["formatterNumber", 0],
          },
          {
            field: "dsfb6j",
            title: "地市发布\n六级风险",
            width: 120,
            headerAlign: "center",
            align: "right",
            formatter: ["formatterNumber", 0],
          },
          // {
          //   field: "sbr",
          //   title: "上报人",
          //   width: 100,
          // },
          // {
          //   field: "sbsj",
          //   title: "上报时间",
          //   width: 120,
          //   sortable: true,
          // },
        ];
      } else {
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
            field: "xgdd",
            title: "相关地调",
            width: 100,
          },
          {
            field: "sj",
            title: "时间",
            width: 120,
            sortable: true,
          },
          {
            field: "fxfblx",
            title: "风险发布类型",
            width: 120,
          },
          {
            field: "dszjfb6j",
            title: "地市自己发布\n六级风险（项）\n（不包含落实省调风险）",
            minWidth: 120,
            // sortable: true,
            headerAlign: "center",
            align: "right",
            formatter: ["formatterNumber", 0],
            slots: { header: "header_ddlj" },
          },
          {
            field: "fxdj6j220",
            title: "220kV\n六级风险（项）",
            minWidth: 120,
            headerAlign: "center",
            align: "right",
            formatter: ["formatterNumber", 0],
          },
          {
            field: "fxdj6j110",
            title: "110kV\n六级风险（项）",
            minWidth: 120,
            headerAlign: "center",
            align: "right",
            formatter: ["formatterNumber", 0],
          },
          {
            field: "fxdj6jN4",
            title: "N-1>4\n六级风险（项）",
            minWidth: 120,
            headerAlign: "center",
            align: "right",
            formatter: ["formatterNumber", 0],
          },
          {
            field: "fxdj6jN10",
            title: "N-2>10\n六级风险（项）",
            minWidth: 120,
            headerAlign: "center",
            align: "right",
            formatter: ["formatterNumber", 0],
          },
          // {
          //   field: "sbr",
          //   title: "上报人",
          //   width: 100,
          // },
          // {
          //   field: "sbsj",
          //   title: "上报时间",
          //   width: 120,
          //   sortable: true,
          // },
        ];
      }
    },
    gridOptions() {
      return {
        height: "auto",
        border: true, //边框
        round: true, //圆角边框
        headerAlign: "center",
        align: "center",
        loading: false,
        showFooter: true,
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
        data: this.tableData,
        columns: this.tableHeaderList,
        // footerData: this.footerData,
        footerMethod: this.footerMethod,
      };
    },

    defaultLeftButtons() {
      return [{ type: "gradientGreen", name: "查询" }];
    },
    defaultRightButtons() {
      return [];
    },
  },
  mounted() {
    this.time = [dayjs().format("YYYY-MM"), dayjs().format("YYYY-MM")];
  },
  methods: {
    loadTableData() {
      fxyjtjfx.loadTableDataService(this.searchParams).then((res) => {
        this.tableData = res.data;
      });
    },

    toggleWrap() {
      if (this.isAutoWrap) {
        this.isAutoWrap = false;
      } else {
        this.isAutoWrap = "tooltip";
      }
    },
    footerMethod({ columns, data }) {
      return [
        columns.map((column, index) => {
          if (index === 0) {
            return "合计";
          }
          if (this.numberColumn.includes(column.field)) {
            return this.sumMethod(data, column.field);
          }
          return "-";
        }),
      ];
    },
  },
};
</script>

<style scoped lang="scss">
.page_content {
  article {
    height: calc(100% - 88px);
  }
  .header_div {
    div {
      font-weight: bold;
    }
  }
}
</style>
