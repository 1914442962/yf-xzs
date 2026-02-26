
export function GetEchartsModule(obj) {
    this.option = {
        title: obj.title ? obj.title : {
            show: false,
            text: '',
        },
        xAxis: obj.xAxis ? obj.xAxis : {
            type: 'category',
            data: obj.xData,
            axisLabel: {
                //x轴文字的配置
                show: true,
                interval: 'auto',//使x轴文字显示全
            },
            triggerEvent: obj.xTrigger ? obj.xTrigger : false,
        },
        dataZoom: obj.dataZoom ? obj.dataZoom : [],
        grid: obj.grid ? obj.grid : {
            bottom: '2%',
            containLabel: true
        },
        yAxis: obj.yAxis ? obj.yAxis : { type: 'value' },
        color: obj.colorArr,
        legend: obj.legend ? obj.legend : {
            right: "10%",
            // data: ['预估发电量', '实际发电量']
        },
        // tooltip: obj.tooltip ? obj.tooltip : {
        //     trigger: 'axis',
        //     confine: true,//当存在tooltip,html外层套div,加此属性可以不闪动
        //     backgroundColor: "rgba(256,256,256,0.8)",
        //     textStyle: {
        //         color: "#444"
        //     },
        //     axisPointer: {
        //         type: 'none'
        //     },
        // },
        // color: "#369390",
        series: obj.ySeries
    }
}

//获取饼图
export function GetPieEchartsModule(obj) {
    this.option = {
        color: obj.colorArr,
        tooltip: obj.tooltip ? obj.tooltip : {
            trigger: 'item',
            formatter: '{b} : {c} {d}%'
        },
        title: obj.title ? obj.title : {
            show: false,
            text: '',
        },
        legend: obj.legend ? obj.legend : {
            show: false,
        },
        series: obj.ySeries
    }
}

//正负条形图
export function GetEchartsNegativeModule(obj) {
    this.option = {
        tooltip: {
            trigger: 'axis',
            // axisPointer: {//鼠标移入背景色
            //     type: 'shadow',
            //     shadowStyle: {
            //         color: 'rgba(111, 111, 111, 0.2)',
            //     }
            // },
            formatter: (params) => {
                if (!params.length) return ''
                let s = params[0].axisValueLabel + '<br/>'
                for (const iterator of params) {
                    // 如果是负数则反转
                    let d = iterator.data < 0 ? -iterator.data : iterator.data
                    s += iterator.marker + iterator.seriesName + '：' + d + '<br/>'
                }
                return s
            }
        },
        legend: {
            right: 150,
            top: 20
        },
        grid: {
            left: '10%',
            right: '10%',
            bottom: '3%',
            containLabel: true
        },
        color: ["#269ae4", "#39b19d"],
        xAxis: [
            {
                show: false,
                type: 'value',
                axisLabel: {
                    formatter: (value) => {
                        // 负数取反 显示的就是正数了
                        if (value < 0) return -value
                        else return value
                    }
                },
                min: function (value) {
                    //最小值设置，其中-value.max * 1.05 乘以1.05 ，主要是使图的边界小于最小的值，给边界留空间
                    return (Math.abs(value.min) < value.max ? -value.max * 1.05 : value.min * 1.05).toFixed(2);
                },
                max: function (value) {
                    //最大值设置，其中-value.min * 1.05 乘以1.05 ，主要是使图的边界大于最大于值，给边界留空间
                    return (Math.abs(value.min) < value.max ? value.max * 1.05 : -value.min * 1.05).toFixed(2);
                }
            }
        ],
        dataZoom: [
            //滑动条
            {
                yAxisIndex: [0, 1], //这里是从X轴的0刻度开始
                show: true, //是否显示滑动条，不影响使用
                type: "inside", // 这个 dataZoom 组件是 slider 型 dataZoom 组件
                startValue: 0, // 从头开始。
                endValue: 13, // 一次性展示14个。
                minValueSpan: 14,
                maxValueSpan: 14,
            },
        ],
        yAxis: [
            {
                type: 'category',
                axisTick: {
                    show: false
                },
                axisLine: {
                    show: false,
                },
                inverse: true,
                triggerEvent: true,
                offset: 50,
                //层级
                // zlevel: 1000,

                // data: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
                data: obj.yAxisData1
            },
            {
                name: '能源利用效率',
                type: 'category',
                axisTick: {
                    show: false
                },
                axisLine: {
                    show: false,
                },
                inverse: true,
                offset: 50,
                //层级
                // zlevel: 1000,
                nameLocation: 'start',
                nameTextStyle: {
                    color: '#fff',
                    padding: 10,
                    backgroundColor: '#e69a67',
                    borderRadius: [0, 0, 8, 8],
                },
                data: obj.yAxisData2,
                // data: [{value: '98%', textStyle:{color:'#e69a67', backgroundColor:'#fef6ef',padding:12.9}}, {value: '01%', textStyle:{color:'#e69a67', backgroundColor:'#fef6ef',padding:12.9}}, {value: '01%', textStyle:{color:'#e69a67', backgroundColor:'#fef6ef',padding:12.9}}, {value: '01%', textStyle:{color:'#e69a67', backgroundColor:'#fef6ef',padding:12.9}}, {value: '01%', textStyle:{color:'#e69a67', backgroundColor:'#fef6ef',padding:12.9}}, {value: '01%', textStyle:{color:'#e69a67', backgroundColor:'#fef6ef',padding:12.9}}, {value: '01%', textStyle:{color:'#e69a67', backgroundColor:'#fef6ef',padding:12.9}}]
            },
        ],
        series: [

            {
                name: '耗气（立方米）',
                type: 'bar',
                stack: 'Total',
                label: {
                    show: true,
                    position: 'right',
                    formatter: (value) => {
                        if (value.data == 0) {
                            return ''
                        } else {
                            return value.data
                        }
                    }
                },
                barWidth: 20,
                emphasis: {
                    focus: 'series'
                },
                selectedMode: 'single',
                select: {
                    itemStyle: {
                        shadowColor: 'rgba(0, 0, 0, 0.5)',
                        shadowBlur: 10,
                        borderWidth: 0,
                    }
                },
                // showBackground: true,
                // data: [320, 302, 341, 374, 390, 450, 420]
                data: obj.seriesData1
            },
            {
                name: '电量',
                type: 'bar',
                stack: 'Total',
                label: {
                    show: true,
                    position: 'left',
                    formatter: (value) => {
                        if (value.data == 0) {
                            return ''
                        } else {
                            return -value.data
                        }

                    }
                },
                barWidth: 20,
                selectedMode: 'single',
                select: {
                    itemStyle: {
                        shadowColor: 'rgba(0, 0, 0, 0.5)',
                        shadowBlur: 10,
                        borderWidth: 0,
                    }
                },
                emphasis: {
                    focus: 'series'
                },
                // showBackground: true,
                // data: [-120, -132, -101, -134, -190, -230, -210]
                data: obj.seriesData2
            }
        ]
    }
}

