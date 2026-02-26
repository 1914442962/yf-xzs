<template>
  <div class="page_content">
    <iframe :src="src" style="width: 100%;height: 100%;border: none" ref="iframe" id="iframe">

    </iframe>
  </div>
</template>
<script>
export default {
  name: 'snjh',
  data() {
    return {
      src: '',
      userName: ''
    }
  },
  created() {
    // let userName = this.$store.state.userInfo.sysUser.loginName;
    let userName = process.env.NODE_ENV === "development"?'dongyanxi':this.$store.state.userInfo.sysUser.loginName;
    if(process.env.NODE_ENV === "production" && !window.origin.includes("192.168.1")){
      this.src = `${window.YCJX_WEBSITE_URL}/master/window.html#/spa/ycjx-rjh/public-visit?userName=${userName}&flag=12`
    }else{
      this.src = `http://192.168.1.194:10015/master/window.html#/spa/ycjx-rjh/public-visit?userName=${userName}&flag=12`
    }
  }
}
</script>
<style scoped lang="scss">

</style>