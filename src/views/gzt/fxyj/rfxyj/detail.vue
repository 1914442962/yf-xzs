<template>
  <div class="page_content">
    <article id="print_div">
      <h2
        style="
          text-align: center;
          color: red;
          font-size: 20px;
          line-height: 36px;
          font-weight: bold;
          padding-top: 10px;
        "
      >
        电网风险预警调度通知书
      </h2>
      <p style="text-align: right; margin-bottom: 10px; font-size: 16px">
        <span>编号：</span><span class="text_bold">{{ ruleForm.tzsBh }}</span>
      </p>
      <table border="1">
        <tr style="height: 24px; line-height: 24px">
          <td style="color: #333" class="td_label">主题</td>
          <td class="td_value">{{ ruleForm.zt }}</td>
        </tr>
        <tr style="height: 24px; line-height: 24px">
          <td style="color: #333" class="td_label">风险等级</td>
          <td class="td_value">{{ ruleForm.fxdj }}</td>
        </tr>
        <tr style="height: 24px; line-height: 24px">
          <td style="color: #333" class="td_label">事由</td>
          <td class="td_value">{{ ruleForm.sy }}</td>
        </tr>
        <tr style="height: 24px; line-height: 24px">
          <td style="color: #333" class="td_label">时段</td>
          <td class="td_value no-print" style="width: 80%">
            <el-date-picker
              v-model="ruleForm.kssj"
              type="date"
              value-format="YYYY-MM-DD"
              label-format="YYYY-MM-DD"
            >
            </el-date-picker>
            至
            <el-date-picker
              v-model="ruleForm.jssj"
              type="date"
              value-format="YYYY-MM-DD"
              label-format="YYYY-MM-DD"
            >
            </el-date-picker>
          </td>
          <td class="td_value print" style="width: 80%">
            {{ ruleForm.kssj }} 至 {{ ruleForm.jssj }}
          </td>
        </tr>
        <tr style="height: 24px; line-height: 24px">
          <td style="color: #333" class="td_label">风险分析</td>
          <td class="td_value no-print">
            <el-input
              type="textarea"
              v-model="ruleForm.fxfx"
              :rows="6"
            ></el-input>
          </td>
          <td class="td_value print">{{ ruleForm.fxfx }}</td>
        </tr>
        <tr style="height: 24px; line-height: 24px">
          <td style="color: #333" class="td_label">预控措施</td>
          <td class="td_value no-print">
            <el-input
              type="textarea"
              v-model="ruleForm.ykcs"
              :rows="6"
            ></el-input>
          </td>
          <td class="td_value print">{{ ruleForm.ykcs }}</td>
        </tr>
        <tr style="height: 24px; line-height: 24px">
          <td style="color: #333" class="td_label">编制</td>
          <td style="width: 30%"></td>
        </tr>
        <tr style="height: 24px; line-height: 24px">
          <td style="color: #333" class="td_label">审核</td>
          <td style="width: 30%"></td>
        </tr>
        <tr style="height: 24px; line-height: 24px">
          <td style="color: #333" class="td_label">日期</td>
          <td class="td_value"></td>
        </tr>
        <tr style="height: 24px; line-height: 24px">
          <td :colspan="2">落实情况反馈信息</td>
        </tr>
        <tr style="height: 24px; line-height: 24px">
          <td style="color: #333" class="td_label">调度员</td>
          <td class="td_value"></td>
        </tr>
      </table>
    </article>
    <footer>
      <el-button type="gradientDarkGreen" @click="refreshData">刷新</el-button>
      <el-button type="gradientGreen" v-print="printObj">打印</el-button>
      <el-button type="gradientGreen" @click="doSubmit">保存</el-button>
    </footer>
  </div>
</template>
<script>
import Dynamic_form_plus from "@/views/vxeModal/dynamic_form_plus.vue";

export default {
  name: "rfxyj_detail",
  components: { Dynamic_form_plus },
  props: {
    row: Object,
  },
  data() {
    return {
      ruleForm: {},
      printObj: {
        id: "print_div",
      },
    };
  },
  computed: {},
  created() {
    this.ruleForm = JSON.parse(JSON.stringify(this.row));
  },
  methods: {
    refreshData() {
      this.ruleForm = this.row;
    },
    doSubmit() {
      this.$emit("doSubmit", this.ruleForm);
    },
  },
};
</script>
<style scoped lang="scss">
@use "table";
.page_content {
  width: 100%;
  height: 100%;
  footer {
    padding: 8px 0;
    text-align: center;
  }
  article {
    width: 800px;
    margin: 0 auto;
    height: calc(100% - 48px);
    overflow: auto;
  }
}
</style>
