<template>
  <div id="view_prompt">
    <article>
      <p v-if="title">{{ title }}：</p>
      <el-input
        type="textarea"
        :autosize="{ minRows: 4, maxRows: 4 }"
        placeholder="请输入内容"
        v-model="textarea"
      >
      </el-input>
    </article>
    <footer>
      <el-button type="gradientGray" @click="$emit('close')">取消</el-button>
      <el-button type="gradientGreen" @click="returnData">确定</el-button>
    </footer>
  </div>
</template>

<script>
export default {
  name: "view_prompt",
  props: {
    title: {
      type: String,
    },
    isRequire: {
      type: Boolean,
      default: true,
    },
    defaultTextarea: String,
  },
  data() {
    return {
      textarea: "",
    };
  },
  created() {
    if (this.defaultTextarea) {
      this.textarea = this.defaultTextarea;
    }
  },
  methods: {
    returnData() {
      if (this.isRequire && (!this.textarea || this.textarea == "")) {
        this.$message.warning("内容不能为空");
        return;
      }
      this.$emit("returnData", this.textarea);
      this.$emit("close");
    },
  },
};
</script>
<style>
.el-icon-circle-close {
  font-size: 20px;
  margin-top: 2px;
  cursor: pointer;
}
</style>
<style scoped lang="scss">
#view_prompt {
  width: 100%;
  height: 100%;

  article {
    width: 100%;
    height: calc(100% - 48px);
    background-color: #ffffff;
    border-radius: 4px 4px 0 0;
    padding: 0 16px;
    padding-top: 10px;
    p {
      height: 38px;
      line-height: 38px;
    }
  }

  footer {
    padding: 8px 0;
    text-align: center;
    background-color: #ffffff;
    border-radius: 0 0 4px 4px;
  }
}
</style>
