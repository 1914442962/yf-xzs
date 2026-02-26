<template>
  <div class="page_content">
    <header>
      <section>
        <div class="header-item">
          日期：
          <el-date-picker v-model="searchParams.time" type="date" format="YYYY-MM-DD" value-format="YYYY-MM-DD"></el-date-picker>
        </div>
      </section>
    </header>
    <article>
      <section>
        <p class="title">负荷及电量情况</p>
<!--        <div v-html="fhHtml"></div>-->
        <p v-for="(item,index) in pageObj.text" :key="'text'+index" style="text-indent: 4ch;line-height: 24px;font-size: 16px">{{item}}</p>
      </section>
      <section>
        <p class="title">{{pageObj.tableTitle1}}</p>
        <vxe-grid v-bind="gridOptions1" ref="xTable1">
        </vxe-grid>
      </section>
      <section>
        <p class="title">{{pageObj.tableTitle2}}</p>
        <vxe-grid v-bind="gridOptions2" ref="xTable2">
        </vxe-grid>
      </section>
    </article>
  </div>
</template>
<script>
import yfdxApi from "@/api/xzs/yfdx-api.js";

export default {
  name: "yfdx",
  data() {
    return {
      searchParams: {
        time: '',
      },
      pageObj: {
        table1: [],
        table2: [],
        tableTitle1: '',
        tableTitle2: '',
        text: []
      },
      // fhHtml: "<p>121</p>"
    }
  },
  watch:{
    'searchParams.time': {
      handler() {
        this.loadPage();
      },
      immediate: true,
    },
  },
  computed:{
    tableHeaderList(){
      return [
        {
          type: 'seq',
          width: 60,
          fixed: "left",
        },
        {
          field: "zbmc",
          title: "变电站",
          minWidth: 120,
        },
        {
          field: "inom",
          title: "额定容量（兆瓦）",
          width: 100,
          sortable: true
        },
        {
          field: "ygfh",
          title: "有功负荷（兆瓦）",
          width: 100,
          sortable: true
        },
        {
          field: "wgfh",
          title: "无功负荷（兆瓦）",
          width: 100,
          sortable: true
        },
        {
          field: "fzl",
          title: "负载率（%）",
          width: 120,
          sortable: true
        },
        {
          field: "zzfzl",
          title: "整站负载率（%）",
          minWidth: 120,
          sortable: true
        },
      ]
    },
    gridOptions1() {
      return {
        border: true,//边框
        round: true,//圆角边框
        headerAlign: 'center',
        align: 'center',
        loading: false,
        rowConfig: {
          isCurrent: true,
          isHover: true
        },
        columnConfig: {
          resizable: true
        },
        resizeConfig:{
          isDblclickAutoWidth: true,//双击自适应列宽
        },
        filterConfig: {
          remote: true
        },
        showOverflow: false,
        headerCellClassName: 'row-class',
        columns: this.tableHeaderList,
        data: this.pageObj.table1,
        spanMethod({ row, rowIndex, column, visibleData }) {
          const spanFields = ['zzfzl'];
          const cellValue = row.bdzmc;
          if (cellValue && spanFields.includes(column.field)) {
            const prevRow = visibleData[rowIndex - 1];
            let nextRow = visibleData[rowIndex + 1];
            if (prevRow && prevRow.bdzmc === cellValue) {
              return { rowspan: 0, colspan: 0 };
            }
            else {
              let countRowspan = 1;
              while (nextRow && nextRow.bdzmc === cellValue) {
                nextRow = visibleData[++countRowspan + rowIndex];
              }
              if (countRowspan > 1) {
                return { rowspan: countRowspan, colspan: 1 };
              }
            }
          }
        },
      }
    },
    gridOptions2() {
      return {
        border: true,//边框
        round: true,//圆角边框
        headerAlign: 'center',
        align: 'center',
        loading: false,
        rowConfig: {
          isCurrent: true,
          isHover: true
        },
        columnConfig: {
          resizable: true
        },
        resizeConfig:{
          isDblclickAutoWidth: true,//双击自适应列宽
        },
        filterConfig: {
          remote: true
        },
        showOverflow: false,
        headerCellClassName: 'row-class',
        columns: this.tableHeaderList,
        data: this.pageObj.table2,
        spanMethod({ row, rowIndex, column, visibleData }) {
          const spanFields = ['zzfzl'];
          const cellValue = row.bdzmc;
          if (cellValue && spanFields.includes(column.field)) {
            const prevRow = visibleData[rowIndex - 1];
            let nextRow = visibleData[rowIndex + 1];
            if (prevRow && prevRow.bdzmc === cellValue) {
              return { rowspan: 0, colspan: 0 };
            }
            else {
              let countRowspan = 1;
              while (nextRow && nextRow.bdzmc === cellValue) {
                nextRow = visibleData[++countRowspan + rowIndex];
              }
              if (countRowspan > 1) {
                return { rowspan: countRowspan, colspan: 1 };
              }
            }
          }
        },
      }
    },
  },
  created() {
  },
  methods: {
    loadPage() {
      return new Promise(resolve => {
        yfdxApi.loadTableDataService(this.searchParams).then(res => {
          this.pageObj = res.data
        })
      })
    },

  }

}
</script>
<style scoped lang="scss">
.page_content {
  background-color: rgb(239, 247, 245);
  width: 820px;
  padding: 0 20px;
  margin: 0 auto;
  article{
    width: 100%;
    height: calc(100% - 48px);
    overflow-y: auto;
    section{
      .title{
        font-size: 20px;
        text-align: center;
        font-weight: bold;
        margin: 10px 0;
      }
    }
  }
}
</style>