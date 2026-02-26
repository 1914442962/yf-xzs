<!--厂站-D5000-->
<template>
  <div id="czD5000" class="gljh px2rem-ignore" @close="$emit('close')">
    <splitpanes style="height: 100%" class="default-theme" :key="guid">
      <pane :size="20">
        <d5000Tree @changeTreeNode="changeTreeNode" :d5000DefaultNode="d5000DefaultNode"></d5000Tree>
      </pane>
      <pane :size="79">
        <div class="search-div" v-show="treeNode.id!=undefined">
          <div class="search-label">厂站类型:&nbsp;</div>
          <div class="search-itme">
            <el-select class="search-datepicker" v-model="param.subType" placeholder="请选择"
                       @change="changeCZLX" :disabled="allDisabled">
              <el-option
                  v-for="item in czlxOptions"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value">
              </el-option>
            </el-select>
          </div>
          <div class="search-label">电压等级:&nbsp;</div>
          <div class="search-itme">
            <el-select class="search-datepicker" v-model="param.subVol" placeholder="请选择"
                       @change="changeCZLX" :disabled="allDisabled">
              <el-option
                  v-for="item in dyoptions"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value">
              </el-option>
            </el-select>
          </div>
          <div class="search-itme" style="margin-left: 10px">
            <el-input class="search-datepicker" @change="changeCZLX" v-model="param.subContent"
                      placeholder="请输入内容" :disabled="allDisabled"></el-input>
          </div>
        </div>
        <div class="content-div" v-show="treeNode.id!=undefined">
          <div class="select-input">
            <div class="select-content">
              <div class="tilte">可选厂站(双击选取厂站)</div>
              <div class="show-div" :class="allDisabled?'disable-show-div':''">
                <div class="text-label"
                     :class="[(item.czid)==canSelectData.czid?'selctet':'',allDisabled?'disable-text-label':'']"
                     @click="ClickSelcteCanSelct(item)" @dblclick="dbClickselctAlselect(item)"
                     v-for="(item,index) in canSelectList" :key="index+'canSelect'">
                  {{ item.czmc }}
                </div>
              </div>
              <div class="page-div">
                <el-button class="page-icon pagebutton"
                           :disabled="param.pageIndex==0||allDisabled"
                           @click="pageChange(-1)">
                  上一页
                </el-button>
                <el-button class="page-icon pagebutton"
                           :disabled="param.pageIndex+1==totalPage||allDisabled||totalPage==0"
                           @click="pageChange(1)">
                  下一页
                </el-button>
              </div>
            </div>
            <div class="center-content">
              <div class="cneter-div">
                <div class="turn-right"
                     :class="allDisabled?'disable-turn':''"
                     @click="turnRight">
                  <d-arrow-right height="24"></d-arrow-right>
                </div>
              </div>
              <div class="cneter-div">
                <div class="turn-left"
                     :class="allDisabled?'disable-turn':''"
                     @click="turnLeft">
                  <d-arrow-left height="24"></d-arrow-left>
                </div>
              </div>
            </div>
            <div class="select-content">
              <div class="tilte">已选厂站(双击删除已选厂站)</div>
              <div class="show-div" :class="allDisabled?'disable-show-div':''">
                <div class="text-label"
                     :class="[item.czid==alSelectData.czid?'selctet':'',allDisabled?'disable-text-label':'']"
                     @click="ClickAlSelcteCanSelct(item)" @dblclick="dbClickAlselctAlselect()"
                     v-for="(item,index) in alSelectList" :key="index+'alSelect'">
                  {{ item.czmc }}
                </div>
              </div>

            </div>
          </div>
          <div class="write-input">
            <div class="tilte">手工录入(<span style="color: red">注:厂站列表中没有的厂站允许在此填写</span>)</div>
            <div class="write-input-textarea">
              <el-input style="height: 100%"
                        type="textarea" resize="none"
                        placeholder="请输入内容"
                        v-model="inputCZ" :disabled="allDisabled">
              </el-input>
            </div>
          </div>

        </div>
        <div class="content-div" v-show="treeNode.id==undefined">
          <div class="select-content">

            <div class="tilte">
              <span>已选厂站</span>
              <span style="color: red;margin-left: 4px">注：双击可移除已选厂站</span>
            </div>
            <div class="nullnode-show-div">
              <div class="nullnode-show-div-select" v-show="alNullNodeInput!=''">
                <div class="text-label">{{ alNullNodeInput }}</div>
                <div class="delete-text-label" @click="delettextlabel"></div>
              </div>

            </div>
            <div class="tilte">
              <span>手工录入</span>
              <span style="color: red;margin-left: 4px">注：左侧设备树中没有的厂站允许在此手工填写</span>
            </div>
            <div class="nullnode-show-div">
              <div class="write-input-textarea">
                <el-input style="height: 100%"
                          type="textarea" resize="none"
                          placeholder="请输入内容"
                          v-model="NullNodeInput">
                </el-input>
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
.search-datepicker .el-input__inner {
  line-height: 15px;
}

