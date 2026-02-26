<template>
    <div class="container px2rem-ignore">
        <form id="station_interface_form" method="post">
            <input type="hidden" value="获取设备选择控件数据" name="data"/>
        </form>
        <iframe name="station_interface_frame" style="width: 100%; height: 100%;"></iframe>
    </div>
</template>
<script>
// import {transferDKYData} from '../../api/zcqjh_sd'
export default {
    name: "dky-cz-iframe",
    props: {
        url: String
    },
    mounted() {
        window.addEventListener("message", evt => {
                if (typeof (evt.data) === "string" && evt.data != '""') {
                    console.log('获取到了厂站的调控云的数据')
                    console.log(JSON.parse(evt.data))
                    this.dkyczData = JSON.parse(evt.data);
                    this.dealSelect();
                }
            }
        )
        console.log(this.url)
        this.openDKY();
        /*setTimeout(() => {
            this.dealSelect();
        }, 1000)*/
    },
    data() {
        return {
            dkyczData: [
                {
                    "JS_CLASS_ID": null,
                    "_OWNER": "320400",
                    "_TOP_AC_VOLTAGE_TYPE": 1005,
                    "MODEL_FG": 1,
                    "OWNER": "常州地调",
                    "LATITUDE": 31.689,
                    "JS_MONITOR_DEPT": null,
                    "_MANAGE_DEPT_ID": "0010320400",
                    "_STAMP": "320400_00613204000001_2020-04-21 14:33:25",
                    "_ASSETS_OWNERSHIP_COM_ID": "0010320400",
                    "_JS_SSFQ": 1006,
                    "JS_STAMP_ORI": null,
                    "_DC_VOLTAGE_TYPE": null,
                    "ID": "01123204000273",
                    "D5000DATA": {
                        "D5000_ID": "113997366104686715",
                        // "D5000_NAME": "滆湖变",
                        "D5000_NAME": "江苏.滆湖变",
                        "DCC_ID": "0021320000",
                        "OMS_ID": null,
                        // "DCLOUD_NAME": "滆湖变",
                        "DCLOUD_NAME": "江苏.滆湖变",
                        "PMS_ID": null,
                        "UPDATE_TIME": "2019-07-18 17:00:00",
                        "STATUS": "0",
                        "OMS_NAME": null,
                        "OWNER": "320400",
                        "DCLOUD_VOLTAGELEVEL": "1005",
                        "DCLOUD_ID": "01123204000273"
                    },
                    "REGION": "江苏省常州市武进区",
                    "_JS_STAMP_ORI": null,
                    "_MAINTAIN_AREA_ID": null,
                    "TYPE": "变电站",
                    "_TYPE": 2001,
                    "MANAGE_DEPT_ID": "国网常州市供电公司",
                    // "NAME": "滆湖变",
                    "NAME": " 江苏.滆湖变",
                    "_EXPIRY_DATE": null,
                    "JS_LONGITUDE_ORI": 119.912,
                    "_ASSETS_OWNERSHIP": 1001,
                    "_ID": "01123204000273",
                    "_JS_DIVAREA_ID": "041632000000000017",
                    "EXPIRY_DATE": null,
                    "DEVICETABLEENG": "SG_CON_SUBSTATION_B",
                    "_PG_ID": "0101320400",
                    "ASSETS_OWNERSHIP_COM_ID": "常州市供电公司",
                    "_LATITUDE": 31.689,
                    "_JS_DATA_SR": "pms",
                    "DCC_ID": "江苏省调",
                    "MAINTAIN_AREA_ID": null,
                    "show_name": "常州电网.220kV/滆湖变(01123204000273)",
                    "show_state": "检修",
                    "DC_VOLTAGE_TYPE": null,
                    "_STATE_CODE": "00101000",
                    "EDIT_DATA": "EDIT",
                    "isPrimaryDevice": "N",
                    "_JS_MONITOR_DEPT": null,
                    "JS_LATITUDE_ORI": 31.689,
                    "_ALTITUDE": 5.3,
                    "_REGION": 320412,
                    "MX_OWNER": "320400",
                    "_CAL_CONNECTIVE_PG_ID": "0101320400",
                    "OPERATE_DATE": "2001-04-27",
                    "_LONGITUDE": 119.912,
                    "_OPERATE_STATE": 1003,
                    "ALTITUDE": 5.3,
                    "_NAME": "滆湖变",
                    "_MODEL_FG": 1,
                    "STAMP": "320400_00613204000001_2020-04-21 14:33:25",
                    "CAL_CONNECTIVE_PG_ID": "0101320400",
                    "_DCC_ID": "0021320000",
                    "_JS_CLASS_ID": null,
                    "JS_SSFQ": "武南分区\t",
                    "STATE_CODE": null,
                    "SHARE_AREA_ID": null,
                    "_JS_LATITUDE_ORI": 31.689,
                    "_SHARE_AREA_ID": null,
                    "OPERATE_STATE": "在运",
                    "_OPERATE_DATE": "2001-04-27",
                    "ASSETS_OWNERSHIP": "公用",
                    "PG_ID": "常州电网",
                    "_JS_LONGITUDE_ORI": 119.912,
                    "JS_DATA_SR": "pms",
                    "LONGITUDE": 119.912,
                    "JS_DIVAREA_ID": "041632000000000017",
                    "TOP_AC_VOLTAGE_TYPE": "220kV"
                },
                /*{
                    ID: "1201",
                    NAME: "线路",
                    allowDrag: true,
                    allowDrop: true,
                    checked: null,
                    children: [],
                    cls: "",
                    commontree: "",
                    dcsys_id: "",
                    deletePk: "ROOT",
                    depth: 1,
                    dispatchId: "",
                    expandable: true,
                    expanded: false,
                    firstInstanceTab: "",
                    fullName: "",
                    gr_id: "",
                    grstateId: "",
                    href: "",
                    hrefTarget: "",
                    icon: "../images/black/1201.png",
                    iconCls: "",
                    index: 2,
                    instanceDataId: "",
                    instanceDataName: "",
                    instanceTab: "ROOT",
                    isCreate: "Y",
                    isFind: "N",
                    isFirst: false,
                    isLast: true,
                    isNew: "Y",
                    isVoltage: "NOT",
                    is_parentID: "",
                    leaf: true,
                    loaded: false,
                    loading: false,
                    login: "",
                    objId: "ER4H57U9-SPN6-C13D-HXYZ-534Y-1LF",
                    objectCode: "1201",
                    objectTab: "",
                    orderAttr: "ID",
                    orderSort: "ASC",
                    pageProject: "PAGE-01",
                    parentAttr: "",
                    parentID: "",
                    parentId: "root",
                    parentName: "",
                    parentTableEng: "ROOT",
                    parentTitle: "",
                    qshowDelay: 0,
                    qtip: "线路",
                    qtitle: "",
                    root: false,
                    rootFiltratSql: "",
                    rootParentText: "",
                    sblx: "线路",
                    showName: "",
                    show_name: "线路",
                    show_state: "检修",
                    sjid: "",
                    stId: "",
                    tabModel: "",
                    tableType: "1",
                    text: "线路",
                    tid: "ROOT",
                    vals: "",
                    voltageId: "",
                }*/
            ],
            d5000List: [
                {id: '113715891127975939', area: '常州'},
                {id: '113715891127975940', area: '淮安'},
                // {id: '113715891127975942', area: '江苏直属'},
                {id: '113715891127975943', area: '连云港'},
                {id: '113715891127975944', area: '南京'},
                {id: '113715891127975945', area: '南通'},
                {id: '113715891127975946', area: '苏州'},
                {id: '113715891127975947', area: '宿迁'},
                {id: '113715891127975948', area: '泰州'},
                {id: '113715891127975949', area: '无锡'},
                {id: '113715891127975950', area: '徐州'},
                {id: '113715891127975951', area: '盐城'},
                {id: '113715891127975952', area: '扬州'},
                {id: '113715891127975953', area: '镇江'},
                // {id: '113715891127975966', area: '外网区域'},
            ],
        }
    },
    methods: {
        // 打开调控云厂站选择页面
        openDKY() {
            // document.getElementById("station_interface_form").action = "http://172.17.3.70:8088/dcloudmodelservice/Client/sbxz/sbxztree.jsp?sbxztree_stid=&sbxztree_pwrgridid=0010320000&sbxztree_objcodes=0111,0112&sbxztree_selectedids=&sbxztree_regions=113715891127975944&sbxztree_isPhowunitstate=Y&TimeStamp=1623744663501";
            document.getElementById("station_interface_form").action = this.url;
            document.getElementById("station_interface_form").target = "station_interface_frame";
            document.getElementById("station_interface_form").submit();
        },
        dealSelect() {
            let data = [];
            for (let i = 0; i < this.dkyczData.length; i++) {
                let item = this.dkyczData[i];
                let obj = {};
                if (item.ID.indexOf('Hand') > -1) {
                    obj.sbddmm = item.show_name ? item.show_name : '';
                    obj.label = item.show_state === '在运' ? '' : item.show_state;
                }
                // 当选中的是调控云线路
                else if (item.ID == '1201') {
                    obj.sbddmm = '线路';
                    obj.czid = 'XL';
                    obj.czmc = '线路';
                    obj.DKYID = item.ID;
                    obj.DKYMC = item.NAME;
                } else {
                    let d5000Data = item.D5000DATA;
                    obj.czid = d5000Data.DCLOUD_ID;
                    obj.czmc = d5000Data.DCLOUD_NAME ?
                        d5000Data.DCLOUD_NAME.split('.')[d5000Data.DCLOUD_NAME.split('.').length - 1] : '';
                    // obj.sbmc = d5000Data.DCLOUD_NAME;
                    // obj.sbzt = d5000Data.RUNNING_STATE;
                    obj.sbddmm = d5000Data.DCLOUD_NAME ?
                        d5000Data.DCLOUD_NAME.split('.')[d5000Data.DCLOUD_NAME.split('.').length - 1] : '';
                    // obj.czdydj = item.TOP_AC_VOLTAGE_TYPE;
                    // obj.czdydj = d5000Data.VOLTAGE_TYPE;
                    // obj.czid = d5000Data.DCLOUD_START_ST_ID;
                    // obj.czid_md = d5000Data.DCLOUD_END_ST_ID;
                    // obj.czmc_md = d5000Data.DCLOUD_END_ST_NAME;
                    obj.label = d5000Data.show_state;
                    obj.DKYID = item.ID;
                    obj.DKYMC =
                        item.NAME ?
                            item.NAME.split('.')[item.NAME.split('.').length - 1] : '';
                    this.d5000List.forEach(function (item1) {
                        if (item.OWNER.indexOf(item1.area) > -1) {
                            obj.dbid = item1.id;
                        }
                    })
                }
                data.push(obj);
            }
            this.$emit('on-return-dkycz', {data: data, dkyczData: this.dkyczData})
            this.$emit('close')
        }
        /*dealSelect() {
            transferDKYData({data: this.dkyczData}).then(data => {
                this.$emit('on-return-dkycz', {data: data, dkyczData: this.dkyczData})
                // this.$emit('close')
            }).catch(() => {
            })
        },*/
    },
}
</script>
<style scoped>
.container.px2rem-ignore {
    width: 1000px;
    height: 600px;
}
</style>
