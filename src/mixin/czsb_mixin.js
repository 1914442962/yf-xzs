
import czSelect from "@/views/czsb/czSelect.vue";
import zcqSbD5000 from "@/views/czsb/zcq-sb-d5000/index.js";
import zcqSbOms from "@/views/czsb/zcq-sb-oms/index.js";
import zcqSbDky from "@/views/czsb/zcq-sb-dky.vue";
export default {
    data(){
        return {
           
        }
    },

    methods:{

        selectCs(row,column){
            this.$vxeModal.show(
                czSelect,
                {
                    omsDefaultNode: this.$store.state.omsDefaultNode,
                    d5000DefaultNode: this.$store.state.d5000DefaultNode,
                    showOMS: false,
                },
                {
                    width: 600,
                    height: 188,
                    title: "选择停电厂站类型",
                    
                },
                {
                    // close: () => {
                    //   this.loadTableData();
                    // },
                    refreshCZXX: (e) => {
                        row[column.field] = e.CZMC;
                        row[column.field + 'Id'] = e.CZID;
                        row[column.field  + 'lx'] = e.tdcslx;
                        row[column.field  + 'Param'] = e;
                        row[column.field  + 'Param0'] = e;
                    },
                }
            );
        },
        selectSb(row,column){
            if (!row.tdcslx) {
                this.$message({
                    message: '停电场所类型为空，请先选择停电场所',
                    type: 'warning'
                });
                return
            }
            if (!row.tdcsParam) {
                this.$message({
                    message: '当前为非对象化场所，请重选场所后再选择停电设备',
                    type: 'warning'
                });
                return
            }
            let paramdata = {
                id: row.id,
                tdcsParam: row.tdcsParam,
                bdlx: 'rjh-dd',
            }
            if (row.tdcslx == 'D5000') {
                this.$vxeModal.show(zcqSbD5000, {
                    paramdata,
                    sblist: row[column.field + 'List'],
                    isCommon:true,
                }, {
                    width: 1000,
                    height: 650,
                    title: '设备选择-D5000'
                }, {
                    'refreshSBXX': (data) => {
                        row[column.field + 'List'] = data;
                        row[column.field + 'List0'] = data;
                        row[column.field + 'Id'] = data.map(i=>i.sbid).join(',');
                        row[column.field] = data.map(i=>i.sbddmm).join(',');
                    }
                })
            } else if (row.tdcslx == 'OMS') {
                this.$vxeModal.show(zcqSbOms, {
                    paramdata,
                    sblist: row[column.field + 'List'],
                    isCommon:true,
                }, {
                    width: 1000,
                    height: 650,
                    title: '设备选择-OMS'
                }, {
                    'refreshSBXX': (data) => {
                        row[column.field + 'List'] = data;
                        row[column.field + 'List0'] = data;
                        row[column.field + 'Id'] = data.map(i=>i.sbid).join(',');
                        row[column.field] = data.map(i=>i.sbddmm).join(',');
                    }
                })
            } else if (row.tdcslx == 'DKY') {
                // TODO 本地数据调控云
                this.$vxeModal.show(zcqSbDky, {
                    paramdata,
                    sblist: row[column.field + 'List'],
                    isCommon:true,
                }, {
                    width: 1000,
                    height: 650,
                    title: '设备选择-DKY'
                }, {
                    'refreshSBXX': (data) => {
                        row[column.field + 'List'] = data;
                        row[column.field + 'List0'] = data;
                        row[column.field + 'Id'] = data.map(i=>i.sbid).join(',');
                        row[column.field] = data.map(i=>i.sbddmm).join(',');
                    }
                })
            }
        },

    }
}