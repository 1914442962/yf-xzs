<template>
  <div class="page_content" id="jdshow">
    <el-carousel height="519px" :autoplay="false" arrow="never">
      <el-carousel-item v-for="item in carouselData" :key="item">
        <div class="carousel_item">
          <p class="carousel_title">{{ item.mklx }}</p>
          <view_flow_xzs
            :origin-nodes="item.list"
            style="height: calc(100% - 34px)"
          ></view_flow_xzs>
        </div>
      </el-carousel-item>
    </el-carousel>
  </div>
</template>
<script>
import jdpzApi from "@/api/xzs/jdpz-api.js";
import View_flow_xzs from "@/views/vxeModal/view_flow_xzs.vue";

export default {
  name: "jdshow",
  components: { View_flow_xzs },
  data() {
    return {
      carouselData: [],
    };
  },
  created() {
    this.loadPage();
  },
  methods: {
    loadPage() {
      jdpzApi.loadJdDataService({}).then((res) => {
        this.carouselData = res.data;
      });
    },
  },
};
</script>
<style>
#jdshow .el-carousel__indicators {
  bottom: 10px;
}
#jdshow .el-carousel__indicator {
  width: 14px;
  height: 8px;
  padding: 0;
  background-color: #5eb7a7;
  border-radius: 4px;
  margin: 0 2px;
}
#jdshow .el-carousel__indicator.is-active {
  width: 28px;
  height: 8px;
  background-image: linear-gradient(90deg, #fcc96c 0%, #d4941e 100%);
  border-radius: 4px;
}
#jdshow .el-carousel__indicator button {
  display: none;
}
</style>
<style scoped lang="scss">
.page_content {
  width: 491px;
  height: 519px;
  background-color: #ffffff;
  border-style: solid;
  border-width: 1px;
  border-image-source: linear-gradient(
    90deg,
    #13b294 0%,
    rgba(1, 221, 178, 0.1) 100%
  );
  border-image-slice: 1;
  margin: 0 auto;
  .carousel_item {
    width: 461px;
    height: 477px;
    background-color: #f8f9f8;
    border-radius: 10px;
    margin: 14px auto;
    .carousel_title {
      width: 387px;
      height: 34px;
      line-height: 28px;
      font-family: MicrosoftYaHei-Bold;
      font-size: 16px;
      font-weight: bold;
      font-stretch: normal;
      letter-spacing: 0px;
      color: #333333;
      text-align: center;
      background-image: url(@/assets/img/carousel_title.png);
      background-size: 100% 100%;
      margin: 0 auto;
    }
  }
}
</style>
