<template>
  <div class="page_content">
    <!--    <header>-->
    <!--      <section>-->
    <!--        <div class="header-item">-->
    <!--          年：-->
    <!--          <el-date-picker v-model="year" type="year" format="YYYY" value-format="YYYY">-->
    <!--          </el-date-picker>-->
    <!--        </div>-->
    <!--        <div class="header-item">-->
    <!--          <el-button type="gradientGreen" @click="loadPageData">查询</el-button>-->
    <!--        </div>-->
    <!--      </section>-->

    <!--    </header>-->
    <!--    <article>-->
    <!--      <section style="margin-bottom: 16px;height: 60%;">-->

    <!--      </section>-->
    <!--      <section style="height: calc(40% - 16px)">-->

    <!--      </section>-->
    <!--    </article>-->
  </div>
</template>
<script>
import dayjs from "dayjs";

export default {
  name: "homepage",
  data() {
    return {
      year: "",
    };
  },
  computed: {
    defaultLeftButtons() {
      return [{ type: "gradientGreen", name: "查询" }];
    },
  },
  created() {
    this.year = dayjs().format("YYYY");
  },
  methods: {
    loadPageData() {},
  },
};
</script>
<style scoped lang="scss">
.page_content {
  background-image: url("@/assets/img/homepage_bgc.png");
  width: 100%;
  height: 100%;
  background-size: 100% 100%;
  header {
    padding-top: 0;
  }
  article {
    padding: 16px;
    height: calc(100% - 40px);
    background-image: linear-gradient(to left, #ffffff, #edfffa);
  }
}
</style>
