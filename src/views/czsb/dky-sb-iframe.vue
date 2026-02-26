<template>
    <div class="container px2rem-ignore">
        <form id="device_interface_form" method="post">
            <input type="hidden" value="获取检修设备数据" name="data"/>
        </form>
        <iframe name="device_interface_frame" style="width: 100%; height: 100%;"></iframe>
    </div>
</template>
<script>
// import {transferDKYData} from '../../api/zcqjh_sd'
import {mapState} from 'vuex'

export default {
    name: "dky-sb-iframe",
    props: {
        url: String,
        corpCode: String,
        dkyDataParam: Object,
    },
    mounted() {
        console.log('当前已经选择的厂站的对象')
        console.log(this.dkyDataParam)
        console.log('当前用户信息')
        console.log(this.userInfo)
        window.addEventListener("message", evt => {
                if (typeof (evt.data) === "string" && evt.data != '""') {
                    console.log('获取到了设备的调控云的数据')
                    console.log(JSON.parse(evt.data))
                    this.dkySbData = JSON.parse(evt.data);
                    this.dealSelect();
                }
            }
        )
        this.openDKY();
        /*setTimeout(() => {
            this.dealSelect();
        }, 1000)*/
    },
    data() {
        return {
            dkySbData: [
                {
                    ARRANGE_TYPE: "AIS",
                    ASSETS_COMPANY_ID: "国网南京市供电公司",
                    BAY_ID: null,
                    BUSBARTYPE: "主母线",
                    D5000DATA: {
                        D5000_ID: "115404742129092811",
                        D5000_NAME: "南京.朝阳变/110kV.110kVⅠ段母线",
                        D5000_ST_ID: null,
                        D5000_ST_NAME: null,
                        DCC_ID: "0021320100",
                        DCLOUD_ID: "130132010000002372",
                        DCLOUD_NAME: "Ⅰ段母线",
                        DCLOUD_ST_ID: "01123201000477",
                        DCLOUD_ST_NAME: "朝阳变",
                        DCLOUD_VOLTAGELEVEL: "1006"
                    },
                    OMS_ID: null,
                    OMS_NAME: null,
                    PMS_ID: null,
                    STATUS: " ",
                    UPDATE_TIME: "2019-05-06 10:41:05.267722",
                    __proto__: Object,
                    DEVICETABLEENG: "SG_DEV_BUSBAR_B",
                    DEV_ID: null,
                    DISPATCH_ORG_ID: "南京地调",
                    EDIT_DATA: "EDIT",
                    EXPIRY_DATE: null,
                    ID: "130132010000002372",
                    JS_BAY_ID: null,
                    JS_MODEL_FG: 0,
                    LICENSE_ORG_ID: null,
                    MAINT_ORG_ID: "国网高淳区检修公司",
                    MODEL: "LGJ-185",
                    MONITOR_ORG_ID: "高淳县电力调度控制中心",
                    MX_OWNER: "320100",
                    NAME: "Ⅰ段母线",
                    OFF_TIME: null,
                    ON_TIME: null,
                    OPERATE_DATE: "2019-04-12",
                    OWNER: "南京地调",
                    RUNNING_STATE: "在运",
                    STAMP: "320100_00613201000093_2019-05-06 10:41:03",
                    ST_ID: "朝阳变",
                    SUPPLIER_ID: null,
                    SYS_FLAG: null,
                    VOLTAGE_TYPE: "110kV",
                    isPrimaryDevice: "N",
                    show_name: "朝阳变.110kV/Ⅰ段母线(130132010000002372)",
                    show_state: "",
                    _ARRANGE_TYPE: 1001,
                    _ASSETS_COMPANY_ID: "0010320100",
                    _BAY_ID: null,
                    _BUSBARTYPE: 1001,
                    _DEV_ID: null,
                    _DISPATCH_ORG_ID: "0021320100",
                    _EXPIRY_DATE: null,
                    _ID: "130132010000002372",
                    _JS_BAY_ID: null,
                    _JS_MODEL_FG: 0,
                    _LICENSE_ORG_ID: null,
                    _MAINT_ORG_ID: "0031320118",
                    _MODEL: "LGJ-185",
                    _MONITOR_ORG_ID: "0021320118",
                    _NAME: "Ⅰ段母线",
                    _OFF_TIME: null,
                    _ON_TIME: null,
                    _OPERATE_DATE: "2019-04-12",
                    _OWNER: "320100",
                    _RUNNING_STATE: 1003,
                    _STAMP: "320100_00613201000093_2019-05-06 10:41:03",
                    _ST_ID: "01123201000477",
                    _SUPPLIER_ID: null,
                    _SYS_FLAG: null,
                    _VOLTAGE_TYPE: 1006
                }
            ]
        }
    },
    methods: {
        openDKY() {
            // document.getElementById("device_interface_form").src = "http://172.17.3.70:8088/dcloudmodelservice/Client/sbxz/sbxztree.jsp?sbxztree_stid=01123201000477&sbxztree_pwrgridid=&sbxztree_objcodes=1101,1201,1203,1204,1301,1311,1321,1313,1314&sbxztree_voltagetypes=1005,1006,1007&sbxztree_selectedids=&sbxztree_regions=&sbxztree_showdeviceLogging=Y&TimeStamp=1623744663501"
            // document.getElementById("device_interface_form").action = "http://172.17.3.70:8088/dcloudmodelservice/Client/sbxz/sbxztree.jsp?sbxztree_stid=01123201000477&sbxztree_pwrgridid=0010320100&sbxztree_objcodes=1101,1201,1203,1204,1301,1311,1321,1313,1314&sbxztree_voltagetypes=1005,1006,1007&sbxztree_selectedids=&sbxztree_regions=0010320100&sbxztree_showdeviceLogging=Y&TimeStamp=1623744663501;"
            document.getElementById("device_interface_form").action = this.url;
            document.getElementById("device_interface_form").target = "device_interface_frame";
            document.getElementById("device_interface_form").submit();
        },
        dealSelect() {
            let data = [];
            for (let i = 0; i < this.dkySbData.length; i++) {
                let item = this.dkySbData[i];
                let obj = {};
                if (item.ID.indexOf('Hand') > -1) {
                    obj.dealType = '手写加入'
                    obj.sbddmm = item.show_name ? item.show_name : '';
                    obj.label = item.show_state === '在运' ? '' : item.show_state;
                    obj.realdydj = '';
                    obj.sblx = '手写输入';
                } else {
                    obj.dealType = '厂站选择'
                    let d5000Data = item.D5000DATA;
                    if (d5000Data && d5000Data.D5000_ID) {
                        obj.sbid = d5000Data.D5000_ID
                        // obj.sbid = item.ID ? item.ID : d5000Data.DCLOUD_ID;
                    } else {
                        obj.sbid = item.ID
                    }
                    obj.sbDkyId = item.ID ? item.ID : '';
                    obj.sbDkyMc = item.NAME ? item.NAME : '';
                    // obj.sbzt = item.RUNNING_STATE ? item.RUNNING_STATE : d5000Data.RUNNING_STATE;
                    obj.sbzt = item.show_state;
                    // 设备表名
                    obj.sbbm = item.DEVICETABLEENG;
                    // obj.sbddmm = d5000Data.DCLOUD_NAME;
                    obj.sbddmm = item.NAME ? item.NAME : (d5000Data.DCLOUD_NAME ? d5000Data.DCLOUD_NAME : '');
                    obj.dydj = item.VOLTAGE_TYPE;
                    obj.sbdydj = item.VOLTAGE_TYPE;
                    obj.realdydj = item.VOLTAGE_TYPE;
                    // obj.sbddmm = '江苏.高传官滩风电/35kV.35千伏Ⅱ段母线';
                    // obj.sbddmm = '江苏.白荡变/110kV.白荡变/#1主变';
                    // obj.sbddmm = '常州地调.110kV/7930线BQ';
                    // obj.sbddmm = '常州.110kV7930线BQ';
                    let showName = ''
                    let pointNameList = obj.sbddmm.split('.')
                    if (pointNameList.length > 0) {
                        showName = pointNameList[pointNameList.length - 1]
                        let splitNameList = showName.split('/')
                        if (splitNameList.length > 0) {
                            showName = splitNameList[splitNameList.length - 1]
                        }
                    }
                    console.log('调整过后的设备名称')
                    console.log(showName)
                    console.log('下方判断条件')
                    console.log(showName.indexOf('110') == -1)
                    console.log('obj.sbddmm：' + obj.sbddmm)
                    console.log('item.VOLTAGE_TYPE：' + item.VOLTAGE_TYPE)
                    if (item.DEVICETABLEENG && item.DEVICETABLEENG == 'SG_DEV_BUSBAR_B') {
                        if (showName && showName.indexOf('110') == -1 &&
                            (obj.sbddmm.indexOf('110') > -1 || ((item.VOLTAGE_TYPE) && item.VOLTAGE_TYPE.indexOf('110') > -1))) {
                            console.log('设备截取后名称中没有有110并且原sbddmm中含有110字段，特殊处理' + i)
                            showName = '110kV' + showName;
                        }
                    }
                    obj.sbddmm = showName
                    console.log('当前厂站是否是1201并且corpCode包含110')
                    console.log(this.dkyDataParam.ID == '1201' && this.userInfo.corpCode.indexOf('110') > -1)
                    if (this.dkyDataParam.ID == '1201' && this.userInfo.corpCode.indexOf('110') > -1) {
                        if (item.LINE_RELATE_STLIST) {
                            var STData = item.LINE_RELATE_STLIST;
                            var STName = "";
                            var index = 0;
                            if (STData && STData.length > 0) {
                                for (var m = 0; m < STData.length; m++) {
                                    if (STName != "") {
                                        STName += "、";
                                    }
                                    index = STData[m].STNAME.indexOf("·");
                                    if (index > 0) {
                                        STName += STData[m].STNAME.substr(0, index);
                                    } else {
                                        STName += STData[m].STNAME;
                                    }
                                }
                                STName += "：";
                            }
                            obj.sbddmm = STName + obj.sbddmm;
                        }
                    }
                    // obj.czdydj = d5000Data.VOLTAGE_TYPE;
                    // 2022年1月27日10:06:02--陈天宇   厂站id和厂站名称获取改动
                    // obj.czid = item.START_ST_ID ? item.START_ST_ID : d5000Data.DCLOUD_START_ST_ID;
                    // obj.czmc = item.START_NODE_ID ? item.START_NODE_ID : d5000Data.DCLOUD_START_ST_NAME;
                    if (item.DEVICETABLEENG && item.DEVICETABLEENG.indexOf('ACLINE') > -1) {
                        obj.czid = (d5000Data && d5000Data.DCLOUD_START_ST_ID) ? d5000Data.DCLOUD_START_ST_ID : ''
                        obj.czmc = (d5000Data && d5000Data.DCLOUD_START_ST_NAME) ? d5000Data.DCLOUD_START_ST_NAME : ''
                        obj.czid_md = (d5000Data && d5000Data.DCLOUD_END_ST_ID) ? d5000Data.DCLOUD_END_ST_ID : '';
                        obj.czmc_md = (d5000Data && d5000Data.DCLOUD_END_ST_NAME) ? d5000Data.DCLOUD_END_ST_NAME : '';
                    } else {
                        obj.czid = (d5000Data && d5000Data.DCLOUD_ST_ID) ? d5000Data.DCLOUD_ST_ID : (item._ST_ID) ? item._ST_ID : '';
                        obj.czid = (d5000Data && d5000Data.DCLOUD_ST_NAME) ? d5000Data.DCLOUD_ST_NAME : (item.ST_ID) ? item.ST_ID : '';
                    }
                    console.log(item);
                    obj.label = item.show_state ? item.show_state : d5000Data.show_state;
                    if (this.dkyDataParam.ID == '1201') {
                        obj.CZID = 'XL';
                        obj.CZMC = '线路';
                    } else {
                        obj.CZID = this.dkyDataParam ?
                            (this.dkyDataParam.D5000DATA.D5000_ID ? this.dkyDataParam.D5000DATA.D5000_ID : this.dkyDataParam.ID) : '';
                        obj.CZMC = this.dkyDataParam ?
                            (this.dkyDataParam.D5000DATA.D5000_NAME ? this.dkyDataParam.D5000DATA.D5000_NAME : this.dkyDataParam.NAME) : '';
                    }
                }
                data.push(obj);
            }
            this.$emit('on-return-dkysb', data)
            this.$emit('close')
        }
        /*dealSelect() {
            transferDKYData({data: this.dkySbData}).then(data => {
                this.$emit('on-return-dkysb', data)
                this.$emit('close')
            }).catch(() => {
            })
        },*/
    },
    computed: {
        ...mapState(["userInfo", "staticOMSxl"])
    },
}
</script>
<style scoped>
.container.px2rem-ignore {
    width: 1000px;
    height: 600px;
}
</style>
