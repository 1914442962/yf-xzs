<template>
  <div class="DataTextComponent">
    <span v-for="item in textArr">
      <span class="span_label">{{ item.name }}：</span>
      <el-text tag="b" type="primary">{{ item.value }}</el-text>
    </span>
  </div>
</template>
<script>
export default {
  name: "DataTextComponent",
  props: {
    textArr: Array,
  },
};
</script>
<style scoped lang="scss">
.DataTextComponent {
  padding: 0 10px;
  .span_label {
    margin-left: 10px;
  }
}
</style>
