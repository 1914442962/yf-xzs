<template>
  <vxe-splitter
    id="gzt"
    height="100%"
    :action-config="{ showPrevButton: true }"
    :resize="false"
  >
    <vxe-splitter-panel width="12%">
      <template #default>
        <el-tree
          :data="treeData"
          @node-click="handleNodeClick"
          node-key="path"
          ref="treeRef"
          :props="{ class: customNodeClass }"
          :key="MathKey"
          :default-expanded-keys="defaultExpandedKeys"
          :current-node-key="defaultExpandedKeys[0]"
          :default-expand-all="defaultExpandAll"
        >
          <template #default="{ node, data }">
            <div>
              <i
                v-if="data.type == 1 || data.type == 2"
                :class="data.icon"
                class="tree_icon"
              ></i>
              {{ data.title }}
            </div>
          </template>
        </el-tree>
      </template>
    </vxe-splitter-panel>
    <vxe-splitter-panel min-width="88%" class="main_class">
      <template #default>
        <div v-if="isShowWelcomePage" class="welcomePage"></div>
        <router-view />
      </template>
    </vxe-splitter-panel>
  </vxe-splitter>
</template>
<script>
import gztApi from "@/api/gzt-api.js";
import UrlUtils from "@/utils/url-utils.js";

export default {
  name: "gzt",
  data() {
    return {
      isShowWelcomePage: true,
      keyword: "",
      activeName: "默认",
      treeData: [],
      defaultExpandAll: false,
      MathKey: 0,
    };
  },
  watch: {
    "$route.path": {
      handler(val) {
        if (val) {
          if (this.$route.path == "/gzt") {
            this.isShowWelcomePage = true;
          } else {
            this.isShowWelcomePage = false;
          }
        }
      },
      immediate: true,
    },
  },
  computed: {
    defaultExpandedKeys() {
      return [this.$route.path.replace("/", "")];
    },
  },
  created() {
    this.loadLeftData();
  },
  methods: {
    customNodeClass({ path }) {
      return this.$route.path.replace("/", "") == path ? "active_tree" : "";
    },
    loadLeftData() {
      this.loadTreeData();
      this.loadCollectData();
    },
    loadTreeData() {
      gztApi.loadTreeDataService({ menu: this.keyword }).then((res) => {
        if (this.$store.state.gztTree) {
          res.data = res.data.filter(
            (item) => item.path === this.$store.state.gztTree,
          );
          this.defaultExpandAll = true;
        }
        this.treeData = res.data;
        this.MathKey = Math.random();
        if (this.$store.state.gztTree) {
          this.$nextTick(() => {
            if (this.$store.state.gztPath) {
              this.$router.push({ path: `/${this.$store.state.gztPath}` });
            } else {
              this.handleNodeClick(res.data[0].children[0]);
            }
          });
        }
      });
    },
    loadCollectData() {},
    handleNodeClick(e) {
      if (!e.children || e.children.length == 0) {
        this.$router.push({ path: `/${e.path}` });
      }
    },
  },
};
</script>
<style>
#gzt .el-tabs__nav {
  width: 100%;
  justify-content: space-around;
}
#gzt .el-tree > .el-tree-node {
  margin-bottom: 6px;
}
#gzt .el-tree > .el-tree-node > .el-tree-node__content > div {
  font-weight: bold;
  font-size: 16px;
}

#gzt
  .el-tree-node__children
  .el-tree-node.active_tree
  > .el-tree-node__content {
  color: #d48f17;
  background-image: url("@/assets/img/active_bgc.png");
  background-size: 100% 100%;
  background-color: transparent !important;
}

#gzt .tree_icon {
  width: 16px;
  height: 16px;
  display: inline-block;
  vertical-align: bottom;
  background-size: 100% 100%;
  margin-right: 4px;
}

#gzt .el-tree-node__content {
  position: relative;
}

