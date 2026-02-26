<template>
  <div class="page_content">
    <vxe-grid v-bind="gridOptions" ref="xTable">
      <template #action="{ row,rowIndex }">
        <vxe-button mode="text" status="primary" @click="doReback(row,'xgq')">回退修改前</vxe-button>
        <vxe-button mode="text" status="primary" @click="doReback(row,'xgh')" v-if="rowIndex">回退修改后</vxe-button>
      </template>
    </vxe-grid>
  </div>
</template>
<script>
import xltgApi from "@/api/xzs/xltg-api.js";

export default {
  name: "cyzl_dialog",
  props:{
    row: Object,
    version: String,
    saveUrl: String,
    headerList: Array,
  },
  computed: {
    xglFilters(){
      return this.headerList.map(i=> {
        return {
          label: i.title,
          value: i.title,
        }
      })
    },
    tableHeaderList(){
      return [
        {
          type: 'seq',
          width: 60,
          fixed: "left",
        },
        {
          field: "xglName",
          title: "修改列",
          filters: this.xglFilters,
        },
        {
          field: "xgq",
          title: "修改前值",
        },
        {
          field: "xgh",
          title: "修改后值",
        },
        {
          field: "createTime",
          title: "修改时间",
          sortable: true,
        },
        {
          field: "czr",
          title: "修改人",
          sortable: true,
        },
        {
          title: '操作',
          width: 150,
          fixed: 'right',
          slots: { default: 'action' }
        }
      ]
    },
    gridOptions() {
      return {
        height: 'auto',
        border: true,//边框
        round: true,//圆角边框
        headerAlign: 'center',
        align: 'center',
        loading: false,
        rowConfig: {
          isCurrent: true,
          isHover: true
        },
        radioConfig: {
          highlight: true
        },
        columnConfig: {
          resizable: true
        },
        resizeConfig:{
          isDblclickAutoWidth: true,//双击自适应列宽
        },
        showOverflow: false,
        headerCellClassName: 'row-class',
        virtualYConfig: {
          enabled: true,
          gt: 0
        },
        proxyConfig: {
          seq: true,
          showResponseMsg: false,//不展示提示消息
          showActionMsg: false,
          sort: true,
          filter: true,
          ajax: {
            query: () => {
              return this.loadTableApi()
            },
          }
        },
        columns: this.tableHeaderList,

      }
    },
  },
  mounted() {

  },
  methods:{
    reloadTableData(){
      this.$refs.xTable.commitProxy('query')//不重置分页
    },
    loadTableData() {
      this.$refs.xTable.commitProxy('reload')//重置分页
    },
    loadTableApi() {
      return new Promise(resolve => {
        xltgApi.loadDialogDataService({id: this.row.id,version: this.version}).then(res => {
          resolve(res.data)
        })
      })
    },
    doReback(row,field){
      let obj = JSON.parse(JSON.stringify(this.row));
      obj[row.xgl] = row[field];
      xltgApi.saveDialogDataService([obj],this.saveUrl).then(res => {
        this.$message.success(res.data)
      })
    }
  }
}
</script>
<style scoped lang="scss">

</style>