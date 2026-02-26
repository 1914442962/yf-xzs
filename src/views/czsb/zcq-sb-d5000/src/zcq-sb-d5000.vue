<!--设备-D5000-->
<template>
    <div id="sbD5000" class="gljh px2rem-ignore" @close="$emit('close')">
        <Splitpanes style="height: 100%" class="default-theme">
            <pane size="20">
                <div class="select-cz" v-show="CZLX=='CZ'"
                     :class="selectNode.CZID==testData.tdcsParam.CZID?'alselect-cz':''"
                     @click="selectCZ(testData.tdcsParam)">
                    {{ testData.tdcsParam.CZMC }}
                </div>
                <div class="sb-left-tree" v-show="CZLX!='CZ'">
                    <el-tree ref="tree" node-key='id' :expand-on-click-node="false" :data="treeData"
                             :props="props" @node-click="clickEvent" lazy :load="loadNode"
                             :default-expanded-keys='[defaultExpandId]'
                             highlight-current>
                    </el-tree>
                </div>
            </pane>
            <pane>
                <a v-show="CZLX!='ST'">
                    <div class="search-div">
                        <div class="search-label">设备类型:&nbsp;</div>
                        <div class="search-itme">
                            <el-select class="search-datepicker" v-model="param.deviceType" placeholder="请选择"
                                       @change="changeCZLX">
                                <el-option
                                    v-for="item in options"
                                    :key="item.value"
                                    :label="item.label"
                                    :value="item.value">
                                </el-option>
                            </el-select>
                        </div>
                        <div class="search-label">电压等级:&nbsp;</div>
                        <div class="search-itme">
                            <el-select class="search-datepicker" v-model="param.dydj" placeholder="请选择"
                                       @change="changeCZLX">
                                <el-option
                                    v-for="item in dydjoptions"
                                    :key="item.value"
                                    :label="item.label"
                                    :value="item.value">
                                </el-option>
                            </el-select>
                        </div>
                        <div class="search-itme" style="margin-left: 10px">
                            <el-input class="search-datepicker" @change="changeCZLX" v-model="param.deviceContent"
                                      placeholder="请输入内容"></el-input>
                        </div>
                        <div class="search-itme" style="margin-left: 10px">
                            <el-button style="width: 50px;line-height: 0px;text-align: center;text-indent: -8px;"
                                       class="" @click="changeCZLX(true)">查询
                            </el-button>
                        </div>
                    </div>
                    <div class="content-div">
                        <div class="select-input">
                            <div class="select-content" v-loading="sbLoadingFlag">
                                <div class="tilte">可选设备(双击选取设备)</div>
                                <div class="show-div" :class="allDisabled?'disable-show-div':''">
                                    <div class="text-label"
                                         :class="[item.checked==true?'selctet':'',allDisabled?'disable-text-label':'']"
                                         @click="ClickSelcteCanSelct(item)" @dblclick="dbClickCanSelect(item)"
                                         v-for="(item,index) in canSelectList" :key="index+'canSelect'">
                                        {{ item.sbddmm }}
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
                                <div class="sortbutton upbutton" @click="moveUp">
                                  <Top></Top>
                                </div>
                                <div class="sortbutton downbutton" @click="moveDown">
                                  <Bottom></Bottom>
                                </div>
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
                                      <d-arrow-left height=24></d-arrow-left>
                                    </div>
                                </div>
                            </div>
                            <div class="select-content">
                                <div class="tilte">已选设备(双击删除已选设备)</div>
                                <div class="show-div" :class="allDisabled?'disable-show-div':''">
                                    <a v-for="(item,index) in alSelectList" :key="index+'alSelect'">
                                        <div class="text-label "
                                             :class="[index==alSelectDataIndex?'selctet':'',showzsb?'candele show-candele':'candele',allDisabled?'disable-text-label':'']" @click="ClickAlSelcteCanSelct(item,index)" @dblclick="dbClickAlselctAlselect(index)">
                                            {{ item.sbddmm ? item.sbddmm : item.sbmc }}
                                        </div>
                                        <div v-show="showzsb" class="zsb-check">
                                            <el-checkbox @change="selectDevice(index)" v-model="item.zsb">主
                                            </el-checkbox>
                                        </div>
                                        <div class="selection" style="display: flex;"
                                             v-show="!isCommon">
                                            <span style="color: red;margin-right: 5px;"
                                                  v-show="!sfts">*</span>
                                            <el-select class="search-datepicker" v-model="item.label" placeholder="请选择"
                                                       clearable
                                                       :allow-create="fromRjh" :filterable="fromRjh">
                                                <el-option
                                                    v-for="item in options2(item)"
                                                    :key="item.value"
                                                    :label="item.label"
                                                    :value="item.value">
                                                </el-option>
                                            </el-select>

                                        </div>

                                    </a>
                                </div>

                            </div>
                        </div>
                        <div class="write-input" v-show="testData.bdlx&&testData.bdlx.indexOf('jl')==-1">
                            <div class="tilte">手工录入(<span style="color: red">注:厂站列表中没有的厂站允许在此填写</span>)</div>
                            <div class="top-hand-div">
                                <div class="write-input-textarea">
                                    <el-input style="height: 100%"
                                              type="textarea" resize="none"
                                              placeholder="请输入内容"
                                              v-model="inputCZ">
                                    </el-input>
                                </div>
                                <div class=" right-button" @click="addInpputCZ()">加入手写</div>
                            </div>
                        </div>

                    </div>
                </a>
                <div class="content-div" v-show="CZLX=='ST'">
                    <div class="select-content">
                        <div class="tilte">已选设备<span style="color: red">注：双击可移除已选设备</span></div>
                        <div class="nullnode-show-div">
                            <div class="nullnode-show-div-select" :key="index+'slect'"
                                 v-for="(item,index) in NullNodeInputList"
                                 @dblclick="delettextlabel(index)">
                                <div class="text-label">{{ item.sbddmm }}</div>
                                <div class="text-label2" style="display: flex;"
                                     v-show="!isCommon">
                                    <span style="color:red;margin-right: 5px;" v-show="!sfts">*</span>
                                    <el-select class="search-datepicker" v-model="item.label" placeholder="请选择"
                                               clearable
                                               :allow-create="fromRjh" :filterable="fromRjh">
                                        <el-option
                                            v-for="item in options2(item)"
                                            :key="item.value"
                                            :label="item.label"
                                            :value="item.value">
                                        </el-option>
                                    </el-select>
                                </div>
                                <div class="delete-text-label" @click="delettextlabel(index)"></div>
                            </div>

                        </div>
                        <div class="tilte">手工录入<span style="color: red">注：左侧设备树中没有的设备允许在此手工填写</span></div>
                        <div class="nullnode-show-div">
                            <div class="write-input-textarea">
                                <el-input style="height: 100%"
                                          type="textarea" resize="none"
                                          placeholder="请输入内容"
                                          v-model="NullNodeInput">
                                </el-input>
                            </div>
                            <div class="add-input" @click="addInpput()">加入手写</div>
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
        </Splitpanes>
    </div>
