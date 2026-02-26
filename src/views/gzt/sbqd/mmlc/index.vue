<template>
  <el-container id="mmlc">
    <el-aside>
      <p><span class="mmlc_left"></span>命名流程管理</p>
      <el-tree :data="treeData" @node-click="handleNodeClick" :default-expand-all="true" :props="{ class: customNodeClass }">
        <template #default="{ node,data  }">
          <div>
            <i :class="data.icon" class="tree_icon"></i>
            {{ data.name }}
          </div>
        </template>
      </el-tree>
    </el-aside>
    <el-main>
      <mmlc_table :key="node.id" :node="node" v-if="node.id" @loadTree="loadLeftData"></mmlc_table>
    </el-main>
  </el-container>
</template>
<script>
import qdfaApi from "@/api/qdfa-api.js";
import Mmlc_table from "@/views/gzt/sbqd/mmlc/mmlc_table.vue";

export default {
  name: 'mmlc',
  components: {Mmlc_table},
  data() {
    return {
      treeData: [],
      node: {}
    }
  },
  created() {
    this.loadLeftData();
  },
  methods:{
    customNodeClass({id}){
      return this.node.id == id ? 'active_tree' : "";
    },
    loadLeftData() {
      qdfaApi.loadTreeDataService({}).then((res) => {
        this.treeData = res.data;
        if(!this.node.id){
          this.handleNodeClick(this.treeData[0].children[0])
        }
      })
    },
    handleNodeClick(e) {
      if(!e.children){
        this.node = e;
      }
    }
  }
}
</script>
<style>
#mmlc .tree_icon.xgcx {
  background-image: url("@/assets/img/icon/xgcx.png");
}
#mmlc .tree_icon.ddbz {
  background-image: url("@/assets/img/icon/ddbz.png");
}
#mmlc .tree_icon.ddzx {
  background-image: url("@/assets/img/icon/ddzx.png");
}
#mmlc .tree_icon.zrsh {
  background-image: url("@/assets/img/icon/zrsh.png");
}
#mmlc .tree_icon.yfbz {
  background-image: url("@/assets/img/icon/yfbz.png");
}
#mmlc .tree_icon.yfcl {
  background-image: url("@/assets/img/icon/yfcl.png");
}
#mmlc .el-tree-node__content > .el-tree-node__expand-icon {
  width:0;
  height:0;
  display:none;
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
    box-shadow: 2px 0 2px 1px rgba(30,189,157,0.2);
    p{
      font-weight: bold;
      color: #333333;
      font-size: 16px;
      margin-bottom: 24px;
      margin-top: 12px;
      .mmlc_left{
        display:inline-block;
        background-image: url('@/assets/img/icon/fsbgd_left.png');
        width: 9px;
        height: 27px;
        margin-right:8px;
      }
    }
    .el-tree{
      background-color: transparent;
    }
  }

  .el-main {
    padding: 0 16px;
    padding-right: 0;

  }
}
</style>