#czD5000 .el-input__suffix .el-input__suffix-inner .el-select__caret.el-input__icon {
  line-height: 20px;
}

#czD5000 .el-textarea__inner {
  height: 100%;
}

#czD5000 .splitpanes.default-theme .splitpanes__pane {
  background: #fff;
}
</style>
<script>
import {Splitpanes, Pane} from 'splitpanes'

import 'splitpanes/dist/splitpanes.css'
import d5000Tree from './d5000Tree'
import {
  customAdd, guid, loadD5000Substation
} from '@/api/czsb-api'
import {DArrowLeft, DArrowRight} from "@element-plus/icons-vue";


export default {
  name: "zcq-cz-d5000",
  props: {
    d5000DefaultNode: Object,
    updateSource: String,
    id: String,
  },
  components: {
    DArrowRight,
    DArrowLeft,
    Splitpanes,
    Pane, d5000Tree
    // ProjectTypeSelection
  },
  mounted() {

  },
  computed: {
    czlxOptions() {
      return [{label: '变电站', value: 'BDZ'}, {label: '电厂', value: 'DC'}];
    }
  },
  data() {
    return {
      guid: guid(),
      param: {

        subType: 'BDZ', subVol: '', subContent: '', pageSize: '20', pageIndex: 0
      },
      // 页码最大值
      dyoptions: [
        {label: '', value: ''},
        {label: '1000kV', value: '112871465677750285'}, {label: '800kV', value: '112871465677750310'},
        {label: '500kV', value: '112871465677750274'}, {label: '220kV', value: '112871465677750279'},
        {label: '110kV', value: '112871465677750280'}, {label: '35kV', value: '112871465677750275'},
      ],
      // 可选列表
      canSelectList: [],
      // 总共多少页
      totalPage: 1,
      // 已选列表
      alSelectList: [],
      inputCZ: '',
      treeNode: {},
      // 选择的可选择厂站
      canSelectData: {},
      // 已选择厂站
      alSelectData: {},
      allDisabled: false,
      // 无树节点情况下，点击加入手填，上方获得的厂站名称
      alNullNodeInput: '',
      // 无树节点的情况下，下方输入的值
      NullNodeInput: '',
    }
  },
  methods: {
    // 改变厂站类型
    changeCZLX() {
      this.restParam();
      this.querySubstation();
    },
    // 点击改变所选树节点
    changeTreeNode(node) {
      console.log(node)
      if (node.id == 'XL') {
        this.treeNode = node
        this.allDisabled = true
        this.inputCZ = '线路'
        this.restParam();
        return
      }
      this.inputCZ = ''
      this.allDisabled = false
      this.treeNode = node
      this.param.areaId = node.id;
      this.param.dbId = node.pid;
      this.param.level = node.level;
      this.restParam();
      this.querySubstation();
    },
    // 重置查询条件
    restParam() {
      this.param.pageIndex = 0
    },
    querySubstation() {
      loadD5000Substation(this.param).then(data => {
        this.canSelectList = data.data
        this.totalPage = Math.ceil(data.total / 20)
        this.canSelectData = {}
      }).catch()
    },
    // 单击可选
    ClickSelcteCanSelct(item) {
      if (this.allDisabled) {
        return
      }
      this.canSelectData = item;
    },
    // 双击可选
    dbClickselctAlselect(item) {
      if (this.allDisabled) {
        return
      }
      this.canSelectData = item;
      this.alSelectList = [item]
    },
    pageChange(num) {
      if (this.allDisabled) {
        return
      }
      if (num == -1 && this.param.pageIndex == 0) {
        return
      }
      if (num == 1 && (this.param.pageIndex + 1) == this.totalPage) {
        return
      }
      this.param.pageIndex += num
      this.querySubstation();
    },
    // 单击已选
    ClickAlSelcteCanSelct(item) {
      if (this.allDisabled) {
        return
      }
      this.alSelectData = item
    },
    // 双击已选
    dbClickAlselctAlselect() {
      if (this.allDisabled) {
        return
      }
      this.alSelectData = {}
      this.alSelectList = []
    },
    // 向右
    turnRight() {
      if (this.allDisabled || this.canSelectData.czid == undefined) {
        return
      }
      this.alSelectList = [this.canSelectData]
    },
    // 向左
    turnLeft() {
      if (this.allDisabled) {
        return
      }
      this.alSelectData = {}
      this.alSelectList = []
    },
    // 删除输入的厂站
    delettextlabel() {
      this.alNullNodeInput = ''
    },
    // 无树节点情况下，点击加入手写
    addInpput() {
      this.alNullNodeInput = this.NullNodeInput
    },
    // 确认
    confirm() {
      if (this.treeNode.id == undefined) {
        if (this.alNullNodeInput == '') {
          this.$message({
            message: '请输入一个厂站进行保存',
            type: 'warning'
          });
          return
        }

      } else {
        if (this.inputCZ == '' && this.alSelectList.length == 0 && this.treeNode.id != 'XL') {
          this.$message({
            message: '请选择一个厂站进行保存',
            type: 'warning'
          });
          return
        }
      }

      let param = {
        // 所属单位ID
        SSDW: '',
        // 单位名称
        DWMC: '',
        // 厂站ID
        CZID: '',
        // 厂站名称
        CZMC: '',
        tdcslx: 'D5000',
        dbId: this.treeNode.pid
      };
      // 如果当前页面没有选择左侧的树节点
      if (this.treeNode.id == undefined) {
        param.CZMC = this.alNullNodeInput
        param.czlx = 'ST'
        param.label = this.alNullNodeInput
        this.dealInputAdd(param);
      } else {
        if (this.inputCZ != '' && this.inputCZ != '线路') {
          let stTDCZ = this.inputCZ.split(/[(\r\n)\r\n]+/).join(' ');
          param.CZMC = stTDCZ
          param.label = stTDCZ
          param.czlx = 'ST'
          this.dealInputAdd(param);
        } else {
          if (this.treeNode.id == 'XL') {
            param.CZMC = '线路'
            param.czlx = 'XL'
            param.CZID = 'XL'
            param.id = 'xl'
            param.label = '线路'
          } else {
            param.SSDW = this.treeNode.id
            param.DWMC = this.treeNode.name
            param.CZID = this.alSelectList[0].czid
            param.CZMC = this.alSelectList[0].czmc
            param.id = this.alSelectList[0].czid
            param.label = this.alSelectList[0].czmc
            param.czlx = 'CZ'
            param.dbId = this.alSelectList[0].dbId
            param.fqmc = this.alSelectList[0].fqmc;
            param.fqmcDispidx = this.alSelectList[0].fqmcDispidx;
            /*if (this.treeNode.level == '2' || this.treeNode.id == '113715891127975942') {
                param.dbId = this.treeNode.pid
            }*/

          }

          this.$emit('refreshCZXX', param);
          this.$emit('close')
        }

      }

    },
    // 处理手动输入
    dealInputAdd(param) {
      let addParma = {name: param.CZMC, sblb: this.param.subType, dq: this.treeNode.id}

      customAdd(addParma).then(res => {
        param.CZID = res.data
        param.id = res.data
        this.$emit('refreshCZXX', param);
        this.$emit('close')
      })
    },
    // 取消
    cancel() {
      this.$emit('close')
    },
  },
}
</script>

<style scoped lang="scss">
.gljh.px2rem-ignore {
  width: 100%;
  height: 100%;

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
    height: 500px;
    /*height: calc(100% - 80px);*/
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
        width: 40px;
        float: left;
        height: 100%;

        .cneter-div {
          height: 50%;
          width: 100%;
          padding: 10px;
          box-sizing: border-box;
          position: relative;

          .turn-right {
            position: absolute;
            bottom: 3%;
            width: 100%;
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

      .nullnode-show-div {
        width: 100%;
        height: calc((100% - 4.28571rem) / 2);
        box-sizing: border-box;
        background: #efffff;
        overflow: auto;
        padding: 5px;
        position: relative;

        .nullnode-show-div-select {
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
            background: url("../../img/delete-text-label.png") no-repeat;
            background-size: 25px;
            background-position: 50% 50%;
          }
        }

        .nullnode-show-div-select:hover {
          background: #84ea84;
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