//正负条形图 新
export function GetEchartsNewNegativeModule(obj) {
    this.option = {
        tooltip: {
            trigger: 'axis',
            // axisPointer: {//鼠标移入背景色
            //     type: 'shadow',
            //     shadowStyle: {
            //         color: 'rgba(111, 111, 111, 0.2)',
            //     }
            // },
            formatter: (params) => {
                if (!params.length) return ''
                let s = params[0].axisValueLabel + '<br/>'
                for (const iterator of params) {
                    // 如果是负数则反转
                    let d = iterator.data < 0 ? -iterator.data : iterator.data
                    s += iterator.marker + iterator.seriesName + '：' + d + '<br/>'
                }
                return s
            }
        },
        legend: {
            right: 150,
            top: 20
        },
        grid: {
            left: '10%',
            right: '10%',
            bottom: '3%',
            containLabel: true
        },
        color: ["#269ae4", "#39b19d"],
        xAxis: [
            {
                show: false,
                type: 'value',
                axisLabel: {
                    formatter: (value) => {
                        // 负数取反 显示的就是正数了
                        if (value < 0) return -value
                        else return value
                    }
                },
                min: function (value) {
                    //最小值设置，其中-value.max * 1.05 乘以1.05 ，主要是使图的边界小于最小的值，给边界留空间
                    return (Math.abs(value.min) < value.max ? -value.max * 1.05 : value.min * 1.05).toFixed(2);
                },
                max: function (value) {
                    //最大值设置，其中-value.min * 1.05 乘以1.05 ，主要是使图的边界大于最大于值，给边界留空间
                    return (Math.abs(value.min) < value.max ? value.max * 1.05 : -value.min * 1.05).toFixed(2);
                }
            }
        ],
        dataZoom: [
            //滑动条
            {
                yAxisIndex: [0, 1], //这里是从X轴的0刻度开始
                show: true, //是否显示滑动条，不影响使用
                type: "inside", // 这个 dataZoom 组件是 slider 型 dataZoom 组件
                startValue: 0, // 从头开始。
                endValue: 13, // 一次性展示14个。
                minValueSpan: 14,
                maxValueSpan: 14,
            },
        ],
        yAxis: [
            {
                type: 'category',
                axisTick: {
                    show: false
                },
                axisLine: {
                    show: false,
                },
                inverse: true,
                triggerEvent: true,
                offset: 50,
                //层级
                // zlevel: 1000,

                // data: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
                data: obj.yAxisData1
            },
            {
                // name: '能源利用效率',
                type: 'category',
                axisTick: {
                    show: false
                },
                axisLine: {
                    show: false,
                },
                inverse: true,
                offset: 50,
                //层级
                // zlevel: 1000,
                nameLocation: 'start',
                nameTextStyle: {
                    color: '#fff',
                    padding: 10,
                    backgroundColor: '#e69a67',
                    borderRadius: [0, 0, 8, 8],
                },
                data: obj.yAxisData2,
                // data: [{value: '98%', textStyle:{color:'#e69a67', backgroundColor:'#fef6ef',padding:12.9}}, {value: '01%', textStyle:{color:'#e69a67', backgroundColor:'#fef6ef',padding:12.9}}, {value: '01%', textStyle:{color:'#e69a67', backgroundColor:'#fef6ef',padding:12.9}}, {value: '01%', textStyle:{color:'#e69a67', backgroundColor:'#fef6ef',padding:12.9}}, {value: '01%', textStyle:{color:'#e69a67', backgroundColor:'#fef6ef',padding:12.9}}, {value: '01%', textStyle:{color:'#e69a67', backgroundColor:'#fef6ef',padding:12.9}}, {value: '01%', textStyle:{color:'#e69a67', backgroundColor:'#fef6ef',padding:12.9}}]
            },
        ],
        series: [
            {
                name: '检修时长 /小时',
                type: 'bar',
                stack: 'Total',
                label: {
                    show: true,
                    position: 'left',
                    formatter: (value) => {
                        if (value.data == 0) {
                            return ''
                        } else {
                            return -value.data
                        }

                    }
                },
                barWidth: 20,
                selectedMode: 'single',
                select: {
                    itemStyle: {
                        shadowColor: 'rgba(0, 0, 0, 0.5)',
                        shadowBlur: 10,
                        borderWidth: 0,
                    }
                },
                emphasis: {
                    focus: 'series'
                },
                // showBackground: true,
                // data: [-120, -132, -101, -134, -190, -230, -210]
                data: obj.seriesData2
            },
            {
                name: '检修次数 /次',
                type: 'bar',
                stack: 'Total',
                label: {
                    show: true,
                    position: 'right',
                    formatter: (value) => {
                        if (value.data == 0) {
                            return ''
                        } else {
                            return value.data;
                        }
                    }
                },
                barWidth: 20,
                emphasis: {
                    focus: 'series'
                },
                selectedMode: 'single',
                select: {
                    itemStyle: {
                        shadowColor: 'rgba(0, 0, 0, 0.5)',
                        shadowBlur: 10,
                        borderWidth: 0,
                    }
                },
                // showBackground: true,
                // data: [320, 302, 341, 374, 390, 450, 420]
                data: obj.seriesData1
            },

        ]
    }
}