#gzt_tab .el-tree-node__content > .el-tree-node__expand-icon {
  position: absolute;
  right: 0;
  top: 0;
  transform: rotate(180deg);
}

#gzt_tab .el-tree-node__expand-icon.expanded {
  transform: rotate(90deg) !important;
}

#gzt .tree_icon.fxyj1 {
  background-image: url("@/assets/img/icon/fxyj1.png");
}

#gzt .tree_icon.fxyj2 {
  background-image: url("@/assets/img/icon/fxyj2.png");
}
#gzt_tab .el-tree > .el-tree-node > .el-tree-node__children {
  background-color: rgba(190, 228, 219, 0.2);
}
#gzt .el-tree-node__children .el-tree-node.active_tree .tree_icon.fxyj2 {
  background-image: url("@/assets/img/icon/fxyj2_active.png");
}

#gzt .tree_icon.sbjx1 {
  background-image: url("@/assets/img/icon/sbjx1.png");
}

#gzt .tree_icon.sbjx2 {
  background-image: url("@/assets/img/icon/sbjx2.png");
}

#gzt .el-tree-node__children .el-tree-node.active_tree .tree_icon.sbjx2 {
  background-image: url("@/assets/img/icon/sbjx2_active.png");
}

#gzt .tree_icon.sbqd1 {
  background-image: url("@/assets/img/icon/sbqd1.png");
}

#gzt .tree_icon.sbqd2 {
  background-image: url("@/assets/img/icon/sbqd2.png");
}

#gzt .el-tree-node__children .el-tree-node.active_tree .tree_icon.sbqd2 {
  background-image: url("@/assets/img/icon/sbqd2_active.png");
}

#gzt .tree_icon.xwb1 {
  background-image: url("@/assets/img/icon/xwb1.png");
}

#gzt .tree_icon.xwb2 {
  background-image: url("@/assets/img/icon/xwb2.png");
}
#gzt .el-tree-node__children .el-tree-node.active_tree .tree_icon.xwb2 {
  background-image: url("@/assets/img/icon/xwb2_active.png");
}

#gzt .tree_icon.ndfs1 {
  background-image: url("@/assets/img/icon/ndfs1.png");
}

#gzt .tree_icon.ndfs2 {
  background-image: url("@/assets/img/icon/ndfs2.png");
}
#gzt .el-tree-node__children .el-tree-node.active_tree .tree_icon.ndfs2 {
  background-image: url("@/assets/img/icon/ndfs2_active.png");
}

#gzt .tree_icon.bwdd1 {
  background-image: url("@/assets/img/icon/bwdd1.png");
}

#gzt .tree_icon.bwdd2 {
  background-image: url("@/assets/img/icon/bwdd2.png");
}
#gzt .el-tree-node__children .el-tree-node.active_tree .tree_icon.bwdd2 {
  background-image: url("@/assets/img/icon/bwdd2_active.png");
}

#gzt .tree_icon.jxt1 {
  background-image: url("@/assets/img/icon/jxt1.png");
}

#gzt .tree_icon.jxt2 {
  background-image: url("@/assets/img/icon/jxt2.png");
}
#gzt .el-tree-node__children .el-tree-node.active_tree .tree_icon.jxt2 {
  background-image: url("@/assets/img/icon/jxt2_active.png");
}

#gzt
  .vxe-splitter-wrapper
  .vxe-splitter-panel:first-child
  .vxe-splitter-panel--inner {
  background-image:
    linear-gradient(#ffffff, #ffffff), linear-gradient(#edfffa, #edfffa);
  padding: 12px;
  opacity: 0.84;
}
#gzt
  .vxe-splitter-wrapper
  .vxe-splitter-panel:nth-child(2)
  .vxe-splitter-panel--inner {
  padding: 0 16px;
  padding-right: 0;
}
#gzt .welcomePage {
  width: 100%;
  height: 100%;
  background-image: url("@/assets/img/gzt_bgc.png");
  background-size: 100% 100%;
}
</style>
<style scoped lang="scss"></style>
