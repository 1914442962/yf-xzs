<template>
  <div class="page_content">
    <header>
      <section>
        <el-button-group>
          <el-button
            v-for="(item, index) in buttonList"
            :key="'buttonList' + index"
            @click="active = item"
            :type="active.url == item.url ? 'gradientGreen' : ''"
            >{{ item.name }}</el-button
          >
        </el-button-group>
      </section>
    </header>
    <article>
      <keep-alive>
        <component :is="active.url"></component>
      </keep-alive>
    </article>
  </div>
</template>
<script>
import xltg from "@/views/xzs/cyzl/xltg.vue";
import zydlkhmd from "@/views/xzs/cyzl/zydlkhmd.vue";
import xlzllxe_new from "@/views/xzs/cyzl/xlzllxe_new.vue";
import xlsbdsbgxdw from "@/views/xzs/cyzl/xlsbdsbgxdw.vue";
import grcyzl from "@/views/xzs/grcyzl.vue";
import bdzsbdsbgxdw from "@/views/xzs/cyzl/bdzsbdsbgxdw.vue";

export default {
  name: "cyzl",
  components: {
    xltg,
    zydlkhmd,
    xlzllxe_new,
    xlsbdsbgxdw,
    bdzsbdsbgxdw,
    grcyzl,
  },
  computed: {},
  data() {
    return {
      active: {
        name: "线路同杆",
        url: "xltg",
      },
      buttonList: [
        {
          name: "线路同杆",
          url: "xltg",
        },
        {
          name: "线路载流量限额",
          url: "xlzllxe_new",
        },
        {
          name: "重要电力客户名单",
          url: "zydlkhmd",
        },
        {
          name: "线路输变电设备管辖单位",
          url: "xlsbdsbgxdw",
        },
        {
          name: "变电站输变电设备管辖单位",
          url: "bdzsbdsbgxdw",
        },
        {
          name: "个人常用资料",
          url: "grcyzl",
        },
      ],
    };
  },
};
</script>
<style scoped lang="scss">
.page_content {
  background-color: rgb(239, 247, 245);
  header {
    padding-bottom: 0;
  }
  article {
    height: calc(100% - 40px);
  }
}
</style>
