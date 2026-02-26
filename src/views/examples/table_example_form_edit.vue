<template>
  <div class="page_content">
    <header>
      <section>
        <div class="header-item">
          日期范围：
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
          性别：
          <el-select
            v-model="searchParams.sex"
            placeholder="请选择"
            clearable
            filterable
          >
            <el-option
              v-for="item in sexOptions"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            >
            </el-option>
          </el-select>
        </div>
        <div class="header-item">
          <el-input
            placeholder="请输入关键字"
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
          <upload-http-component
            prop-upload-url=""
            @loadTableData="loadTableData(true)"
          ></upload-http-component>
        </div>
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
      <vxe-table
        ref="xTable"
        :data="tableData"
        align="center"
        keep-source
        height="100%"
        border
        :show-overflow="!isAutoWrap"
        :seq-config="{ startIndex: computedStartIndex }"
        :radio-config="{ highlight: true }"
        :checkbox-config="{ highlight: true }"
        :row-config="{ isCurrent: true, isHover: true }"
        :column-config="{ resizable: true }"
        header-cell-class-name="row-class"
        :cell-class-name="cellClassName"
        :sort-config="{ remote: true }"
        @sort-change="sortChangeEvent"
        @cell-dblclick="cellDbClick"
        :edit-config="{}"
        :export-config="{
          remote: true,
          filename: '测试表格',
          sheetName: 'sheet1',
          type: 'xlsx',
          mode: 'all',
          modes: ['current', 'selected', 'all'],
          exportMethod: exportMethod,
        }"
      >
        <vxe-table-column :width="50" type="checkbox"></vxe-table-column>
        <vxe-table-column
          :width="60"
          type="seq"
          title="序号"
        ></vxe-table-column>
        <vxe-table-column
          v-for="(item, index) in tableHeaderList"
          :field="item.field"
          :title="item.title"
          :key="index + 'tableHeaderList'"
          :formatter="item.formatter"
          :type="item.type"
          :width="item.width"
          :min-width="item.minWidth"
          :fixed="item.fixed"
          :align="item.align"
          :header-align="item.headerAlign ? item.headerAlign : 'center'"
          :sortable="item.sortable"
          :visible="item.visible"
          :edit-render="item.editRender"
        >
        </vxe-table-column>
      </vxe-table>
    </article>
    <footer>
      <vxe-pager
        :current-page.sync="searchParams.pageIndex"
        :page-size.sync="searchParams.pageSize"
        :total="total"
        :layouts="[
          'Home',
          'PrevPage',
          'JumpNumber',
          'NextPage',
          'End',
          'Sizes',
          'FullJump',
          'Total',
        ]"
        @page-change="handlePageChange"
      >
      </vxe-pager>
    </footer>
  </div>
</template>