//矩形树图
export function GetEchartsTreeMapModule(obj) {

    let seriesData = obj.seriesData;
    let dataValueStrArr = obj.dataValueStrArr;
    if (seriesData.length > 0) {
        let colorArr = obj.colorArr;
        for (let i = 0; i < seriesData.length; i++) {
            let sc = 0;
            let count = 0;
            for (let j = 0; j < seriesData[i].children.length; j++) {
                if (j == 0) {
                    if (seriesData[i].children[j].name == '跳闸') {
                        seriesData[i].children[j].itemStyle = {
                            color: '#e3442e',
                        }
                    } else {
                        seriesData[i].children[j].itemStyle = {
                            color: LightenDarkenColor(colorArr[i], obj.colorDistance * count),
                        }
                    }
                    sc = seriesData[i].children[j].value[1];
                } else {
                    if (sc != seriesData[i].children[j].value[1]) {
                        count++;
                        sc = seriesData[i].children[j].value[1];
                    }
                    if (seriesData[i].children[j].name == '跳闸') {
                        seriesData[i].children[j].itemStyle = {
                            color: '#e3442e',
                        }
                    } else {
                        seriesData[i].children[j].itemStyle = {
                            color: LightenDarkenColor(colorArr[i], obj.colorDistance * count),
                        }
                    }

                }

            }
        }
    }
    this.option = {
        tooltip: {
            formatter(params) {
                let str = "";
                str += params.name;
                for (let i = 0; i < params.data.value.length; i++) {
                    str += '<br />';
                    str += dataValueStrArr[i];
                    str += ': ';
                    str += params.data.value[i];
                }
                return str;
            },
        },
        title: {
            text: '',    //主标题
        },
        // color: ,
        series: [
            {
                type: 'treemap',
                breadcrumb: { show: false },//不显示下标
                width: '98%',
                height: '100%',
                roam: 'false',//不缩放移动
                data: seriesData,
                // visibleMin: 300,
                levels: [
                    {
                        itemStyle: {
                            gapWidth: 1,
                        }
                    },
                    {
                        itemStyle: {
                            gapWidth: 1,
                        }
                    }
                ]
            }
        ]
    };
}

function LightenDarkenColor(col, amt) {

    var usePound = false;

    if (col[0] == "#") {
        col = col.slice(1);
        usePound = true;
    }

    var num = parseInt(col, 16);

    var r = (num >> 16) + amt;

    if (r > 255) r = 255;
    else if (r < 0) r = 0;

    var b = ((num >> 8) & 0x00FF) + amt;

    if (b > 255) b = 255;
    else if (b < 0) b = 0;

    var g = (num & 0x0000FF) + amt;

    if (g > 255) g = 255;
    else if (g < 0) g = 0;

    return (usePound ? "#" : "") + (g | (b << 8) | (r << 16)).toString(16);

}
