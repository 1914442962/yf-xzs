<!--设备-DKY-->
<template>
  <div id="sbDky" class="gljh px2rem-ignore" @close="$emit('close')">
    <splitpanes style="height: 100%" class="default-theme" :key="guid">
      <pane :size="25">
        <div class="select-cz" v-show="CZLX == 'CZ' || CZLX == 'input'" :class="selectNode.CZID == testData.tdcsParam.CZID
                        ? 'alselect-cz'
                        : ''
                    " @click="selectCZ(testData.tdcsParam)">
          {{ testData.tdcsParam.CZMC }}
        </div>
        <div class="sb-left-tree alselect-cz" v-show="CZLX == 'xl'">
          线路
        </div>
        <!--                <div class="filter-div">-->
        <!--                    <el-input v-model="filterKey" size="mini" @keyup.enter.native="filterTree">-->
        <!--                        <i slot="suffix" class="el-input__icon el-icon-search" @click="filterTree"-->
        <!--                           style="cursor: pointer;"></i>-->
        <!--                    </el-input>-->
        <!--                </div>-->
        <!--                <div class="tree-outer">-->
        <!--                    <DkySbTree @changeTreeNode="changeTreeNode" :tree-filter-key="treeFilterKey"-->
        <!--                               :cz-param="czParam"></DkySbTree>-->
        <!--                </div>-->
      </pane>
      <pane :size="75">
        <div class="content-div">
          <div class="search-div">
            <div class="search-label">设备类型:&nbsp;</div>
            <div class="search-itme">
              <el-select class="search-datepicker" v-model="param.sblx" placeholder="请选择"
                         @change="changeCZLX">
                <el-option v-for="item in sblxOptions" :key="item.value" :label="item.label"
                           :value="item.value">
                </el-option>
              </el-select>
            </div>
            <div class="search-label">电压等级:&nbsp;</div>
            <div class="search-itme">
              <el-select class="search-datepicker" v-model="param.dydj" placeholder="请选择"
                         @change="changeCZLX">
                <el-option v-for="item in dydjoptions" :key="item.value" :label="item.label"
                           :value="item.value">
                </el-option>
              </el-select>
            </div>
            <div class="search-itme" style="margin-left: 10px">
              <el-input class="search-datepicker" @change="changeCZLX" v-model="param.keyword"
                        placeholder="请输入内容"></el-input>
            </div>
            <div class="search-itme" style="margin-left: 10px; width: 80px">
              <el-button style="
                                    width: 50px;
                                    line-height: 0px;
                                    text-align: center;
                                    text-indent: -8px;
                                " class="" @click="changeCZLX(true)">查询
              </el-button>
            </div>
          </div>
          <div class="select-input">
            <div class="select-content" v-loading="sbLoadingFlag">
              <div class="tilte">可选设备(双击选取设备)</div>
              <div class="show-div">
                <div class="text-label" :class="[
                                    item.checked == true ? 'selctet' : '',
                                ]" @click="ClickSelcteCanSelct(item)" @dblclick="dbClickCanSelect(item)"
                     v-for="(item, index) in canSelectList" :key="index + 'canSelect'">
                  {{ item.label }}
                </div>
              </div>
              <div class="page-div">
                <el-button class="page-icon pagebutton"
                           :disabled="param.pageIndex == 0" @click="pageChange(-1)">
                  上一页
                </el-button>
                <el-button class="page-icon pagebutton" :disabled="param.pageIndex + 1 == totalPage ||
                                    totalPage == 0
                                    " @click="pageChange(1)">
                  下一页
                </el-button>
              </div>
            </div>
            <div class="center-content">
              <div class="sortbutton upbutton" @click="moveUp">
                <Top></Top>
              </div>
              <div class="sortbutton downbutton" @click="moveDown">
                <Bottom></Bottom>
              </div>
              <div class="cneter-div">
                <div class="turn-right" @click="turnRight">
                  <d-arrow-right height="24"></d-arrow-right>
                </div>
              </div>
              <div class="cneter-div">
                <div class="turn-left" @click="turnLeft">
                 <d-arrow-left height=24></d-arrow-left>
                </div>
              </div>
            </div>
            <div class="select-content">
              <div class="tilte">
                已选数据<span style="color: red">注:双击可移除已选数据</span>
              </div>
              <div class="node-show-div">
                <div class="node-show-div-select" v-for="(item, index) in selectedNodes"
                     :key="'zcqSbDky_SelectedNodes_' + index"
                     @click="ClickAlSelcteCanSelct(item, index)"
                     @dblclick="deleteSelectedNode(item)">
                  <div class="text-label">
                    {{ item.label }}
                  </div>
                  <div class="show-div-right">
                    <el-checkbox v-show="showzsb" @change="selectDevice(item)" v-model="item.zsb">主
                    </el-checkbox>
                    <span style="color: red;margin-right: 5px;" v-show="showRequireLabel">*</span>
                    <el-select class="search-datepicker" v-show="showSelectSbzt && !isTysb"
                               style="width: 100px" v-model="item.sbzt" placeholder="请选择" clearable
                               :allow-create="true" :filterable="true">
                      <el-option v-for="item in sbztOptions1" :key="item.value + index"
                                 :label="item.label" :value="item.value">
                      </el-option>
                    </el-select>

                    <div class="delete-text-label" @click="deleteSelectedNode(item)"></div>
                  </div>
                </div>
              </div>
            </div>
            <div class="write-input">
              <div class="tilte">
                <span style="display: inline-block">手动录入</span>
                <span style="color: red">(数据库中没有的设备可在此手动添加)</span>
              </div>
              <div class="top-hand-div">
                <div class="write-input-textarea">
                  <el-input style="height: 100%" type="textarea" resize="none" placeholder="请输入内容"
                            v-model="selfInput"></el-input>
                </div>
                <div class="add-input" @click="addInpput()">
                  加入手写
                </div>
              </div>
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

