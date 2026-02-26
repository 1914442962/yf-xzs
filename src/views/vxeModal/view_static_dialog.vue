<template>
  <div id="view_static_dialog" class="page_content modal_content" >
    <header v-if="headerButtonList.length>0">
      <section></section>
      <section>
        <el-button v-for="(item,index) in headerButtonList" :type="item.type" :plain="item.plain" :key="index + 'headerButtonList'" @click="btnClick(item)">{{ item.name }}</el-button>

      </section>
    </header>
    <article>
      <vxe-grid v-bind="gridOptions" ref="xTable">
      </vxe-grid>
    </article>
    <footer v-if="footerButtonList.length>0">
      <el-button v-for="(item,index) in footerButtonList" :type="item.type" :plain="item.plain" :key="index + 'footerButtonList'" @click="btnClick(item)">{{ item.name }}</el-button>
    </footer>
  </div>
</template>

<script>
import table_mixin from "@/mixin/table_mixin";

export default {
  name: "view_static_dialog",
  props: {
    tableHeaderList: {
      type: Array,
      default: () => {
        return [];
      }
    },
    headerButtonList: {
      type: Array,
      default: () => {
        return [];
      }
    },
    footerButtonList: {
      type: Array,
      default: () => {
        return [];
      }
    },
    tableData: {
      type: Array,
      default: () => {
        return [];
      }
    },
  },
  mixins: [table_mixin],
  data() {
    return {
      total: 0,
      searchParams:{
        pageIndex: 1,
        pageSize: 20,
      }
    }
  },
  computed:{
    isCheckbox(){
      return this.tableHeaderList.some(i=> i.type=='checkbox')
    },
    gridOptions() {
      return {
        height: 'auto',
        keepSource: true,
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
        checkboxConfig: {
          highlight: true
        },
        columnConfig: {
          resizable: true
        },
        headerCellClassName: 'row-class',
        // seqConfig: {
        //   seqMethod: this.seqMethod,
        // },
        // pagerConfig: this.pagerConfig,
        data: this.tableData,
        columns: this.tableHeaderList,

      }
    },
  },
  created() {
  },
  methods: {
    btnClick(item){
      let rows = [];
      switch (item.name) {
        case "确定":
          if(this.isCheckbox){
            rows = this.getCheckboxRecords()
          }else{
            rows = this.getRadioRecord()
          }
          if(rows && rows.length > 0){
            this.$emit('returnData', rows);
            this.$emit('close');
          }

          break
        case "扫描":
          if(this.isCheckbox){
            rows = this.getCheckboxRecords()
          }else{
            rows = this.getRadioRecord()
          }
          if(rows && rows.length > 0){
            this.$emit('returnData', rows);
          }
          break
        case "保存":
          if(this.isCheckbox){
            rows = this.getCheckboxRecords()
          }else{
            rows = this.getRadioRecord()
          }
          if(rows && rows.length > 0){
            this.$emit('returnData', rows);
            this.$emit('close');
          }
          break
        case "取消":
          this.$emit('close');

      }
    },
  },
};
</script>

<style scoped lang="scss">
#view_static_dialog {
  width: 100%;
  height: 100%;
  header{
    text-align: right;
  }
  article {
    width: 100%;
    height: calc(100% - 40px);
    background-color: #ffffff;
    border-radius: 4px;
  }
}
</style>
