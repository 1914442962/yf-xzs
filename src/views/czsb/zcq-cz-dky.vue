<!--厂站-DKY-->
<template>
  <div id="czDKY" class="gljh px2rem-ignore" @close="$emit('close')">
    <splitpanes style="height: 100%" class="default-theme" :key="guid">
      <pane :size="25">
        <div class="filter-div">
          <el-input v-model="filterKey" size="mini" @keyup.enter.native="filterTree">
            <i slot="suffix" class="el-input__icon el-icon-search" @click="filterTree"
               style="cursor: pointer;"></i>
          </el-input>
        </div>
        <div class="tree-outer">
          <DkyCzTree @changeTreeNode="changeTreeNode" :tree-filter-key="treeFilterKey"></DkyCzTree>
        </div>
      </pane>
      <pane :size="75">
        <div class="content-div">
          <div class="select-content">
            <div class="tilte">
              <span>已选厂站</span>
              <span style="color: red;margin-left: 4px">注：双击可移除已选厂站</span></div>
            <div class="node-show-div">
              <div class="node-show-div-select" v-if="selectedNode.id" @dblclick="deleteSelectedNode">
                <div class="text-label">{{ selectedNode.label }}</div>
                <div class="delete-text-label" @click="deleteSelectedNode"></div>
              </div>
            </div>
            <div class="tilte">
              <span>手工录入</span>
              <span style="color: red">(数据库中没有的厂站可在此手动添加)</span></div>
            <div class="node-show-div">
              <div class="write-input-textarea">
                <el-input style="height: 100%" type="textarea" resize="none" placeholder="请输入内容"
                          v-model="selfInput"></el-input>
              </div>
              <div class=" add-input" @click="addInpput()">加入手写</div>
            </div>
          </div>
        </div>
        <div class="bottom-button-div">
          <div class="half-div">
            <div class="gljh-btn qd" @click="confirm()">确认</div>
          </div>
          <div class="half-div">
            <div class="gljh-btn gb" @click="cancel()">取消</div>
          </div>
        </div>
      </pane>
    </splitpanes>
  </div>
</template>
<style>
/*引入49版本兼容样式*/
.search-datepicker .el-input__inner {
  line-height: 15px;
}

#czDKY .el-input__suffix .el-input__suffix-inner .el-select__caret.el-input__icon {
  line-height: 20px;
}

#czDKY .el-textarea__inner {
  height: 100%;
}

#czDKY .splitpanes.default-theme .splitpanes__pane {
  background: #fff;
}
</style>
<script>
import 'splitpanes/dist/splitpanes.css'
import DkyCzTree from "./DkyCzTree";

import {Pane, Splitpanes} from "splitpanes";
import {guid} from "@/api/czsb-api.js";

export default {
  name: "zcq-cz-dky",
  props: {

    d5000DefaultNode: Object,
    updateSource: String,
    id: String
  },
  components: {
    DkyCzTree,
    Splitpanes,
    Pane
  },
  data() {
    return {
      // 已选择的树节点
      selectedNode: {},
      // 树筛选关键字
      filterKey: '',
      treeFilterKey: '',
      guid: guid(),
      // 无树节点的情况下，下方输入的值
      selfInput: '',
    }
  },
  methods: {
    // 树节点筛选
    filterTree() {
      this.treeFilterKey = this.filterKey;
    },
    // 点击改变所选树节点
    changeTreeNode(node) {
      if (JSON.stringify(this.selectedNode) === '{}') {
        this.selectedNode = node;
      }
      // this.selectedNode = node;
    },
    deleteSelectedNode() {
      this.selectedNode = {};
    },
    // 无树节点情况下，点击加入手写
    addInpput() {
      this.selectedNode = {
        id: 'input',
        label: this.selfInput,
        czid: '',
        czmc: this.selfInput,
      }
    },
    // 确认
    confirm() {
      if (!this.selectedNode.id) {
        this.$message({
          message: '请选择或输入一个厂站进行保存',
          type: 'warning'
        });
        return
      }
      let param = {};
      param.tdcslx = 'DKY';
      param.CZID = this.selectedNode.czid
      param.CZMC = this.selectedNode.czmc
      param.id = this.selectedNode.id
      param.label = this.selectedNode.label
      this.$emit('refreshCZXX', param)
      this.$emit('close')
    },
    // 取消
    cancel() {
      this.$emit('close')
    },
  }
}
</script>

<style scoped lang="scss">
.gljh.px2rem-ignore {
  width: 100%;
  height: 100%;

  .filter-div {
    width: calc(100% - 10px);
    height: 50px;
    display: flex;
    align-items: center;
  }

  .tree-outer {
    width: 100%;
    height: calc(100% - 50px);
  }

  .content-div {
    height: calc(100% - 50px);
    width: 100%;

    .select-input {
      height: calc(100% - 200px);
      width: 100%;

      .select-content {
        width: calc(50% - 20px);
        height: 100%;
        float: left;

        .tilte {
          height: 30px;
          width: 100%;
        }
      }
    }

    .select-content {
      width: calc(100% - 20px);
      height: 100%;

      .node-show-div {
        width: 100%;
        height: calc((100% - 4.28571rem) / 2);
        box-sizing: border-box;
        background: #efffff;
        overflow: auto;
        padding: 5px;
        position: relative;

        .node-show-div-select {
          width: calc(100%);
          height: 30px;

          .text-label {
            width: calc(100% - 50px);
            height: 30px;
            text-align: left;
            color: #111;
            line-height: 30px;
            float: left;
          }

          .delete-text-label {
            width: 50px;
            height: 100%;
            float: left;
            background: url("img/delete-text-label.png") no-repeat;
            background-size: 25px;
            background-position: 50% 50%;
          }
        }

        .write-input-textarea {
          width: calc(100% - 100px);
          height: 100%;
          float: left;
        }

        .add-input {
          height: 28px;
          padding: 0 10px;
          line-height: 28px;
          color: #fff;
          border-radius: 5px;
          cursor: pointer;
          text-align: center;
          background: #95a8ad;
          float: left;
          margin-left: 12px;
          margin-top: 15%;
        }
      }
    }


    .write-input {
      height: 200px;

      .write-input-textarea {
        width: 100%;
        height: calc(100% - 30px);
      }
    }


  }

  .bottom-button-div {
    width: 100%;
    height: 40px;

    .half-div {
      width: 50%;
      height: 100%;
      padding: 10px;
      display: inline-block;
      float: left;

      .gljh-btn {
        width: 80px;
        height: 28px;
        padding: 0 10px;
        line-height: 28px;
        color: #fff;
        border-radius: 5px;
        cursor: pointer;
        text-align: center;
      }

      .gb {
        background: #95a8ad;
        margin-right: 20px;
      }

      .qd {
        background: #13bbb5;
        margin-right: 20px;
        float: right;
      }
    }
  }
}
</style>


