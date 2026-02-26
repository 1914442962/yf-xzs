<template>
  <div id="view_simple_table" class="page_content">
    <article>
      <vxe-grid
        v-bind="gridOptions"
        ref="xTable"
        v-on="{ sortChange: sortChangeEvent }"
      >
      </vxe-grid>
    </article>
  </div>
</template>

<script>
import table_mixin from "@/mixin/table_mixin.jsx";

export default {
  name: "view_simple_table",
  props: {
    tableHeaderList: {
      type: Array,
    },
    tableData: {
      type: Array,
    },
  },
  mixins: [table_mixin],
  data() {
    return {};
  },
  computed: {
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
        headerCellClassName: "row-class",
        data: this.tableData,

        columns: this.tableHeaderList,
      };
    },
  },
  created() {},
  methods: {},
};
</script>

<style scoped lang="scss">
#view_simple_table {
  width: 100%;
  height: 100%;
  padding-top: 10px;
  article {
    width: 100%;
    height: 100%;
    background-color: #ffffff;
    border-radius: 4px;
  }
}
</style>
