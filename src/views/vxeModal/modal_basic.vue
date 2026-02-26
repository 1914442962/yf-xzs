<template>
  <div id="modal_basic">
    <header>
<!--      <div class="flex_between" v-if='isRadio' style="margin-top: 10px">-->
<!--        <div class="button_div">-->

<!--        </div>-->
<!--        <el-button type="primary" class="blue_button" size="medium" @click="btnClick">确定</el-button>-->
<!--      </div>-->
    </header>
    <article>
      <el-scrollbar height="100%">
      </el-scrollbar>

    </article>
  </div>

</template>

<script>
export default {
  name: "modal_basic",
  props: {
    title: {
      type: String
    },

  },
  data(){
    return{

    }
  },
  created() {
  },
  methods: {
    btnClick() {
      let row = this.$refs.xTable.getRadioRecord();
      if (!row || row.length == 0) {
        this.$message.warning('请选择一条数据');
        return
      }
      this.$emit('returnData', row);
      this.$emit('close');
    },
  }

}
</script>
<style scoped lang="scss">
#modal_basic {
  width: 100%;
  height: 100%;
  header {
    padding: 8px 0;
    .header-item{
      display: inline-block;
      margin-right: 10px;
    }
  }
  article {
    width: 100%;
    height: calc(100% - 40px);
    background-color: #ffffff;
    border-radius: 4px;
  }

}
</style>
