<template>
  <el-container id="mmbg">
    <el-aside>
      <p><span class="mmbg_left"></span>设备命名变更</p>
      <el-tree
        :data="treeData"
        @node-click="handleNodeClick"
        :default-expand-all="true"
        :props="{ class: customNodeClass }"
      >
        <template #default="{ node, data }">
          <div>
            <i :class="data.icon" class="tree_icon"></i>
            {{ data.name }}
          </div>
        </template>
      </el-tree>
    </el-aside>
    <el-main>
      <mmbg_table
        :key="node.id"
        :node="node"
        v-if="node.id"
        :buttons="buttons"
        @loadTree="loadLeftData"
      ></mmbg_table>
    </el-main>
  </el-container>
</template>
<script>
import Mmbg_table from "@/views/gzt/sbqd/mmbg/mmbg_table.vue";
import mmbgApi from "@/api/sbqd/mmbg-api.js";

export default {
  name: "mmbg",
  components: { Mmbg_table },
  data() {
    return {
      treeData: [],
      node: {},
      buttons: {
        outerBtns: [],
        insideBtns: [],
      },
    };
  },
  created() {
    this.loadLeftData();
  },
  methods: {
    customNodeClass({ id }) {
      return this.node.id == id ? "active_tree" : "";
    },
    loadLeftData() {
      mmbgApi.loadTreeDataService({}).then((res) => {
        this.treeData = res.data;
        if (!this.node.id) {
          this.handleNodeClick(this.treeData[0].children[0]);
        }
      });
    },
    handleNodeClick(e) {
      if (!e.children || e.children.length === 0) {
        this.buttons = {
          outerBtns: e.outerBtns,
          insideBtns: e.insideBtns,
        };
        let obj = JSON.parse(JSON.stringify(e));
        delete obj.outerBtns;
        delete obj.insideBtns;
        delete obj.children;
        this.node = obj;
      }
    },
  },
};
</script>
<style>
#mmbg .tree_icon.cx {
  background-image: url("@/assets/img/icon/xgcx.png");
}
#mmbg .tree_icon.bz {
  background-image: url("@/assets/img/icon/ddbz.png");
}
#mmbg .tree_icon.dd {
  background-image: url("@/assets/img/icon/ddzx.png");
}
#mmbg .tree_icon.zdh {
  background-image: url("@/assets/img/icon/zrsh.png");
}
#mmbg .tree_icon.yf {
  background-image: url("@/assets/img/icon/yfbz.png");
}
#mmbg .tree_icon.jb {
  background-image: url("@/assets/img/icon/yfcl.png");
}
#mmbg .el-tree-node__content > .el-tree-node__expand-icon {
  width: 0;
  height: 0;
  display: none;
}
</style>
<style scoped lang="scss">
.el-container {
  height: 100%;

  .el-aside {
    width: 210px;
    background-image: linear-gradient(to left, #ffffff, #edfffa);
    background-blend-mode: normal, normal;
    opacity: 0.9;
    padding: 12px;
    box-shadow: 2px 0 2px 1px rgba(30, 189, 157, 0.2);
    p {
      font-weight: bold;
      color: #333333;
      font-size: 16px;
      margin-bottom: 24px;
      margin-top: 12px;
      .mmbg_left {
        display: inline-block;
        background-image: url("@/assets/img/icon/fsbgd_left.png");
        width: 9px;
        height: 27px;
        margin-right: 8px;
      }
    }
    .el-tree {
      background-color: transparent;
    }
  }

  .el-main {
    padding: 0 16px;
    padding-right: 0;
  }
}
</style>
