<template>
  <div id="view_transfer">
    <article>
      <el-transfer v-model="selectValue" :data="transferLeftData" filterable :props="transferProps" :titles="['请选择', '已选择']"></el-transfer>

    </article>
    <footer>
      <el-button @click="$emit('close')">取消</el-button>
      <el-button type="primary"  @click="returnData">确定</el-button>
    </footer>
  </div>

</template>

<script>
export default {
  name: "view_transfer",
  props: {
    title: {
      type: String,
    },
    transferData: Array,
    defaultValue: Array,
    transferProps: {
      type: Object,
      default: () => {
        return {key: 'value', label: 'label'}
      }
    }
  },
  data() {
    return {
      selectValue: [],
      transferLeftData: [],
    }
  },
  created() {
    this.selectValue = JSON.parse(JSON.stringify(this.defaultValue));
    this.transferLeftData = JSON.parse(JSON.stringify(this.transferData));
  },
  methods: {
    returnData() {
      if (this.selectValue.length == 0) {
        this.$message.warning('请选择节点');
        return
      }

      this.$emit('returnData', this.selectValue);
      this.$emit('close')
    },
  }

}
</script>
<style>


#view_transfer .el-transfer-panel:first-child .el-transfer-panel__header {
  background-color: #d1efed !important;
}

#view_transfer .el-transfer-panel:first-child .el-transfer-panel__header .el-checkbox .el-checkbox__label {
  color: #0d998d !important;
}

#view_transfer .el-transfer-panel:last-child .el-transfer-panel__header {
  background-color: #d8ebf5 !important;
}

#view_transfer .el-transfer-panel:last-child .el-transfer-panel__header .el-checkbox .el-checkbox__label {
  color: #1789c5 !important;
}

#view_transfer .el-transfer__buttons button {
  display: block;
  margin: 4px;
  padding: 8px 16px;
}
</style>
<style>

.el-icon-circle-close {
  font-size: 20px;
  margin-top: 2px;
  cursor: pointer;
}
</style>
<style scoped lang="scss">
#view_transfer {
  width: 100%;
  height: 100%;

  article {
    width: 100%;
    height: calc(100% - 48px);
    background-color: #ffffff;
    border-radius: 4px;
    padding: 10px 16px;
  }

  footer {
    padding: 8px 0;
    text-align: center;
    background-color: #ffffff;
  }
}
</style>