</template>
<style>
    #sbD5000 .el-input__suffix .el-input__suffix-inner .el-select__caret.el-input__icon {
        line-height: 20px;
    }

    #sbD5000 .el-textarea__inner {
        height: 100%;
    }

    #sbD5000 .splitpanes.default-theme .splitpanes__pane {
        background: #fff !important;
    }

    #sbD5000 .search-datepicker .el-input__inner {
        height: 25px;
    }

    .text-label2 .el-input__inner {
        height: 22px !important;
        line-height: 22px;
    }
</style>
<script>
    import {Splitpanes, Pane} from 'splitpanes'
    import 'splitpanes/dist/splitpanes.css'
    import {
        customAdd, loadD5000Device, loadD5000Tree, loadXlD5000Tree,
        loadDSecondDevice,
    } from '@/api/czsb-api'
    import {mapGetters} from "vuex";
    import {Bottom, DArrowLeft, DArrowRight, Top} from "@element-plus/icons-vue";

    // let sxId = 1;
    export default {
        name: "zcq-sb-d5000",
        props: {
            paramdata: {
                type: Object
            },

            updateSource: String,
            sblist: {
                type: Array,
            },
            id: {
                type: String,
                default: ''
            },
            isCommon: {
                type: Boolean,
                default: false
            },
        },
        components: {
          DArrowLeft,
          DArrowRight,
          Bottom,
          Top,
            Splitpanes, Pane
        },
        mounted() {
            this.sfts = this.paramdata.sfts ? this.paramdata.sfts : false;
            this.testData = this.paramdata;
            if (this.testData.showzsb) {
                this.showzsb = true
            }
            if (!this.testData.tdcsParam) {
                this.testData.tdcsParam = {czlx: '', CZID: '', dbId: '', stationType: ''}

            }
            this.CZLX = this.testData.tdcsParam.czlx
            this.param.subType = this.CZLX

            this.getAlSelectDevice();
            this.param.deviceType = this.options[0].value
            // 如果是线路
            if (this.CZLX == 'XL') {
                this.options = [{label: '线路', value: 'XL'}];
                this.param.deviceType = this.options[0].value
                this.getLeftTree()
            } else {
              if(this.$store.state.userInfo.cropJc == '徐州'){
                this.options = [
                  {label: '线路', value: 'XL'},
                  {label: '母线', value: 'MX'},
                  {label: '开关', value: 'KG'},
                  {label: '主变', value: 'ZB'},
                  {label: '发电机', value: 'FDJ'},
                  {label: '电容器', value: 'DRQ'},
                  {label: '电抗器', value: 'DKQ'},
                  {label: '二次设备', value: 'ECSB'},
                ];
              }

                setTimeout(() => {
                    this.sbLoadingFlag = true;
                    this.selectCZ(this.testData.tdcsParam)
                }, 100)
            }

        },
        data() {
            return {
                // 当前页面展示的设备数组
                innerSblist: [],
                // 是否是调试，当true的时候  不必填设备类型  ；fasle必填设备类型
                sfts: false,
                showzsb: false,
                curNode: {},
                defaultExpandId: '',
                // 树结构的数据
                treeData: [],
                props: {
                    children: 'children',
                    label: 'name',
                    isLeaf: 'leaf'
                },
                // 表单中选择的停电场所类型
                CZLX: '',
                testData: {tdcsParam: {CZID: ""}},
                param: {
                    subId: "",
                    dydj: '',
                    dbId: "",
                    deviceType: "",
                    subType: "",
                    deviceContent: "",
                    keyword: "", pageSize: '20', pageIndex: 0
                },
                options: [
                    {label: '线路', value: 'XL'},
                    {label: '母线', value: 'MX'},
                    {label: '开关', value: 'KG'},
                    {label: '主变', value: 'ZB'},
                    {label: '发电机', value: 'FDJ'},
                    {label: '电容器', value: 'DRQ'},
                    {label: '电抗器', value: 'DKQ'},
                ],
                dydjoptions: [
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
                // 选择的可选择厂站
                canSelectData: {},
                treeNode: {},
                // 已选择厂站
                alSelectData: {},
                // 已选择厂站的序号
                alSelectDataIndex: -1,
                allDisabled: false,
                // 无树节点情况下，点击加入手填，上方获得的厂站名称
                NullNodeInputList: [],
                // 无树节点的情况下，下方输入的值
                NullNodeInput: '',
                // 选中的左侧节点
                selectNode: {CZID: ''},
                // 线路是否选中了
                unCZSelectFlag: false,
                sbLoadingFlag: false
            }
        },
        methods: {
            // 获取已经选择的数据
            getAlSelectDevice() {
                if (!this.sblist) {
                    return
                }
                this.innerSblist = JSON.parse(JSON.stringify(this.sblist));
                // console.log(data)
                if (this.innerSblist.length > 0) {
                    this.innerSblist.forEach((item) => {
                        if (!this.testData.showzsb) {
                            item.zsb = false;
                        }
                        item.checked = false;
                    })
                    if (this.CZLX == 'ST') {
                        this.NullNodeInputList = JSON.parse(JSON.stringify(this.innerSblist))
                    } else {
                        this.alSelectList = JSON.parse(JSON.stringify(this.innerSblist))
                    }
                }
                console.log(this.innerSblist)
            },
            // 懒加载
            loadNode(node, resolve) {
                let curNode = node.data;
                if (Object.prototype.toString.call(curNode) !== '[object Object]') {
                    return;
                }
                if (curNode.children && curNode.children.length > 0) {
                    resolve(curNode.children);
                } else {
                    loadD5000Tree(curNode).then(data => {
                        resolve(data);
                    }).catch()
                }
            },
            // 当为线路时，加载左侧树
            getLeftTree() {
                loadXlD5000Tree().then(data => {
                    this.treeData = [data.data]
                    this.defaultExpandId = data.data.id;
                }).catch()
            },
            // 点击选中厂站
            selectCZ(item) {
                this.resetParam()
                this.curNode = item;
                this.selectNode = item;
                this.param.subId = this.testData.tdcsParam.CZID;
                this.param.dbId = this.testData.tdcsParam.dbId;
                this.param.subType = this.testData.tdcsParam.czlx;
                this.queryD5000Device()
            },

            // D5000线路的树点击事件
            clickEvent(node) {
                console.log(node)
                if (node.level == 0) {
                    this.$refs.tree.setCurrentKey()
                    return
                }
                this.curNode = node;
                this.param.subId = node.id
                this.param.level = node.level
                this.param.dbId = node.pid;
                this.resetParam()
                this.queryD5000Device()
            },
            // 改变厂站类型
            changeCZLX(flag) {
                this.resetParam()
                console.log(flag, 'flag')
                this.queryD5000Device(flag);
            },
            resetParam() {
                this.param.pageIndex = 0;
            },
            // 查询设备
            queryD5000Device(flag) {
                if (!this.param.dbId && flag) {
                    this.$message({
                        message: '请先选择厂站',
                        type: 'warning'
                    });
                    return
                }
                this.param.stationType = this.testData.tdcsParam.stationType;
                this.sbLoadingFlag = true;
                if (this.param.deviceType == 'ECSB') {
                    loadDSecondDevice(this.param).then(data => {
                        if (data.data) {
                            data.data.forEach((item) => {
                                item.checked = false
                                item.zsb = false
                            })
                            this.canSelectList = data.data
                            this.totalPage = Math.ceil(data.total / 20)
                            this.canSelectData = {}
                        }
                        this.sbLoadingFlag = false;
                    }).catch()
                }
                else {
                    loadD5000Device(this.param).then(data => {
                        if (data.data) {
                            data.data.forEach((item) => {
                                item.checked = false
                                item.zsb = false
                            })
                            this.canSelectList = data.data
                            this.totalPage = Math.ceil(data.total / 20)
                            this.canSelectData = {}
                        }
                        this.sbLoadingFlag = false;
                    }).catch()
                }
            },
            // 单击可选
            ClickSelcteCanSelct(item) {
                if (this.allDisabled) {
                    return
                }
                this.canSelectList.forEach((item1) => {
                    item1.checked = false;
                })
                item.checked = true;
                this.canSelectData = item;
            },
            // 双击可选
            dbClickCanSelect(item) {
                if (this.allDisabled) {
                    return
                }
                this.canSelectData = item;
                this.canSelectList.forEach((item1) => {
                    item1.checked = false;
                })
                if (this.judgeExist()) {
                    this.$message({
                        message: '当前设备已添加',
                        type: 'warning'
                    });
                    return
                }
                // 当为二次设备，默认选择保护停用
                if (item.isSecond) {
                    item.label = '保护停用'
                }
                item.checked = false;
                this.alSelectList.push(JSON.parse(JSON.stringify(item)))
                item.checked = true;
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
                this.queryD5000Device();
            },
            // 单击已选
            ClickAlSelcteCanSelct(item, index) {
                if (this.allDisabled) {
                    return
                }
                this.alSelectData = item
                this.alSelectDataIndex = index
                this.alSelectList.forEach((item1) => {
                    item1.checked = false;
                })
                item.checked = true
            },
            // 双击已选
            dbClickAlselctAlselect(index) {
                if (this.allDisabled) {
                    return
                }
                this.alSelectData = {}
                this.alSelectDataIndex = -1;
                this.alSelectList.splice(index, 1)
                this.alSelectList.forEach((item1) => {
                    item1.checked = false;
                })
            },
            // 选择主设备
            selectDevice(index) {
                let nowSelectDevice = [];
                if (this.alSelectList[index].zsb) {
                    nowSelectDevice.push(this.alSelectList[index])
                    this.alSelectList.splice(index, 1)
                }
                let trueDevice = [];
                let falseDevice = [];
                if (this.alSelectList.length > 0) {
                    this.alSelectList.forEach(item => {
                        if (item.zsb) {
                            trueDevice.push(item)
                        } else {
                            falseDevice.push(item)
                        }
                    })
                }
                this.alSelectList = JSON.parse(JSON.stringify((nowSelectDevice.concat(trueDevice)).concat(falseDevice)))
            },
            // 上移
            moveUp() {
                if (this.alSelectDataIndex == -1) {
                    this.$message({
                        message: '请选择一条数据',
                        type: 'warning'
                    });
                    return
                }
                if (this.alSelectDataIndex == 0) {
                    this.$message({
                        message: '已经在第一个，无法上移',
                        type: 'warning'
                    });
                    return
                }
                //在上一项插入该项
                this.alSelectList.splice(this.alSelectDataIndex - 1, 0, (this.alSelectList[this.alSelectDataIndex]))
                //删除后一项
                this.alSelectList.splice(this.alSelectDataIndex + 1, 1)
                this.alSelectDataIndex = this.alSelectDataIndex - 1
            },
            // 下移
            moveDown() {
                if (this.alSelectDataIndex == -1) {
                    this.$message({
                        message: '请选择一条数据',
                        type: 'warning'
                    });
                    return
                }
                if (this.alSelectDataIndex == this.alSelectList.length - 1) {
                    this.$message({
                        message: '已经在最后一个，无法下移',
                        type: 'warning'
                    });
                    return
                }
                // 在下一项插入该项
                this.alSelectList.splice(this.alSelectDataIndex + 2, 0, (this.alSelectList[this.alSelectDataIndex]))
                // 删除前一项
                this.alSelectList.splice(this.alSelectDataIndex, 1)
                this.alSelectDataIndex = this.alSelectDataIndex + 1
            },
            // 判读是否已经选了这个设备
            judgeExist() {
                if (this.alSelectList.findIndex(c => c.sbid == this.canSelectData.sbid) != -1) {
                    return true
                } else {
                    return false
                }
            },
            // 向右
            turnRight() {
                if (this.allDisabled || this.canSelectData.sbid == undefined) {
                    return
                }
                if (this.judgeExist()) {
                    this.$message({
                        message: '当前设备已添加',
                        type: 'warning'
                    });
                    return
                }
                // 当为二次设备，默认选择保护停用
                if (this.canSelectData.isSecond) {
                    this.canSelectData.label = '保护停用'
                }
                this.alSelectList.push(this.canSelectData)
            },
            // 向左
            turnLeft() {
                if (this.allDisabled) {
                    return
                }
                this.alSelectData = {}
                this.alSelectDataIndex = -1;
                this.alSelectList = []
            },
            // 删除输入的厂站
            delettextlabel(index) {
                this.NullNodeInputList.splice(index, 1)
            },
            // 无树节点情况下，点击加入手写
            addInpput() {
                if (this.NullNodeInput.trim() == '') {
                    this.$message({
                        message: '无法加入空白设备',
                        type: 'warning'
                    });
                    return
                }
                if (this.NullNodeInputList.findIndex(c => c.sbmc == this.NullNodeInput) > -1) {
                    this.$message({
                        message: '无法加入同名设备',
                        type: 'warning'
                    });
                    return
                }
                this.NullNodeInputList.push({
                    sbid: '',
                    sbmc: this.NullNodeInput,
                    sbzt: '',
                    sbddmm: this.NullNodeInput,
                    label: '',
                    realdydj: '',
                    checked: false,
                    sblx: '手写输入',
                })

            },
            // 厂站、线路情况下添加手写
            addInpputCZ() {
                if (this.inputCZ.trim() == '') {
                    this.$message({
                        message: '无法加入空白设备',
                        type: 'warning'
                    });
                    return
                }
                if (this.alSelectList.findIndex(c => c.sbmc == this.inputCZ) > -1) {
                    this.$message({
                        message: '无法加入同名设备',
                        type: 'warning'
                    });
                    return
                }
                this.alSelectList.push({
                    sbid: '',
                    sbmc: this.inputCZ,
                    sbzt: '',
                    sbddmm: this.inputCZ,
                    label: '',
                    dydj: '',
                    checked: false,
                    sblx: '手写输入',
                })
            },
            // 确认
            confirm() {
                let param = {CZSBList: [], STSBList: []};
                // 当前为日计划并且没有选择设备
                if (this.testData.bdlx.indexOf('rjh') != -1 && (this.alSelectList.length < 1 && this.NullNodeInputList.length < 1)) {
                    this.$emit('refreshSBXX', param.CZSBList)
                    this.$emit('close')
                    return
                }

                if (this.alSelectList.length < 1 && this.NullNodeInputList.length < 1) {
                    this.$message({
                        message: '请选择一条数据',
                        type: 'warning'
                    });
                    return
                }

                // 如果是日计划，并且sfts  为 false  此时必填设备类型
                if (!this.isCommon && (this.testData.bdlx.indexOf('rjh') != -1 && !this.sfts || this.testData.bdlx.indexOf('zcq') > -1)) {
                    let requeiredFlag = false;
                    this.alSelectList.forEach((item) => {
                        if (!item.label) {
                            requeiredFlag = true
                        }
                    })
                    this.NullNodeInputList.forEach((item) => {
                        if (!item.label) {
                            requeiredFlag = true
                        }
                    })
                    if (requeiredFlag) {
                        this.$message({
                            message: '请给所有设备选择类型',
                            type: 'warning'
                        });
                        return
                    }
                }

                // let _self = this;
                // 当为手填的厂站
                if (this.CZLX == 'ST') {
                    param = {CZSBList: this.NullNodeInputList, STSBList: []}
                } else {
                    this.alSelectList.forEach((item) => {
                        if (item.sbid != '') {
                            param.CZSBList.push({
                                sbddmm: item.sbddmm ? item.sbddmm : item.sbmc,
                                sbid: item.sbid,
                                label: !item.label ? '' : item.label,
                                realdydj: item.realdydj ? item.realdydj : (item.dydj ? item.dydj : ''),
                                zsb: item.zsb ? true : false,
                                sblx: item.sblx ? item.sblx : '',
                                sbbm: item.sbbm ? item.sbbm : '',
                                isSecond: item.isSecond ? true : false,
                                czid: item.czid ? item.czid : (item.czid_md ? item.czid_md : ''),
                                czmc: item.czmc ? item.czmc : (item.czmc_md ? item.czmc_md : ''),
                            })
                        } else {
                            item.realdydj = '';
                            param.CZSBList.push({
                                sbddmm: item.sbddmm ? item.sbddmm.replace(/[\r\n]/g, " ") : item.sbmc.replace(/[\r\n]/g, " "),
                                sbid: item.sbid,
                                label: !item.label ? '' : item.label,
                                realdydj: '',
                                sbbm: '',
                                zsb: item.zsb ? true : false,
                                sblx: '手写输入',
                            })
                        }
                    });
                }
                if (param.CZSBList && param.CZSBList.length > 0) {
                    param.CZSBList.forEach((item, index) => {
                        item.sort = (index + 1)
                    })
                    if (this.testData.showzsb) {
                        param.CZSBList.sort((a, b) => {
                            if (a.zsb && b.zsb) {
                                return 0;
                            }
                            return a.zsb ? -1 : 1;
                        });
                    }
                }
              this.$emit('refreshSBXX', param.CZSBList)
              this.$emit('close')
            },
            // 取消
            cancel() {
                this.$emit('close')
            },


        },
        computed: {
            ...mapGetters(['areaEng']),
            fromRjh() {
                return true;
            },
            options2() {
                return item => {
                    if (item.isSecond) {
                        return [
                            {label: '保护停用', value: '保护停用'},
                            {label: '保护信号', value: '保护信号'},
                        ];
                    }
                    if ((this.testData.bdlx.indexOf('rjh') > -1 || this.testData.bdlx.indexOf('zcq') > -1) && this.areaEng === 'NT') {
                        return [
                            {label: '检修', value: '检修'},
                            {label: '冷备用', value: '冷备用'},
                            {label: '热备用', value: '热备用'},
                            {label: '运行', value: '运行'},
                            {label: '停用', value: '停用'},
                            {label: '停机', value: '停机'},
                        ];
                    }
                    return [
                        {label: '检修', value: '检修'},
                        {label: '冷备用', value: '冷备用'},
                        {label: '热备用', value: '热备用'},
                        {label: '运行', value: '运行'},
                        {label: '停用', value: '停用'},
                    ];
                }
            },
        },
    }
</script>

<style scoped lang="scss">
    .gljh.px2rem-ignore {
        width: 100%;
        height: 100%;

        .select-cz {
            width: 100%;
            height: 30px;
            text-align: left;
            text-indent: 10px;
        }

        .sb-left-tree {
            width: 100%;
            height: 100%;
            box-sizing: border-box;
            overflow: auto;
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

                        .candele {
                            width: calc(100% - 120px);
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
                            height: 29px;
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
                            font-size: 27px;
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
                            width: calc(100% - 150px);
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

                .top-hand-div {
                    width: 100%;
                    height: calc(100% - 30px);
                    display: flex;

                    .write-input-textarea {
                        min-width: calc(100% - 150px);
                        width: auto;
                        height: 100%;
                    }

                    .right-button {
                        height: 28px;
                        padding: 0 10px;
                        box-sizing: border-box;
                        line-height: 28px;
                        color: #fff;
                        border-radius: 5px;
                        cursor: pointer;
                        text-align: center;
                        background: #95a8ad;
                        float: left;
                        margin-left: 10px;
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


