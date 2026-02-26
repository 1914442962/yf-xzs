<template>
  <div id="view_file_new">
    <article>
      <vue-pdf-embed :source="url" style="height: 100%" />
    </article>

  </div>

</template>


<script>
import VuePdfEmbed, { useVuePdfEmbed } from 'vue-pdf-embed'
import commonApi from "@/api/common-api.js";
import {fileToBlobBase64, fileToBlobUrl} from "@/utils/tools.js";
export default {
  name: "view_file_new",
  components:{VuePdfEmbed},
  props: {
    params: {
      type: Object,
    }

  },
  data() {
    return {
      source:{},
      url: '',
      numPages: 0,
    }
  },
  created() {
    this.preViewFile()
  },
  methods: {
    preViewFile(){
      commonApi.preViewFileService(this.params).then(res => {
        let url = fileToBlobUrl(res,'pdf') + '#toolbar=0';
        const { doc } = useVuePdfEmbed({ source: url })
        this.url = doc;
        // fileToBlobBase64(res).then(response=>{
        //   this.url = response;
          // let loadingTask = createLoadingTask(response);
          // loadingTask.promise.then(pdf=>{
          //   this.numPages = pdf.numPages
          // })
        // })
      })
    }
  }

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
#view_file_new {
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
