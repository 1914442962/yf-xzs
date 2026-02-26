<template>
  <div class="page_content">
    <header>
      <section>
        <div class="header-item">
          图：
          <el-select
            v-model="name"
            placeholder="请选择"
            clearable
            style="width: 300px"
          >
            <el-option
              v-for="item in picOptions"
              :label="item.name"
              :value="item.name"
            >
            </el-option>
          </el-select>
        </div>
      </section>
      <section>
        <el-button type="gradientGreen" @click="openDetail">查看详情</el-button>
      </section>
    </header>
    <div class="left">
      <div id="KonvaContainer0"></div>
    </div>
    <div class="right">
      <el-date-picker
        v-model="seatchParams.date"
        type="datetime"
        placeholder="选择日期时间"
        format="YYYY-MM-DD HH:mm"
        value-format="YYYY-MM-DD HH:mm"
      >
      </el-date-picker>
      <el-button @click="getTable">查询</el-button>
      <vxe-table
        ref="tableRef"
        :data="tableData"
        stripe
        keep-source
        border
        height="100%"
        :round="true"
        resizable
        :row-config="{ isHover: true }"
        align="center"
        @cell-click="cellClickEvent"
      >
        <vxe-column type="expand" fixed="left" width="50">
          <template #content="{ row }">
            <div class="childTables">
              <vxe-table
                border
                :data="row.transformerPhaseDataList"
                auto-resize
                stripe
                row-id="id"
                :row-config="{ isHover: true }"
                :round="true"
                keep-source
                resizable
                align="center"
              >
                <vxe-column type="seq" title="序号" width="60"></vxe-column>
                <vxe-column
                  field="equipmentName"
                  title="设备名称"
                  min-width="120"
                >
                </vxe-column>
                <vxe-column field="yg" title="有功值" width="120" sortable>
                </vxe-column>
                <vxe-column field="wg" title="无功值" width="120" sortable>
                </vxe-column>
                <vxe-column field="dl" title="电流值" width="120" sortable>
                </vxe-column>
              </vxe-table>
            </div>
          </template>
        </vxe-column>
        <vxe-column type="seq" title="序号" width="60"></vxe-column>
        <vxe-column field="substationName" title="变电站名称" min-width="120">
        </vxe-column>
        <vxe-column field="equipmentName" title="设备名称" min-width="120">
        </vxe-column>
        <vxe-column field="equipmentType" title="设备类型" width="120">
        </vxe-column>
        <vxe-column
          field="belongSubstationName"
          title="所属变电站"
          min-width="120"
        >
        </vxe-column>
        <vxe-column field="statusDesc" title="开关状态" width="120">
        </vxe-column>
        <vxe-column
          field="yg"
          title="有功值"
          width="110"
          sortable
          header-align="center"
          align="right"
        >
        </vxe-column>
        <vxe-column
          field="wg"
          title="无功值"
          width="110"
          sortable
          header-align="center"
          align="right"
        >
        </vxe-column>
        <vxe-column
          field="dl"
          title="电流值"
          width="110"
          sortable
          header-align="center"
          align="right"
        >
        </vxe-column>
      </vxe-table>
    </div>
  </div>
</template>
<script>
import pzglApi from "@/api/xzs/pzgl-api.js";
import sbjgtgl from "@/views/xzs/pzgl/sbjgtgl.vue";
import Konva from "konva";
import {
  setupKonvaEdit,
  highlightAndCenterNodesByBoundary,
  batchUpdatePowerStatus,
} from "@/utils/konva/index.js";
import dayjs from "dayjs";
let stage;
export default {
  name: "pzgl",
  data() {
    return {
      name: "",
      picOptions: [],
      row: {
        id: "",
        name: "",
        time: "",
        flag: "",
        svg: "",
      },
      dragState: {
        isDragging: false,
        ghostNode: null,
        draggedItemType: null,
        nodeSize: 0,
      },
      tableData: [],
      seatchParams: {
        date: dayjs().format("YYYY-MM-DD HH:mm"),
      },
    };
  },
  watch: {
    name: {
      handler(val) {
        if (val) {
          this.row = this.picOptions.filter((i) => i.name === val)[0];
          this.getTable();
        } else {
          this.row = {
            id: "",
            name: "",
            time: "",
            flag: "",
            svg: "",
          };
        }
      },
      immediate: false,
    },
    "row.svg": {
      handler(val) {
        if (val) {
          this.initKonvaEdit(val);
        } else {
          if (stage) {
            stage.destroy();
          }
        }
      },
      immediate: false,
    },
  },
  beforeUnmount() {},
  created() {
    this.loadPage();
  },
  methods: {
    getTable() {
      pzglApi
        .seletNormalDiagramList({
          substationName: this.name, //变电站名称
          date: dayjs(this.seatchParams.date).format("YYYY-MM-DD"), //日期
          time: dayjs(this.seatchParams.date).format("HH") + ":00", //时分
          equipmentName: "", //设备名称
          belongSubstationName: "", //所属变电站
        })
        .then((res) => {
          this.tableData = res.data;
          batchUpdatePowerStatus(
            stage,
            res.data.filter((item) => item.equipmentType === "开关"),
          );
        });
    },
    loadPage() {
      pzglApi.loadDataService({}).then((res) => {
        this.picOptions = res.data;
        if (this.picOptions.length > 0) {
          if (this.name) {
            this.row = this.picOptions.filter((i) => i.name === this.name)[0];
          } else {
            this.name = this.picOptions[0].name;
          }
        }
      });
    },
    // --- 拖拽事件触发器 (Wrapper) ---
    // 基于json回显
    initKonvaEdit(json) {
      stage = Konva.Node.create(json, "KonvaContainer0");
      this.stage = stage;
      setupKonvaEdit(stage);
    },
    openDetail() {
      this.$vxeModal.show(
        sbjgtgl,
        {
          name: this.name,
        },
        {
          width: window.innerWidth - 100,
          title: `${this.name}详情`,
          height: window.innerHeight - 100,
        },
        {
          // close: () => {
          //   this.loadTableData();
          // },
          refresh: () => {
            this.loadPage();
          },
        },
      );
    },
    cellClickEvent({ row }) {
      console.log(row);
      if (row.equipmentType === "开关") {
        highlightAndCenterNodesByBoundary(stage, row.jsonId);
      }
    },
  },
};
</script>
<style scoped lang="scss">
.page_content {
  height: 100%;
  position: relative;
  display: flex;
  align-items: center;
  header {
    width: 100%;
    position: absolute;
    top: 0;
    z-index: 1000;
  }
  .left {
    height: 100%;
    width: 50%;
    #KonvaContainer0 {
      height: 100%;
    }
  }
  .right {
    height: 90%;
    width: 42%;
    padding-top: 60px;
    .childTables {
      margin: 20px;
    }
  }
}
</style>
