<template>
  <div class="page_content">
    <header>
      <section>
        <div class="header-item">
          模块类型：
          <el-select
            v-model="searchParams.mklx"
            placeholder="请选择"
            :clearable="false"
            filterable
          >
            <el-option
              v-for="item in $store.state.selectOptionsObj.jdpz"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            >
            </el-option>
          </el-select>
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
          <el-button type="gradientBlue" @click="doAddMk">新增模块</el-button>
          <el-button type="gradientRed" @click="doDelMk">删除模块</el-button>
        </div>
      </section>
    </header>
    <article>
      <vxe-grid v-bind="gridOptions" ref="xTable"></vxe-grid>
    </article>
  </div>
</template>

<script>
import table_mixin from "@/mixin/table_mixin.jsx";
import jdpzApi from "@/api/xzs/jdpz-api.js";
import store from "@/store/index.js";
import view_prompt from "@/views/vxeModal/view_prompt.vue";
import gztApi from "@/api/gzt-api.js";

export default {
  name: "jdpz",
  mixins: [table_mixin],
  data() {
    return {
      time: ["", ""],
      total: 0,
      searchParams: {
        mklx: "",
        pageIndex: 0,
        pageSize: 999,
      },
      tableData: [],
      isAutoWrap: false,
      treeData: [],
    };
  },
  watch: {
    "searchParams.mklx": {
      handler(val) {
        if (val) {
          this.reloadTableData();
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
          width: 60,
          dragSort: true,
          fixed: "left",
        },
        {
          field: "mklx",
          title: "模块名称",
          minWidth: 120,
          // editRender: { name: "ElInput", props: { clearable: true } },
        },
        {
          field: "byValue",
          title: "模块路径",
          minWidth: 120,
          editRender: { name: "ElInput", props: { clearable: true } },
        },
        {
          field: "mc",
          title: "节点名称",
          minWidth: 120,
          editRender: { name: "ElInput", props: { clearable: true } },
        },

        {
          field: "url",
          title: "节点跳转路径",
          minWidth: 120,
          editRender: { name: "ElInput", props: { clearable: true } },
        },
      ];
    },
    editRules() {
      return {
        byValue: [{ required: true, message: "模块路径不能为空" }],
        mc: [{ required: true, message: "节点名称不能为空" }],
        url: [{ required: true, message: "跳转路径不能为空" }],
      };
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
          drag: true,
        },
        radioConfig: {
          highlight: true,
        },

        checkboxConfig: {
          highlight: true,
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
        proxyConfig: {
          autoLoad: false,
          seq: true,
          showResponseMsg: false, //不展示提示消息
          showActionMsg: false,
          sort: true,
          filter: true,
          ajax: {
            query: () => {
              return this.loadTableApi();
            },
            delete: ({ body }) => {
              return this.doDeleteApi(body.removeRecords);
            },
          },
        },
        editConfig: {
          trigger: "click",
          mode: "cell",
          showStatus: true,
          showIcon: true,
          beforeEditMethod: this.beforeEditMethod,
        },
        editRules: this.editRules,
        columns: this.tableHeaderList,
      };
    },

    defaultLeftButtons() {
      return [{ type: "gradientGreen", name: "查询" }];
    },
    defaultRightButtons() {
      return [
        { type: "gradientBlue", name: "新增" },
        { type: "gradientBlue", name: "保存" },
        { type: "gradientRed", name: "删除" },
      ];
    },
  },
  created() {
    // this.loadTreeData();
    this.resetMklx();
  },
  mounted() {},
  methods: {
    reloadTableData() {
      this.$refs.xTable.commitProxy("query"); //不重置分页
    },
    loadTableData() {
      this.$refs.xTable.commitProxy("reload"); //重置分页
    },
    loadTableApi() {
      return new Promise((resolve, reject) => {
        jdpzApi.loadTableDataService(this.searchParams).then((res) => {
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
    doAdd() {
      let record = {
        mklx: this.searchParams.mklx,
        byValue: "",
      };
      this.$refs.xTable.insertAt(record, -1).then((row) => {
        this.$refs.xTable.setEditRow(row);
      });
    },
    doSave() {
      let data = this.$refs.xTable.getTableData().tableData;
      jdpzApi.saveTableDataService({ data }).then((res) => {
        this.$message.success(res.data);
        this.reloadTableData();
      });
    },

    doDelete() {
      const rows = this.getCheckboxRecords();
      if (rows && rows.length > 0) {
        this.$confirm(`确认删除勾选的${rows.length}条数据吗？`, "提示", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning",
        }).then(() => {
          this.$refs.xTable.commitProxy("delete");
        });
      }
    },
    doDeleteApi(data) {
      return new Promise((resolve, reject) => {
        let ids = data.map((i) => i.id).join(",");
        jdpzApi
          .doDelTableDataService({ ids })
          .then((res) => {
            this.$message.success(res.data);
            resolve();
          })
          .catch(() => {
            reject();
          });
      });
    },
    async resetMklx() {
      await store.dispatch("getSelectOptions");
      if (this.$store.state.selectOptionsObj.jdpz.length > 0) {
        this.searchParams.mklx =
          this.$store.state.selectOptionsObj.jdpz[0].value;
      }
    },
    beforeEditMethod({ row, column }) {
      return true;
    },

    doAddMk() {
      this.$vxeModal.show(
        view_prompt,
        {
          title: "请输入新增模块类型",
        },
        {
          width: 420,
          title: "模块类型",
          height: 260,
        },
        {
          returnData: (res) => {
            jdpzApi.saveMkDataService({ mklx: res }).then((res) => {
              this.$message.success(res.data);
              this.resetMklx();
            });
          },
        },
      );
    },
    doDelMk() {
      this.$confirm(`确认删除${this.searchParams.mklx}模块吗？`, "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      }).then(() => {
        jdpzApi
          .doDelMkDataService({ mklx: this.searchParams.mklx })
          .then((res) => {
            this.$message.success(res.data);
            this.resetMklx();
          });
      });
    },
    loadTreeData() {
      gztApi.loadTreeDataService({}).then((res) => {
        this.treeData = res.data;
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
