<template>
  <div style="display: inline-block">
    <el-upload
      ref="importUpload"
      :accept="acceptStr"
      :show-file-list="showFileList"
      :limit="1"
      :action="uploadUrl"
      :headers="uploadHeaders"
      :data="propUploadParam"
      :auto-upload="autoUpload"
      :before-upload="beforeUpload"
      :on-success="uploadSuccess"
      :on-error="uploadError"
      :on-progress="uploadProgress"
    >
      <template #trigger>
        <el-button type="gradientBlue" class="upload_button">{{
          buttonName
        }}</el-button>
      </template>
    </el-upload>
    <div class="progress_div" v-show="progressFlag">
      <el-progress
        :percentage="progressUploadPercent"
        :stroke-width="10"
      ></el-progress>
    </div>
  </div>
</template>

<script>
import CookiesUtil from "@/utils/cookies.utils";
import CloudService from "@/enums/CloudService.js";
import { ElLoading } from "element-plus";
import { TOKEN_KEY } from "@/enums/CacheEnum.js";
let loadingInstance;
export default {
  name: "UploadComponent",
  props: {
    propUploadUrl: {
      type: String,
      default: () => {
        return "";
      },
    },
    propUploadParam: {
      type: Object,
      default: () => {
        return {};
      },
    },
    buttonName: {
      type: String,
      default: () => {
        return "导入";
      },
    },
    acceptStr: {
      type: String,
      default: () => {
        return ".xls,.xlsx,.pdf,.doc,.docx,.png,.jpg,.jpeg";
      },
    },
    fileSize: {
      type: Number,
      // eslint-disable-next-line vue/require-valid-default-prop
      default: () => {
        return 30;
      },
    },
    autoUpload: {
      type: Boolean,
      default: () => {
        return true;
      },
    },
    showFileList: {
      type: Boolean,
      default: () => {
        return false;
      },
    },
  },
  data() {
    return {
      progressFlag: false,
      progressUploadPercent: 0,
    };
  },
  computed: {
    uploadUrl() {
      let url = "/" + CloudService.base + this.propUploadUrl;
      return window.location.origin + url;
    },
    uploadHeaders() {
      return {
        Authorization: CookiesUtil.get(TOKEN_KEY),
      };
    },
  },
  methods: {
    beforeUpload(file) {
      const maxSize = this.fileSize * 1024 * 1024; // 设定最大文件大小为30MB
      if (file.size > maxSize) {
        this.$message.error("文件大小不能超过30MB!");
        return false; // 返回false停止上传
      }
      this.progressUploadPercent = 0;
      this.progressFlag = true;
      loadingInstance = ElLoading.service();
      return true; // 返回true允许上传
    },
    uploadProgress(event) {
      this.progressUploadPercent = Math.ceil(
        (event.loaded / event.total) * 100,
      );
      this.$forceUpdate();
    },
    uploadSuccess(res) {
      this.$refs.importUpload.clearFiles();
      this.progressFlag = false;
      loadingInstance.close();
      if (res.code == 200) {
        loadingInstance.close();
        if (XEUtils.isString(res.data)) {
          this.$message.success(res.data);
        } else {
          this.$message.success(`${this.buttonName}成功`);
        }

        this.$emit("loadTableData", res.data);
      } else {
        loadingInstance.close();
        this.$message.error(res.msg);
      }
    },
    uploadError(err) {
      loadingInstance.close();
      this.progressFlag = false;
      this.$message.error(err);
    },
    doTriggerClick() {
      this.$refs.importUpload.$el.querySelector(".upload_button").click();
    },
  },
};
</script>
<style scoped lang="scss">
.progress_div {
  width: 600px;
  height: 40px;
  position: fixed;
  padding: 10px;
  left: calc(50% - 300px);
  top: calc(50% - 20px);
  z-index: 10000;
  background: #eee;
  opacity: 0.9;
  //font-size: 16px;
  border-radius: 10px;
}
</style>
