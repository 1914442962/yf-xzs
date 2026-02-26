<template>
<div class="EchartsDivComponent">
  <p :class="echartsData.isSpecial?'green_bg2':'blue_bg2'" :style="computedBgcWidth(echartsData.bgcWidth)">
    <span :class="echartsData.isSpecial?'green_bg1':'blue_bg1'">{{echartsData.title}}</span>
    <span style="font-size: 36px;margin-left: 20px">
      <span style="color:#ff8260;font-size: 60px;position: relative;top:10px">{{echartsData.total}}</span>万千瓦
    </span>
  </p>
  <echarts-component :echarts-id="echartsData.id" :data-obj="echartsObj" style="height: calc(100% - 105px)"></echarts-component>
</div>
</template>

<script>
import EchartsComponent from "@/components/EchartsComponent";

export default {
  name: "EchartsDivComponent",
  components: {EchartsComponent},
  props:{
    echartsData: Object,
  },
  data() {
    return {
    }
  },
  computed:{
    echartsObj(){
      return {
        xAxis: {
          type: 'category',
          data: this.echartsData.xAxis,
          axisLine:{
            show:false,
            lineStyle: {
              color: '#0096ff'
            }

          },
          axisLabel:{
            fontSize: 44,
            color: '#fff',
            margin:20,
          },
          splitLine:{
            show: false
          }
        },
        yAxis: {
          type: 'value',
          axisLabel:{
            fontSize: 44,
            color: '#fff',
            margin:50,
          },
          splitLine:{
            show: false
          }
        },
        ySeries: [
          {
            data: this.echartsData.yAxis,
            type: "line",
            areaStyle: {
              color: {
                type: 'linear',
                x: 0,
                y: 0,
                x2: 0,
                y2: 1,
                colorStops: [{
                  offset: 0, color: '#0096ff' // 0% 处的颜色
                }, {
                  offset: 1, color: 'rgba(128, 128, 128, 0)' // 100% 处的颜色
                }],
                global: false // 缺省为 false
              }
            },
            lineStyle: {
              type: 'solid',
              width:6
            }
          },
        ],
        colorArr: ["#00c6ff"],
        grid:{
          left: '12%',
          // top: 0,
          // right: 0,
          bottom: 100,
        }
      }

    }
  },
  methods:{
    computedBgcWidth(val){
      return {backgroundSize: `100% 100%`}
      // return {backgroundSize: `${val} 100%`}
    }
  }
}
</script>

<style scoped lang="scss">
.EchartsDivComponent{
  width: 100%;
  font-family: MicrosoftYaHei-Bold;
  color:#fff;
  font-size: 50px;
  p{
    height: 105px;
    background-repeat: no-repeat;
  }
  .green_bg2{
    background-image: url('@/assets/images/bygyfh/green_bg2.png');
    .green_bg1{
      background-image: url('@/assets/images/bygyfh/green_bg1.png');
      font-size: 60px;
      display: inline-block;
      height: 105px;
      line-height: 105px;
      background-size: 100% 100%;
      padding: 0 80px;
      padding-right: 150px;
      text-shadow: 3px 0 0 #000
    }
  }
  .blue_bg2{
    background-image: url('@/assets/images/bygyfh/blue_bg2.png');
    .blue_bg1{
      background-image: url('@/assets/images/bygyfh/blue_bg1.png');
      font-size: 50px;
      display: inline-block;
      height: 105px;
      line-height: 105px;
      background-size: 100% 100%;
      padding: 0 110px;
      padding-right: 130px;
    }
  }
}
</style>