<script>
import table_mixin from "@/mixin/table_mixin.jsx";
import exampleApi from "@/api/table-example-api.js";
import { downloadFileByBlob } from "@/utils/tools.js";
import UploadHttpComponent from "@/components/UploadHttpComponent.vue";
import dynamic_form from "@/views/vxeModal/dynamic_form.vue";
import { VxeUI } from "vxe-table";
export default {
  name: "table_example",
  mixins: [table_mixin],
  components: { UploadComponent },
  data() {
    return {
      total: 0,
      time: ["", ""],
      searchParams: {
        keyword: "",
        sex: "",
        startTime: "",
        endTime: "",
        pageIndex: 1,
        pageSize: 50,
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
    computedStartIndex() {
      return (this.searchParams.pageIndex - 1) * this.searchParams.pageSize;
    },
    validRules() {
      return {
        ddmm: [{ required: true, message: "电厂名称不能为空" }],
        yqygl: [{ required: true, message: "已签约容量（功率）不能为空" }],
        yqydrl: [{ required: true, message: "已签约容量（电能量）不能为空" }],
        yqykssj: [{ required: true, message: "签约开始时间不能为空" }],
        yqyjssj: [{ required: true, message: "签约结束时间不能为空" }],
      };
    },
    tableHeaderList() {
      return [
        {
          field: "name",
          title: "名字",
          minWidth: 120,
          editRender: { name: "ElInput", props: { type: "text" } },
        },
        {
          field: "sex",
          title: "性别",
          width: 100,
          sortable: true,
          editRender: {
            name: "ElSelect",
            options: this.sexOptions,
            props: { multiple: true, clearable: true },
          },
        },
        {
          field: "money",
          title: "金钱（元）",
          minWidth: 120,
          align: "right",
          headerAlign: "center",
          formatter: ["formatterNumber", 2],
          editRender: {
            name: "ElInput",
            props: { type: "number", min: 0, step: 1 },
          },
        },
        {
          field: "birthday",
          title: "生日",
          width: 150,
          editRender: {
            name: "ElDatePicker",
            props: {
              type: "date",
              labelFormat: "YYYY-MM-DD",
              valueFormat: "YYYY-MM-DD",
            },
          },
        },
      ];
    },
    defaultLeftButtons() {
      return [
        { type: "gradientGreen", name: "查询" },
        { type: "gradientDarkGreen", name: "重置" },
        { type: "gradientGreen", name: "导出当前页" },
        { type: "gradientGreen", name: "导出全部" },
      ];
    },
    defaultRightButtons() {
      return [
        { type: "gradientBlue", name: "下载导入模版" },
        { type: "gradientBlue", name: "新增" },
        { type: "gradientRed", name: "删除" },
      ];
    },
  },
  mounted() {
    this.loadTableData(true);
  },
  methods: {
    loadTableData(flag) {
      if (flag) this.searchParams.pageIndex = 1;

      exampleApi
        .loadTableDataService(this.searchParams)
        .then((res) => {
          this.total = res.total;
          this.tableData = res.data;
        })
        .catch(() => {
          this.tableData = [{ id: 1, name: "122", money: 4000 }];
        });
    },
    resetParams() {
      this.searchParams.sex = "";
      this.searchParams.keyword = "";
      this.searchParams.pageIndex = 1;
      this.searchParams.pageSize = 100;
      this.searchParams.sortOrder = "";
      this.searchParams.sortColumn = "";
      this.time = ["", ""];
      this.$nextTick(function () {
        this.loadTableData();
      });
    },
    async doAdd() {
      this.$vxeModal.show(
        dynamic_form,
        {
          tableHeaderList: this.tableHeaderList,
          validateRules: this.validRules,
        },
        {
          width: 800,
          title: "详情",
          height: window.innerHeight - 100,
        },
        {
          // close: () => {
          //   this.loadTableData();
          // },
          doSubmit: (res) => {
            console.log(res);
            // if (res.xyksrq && res.xyjsrq) {
            //   if (dayjs(res.xyksrq).isAfter(res.xyjsrq)) {
            //     this.$message.error('协议开始日期不能在协议结束日期之后');
            //     return
            //   }
            // }
            // this.doRealSave([res])
          },
        },
      );
    },
    openDetail(row) {
      console.log(row);
      this.$vxeModal.show(
        dynamic_form,
        {
          tableHeaderList: this.tableHeaderList,
          validateRules: this.validRules,
          row: row,
        },
        {
          width: 800,
          title: "详情",
          height: window.innerHeight - 100,
        },
        {
          // close: () => {
          //   this.loadTableData();
          // },
          doSubmit: (res) => {
            console.log(res);
            // if (res.xyksrq && res.xyjsrq) {
            //   if (dayjs(res.xyksrq).isAfter(res.xyjsrq)) {
            //     this.$message.error('协议开始日期不能在协议结束日期之后');
            //     return
            //   }
            // }
            this.doRealSave([res]);
          },
        },
      );
    },
    doRealSave(data) {
      this.$confirm(`确认保存修改的数据吗？`, "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      }).then(() => {
        exampleApi.saveTableDataService({ data }).then((res) => {
          this.$message.success(res.data);
          VxeUI.modal.close();
          this.loadTableData(true);
        });
      });
    },
    doDelete(rows = []) {
      if (!rows) {
        rows = this.$refs.xTable.getCheckboxRecords();
      }
      if (!rows || rows.length == 0) {
        this.$message.warning("请选择一条数据");
        return;
      }
      this.$confirm(`确认删除勾选的${rows.length}条数据吗？`, "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      }).then(() => {
        this.$refs.xTable.removeCheckboxRow();
        let removeRecords = this.$refs.xTable.getRemoveRecords();
        if (removeRecords.length > 0) {
          let ids = removeRecords.map((i) => i.id).join(",");
          exampleApi.doDelTableDataService({ ids }).then((res) => {
            this.$message.success(res.data);
            this.loadTableData(true);
          });
        }
      });
    },
    doExport() {
      let obj = JSON.parse(JSON.stringify(this.searchParams));
      delete obj.pageSize;
      delete obj.pageIndex;
      exampleApi.exportTableDataFileService(obj, "导出模板");
    },

    downloadModule() {
      exampleApi.downloadModuleService();
    },

    cellClassName({ row, column }) {
      console.log(row, column);
      return "";
    },
    handlePageChange({ currentPage, pageSize }) {
      this.searchParams.pageIndex = currentPage;
      this.searchParams.pageSize = pageSize;
      this.loadTableData();
    },
    cellDbClick(e) {
      let { row } = e;
      this.openDetail(row);
    },
  },
};
</script>

<style scoped lang="scss">
.page_content {
  article {
    height: calc(100% - 96px);
  }
}
</style>
