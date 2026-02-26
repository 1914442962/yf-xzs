<template>
  <iframe
    :src="src"
    style="width: 100%; height: 100%; border: none"
    ref="iframe"
    id="iframe"
  ></iframe>
</template>
<script>
export default {
  name: "view_iframe",
  props: {
    src: String,
  },
  data() {
    return {
      iframeWin: {},
    };
  },
  mounted() {
    this.iframeWin = this.$refs.iframe.contentWindow;
    window.addEventListener("message", this.receiveMessage);
  },
  unmounted() {
    window.removeEventListener("message", this.receiveMessage);
  },
  methods: {
    receiveMessage(e) {
      if (e.data.event === "returnData") {
        this.$emit("returnData", e.data.data);
      }
      if (e.data.name === "multi-jxd-close-tab") {
        this.$emit("close");
      }
    },
  },
};
</script>
<style scoped lang="scss">
#iframe {
  background-color: #fff;
}
</style>
