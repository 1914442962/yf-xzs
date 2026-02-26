<template>
  <div id="view_file">
    <article>
      <iframe id="iframe_div" :src='url' style="width: 100%; height: 100%; border: none"></iframe>
    </article>

  </div>

</template>

<script>
export default {
  name: "view_file",
  props: {
    url: {
      type: String
    }

  },
  data() {
    return {}
  },
  created() {
  },
  methods: {}

}
</script>
<style>

.el-icon-circle-close {
  font-size: 20px;
  margin-top: 2px;
  cursor: pointer;
}
</style>
<style scoped lang="scss">
#view_file {
  width: 100%;
  height: 100%;

  article {
    width: 100%;
    height: 100%;
    background-color: #ffffff;
    border-radius: 4px;
  }


}
</style>
