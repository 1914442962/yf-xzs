<template>
  <div class="page_content" id="grcyzl">
    <article>
      <vxe-grid v-bind="gridOptions" ref="xTable">
        <template #toolbarButtons>
          <header>
            <div class="header-item">
              <el-select
                v-model="excelId"
                placeholder="请选择"
                filterable
                style="width: 300px"
              >
                <el-option
                  v-for="item in excelOptions"
                  :key="item.id"
                  :label="item.fileName"
                  :value="item.id"
                >
                </el-option>
              </el-select>
            </div>
            <div class="header-item">
              <el-button type="gradientGreen" @click="clearSortEvent"
                >重置排序</el-button
              >
              <el-button type="gradientGreen" @click="clearFilterEvent"
                >重置筛选</el-button
              >
              <el-button type="gradientGreen" @click="doExport">导出</el-button>
            </div>
            <div class="header-item">
              <upload-http-component
                prop-upload-url="/first/upload-file-execl"
                button-name="上传"
                @loadTableData="getExcelOptions"
              ></upload-http-component>
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
          </header>
        </template>
      </vxe-grid>
    </article>
  </div>
</template>
<script>
import grcyzlApi from "@/api/xzs/grcyzl-api.js";
import commonApi from "@/api/common-api.js";
import table_mixin from "@/mixin/table_mixin.jsx";
import UploadHttpComponent from "@/components/UploadHttpComponent.vue";

export default {
  name: "grcyzl",
  mixins: [table_mixin],
  components: { UploadHttpComponent },
  data() {
    return {
      excelId: "",
      excelObj: {},
      excelOptions: [],
      tableHeaderList: [],
      tableData: [],
    };
  },
  watch: {
    excelId: {
      handler(val) {
        if (val) {
          this.excelObj = this.excelOptions.filter(
            (item) => item.id === val,
          )[0];
          this.loadTableData();
        }
      },
      immediate: false,
    },
  },
  computed: {
    defaultLeftButtons() {
      return [{ type: "gradientRed", name: "删除" }];
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
        toolbarConfig: {
          custom: true,
          slots: {
            buttons: "toolbarButtons",
          },
        },
        customConfig: {
          allowVisible: true,
          allowFixed: false,
          allowResizable: false,
          allowSort: false,
        },
        columnConfig: {
          resizable: true,
        },
        resizeConfig: {
          isDblclickAutoWidth: true, //双击自适应列宽
        },
        // filterConfig: {
        //   filterMethod: this.filterMethod,
        // },
        showOverflow: this.isAutoWrap,
        headerCellClassName: "row-class",
        exportConfig: {
          // remote: true,
          filename: this.excelObj.fileName,
          sheetName: "sheet1",
          type: "xlsx",
          mode: "all",
          modes: ["all"],
          message: false,
          columns: this.tableHeaderList,
          exportMethod: this.exportMethod,
          afterExportMethod: this.afterExportMethod,
        },
        columns: this.tableHeaderList,
        data: this.tableData,
        // spanMethod({ row, rowIndex, column, visibleData }) {
        //   const cellValue = row[column.field];
        //   if (cellValue) {
        //     const prevRow = visibleData[rowIndex - 1];
        //     let nextRow = visibleData[rowIndex + 1];
        //     if (prevRow && prevRow[column.field] === cellValue) {
        //       return { rowspan: 0, colspan: 0 };
        //     }
        //     else {
        //       let countRowspan = 1;
        //       while (nextRow && nextRow[column.field] === cellValue) {
        //         nextRow = visibleData[++countRowspan + rowIndex];
        //       }
        //       if (countRowspan > 1) {
        //         return { rowspan: countRowspan, colspan: 1 };
        //       }
        //     }
        //   }
        // },
      };
    },
  },
  created() {
    this.getExcelOptions();
  },
  methods: {
    getExcelOptions() {
      grcyzlApi.loadExcelDataService({}).then((res) => {
        this.excelOptions = res.data;
        if (this.excelOptions.length > 0) {
          this.excelId = this.excelOptions[0].id;
        }
      });
    },
    loadTableData() {
      grcyzlApi.loadTableDataService({ fileId: this.excelId }).then((res) => {
        this.tableHeaderList = res.data.headers;
        this.tableHeaderList.forEach((item) => {
          item.sortable = true;
          item.minWidth = 60;
          item.filterMultiple = true;
          let textArr = Array.from(
            new Set(res.data.data.map((i) => i[item.field])),
          );
          item.filters = textArr
            .filter((i) => i)
            .map((i) => {
              return {
                label: i,
                value: i,
              };
            });
          // item.filters = [{data:''}];
          // let options = textArr.filter(i=> i).map(i => {return {label: i, value: i}})
          // item.filterRender = {
          //   name: 'VxeSelect',
          //   props:{filterable: true,multiple:true,clearable:true,modelValue: []},
          //   options: options,
          //   events: {
          //     change(e){
          //       e.column.filters[0].data = e.column.filters[0].data.filter(i=> i);
          //     }
          //   }
          // }
        });
        console.log(this.tableHeaderList);
        this.tableData = res.data.data;
      });
    },
    doDelete() {
      this.$confirm(`确认删除吗？`, "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      }).then(() => {
        commonApi.removeFileService({ fileId: this.excelId }).then(() => {
          this.$message.success("删除成功");
          this.getExcelOptions();
        });
      });
    },
    clearSortEvent() {
      this.$refs.xTable.clearSort();
    },
    clearFilterEvent() {
      this.$refs.xTable.clearFilter();
    },
    doExport(flag) {
      grcyzlApi
        .exportGetIdByParamsService({
          headers: this.$refs.xTable.getTableColumn().tableColumn,
          data: this.$refs.xTable.getTableData().tableData,
        })
        .then((res) => {
          commonApi.exportFileService(
            "/first/download-export-data",
            { id: res.data, name: this.excelObj.fileName },
            flag,
            this.pagerParam,
          );
        });
    },
  },
};
</script>
<style>
#grcyzl .vxe-toolbar {
  background-color: rgb(239, 247, 245);
  padding: 0;
}
</style>
<style scoped lang="scss">
.page_content {
  background-color: rgb(239, 247, 245);
  article {
    height: 100%;
  }
}
</style>
