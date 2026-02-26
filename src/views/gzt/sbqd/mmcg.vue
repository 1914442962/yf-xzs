<template>
  <div class="page_content">
    <header>
      <section>
        <div class="header-item">
          <el-input
            placeholder="请输入文件名称"
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
          <el-button type="gradientBlue" @click="$refs.uploadRef.choose()"
            >上传</el-button
          >
          <vxe-upload
            ref="uploadRef"
            multiple
            :file-types="[
              'doc',
              'docx',
              'xls',
              'xlsx',
              'ppt',
              'pptx',
              'pdf',
              'dwg',
            ]"
            button-text="上传文件"
            :show-list="false"
            :showUploadButton="false"
            :upload-method="uploadMethod"
          >
          </vxe-upload>
          <!--          <el-button :type="item.type" :plain="item.plain" v-for="(item, index) in defaultRightButtons"-->
          <!--                     :key="index + 'defaultRightButtons'" @click="btnClick(item)">-->
          <!--            {{ item.name }}-->
          <!--          </el-button>-->
        </div>
      </section>
    </header>
    <article>
      <vxe-grid
        v-bind="gridOptions"
        ref="xTable"
        @menu-click="(e) => menuClickEvent(e, '设备启动')"
      >
        <template #action="{ row }">
          <vxe-button
            mode="text"
            icon="vxe-icon-search"
            status="primary"
            @click="previewMethod(row)"
          ></vxe-button>
          <vxe-button
            mode="text"
            status="primary"
            icon="vxe-icon-download"
            @click="downloadMethod(row)"
          ></vxe-button>
          <vxe-button
            mode="text"
            status="error"
            icon="vxe-icon-delete"
            @click="removeMethod(row)"
          ></vxe-button>
        </template>
      </vxe-grid>
    </article>
  </div>
</template>

<script>
import table_mixin from "@/mixin/table_mixin.jsx";
import VxeUI from "vxe-pc-ui";
import commonApi from "@/api/common-api.js";
import { fileToBlobUrl } from "@/utils/tools.js";
import view_file from "@/views/vxeModal/view_file.vue";
export default {
  name: "mmcg",
  mixins: [table_mixin],
  data() {
    return {
      time: ["", ""],
      total: 0,
      searchParams: {
        type: "mmcg",
        keyword: "",
      },
      tableData: [],
      isAutoWrap: false,
    };
  },
  watch: {},
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
          field: "fileName",
          title: "文件名",
        },
        {
          title: "操作",
          width: "150",
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
            // queryAll: ({sorts,filters}) => {
            //   return this.loadTableApi({pageSize: 100000, currentPage: 1},sorts,filters)
            // },
            delete: ({ body }) => {
              return this.doDeleteApi(body.removeRecords);
            },
            save: ({ body }) => {
              return this.doSaveApi(body);
            },
          },
        },

        exportConfig: {
          // remote: true,
          filename: "运行方式模版管理表",
          sheetName: "sheet1",
          type: "xlsx",
          mode: "all",
          modes: ["current", "selected", "all"],
          message: false,
          columns: this.tableHeaderList.filter((i) => i.type !== "checkbox"),
          exportMethod: this.exportMethod,
          afterExportMethod: this.afterExportMethod,
        },
        editConfig: {
          trigger: "click",
          mode: "cell",
          showStatus: true,
          showIcon: true,
          beforeEditMethod: this.beforeEditMethod,
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
      return [{ type: "gradientGreen", name: "查询" }];
    },
    defaultRightButtons() {
      return [{ type: "gradientBlue", name: "上传文件" }];
    },
  },
  mounted() {},
  methods: {
    reloadTableData() {
      this.$refs.xTable.commitProxy("query"); //不重置分页
    },
    loadTableData() {
      this.$refs.xTable.commitProxy("reload"); //重置分页
    },
    loadTableApi(page, sorts, filters) {
      let params = this.getRealParams(this.searchParams, page, sorts, filters);
      return new Promise((resolve, reject) => {
        commonApi.loadFileService(params).then((res) => {
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
    async readFileEvent() {
      const tableData = [];
      const { files } = await VxeUI.readFile({
        multiple: true,
      });
      files.forEach((file) => {
        tableData.push({
          id: this.rowKey++,
          name: file.name,
          size: file.size,
          file,
        });
      });
      this.gridOptions.data = tableData;
    },

    uploadMethod({ file }) {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("id", "");
      formData.append("type", "mmcg");
      // return commonApi.uploadFileService(formData).then(res => {
      //   return res.data
      // })
      commonApi.uploadFileService(formData).then((res) => {
        this.loadTableData();
      });
    },

    removeMethod(row) {
      commonApi.removeFileService({ fileId: row.id }).then(() => {
        this.$message.success("移除成功");
        this.loadTableData();
      });
    },
    downloadMethod(row) {
      commonApi.downloadFileGetService({ fileId: row.id });
    },
    previewMethod(row) {
      if (this.$store.state.isXzs) {
        commonApi.preViewFileGetService({ fileId: row.id });
      } else {
        commonApi.preViewFileService({ fileId: row.id }).then((res) => {
          let url = fileToBlobUrl(res, "pdf") + "#toolbar=0";
          this.$vxeModal.show(
            view_file,
            {
              url: url,
            },
            {
              width: 800,
              title: "文件预览",
              height: window.innerHeight - 20,
            },
            {},
          );
        });
      }
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
