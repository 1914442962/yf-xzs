<template>
<div class="page_content">
  <iframe :src="url"></iframe>
</div>
</template>
<script>
export default {
  name:'view_iframe_page1',
  data() {
    return {
      url: ''
    }
  },
  created() {
    this.url = (process.env.NODE_ENV === 'development'?'http://192.168.4.117:8080':'http://192.168.4.117:8080') + "/yfxzs/application/flow/config/nodeConfig.html"

  }
}
</script>
<style scoped lang="scss">
.page_content{
  width: 100%;
  height: 100%;
  iframe{
    width: 100%;
    height: 100%;
  }
}
</style>