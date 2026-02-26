<!--厂站-OMS-->
<template>
  <div id="czOMS" class="gljh px2rem-ignore" @close="$emit('close')">
    <splitpanes style="height: 100%" class="default-theme">
      <pane size="25" style="overflow-y: auto">
        <omsTree @changeTreeNode="changeTreeNode" :omsDefaultNode="omsDefaultNode"></omsTree>
      </pane>
      <pane size="75">
        <div class="search-div">
          <div class="search-label">厂站类型:&nbsp;</div>
          <div class="search-itme">
            <el-select class="search-datepicker" v-model="param.substation" placeholder="请选择"
                       @change="changeCZLX" :disabled="allDisabled">
              <el-option
                  v-for="item in czOptions"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value">
              </el-option>
            </el-select>
          </div>
          <div class="search-label">电压等级:&nbsp;</div>
          <div class="search-itme">
            <el-select class="search-datepicker" v-model="param.dydj" placeholder="请选择"
                       @change="changeDYDJ" :disabled="allDisabled">
              <el-option
                  v-for="item in dyoptions"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value">
              </el-option>
            </el-select>
          </div>
          <div class="search-label">模糊搜索:&nbsp;</div>
          <div class="search-itme" style="margin-left: 10px">
            <el-input class="search-datepicker" @change="changeDYDJ" v-model="param.text"
                      :disabled="allDisabled"
                      placeholder="请输入内容"></el-input>
          </div>
        </div>
        <div class="content-div">
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
            <div class="tilte">
              <span>手工录入</span>
              <span style="color: red;margin-left: 4px">(注:厂站列表中没有的厂站允许在此填写)</span></div>
            <div class="write-input-textarea">
              <el-input style="height: 100%"
                        type="textarea" resize="none" :disabled="allDisabled"
                        placeholder="请输入内容"
                        v-model="inputCZ">
              </el-input>
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
#czOMS .el-input__suffix .el-input__suffix-inner .el-select__caret.el-input__icon {
  line-height: 20px;
}

#czOMS .el-textarea__inner {
  height: 100%;
}

#czOMS .splitpanes.default-theme .splitpanes__pane {
  background: #fff !important;
}

</style>
<script>
import {Splitpanes, Pane} from 'splitpanes'
import 'splitpanes/dist/splitpanes.css'
import omsTree from './omsTree'
import {
  customAdd, loadDOMSSubstation
} from '@/api/czsb-api'
import {DArrowLeft, DArrowRight} from "@element-plus/icons-vue";

export default {
  name: "zcq-cz-oms",
  props: {
    omsDefaultNode: Object,
    updateSource: String,
    id: String,
  },
  components: {
    DArrowLeft,
    DArrowRight,
    Splitpanes, Pane,
    omsTree

  },
  mounted() {
  },
  computed: {
    czOptions() {
      return [
        {label: '变电站', value: 'MW_APP.MWT_UD_SB_BDZ'},
        {label: '统调电厂', value: 'MW_APP.MWT_UD_SB_TDDC'},
        {label: '非统调电厂', value: 'MW_APP.MWT_UD_SB_FTDDC'},
      ];
    }
  },
  data() {
    return {
      param: {
        substation: 'MW_APP.MWT_UD_SB_BDZ', dydj: '', text: '', pageSize: '20', pageIndex: 0
      },
      // 页码最大值
      dyoptions: [
        {label: '', value: ''},
        {label: '1000kV', value: '1000000'},
        {label: '500kV', value: '500000'},
        {label: '220kV', value: '220000'},
        {label: '110kV', value: '110000'},
        {label: '35kV', value: '35000'},
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
    }
  },
  methods: {
    initPx2Rem() {

    },
    // 改变厂站类型
    changeCZLX() {
      if (JSON.stringify(this.treeNode) == "{}") {
        this.$message({
          message: '请先选择厂站所在区域',
          type: 'warning'
        });
        this.dealCZLX();
        return
      } else {
        this.restParam()
        this.querySubstation();
      }
    },
    // 改变电压等级
    changeDYDJ() {
      this.restParam()
      this.querySubstation();
    },
    // 点击改变所选树节点
    changeTreeNode(node) {
      console.log('OMS')
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
      this.param.value = node.id;
      this.restParam();
      // this.param.dbId = node.pid;
      this.querySubstation();
    },
    // 重置查询条件
    restParam() {
      this.param.pageIndex = 0
    },
    querySubstation() {
      loadDOMSSubstation(this.param).then(data => {
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
      if (num == 1 && this.param.pageIndex == this.totalPage) {
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
    // 确认
    confirm() {
      if (this.inputCZ == '' && this.alSelectList.length == 0 && this.treeNode.id != 'XL') {
        this.$message({
          message: '请选择一个厂站进行保存',
          type: 'warning'
        });
        return
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
        tdcslx: 'OMS',
        stationType: this.param.substation,
      };
      if (this.inputCZ != '' && this.inputCZ != '线路') {
        let stTDCZ = this.inputCZ.split(/[(\r\n)\r\n]+/).join(' ');
        param.CZMC = stTDCZ
        param.label = stTDCZ
        param.czlx = 'ST'
        let addParma = {name: param.CZMC, sblb: this.param.substation, dq: this.treeNode.id}
        customAdd(addParma).then(res => {
          param.CZID = res.data
          param.id = res.data
          this.$emit('refreshCZXX', param);
          this.$emit('close')
        })
      } else {
        if (this.treeNode.id == 'XL') {
          param.CZMC = '线路'
          param.czlx = 'XL'
          param.id = 'xl'
          param.label = '线路'
          param.CZID = 'XL'
        } else {
          param.SSDW = this.treeNode.id
          param.DWMC = this.treeNode.name
          param.CZID = this.alSelectList[0].czid
          param.CZMC = this.alSelectList[0].czmc
          param.id = this.alSelectList[0].czid
          param.label = this.alSelectList[0].czmc
          param.czlx = 'CZ'
        }
        this.$emit('refreshCZXX', param);
        this.$emit('close')
      }

    },
    // 取消
    cancel() {
      this.$emit('close')
    },
    dealCZLX() {
      if (this.param.substation == 'BDZ') {
        this.param.substation = 'DC'
      } else {
        this.param.substation = 'BDZ'
      }
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
    /*height: calc(100% - 80px);*/
    height: 500px;
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

          .disablediv {
            background: #f9f9f9;
            color: #d0d0d0;
            border: 1px solid #efefef;
          }

          .disablediv:hover {
            opacity: 1;
          }

          .pagebutton {
            padding: 0 !important;
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

    .write-input {
      height: 200px;

      .write-input-textarea {
        width: 100%;
        height: calc(100% - 30px);
        /*height: 150px;*/
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


