<template>
  <el-container id="fsbgd">
    <el-aside>
      <p><span class="fsbgd_left"></span>运行方式变更单</p>
      <el-tree :data="treeData" @node-click="handleNodeClick" :default-expand-all="true" :props="{ class: customNodeClass }">
        <template #default="{ node,data  }">
          <div>
            <i :class="data.icon" class="tree_icon"></i>
            {{ data.type == 1?data.title:data.title+'（'+ data.count + '）' }}
          </div>
        </template>
      </el-tree>
    </el-aside>
    <el-main>
      <fsbgd_table :key="node.id" :node="node" v-if="node.id" @loadTree="loadLeftData"></fsbgd_table>
    </el-main>
  </el-container>
</template>
<script>
import fsbgdApi from "@/api/fsbgd-api.js";
import Fsbgd_table from "@/views/gzt/fsbgd/fsbgd_table.vue";

export default {
  name: 'fsgbd',
  components: {Fsbgd_table},
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
      fsbgdApi.loadTreeDataService({menu: this.keyword}).then((res) => {
        this.treeData = res.data.menuTreeList;
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
#fsbgd .tree_icon.xgcx {
  background-image: url("@/assets/img/icon/xgcx.png");
}
#fsbgd .tree_icon.ddbz {
  background-image: url("@/assets/img/icon/ddbz.png");
}
#fsbgd .tree_icon.ddzx {
  background-image: url("@/assets/img/icon/ddzx.png");
}
#fsbgd .tree_icon.zrsh {
  background-image: url("@/assets/img/icon/zrsh.png");
}
#fsbgd .tree_icon.yfbz {
  background-image: url("@/assets/img/icon/yfbz.png");
}
#fsbgd .tree_icon.yfcl {
  background-image: url("@/assets/img/icon/yfcl.png");
}
#fsbgd .el-tree-node__content > .el-tree-node__expand-icon {
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
      .fsbgd_left{
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