#sbDky .el-input__suffix .el-input__suffix-inner .el-select__caret.el-input__icon {
  line-height: 20px;
}

#sbDky .el-textarea__inner {
  height: 100%;
}

#sbDky .search-datepicker .el-input__inner {
  height: 25px;
}

#sbDky .splitpanes.default-theme .splitpanes__pane {
  background: #fff;
}
</style>
<script>
import {Splitpanes, Pane} from "splitpanes";
import "splitpanes/dist/splitpanes.css";
import {guid, loadD5000Tree, loadDkySbTree} from "@/api/czsb-api.js";
import {ArrowLeft, ArrowRight, Bottom, DArrowLeft, DArrowRight, Top} from "@element-plus/icons-vue";

export default {
  name: "zcq-sb-dky",
  props: {
    // 主要停电设备
    isZytdsb: {
      type: Boolean,
      default: false,
    },
    // 投运设备
    isTysb: {
      type: Boolean,
      default: false,
    },
    isBYQ: {
      type: Boolean,
      default: false,
    },
    isFdj: {
      type: Boolean,
      default: false,
    },
    isMx: {
      type: Boolean,
      default: false,
    },
    isXsbty: {
      type: Boolean,
      default: false,
    },
    paramdata: {
      type: Object,
    },
    sblist: {
      type: Array,
      default: [],
    },
    id: {
      type: String,
      default: "",
    },
  },
  components: {
    DArrowLeft,
    DArrowRight,
    ArrowRight,
    ArrowLeft,
    Bottom,
    Top,
    Splitpanes,
    Pane,
  },
  data() {
    return {
      // 当前地区
      nowArea: "",
      czParam: {},
      // 已选择的树节点
      selectedNodes: [],
      // 树筛选关键字
      filterKey: "",
      treeData: [],
      treeFilterKey: "",
      guid: guid(),
      // 无树节点的情况下，下方输入的值
      selfInput: "",
      showzsb: false,
      sbLoadingFlag: false,
      canSelectList: [],
      defaultExpandId: "",
      totalPage: 1,
      props: {
        children: "children",
        label: "name",
        isLeaf: "leaf",
      },
      testData: {tdcsParam: {CZID: ""}},
      param: {
        sblx: "",
        dydj: "",
        subId: "",
        keyword: "",
        pageSize: "20",
        pageIndex: 0,
      },
      sblxOptions: [
        {label: "交流线路", value: "交流线路"},
        {label: "T接线路", value: "T接线路"},
        {label: "发电机", value: "发电机"},
        {label: "变压器", value: "变压器"},
        {label: "母线", value: "母线"},
        {label: "断路器", value: "断路器"},
        {label: "隔离开关", value: "隔离开关"},
        {label: "并联电容器", value: "并联电容器"},
        {label: "电流互感器", value: "电流互感器"},
        {label: "电压互感器", value: "电压互感器"},
      ],
      dydjoptions: [
        {label: "全部", value: ""},
        {label: "1000kV", value: "1000kV"},
        {label: "800kV", value: "800kV"},
        {label: "500kV", value: "500kV"},
        {label: "220kV", value: "220kV"},
        {label: "110kV", value: "110kV"},
        {label: "35kV", value: "35kV"},
        {label: "20kV", value: "20kV"},
        {label: "10kV", value: "10kV"},
      ],
      CZLX: "",
      treeNode: {},
      alSelectDataIndex: -1,
      alSelectData: {},
      selectNode: {},
    };
  },
  mounted() {
      this.nowArea = this.$store.state.userInfo.cropJc;
      this.testData = this.paramdata;
      this.czParam = this.paramdata.tdcsParam;
      if (this.testData.showzsb) {
        this.showzsb = true;
      }
      if (!this.testData.tdcsParam) {
        this.testData.tdcsParam = {
          czlx: "",
          CZID: "",
          dbId: "",
          stationType: "",
        };
      }
      this.CZLX = this.testData.tdcsParam.id;
      if (this.nowArea == "南京") {
        this.param.dydj = "110kV"
      }
      if (this.CZLX == "xl") {
        this.sblxOptions = [
          {label: "交流线路", value: "交流线路"},
          {label: "T接线路", value: "T接线路"},
        ];
        if (this.nowArea == "南京") {
          this.dydjoptions = [
            {label: "全部", value: ""},
            {label: "1000kV", value: "1000kV"},
            {label: "800kV", value: "800kV"},
            {label: "500kV", value: "500kV"},
            {label: "220kV", value: "220kV"},
            {label: "110kV", value: "110kV"},
          ];
          this.param.dydj = "110kV"
        }
        if (this.nowArea == "常州") {
          this.dydjoptions = [{label: "110kV", value: "110kV"}];
          this.param.dydj = this.dydjoptions[0].value;
        }
        this.param.sblx = this.sblxOptions[0].value;
        this.param.subId = "xl";
        this.queryDkyDevice();
      } else if (this.CZLX == "input") {
        this.param.sblx = this.sblxOptions[0].value;
        this.param.subId = "input";
        setTimeout(() => {
          this.selectCZ(this.testData.tdcsParam, true);
        }, 100);
      } else {

        if (this.isBYQ) {
          this.sblxOptions = [{label: '变压器', value: '变压器'}];
        }
        if (this.isMx) {
          this.sblxOptions = [{label: '母线', value: '母线'}];
        }
        if (this.isFdj) {
          this.sblxOptions = [{label: '发电机', value: '发电机'}];
        }
        this.CZLX = "CZ";
        this.param.sblx = this.sblxOptions[0].value;
        setTimeout(() => {
          this.selectCZ(this.testData.tdcsParam);
        }, 100);
      }

      this.sblist.forEach((item) => {
        let label = "";
        if (!label && item.specialDkyName) {
          label = item.specialDkyName;
        }
        if (!label && item.sbddmm) {
          label = item.sbddmm;
        }
        let sbmc = "";
        if (this.czParam.CZID == "xl" && this.nowArea != "常州") {
          sbmc = item.sbddmm;
        } else {
          sbmc = item.simpleDkyName ? item.simpleDkyName : item.sbddmm;
        }
        let obj = {
          zsb: item.zsb,
          sbzt: item.label,
          id: item.id,
          label: label,
          sbmc: sbmc,
          d5000id: item.d5000id,
          dydj: item.realdydj,
          sbid: item.sbid,
          sblx: item.sblx,
        };
        this.selectedNodes.push(obj);
      });



  },
  methods: {
    loadNode(node, resolve) {
      let curNode = node.data;
      if (Object.prototype.toString.call(curNode) !== "[object Object]") {
        return;
      }
      if (curNode.children && curNode.children.length > 0) {
        resolve(curNode.children);
      } else {
        loadD5000Tree(curNode)
            .then((data) => {
              resolve(data);
            })
            .catch();
      }
    },
    resetParam() {
      this.param.pageIndex = 0;
    },
    // 树节点筛选
    filterTree() {
      this.treeFilterKey = this.filterKey;
    },
    selectCZ(item, flag) {
      this.resetParam();
      this.curNode = item;
      this.selectNode = item;
      if (!flag) {
        this.param.subId = this.testData.tdcsParam.id;
      }

      this.queryDkyDevice();
    },
    // 双击选择节点
    clickEvent(node) {
      this.param.areaId = node.id;
      this.param.dbId = node.pid;
      this.param.level = node.level;
      this.treeNode = node;
      this.restParam();
      this.querySubstation();

      // if (!this.selectedNodes.some(item => item.id === obj.id && item.label === obj.label)) {
      //     obj.zsb = false;
      //     this.selectedNodes.push(obj);
      // }
    },
    changeCZLX(flag) {
      this.resetParam();
      console.log(flag, "flag");
      // 进入二次设备的查询接口
      this.queryDkyDevice();
    },
    queryDkyDevice() {
      this.sbLoadingFlag = true;
      loadDkySbTree({...this.param, isXsbty: this.isXsbty})
          .then((res) => {
            res.data.forEach((item) => {
              item.checked = false;
              item.zsb = false;
            });
            this.canSelectList = res.data;
            this.sbLoadingFlag = false;
            this.totalPage = Math.ceil(res.total / 20);
          })
          .catch(() => {
            this.sbLoadingFlag = false;
          });
    },
    pageChange(num) {
      if (num == -1 && this.param.pageIndex == 0) {
        return;
      }
      if (num == 1 && this.param.pageIndex + 1 == this.totalPage) {
        return;
      }
      this.param.pageIndex += num;
      this.queryDkyDevice();
    },
    // 单击可选
    ClickSelcteCanSelct(item) {
      this.canSelectList.forEach((item1) => {
        item1.checked = false;
      });
      item.checked = true;
      this.canSelectData = item;
    },
    // 双击可选
    dbClickCanSelect(item) {
      this.canSelectData = item;
      this.canSelectList.forEach((item1) => {
        item1.checked = false;
      });
      if (this.judgeExist()) {
        this.$message({
          message: "当前设备已添加",
          type: "warning",
        });
        return;
      }
      if (this.nowArea === "常州") {
        item.sbzt = "检修";
      }
      item.checked = false;
      this.selectedNodes.push(JSON.parse(JSON.stringify(item)));
      item.checked = true;
    },
    ClickAlSelcteCanSelct(item, index) {
      console.log(item, index);
      this.canSelectData = item;
      this.alSelectDataIndex = index;
      this.selectedNodes.forEach((item1) => {
        item1.checked = false;
      });
      item.checked = true;
    },
    deleteSelectedNode(item) {
      this.canSelectData = {};
      this.alSelectDataIndex = -1;
      this.selectedNodes.splice(this.selectedNodes.indexOf(item), 1);
      this.selectedNodes.forEach((item1) => {
        item1.checked = false;
      });
    },
    judgeExist() {
      if (this.selectedNodes.findIndex((c) => c.sbid == this.canSelectData.sbid) != -1) {
        return true;
      } else {
        return false;
      }
    },
    // 上移
    moveUp() {
      if (this.alSelectDataIndex == -1) {
        this.$message({
          message: "请选择一条数据",
          type: "warning",
        });
        return;
      }
      if (this.alSelectDataIndex == 0) {
        this.$message({
          message: "已经在第一个，无法上移",
          type: "warning",
        });
        return;
      }

      //在上一项插入该项
      this.selectedNodes.splice(
          this.alSelectDataIndex - 1,
          0,
          this.selectedNodes[this.alSelectDataIndex]
      );
      //删除后一项
      this.selectedNodes.splice(this.alSelectDataIndex + 1, 1);
      this.alSelectDataIndex = this.alSelectDataIndex - 1;
    },
    // 下移
    moveDown() {
      if (this.alSelectDataIndex == -1) {
        this.$message({
          message: "请选择一条数据",
          type: "warning",
        });
        return;
      }
      if (this.alSelectDataIndex == this.selectedNodes.length - 1) {
        this.$message({
          message: "已经在最后一个，无法下移",
          type: "warning",
        });
        return;
      }
      // 在下一项插入该项
      this.selectedNodes.splice(
          this.alSelectDataIndex + 2,
          0,
          this.selectedNodes[this.alSelectDataIndex]
      );
      // 删除前一项
      this.selectedNodes.splice(this.alSelectDataIndex, 1);
      this.alSelectDataIndex = this.alSelectDataIndex + 1;
    },
    turnRight() {
      if (this.canSelectData.sbid == undefined) {
        return;
      }
      if (this.judgeExist()) {
        this.$message({
          message: "当前设备已添加",
          type: "warning",
        });
        return;
      }

      this.selectedNodes.push(this.canSelectData);
    },
    // 向左
    turnLeft() {
      this.alSelectData = {};
      this.alSelectDataIndex = -1;
      this.selectedNodes = [];
    },

    // 无树节点情况下，点击加入手写
    addInpput() {
      let num = Math.random();
      this.dbClickCanSelect({
        id: "input" + num,
        label: this.selfInput,
        simpleDkyName: this.selfInput,
        sbmc: this.selfInput,
        sblx: "手写输入",
        sbid: "sbinput" + num
      });
    },
    // 确认
    confirm() {
      if (this.selectedNodes.length === 0) {
        this.$message({
          message: "请选择或输入一个设备进行保存",
          type: "warning",
        });
        return;
      }
      if (this.showRequireLabel) {
        let flag = this.selectedNodes.every((item) => item.sbzt);
        if (!flag) {
          this.$message({
            message: "请给所有设备选择类型",
            type: "warning",
          });
          return;
        }
      }
      let array = [];
      for (let i = 0; i < this.selectedNodes.length; i++) {
        let item = this.selectedNodes[i];
        let obj;
        // 地区 == 南京 并且 停电场所 == 线路
        // if (this.nowArea == '南京' && this.czParam && this.czParam.CZID == 'xl') {//放开为全省
        if (this.czParam && this.czParam.CZID == "xl" && this.nowArea != "常州") {
          let sbddmm = "";
          if (!item.czmc) {
            sbddmm = item.sbmc;
          } else {
            sbddmm = (item.czmc ? item.czmc : "") + ":" + (item.sbmc ? item.sbmc : "");
          }
          obj = {
            sbddmm: sbddmm,
            specialDkyName: item.label ? item.label : "",
            simpleDkyName: item.sbmc ? item.sbmc : "",
            sbid: item.sbid,
            label: item.sbzt ? item.sbzt : "",
            realdydj: item.realdydj
                ? item.realdydj
                : item.dydj
                    ? item.dydj
                    : "",
            zsb: item.zsb ? true : false,
            sblx: item.sblx ? item.sblx : "",
            czid: this.czParam.CZID,
            czmc: this.czParam.CZMC,
            id: item.id,
            d5000id: item.d5000id,
            sort: i + 1,
          };
        } else {
          obj = {
            // sbddmm: item.sbmc ? item.sbmc : '',
            sbddmm: item.label ? item.label : "",
            specialDkyName: item.label ? item.label : "",
            simpleDkyName: item.sbmc ? item.sbmc : "",
            sbid: item.sbid,
            label: item.sbzt ? item.sbzt : "",
            realdydj: item.realdydj
                ? item.realdydj
                : item.dydj
                    ? item.dydj
                    : "",
            zsb: item.zsb ? true : false,
            sblx: item.sblx ? item.sblx : "",
            czid: this.czParam.CZID,
            czmc: this.czParam.CZMC,
            id: item.id,
            d5000id: item.d5000id,
            sort: i + 1,
            sbedrl: item.sbedrl ? item.sbedrl : "",
            fdlx: item.fdlx ? item.fdlx : "",
          };
        }

        array.push(obj);
      }
      this.$emit('refreshSBXX', array)
      this.$emit("close");
    },
    // 取消
    cancel() {
      this.$emit("close");
    },
  },
  computed: {
    // 是否显示必填星号
    showRequireLabel() {
      return false;
    },
    // 是否显示设备状态下拉框
    showSelectSbzt() {
      return  false;
    },
    // 设备状态
    sbztOptions1() {
      return [
        {
          label: "运行",
          value: "运行",
        },
        {
          label: "检修",
          value: "检修",
        },
        {
          label: "冷备用",
          value: "冷备用",
        },
        {
          label: "热备用",
          value: "热备用",
        },
        {
          label: "停用保护",
          value: "停用保护",
        },
        {
          label: "停用",
          value: "停用",
        },
        {
          label: "启用",
          value: "启用",
        },
        {label: "充电", value: "充电"},
      ];
    },
    sbztOptions2() {
      if (this.isTysb) {
        return [
          {label: "主变更换", value: "主变更换"},
          {label: "保护更换", value: "保护更换"},
          {label: "流变更换", value: "流变更换"},
          {label: "线路改造", value: "线路改造"},
          {label: "压变更换", value: "压变更换"},
          //2024年10月31日 新设备投运新增选项
          {label: "新增主变", value: "新增主变"},
          {label: "新增保护", value: "新增保护"},
          {label: "新增流变", value: "新增流变"},
          {label: "新增线路", value: "新增线路"},
          {label: "新增压变", value: "新增压变"},
          //2024 11 29 新设备 主要变更新增
          {label: "母线新增", value: "母线新增"},
          {label: "母线改造", value: "母线改造"},
        ];
      } else {
        return [
          {label: "主变更换", value: "主变更换"},
          {label: "保护更换", value: "保护更换"},
          {label: "流变更换", value: "流变更换"},
          {label: "线路改造", value: "线路改造"},
          {label: "压变更换", value: "压变更换"},
          //2024年10月31日 新设备投运新增选项
          {label: "新增主变", value: "新增主变"},
          {label: "新增保护", value: "新增保护"},
          {label: "新增流变", value: "新增流变"},
          {label: "新增线路", value: "新增线路"},
          {label: "新增压变", value: "新增压变"},
        ];
      }

    },
    sbztOptions3() {
      return [
        {label: "主变更换", value: "主变更换"},
        {label: "保护更换", value: "保护更换"},
        {label: "流变更换", value: "流变更换"},
        {label: "线路改造", value: "线路改造"},
        {label: "压变更换", value: "压变更换"},
        {label: "主变改造", value: "主变改造"},
        {label: "新增主变", value: "新增主变"},
        {label: "新增保护", value: "新增保护"},
        {label: "新增流变", value: "新增流变"},
        {label: "新增线路", value: "新增线路"},
        {label: "新增压变", value: "新增压变"},
      ];
    },
  },
};
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

  .alselect-cz {
    background: #90cf8c;
  }

  .search-div {
    width: 100%;
    height: 40px;

    .search-label {
      margin-left: 10px;
      /*width: 60px;*/
      height: 30px !important;
      float: left;
      line-height: 30px;
      text-align: right;
    }

    .search-itme {
      width: 140px;
      height: 30px !important;
      float: left;

      .search-datepicker {
        height: 30px;
        width: 100%;

        :deep(input) {
          width: 100%;
          height: 30px;
        }
      }
    }
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

        .show-div {
          height: calc(100% - 80px);
          width: 100%;
          box-sizing: border-box;
          background: #efffff;
          overflow: auto;
          padding: 5px;
          position: relative;

          .text-label {
            width: 100%;
            height: 30px;
            text-align: left;
            color: #1516ff;
            line-height: 30px;
          }

          .text-label:hover {
            background: #eaeaea;
          }

          .disable-text-label {
            background: #f9f9f9;
            color: #d0d0d0;
          }

          .disable-text-label:hover {
            background: transparent;
          }

          .selctet {
            color: #fff;
            background: #71beff !important;
          }

          .candele {
            width: calc(100% - 110px);
            height: 30px;
            float: left;
            white-space: nowrap;
            overflow-x: auto;
            line-height: 15px;
          }

          .show-candele {
            width: calc(100% - 170px);
          }

          .zsb-check {
            width: 50px;
            height: 30px;
            float: left;
          }

          .selection {
            width: 120px;
            height: 30px;
            float: left;
          }

          .alselect {
            background: red;
          }
        }

        .disable-show-div {
          background: #f9f9f9;
          color: #d0d0d0;
          overflow: hidden;
        }

        .page-div {
          width: 100%;
          height: 50px;

          .page-icon {
            cursor: pointer;
            width: 100px;
            height: 30px;
            margin-top: 10px;
            font-size: 16px;
            line-height: 30px;
            border: 1px solid #b4b4b4;
            border-radius: 5px;
            text-align: center;
            margin-left: 10px;
            float: left;
            background: #efefef;
          }

          /* .page-icon:hover {
                   opacity: 0.7;
               }*/
          .pagebutton {
            padding: 0 !important;
          }

          .disablediv {
            background: #f9f9f9;
            color: #d0d0d0;
            border: 1px solid #efefef;
          }

          .disablediv:hover {
            opacity: 1;
          }
        }
      }

      .center-content {
        width: 30px;
        float: left;
        height: 100%;
        position: relative;

        .sortbutton {
          width: 100%;
          font-size: 27px;
          position: absolute;
          left: 0;
          border: 1px solid #b4b4b4;
          border-radius: 2px;
          height: 30px;
          line-height: 30px;
          text-align: center;
          z-index: 10;
        }

        .sortbutton:hover {
          cursor: pointer;
          opacity: 0.7;
        }

        .upbutton {
          top: 30px;
        }

        .downbutton {
          top: 80px;
        }

        .cneter-div {
          height: 50%;
          width: 100%;
          padding: 10px;
          box-sizing: border-box;
          position: relative;
          z-index: 1;

          .turn-right {
            position: absolute;
            bottom: 3%;
            width: 100%;
            /*height: 60px;*/
            font-size: 24px;
            border: 1px solid #b4b4b4;
            border-radius: 5px;
            text-align: center;
            left: 0px;
          }

          .turn-right:hover {
            cursor: pointer;
            opacity: 0.7;
          }

          .turn-left {
            position: absolute;
            top: 3%;
            width: 100%;
            /*height: 60px;*/
            font-size: 24px;
            border: 1px solid #b4b4b4;
            border-radius: 5px;
            text-align: center;
            left: 0px;
          }

          .turn-left:hover {
            cursor: pointer;
            opacity: 0.7;
          }

          .disable-turn {
            background: #f9f9f9;
            color: #d0d0d0;
          }

          .disable-turn:hover {
            cursor: initial;
            opacity: 1;
          }
        }
      }
    }

    .select-content {
      width: calc(100% - 20px);
      height: 100%;

      .node-show-div {
        width: 100%;
        height: calc(100% - 80px);
        box-sizing: border-box;
        background: #efffff;
        overflow: auto;
        padding: 5px;
        position: relative;

        .node-show-div-select {
          width: calc(100%);
          height: 30px;

          .text-label {
            width: calc(100% - 130px);
            height: 30px;
            text-align: left;
            color: #111;
            line-height: 30px;
            float: left;
          }

          .text-label2 {
            width: 100px;
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
            background: url("./img/delete-text-label.png") no-repeat;
            background-size: 25px;
            background-position: 50% 50%;
          }
        }

        //.node-show-div-select:hover {
        //    background: #84ea84;
        //}

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

      .top-hand-div {
        width: 100%;
        height: calc(100% - 60px);
        display: flex;

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
