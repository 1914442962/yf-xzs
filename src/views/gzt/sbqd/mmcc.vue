<template>
  <div class="page_content">
    <header>
      <section>
        <div class="header-item">
          电压等级：
          <el-select
            v-model="searchParams.dydj"
            placeholder="请选择"
            filterable
            ref="dydjRef"
          >
            <el-option
              v-for="item in dydjOptions"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            >
            </el-option>
          </el-select>
        </div>
        <div class="header-item">
          设备类型：
          <el-select
            v-model="searchParams.sblx"
            placeholder="请选择"
            filterable
          >
            <el-option
              v-for="item in this.$store.state.staticOptionsObj.sblx"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            >
            </el-option>
          </el-select>
        </div>
        <div class="header-item" v-if="searchParams.sblx != '厂站'">
          厂站名称：
          <el-select
            v-model="searchParams.czmcId"
            placeholder="请选择"
            filterable
            ref="czRef"
          >
            <el-option
              v-for="item in this.$store.state.selectOptionsObj.cz"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            >
            </el-option>
          </el-select>
        </div>
        <div class="header-item">
          <el-input
            placeholder="请输入校核名"
            v-model="searchParams.jhmc"
            :title="searchParams.jhmc"
            clearable
          >
          </el-input>
        </div>
        <div class="header-item">
          <el-button type="gradientGreen" @click="loadTableData"
            >核名</el-button
          >
        </div>
      </section>
      <section></section>
    </header>
    <article>
      <vxe-grid
        v-bind="gridOptions"
        ref="xTable"
        @menu-click="(e) => menuClickEvent(e, '设备启动')"
      >
        <template #top>
          <div>
            以D5000设备模型库为查询库，您查询的{{ dydj }}kV{{ searchParams.czmc
            }}{{ searchParams.jhmc }}的重名情况如下：
          </div>
        </template>
      </vxe-grid>
    </article>
  </div>
</template>

<script>
import table_mixin from "@/mixin/table_mixin.jsx";
import mmccApi from "@/api/sbqd/mmcc-api.js";

export default {
  name: "mmcc",
  mixins: [table_mixin],
  components: {},
  data() {
    return {
      time: ["", ""],
      total: 0,
      dydj: "",
      searchParams: {
        czmcId: "",
        czmc: "",
        jhmc: "",
        dydj: "",
        sblx: "",
      },
      tableData: [],
      isAutoWrap: false,
      dydjOptions: [
        {
          label: "500",
          value: "112871465677750274",
        },
        {
          label: "220",
          value: "112871465677750279",
        },
        {
          label: "110",
          value: "112871465677750280",
        },
        {
          label: "35",
          value: "112871465677750275",
        },
        {
          label: "20",
          value: "112871465677750273",
        },
        {
          label: "10",
          value: "112871465677750278",
        },
      ],
    };
  },
  watch: {
    "searchParams.sblx": {
      handler(val) {
        if (val && val == "厂站") {
          this.searchParams.czmcId = "";
        }
      },
      immediate: false,
    },
    "searchParams.dydj": {
      handler(val) {
        if (val) {
          this.$nextTick(() => {
            this.dydj = this.$refs.dydjRef.selectedLabel;
          });
        } else {
          this.dydj = "";
        }
      },
      immediate: false,
    },
    "searchParams.czmcId": {
      handler(val) {
        if (val) {
          this.$nextTick(() => {
            this.searchParams.czmc = this.$refs.czRef.selectedLabel;
          });
        } else {
          this.searchParams.czmc = "";
        }
      },
      immediate: false,
    },
  },
  computed: {
    tableHeaderList() {
      if (this.searchParams.sblx == "厂站") {
        return [
          {
            type: "seq",
            width: 60,
          },
          {
            field: "bvId",
            title: "电压等级（kV）",
            width: 200,
          },
          {
            field: "name",
            title: "厂站",
            minWidth: 200,
          },
          {
            field: "sjly",
            title: "数据来源",
            width: 110,
          },
        ];
      } else {
        return [
          {
            type: "seq",
            width: 60,
          },
          {
            field: "bvId",
            title: "电压等级（kV）",
            width: 200,
          },
          {
            field: "stId",
            title: "厂站",
            width: 200,
          },
          {
            field: "name",
            title: "设备名称",
            minWidth: 120,
          },
          {
            field: "sjly",
            title: "数据来源",
            width: 110,
          },
        ];
      }
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
        // pagerConfig: this.pagerConfig,
        proxyConfig: {
          seq: true,
          showResponseMsg: false, //不展示提示消息
          showActionMsg: false,
          sort: true,
          filter: true,
          autoLoad: false,
          ajax: {
            query: () => {
              return this.loadTableApi();
            },
          },
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
      return [{ type: "gradientGreen", name: "核名" }];
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
      // if(!this.searchParams.dydj){
      //   this.$message.warning("请先选择电压等级");
      //   return
      // }
      // if(!this.searchParams.sblx){
      //   this.$message.warning("请先选择设备类型");
      //   return
      // }
      if (!this.searchParams.jhmc) {
        this.$message.warning("请先输入校核名");
        return;
      }
      // if(this.searchParams.sblx !== '厂站'){
      //   if(!this.searchParams.czmcId){
      //     this.$message.warning("请先选择厂站");
      //     return
      //   }
      // }
      this.$refs.xTable.commitProxy("reload"); //重置分页
    },
    loadTableApi() {
      return new Promise((resolve) => {
        mmccApi.loadTableDataService(this.searchParams).then((res) => {
          resolve(res.data);
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
      this.searchParams.dydj = "";
      this.searchParams.jhmc = "";
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
