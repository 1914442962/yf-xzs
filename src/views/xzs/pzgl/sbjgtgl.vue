<template>
  <div id="KonvaPage">
    <div id="KonvaContainer"></div>
    <footer>
      <el-button type="primary" plain size="small" @click="doUp">
        <input
          accept=".svg"
          type="file"
          style="display: none"
          @change="doImport($event)"
          ref="uploadFile"
        />
        <div class="icon-text">导入svg</div>
      </el-button>
      <el-button type="primary" plain size="small" @click="doJson(false)">
        修改版本
      </el-button>
      <el-button type="primary" plain size="small" @click="doJson(true)">
        新增版本
      </el-button>
      <el-button type="primary" plain size="small" @click="setCurrent()">
        设为版本
      </el-button>
    </footer>
    <aside>
      <vxe-grid
        v-bind="gridOptions"
        ref="xTable"
        @cell-click="cellClick"
      ></vxe-grid>
    </aside>
  </div>
</template>
<script>
import Konva from "konva";
import { dealSvg, setupKonvaEdit } from "@/utils/konva/index.js";
import pzglApi from "@/api/xzs/pzgl-api.js";

let stage;
export default {
  props: {
    name: {
      type: Object,
    },
    type: {
      type: String,
      default: "",
    },
  },
  data() {
    return {
      stage: null,
      row: {
        id: "",
        name: "",
        time: "",
        flag: "",
        svg: "",
      },
      tableData: [],
    };
  },
  computed: {
    gridOptions() {
      return {
        height: "auto",
        border: true, //边框
        round: true, //圆角边框
        headerAlign: "center",
        align: "center",
        loading: false,
        rowConfig: {
          isCurrent: true,
          isHover: true,
        },
        headerCellClassName: "row-class",
        data: this.tableData,
        columns: [
          {
            field: "time",
            title: "历史版本",
          },
        ],
      };
    },
  },
  watch: {
    "row.time": {
      handler() {
        this.$refs.xTable.setCurrentRow(this.row);
        this.initKonvaEdit(this.row.svg);
      },
      immediate: false,
    },
  },
  mounted() {
    this.loadPage();
  },
  beforeUnmount() {},
  methods: {
    loadPage() {
      pzglApi.queryInitFstService({ name: this.name }).then((res) => {
        this.tableData = res.data;
        this.row = res.data.filter((i) => i.flag == 1)[0];
      });
    },
    // 基于json回显
    initKonvaEdit(json) {
      stage = Konva.Node.create(json, "KonvaContainer");
      this.stage = stage;
      setupKonvaEdit(stage, true, "KonvaPage");
      let el = document.getElementById("konva-stencil-panel");
      el.style.height = "calc(50% - 20px)";
      el.style.width = "130px";
    },
    // 导入svg
    doImport(e) {
      const file = e.target.files[0];
      if (!file) return;
      const reader = new FileReader();
      reader.onload = (evt) => {
        const parser = new DOMParser();
        const doc = parser.parseFromString(evt.target.result, "image/svg+xml");
        stage = new Konva.Stage({
          container: "KonvaContainer", // 渲染的dom元素
          draggable: true,
        });
        dealSvg(stage, doc);
        setupKonvaEdit(stage);
      };
      reader.readAsText(file);
    },
    doUp() {
      this.$refs.uploadFile.click();
    },
    // 导出jsjon
    doJson(flag) {
      // todo - 保存
      this.row.svg = stage.toJSON();
      console.log(flag);
      console.log(this.row);
      if (flag) {
        pzglApi
          .saveDataService({ data: [{ name: this.name, svg: this.row.svg }] })
          .then((res) => {
            this.$message.success(res.data);
            this.$emit("refresh");
            this.$emit("close");
          });
      } else {
        pzglApi.saveDataService({ data: [this.row] }).then((res) => {
          this.$message.success(res.data);
          this.$emit("refresh");
          this.$emit("close");
        });
      }
    },
    setCurrent() {
      let obj = JSON.parse(JSON.stringify(this.row));
      obj.flag = "1";
      pzglApi.setCurrentService({ data: obj }).then((res) => {
        this.$emit("refresh");
        this.$emit("close");
      });
    },
    cellClick({ row, column }) {
      this.row = row;
    },
  },
};
</script>
<style scoped lang="scss">
#KonvaPage {
  width: 100%;
  height: 100%;
  display: flex;
  overflow: hidden;
  position: relative;
  #KonvaContainer {
    background-color: #ffffff;
    flex: 1;
    background-image: url(data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjgiIGhlaWdodD0iMjgiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PHBhdHRlcm4gaWQ9ImdyaWQiIHdpZHRoPSIyOCIgaGVpZ2h0PSIyOCIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PHBhdGggZD0iTSAwIDcgTCAyOCA3IE0gNyAwIEwgNyAyOCBNIDAgMTQgTCAyOCAxNCBNIDE0IDAgTCAxNCAyOCBNIDAgMjEgTCAyOCAyMSBNIDIxIDAgTCAyMSAyOCIgZmlsbD0ibm9uZSIgc3Ryb2tlPSIjZDBkMGQwIiBvcGFjaXR5PSIwLjIiIHN0cm9rZS13aWR0aD0iMSIvPjxwYXRoIGQ9Ik0gMjggMCBMIDAgMCAwIDI4IiBmaWxsPSJub25lIiBzdHJva2U9IiNkMGQwZDAiIHN0cm9rZS13aWR0aD0iMSIvPjwvcGF0dGVybj48L2RlZnM+PHJlY3Qgd2lkdGg9IjEwMCUiIGhlaWdodD0iMTAwJSIgZmlsbD0idXJsKCNncmlkKSIvPjwvc3ZnPg==);
  }
  footer {
    width: calc(100%);
    height: 40px;
    position: absolute;
    bottom: 0px;
    background-color: #fff;
    display: flex;
    justify-content: center;
    align-items: center;
  }
  aside {
    width: 130px;
    position: absolute;
    left: 10px;
    bottom: 10px;
    height: calc(50% - 20px);
  }
}
</style>
