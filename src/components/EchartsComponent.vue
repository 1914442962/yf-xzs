<template>
  <div class="chart_div" :id="echartsId">
    <div :ref="echartsId" class="contentChart"></div>
  </div>
</template>

<script>
import * as echarts from "echarts";


let contentEchartsObj = {
  contentChart1: null,
  contentChart2: null,
  contentChart3: null,
  contentChart4: null,
  contentChart5: null,
  contentChart6: null,
  contentChart7: null,
  contentChart8: null,
  contentChart9: null,
  contentChart10: null,
  contentChart11: null,
  contentChart12: null,
  contentChart13: null,
  contentChart14: null,
  contentChart15: null,
  contentChart16: null,
  contentChart17: null,
  contentChart18: null,
  contentChart19: null,
  contentChart20: null,
  contentChart21: null,
  contentChart22: null,
  contentChart23: null,
  contentChart24: null,
  contentChart25: null,
};
export default {
  name: "EchartsComponent",
  props: {
    echartsId: {
      type: String,
      default: "contentChart",
    },
    dataObj: {
      type: Object,
    },
  },

  mounted() {
    this.initData();
  },
  methods: {
    initData() {
      if (contentEchartsObj[this.echartsId]) {
        echarts.dispose(contentEchartsObj[this.echartsId]);
      }
      this.$nextTick(() => {
        contentEchartsObj[this.echartsId] = echarts.init(
            this.$refs[this.echartsId]
        );
        contentEchartsObj[this.echartsId].setOption(this.dataObj);
        contentEchartsObj[this.echartsId].on("click", (params) => {
          this.$emit("echartsClick", params);
        });
        contentEchartsObj[this.echartsId].resize();
      });
    },
    getSrcUrl() {
      return contentEchartsObj[this.echartsId].getDataURL({
        type: 'png'
      })
    }
  },
  watch: {
    dataObj: {
      handler() {
        this.initData();
      },
      immediate: false,
      deep: true,
    },
  },
};
</script>

<style scoped lang="scss">
.chart_div {
  width: 100%;
  height: 100%;
  overflow: hidden;

  .contentChart {
    width: 100%;
    height: 100%;
  }
}
</style>
