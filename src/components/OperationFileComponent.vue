<template>
<span>
  <el-upload class="upload-btn-self" :action="uploadUrl" :headers="uploadHeaders" :data="uploadParam"  :on-success="uploadSuccess" :on-error="uploadError" :before-upload="handleBeforeUpload" style="display: inline-block" accept=".pdf" :show-file-list="false" action=""
              v-if="item.template.operations&&computedIf(this.item,this.row,'upload')" ref="importUpload">
    <i class="el-icon-upload2 blueClass"></i>
  </el-upload>
  <i class="el-icon-download blueClass" @click="doDownloadFile()" style="margin-left:4px" v-if="item.template.operations&&computedIf(this.item,this.row,'download')"></i>
  <i class="el-icon-delete blueClass" @click="doDeleteFile()" style="margin-left:4px" v-if="item.template.operations&&computedIf(this.item,this.row,'delete')"></i>
  <i class="el-icon-search blueClass" @click="doPreviewFile()" style="margin-left:4px"
     v-if="this.item.template.operations&&computedIf(this.item,this.row,'preview')"></i>
  <span v-if="this.item.template.isShowOperationName" style="margin-left:4px;">{{this.row[this.item.field]}}</span>
</span>
</template>

<script>
import commonApi from "@/api/common-api";
import CookiesUtil from "@/utils/cookies.utils";
import {downloadFileByBlob} from "@/utils/tools";
import view_file from "@/views/vxeModal/view_file";
import {TOKEN_KEY} from "@/enums/CacheEnum.js";
export default {
  name: "OperationFileComponent.",
  props:{
    row:Object,
    item:Object,
    isFromForm: {
      type: Boolean,
      default() {
        return false;
      }
    }
  },
  data() {
    return {
    }
  },
  computed:{
    uploadUrl(){
      let url='';
      let uploadArr = this.item.template.operations.filter(i=> i.name == 'upload');
      if(uploadArr&&uploadArr.length > 0){
        url= uploadArr[0].url;
      }
      return url
    },
    uploadParam(){
      let obj={},key,value;
      let uploadArr = this.item.template.operations.filter(i=> i.name == 'upload');
      if(uploadArr&&uploadArr.length > 0){
        let uploadObj = uploadArr[0];
        for (let i = 0; i < uploadObj.params.length; i++) {
          key = uploadObj.params[i].key;
          value = uploadObj.params[i].value;
          obj[key] = this.row[value];
        }
      }
      return obj

    },
    uploadHeaders(){
      return{
        Authorization: CookiesUtil.get(TOKEN_KEY)
      }

    }
  },
  methods:{
    computedIf(item,row,operation){
      let flag = false;
      for (let i = 0; i < item.template.operations.length; i++) {
        if(item.template.operations[i].name == operation){
          if(item.template.operations[i].enabledList){
            let enables = item.template.operations[i].enabledList;
            flag = true;
            for (let j = 0; j < enables.length; j++) {
              if(!row[enables[j].field]){
                flag = false;
              }
            }
            break
          }else{
            flag = true;
            break
          }
        }
      }
      return flag
    },

    doDownloadFile() {
      let obj={},key,value,str='';
      let downloadObj = this.item.template.operations.filter(i=> i.name == 'download')[0];
      for (let i = 0; i < downloadObj.params.length; i++) {
        key = downloadObj.params[i].key;
        value = downloadObj.params[i].value;
        // obj[key] = this.row[value];
        key = downloadObj.params[i].key;
        value = downloadObj.params[i].value;
        if(i != 0){
          str += "&";
        }
        str += key;
        str += '=';
        if(downloadObj.params[i].type && downloadObj.params[i].type == '固定值'){
          str += value;
        }else{
          str += this.row[value];
        }
      }
      commonApi.downloadBlobFileService(downloadObj.url + '?' + str).then(res=>{downloadFileByBlob(res, this.row[downloadObj.downloadFieldName], 'pdf')})
    },
    doDeleteFile(){
      let obj={},key,value;
      let operations = this.item.template.operations.filter(i=> i.name == 'delete')[0];
      for (let i = 0; i < operations.params.length; i++) {
        key = operations.params[i].key;
        value = operations.params[i].value;
        obj[key] = this.row[value];
      }
      this.$confirm(`确认移除该文件吗？`, "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      }).then(() => {
        commonApi.removeFileService(operations.url,obj).then(()=>{
          this.$message.success('移除成功')
          if(this.row.rev && !this.isFromForm){
            this.$emit('loadPage' );
          }else{
            this.$emit('replaceUploadRow',{fileName:'',fileId:''});
          }
        })
      })

    },
    doConfirm(){
      let obj={},key,value;
      let operations = this.item.template.operations.filter(i=> i.name == 'confirm')[0];
      for (let i = 0; i < operations.params.length; i++) {
        key = operations.params[i].key;
        value = operations.params[i].value;
        obj[key] = this.row[value];
      }
      confirmService(operations.url,obj).then(res=>{
        this.$message.success(res.data)
        this.$emit('loadPage');
      })

    },
    uploadSuccess(response) {
      if (response.code == 200) {
        this.$message.success('上传成功');
        if(this.row.rev){
          this.$emit('loadPage');
        }else{
          this.$emit('replaceUploadRow',response.data);
        }

      } else {
        this.$message.error(response.msg)
      }
    },
    // 上传失败回调
    uploadError(err) {
      this.$message.error(err)
    },
    // doUploadFile(){
    //   this.$emit('doUploadFile',this.row);
    // },
    doPreviewFile(){
      let previewObj = this.item.template.operations.filter(i=> i.name == 'preview')[0];

      let str = "",key,value;
      for (let i = 0; i < previewObj.params.length; i++) {
        key = previewObj.params[i].key;
        value = previewObj.params[i].value;
        str += key;
        str += '=';
        str += this.row[value];
      }
      this.$vxeModal.show(
          view_file,
          {
            baseUrl: previewObj.url + '?' + str,
            rowObj: this.row,
            field: this.item.field
          },
          {
            width: 800,
            title: "文件预览",
            height: window.innerHeight - 20,

          },
          {}
      );
    },
    // doContact(){
    //   this.$emit('doContact',this.row);
    // },

    handleBeforeUpload(file){
      const maxSize = 100 * 1024 * 1024; // 100MB
      if (file.size > maxSize) {
        this.$message.error('文件大小不能超过100MB！');
        return false;
      }
      return true;
    },
  }
}
</script>

<style scoped lang="scss">
</style>