<template>
  <div style="display: inline-block">
    <el-button type="gradientBlue" class="upload_button" @click="selectEvent">{{
      buttonName
    }}</el-button>
    <vxe-upload
      multiple
      show-progress
      ref="uploadRef"
      :show-list="showFileList"
      v-model="fileList"
      :showUploadButton="false"
      :upload-method="uploadMethod"
      @uploadSuccess="uploadSuccess"
    >
    </vxe-upload>
  </div>
</template>

<script>
import commonApi from "@/api/common-api.js";
import XEUtils from "xe-utils";
export default {
  name: "UploadHttpComponent",
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
      type: Array,
      default: () => {
        return ["xls", "xlsx", "pdf", "doc", "docx", "png", "jpg", "jpeg"];
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
      fileList: [],
    };
  },
  computed: {},
  methods: {
    selectEvent() {
      const $upload = this.$refs.uploadRef;
      if ($upload) {
        $upload.choose();
      }
    },
    uploadMethod({ file }) {
      const formData = new FormData();
      formData.append("file", file);
      for (let key in this.propUploadParam) {
        formData.append(key, this.propUploadParam[key]);
      }
      return commonApi
        .uploadFileByUrlService(formData, this.propUploadUrl)
        .then((res) => {
          return res.data;
        });
    },
    uploadSuccess(res) {
      if (XEUtils.isString(res.data)) {
        this.$message.success(res.data);
      } else {
        this.$message.success(`${this.buttonName}成功`);
      }
      this.$emit("loadTableData", res.data);
    },
  },
};
</script>
<style scoped lang="scss"></style>
