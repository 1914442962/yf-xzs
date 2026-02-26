<template>
  <div class="page_content">
    <header>
      <section>
        <div class="header-item">
          图：
          <el-select v-model="src" placeholder="请选择" clearable filterable style="width: 300px">
            <el-option v-for="item in imageOptions" :key="item.fullImageUrl" :label="item.name" :value="item.fullImageUrl">
            </el-option>
          </el-select>
        </div>
      </section>
    </header>
    <article>
      <div v-html="svgUrl" v-show="svgUrl" id="svgDiv" :style="{left: x+'px',top: y+'px'}" @mousedown="startDrag($event)"></div>
      <el-image v-show="!svgUrl"
          :src="svgUrl"
          :zoom-rate="1.2"
          :max-scale="7"
          :min-scale="0.2"
          :preview-src-list="[svgUrl]"
          show-progress
          fit="cover">
      </el-image>
    </article>
  </div>
</template>
<script>
import dwjxtApi from "@/api/xzs/dwjxt-api.js";

export default {
  name: 'dwjxt',
  data() {
    return {
      src: '',
      imageOptions: [],
      svgUrl: '',
      x: 50,
      y: 50,
      offsetX: 0,
      offsetY: 0,
      isDragging: false,
    }
  },
  created() {
    this.getImages();
  },
  mounted() {
    this.registerWheel()
  },
  watch: {
    src: {
      handler(val) {
        let arr = this.imageOptions.filter(i=> i.fullImageUrl === val);
        if(arr.length > 0){
          this.svgUrl = arr[0].svg

        }else{
          this.svgUrl = ""
        }
      },
      immediate: false,
    },
  },
  methods: {
    registerWheel(){
      var svgDiv = document.getElementById("svgDiv");
      let scale = 1;
      svgDiv.addEventListener("wheel", (event) => {
        event.preventDefault();
        console.log(event)
        if(event.deltaY < 0) {
          scale += 0.1;
        }else{
          scale -= 0.1;
        }
        svgDiv.style.transform = `scale(${scale})`;
      })

    },
    startDrag(event){
      this.isDragging = true;
      this.offsetX = event.clientX - this.x;
      this.offsetY = event.clientY - this.y;
      document.addEventListener("mousemove", this.onMouseMove);
      document.addEventListener("mouseup", this.stopDrag);
    },
    onMouseMove(event){
      if(this.isDragging){
        this.x = event.clientX - this.offsetX;
        this.y = event.clientY - this.offsetY;
      }
    },
    stopDrag(){
      this.isDragging = false;
      document.removeEventListener("mousemove", this.onMouseMove);
      document.removeEventListener("mouseup", this.stopDrag);
    },
    getImages(){
      dwjxtApi.loadTableDataService().then(res => {
        this.imageOptions = res.data;
        if(this.imageOptions.length > 0){
          this.src = this.imageOptions[0].fullImageUrl
        }

      })
    }
  }
}
</script>
<style scoped lang="scss">
.page_content {
  background-color: rgb(239, 247, 245);
  header{
    position: fixed;
    z-index: 100;
  }
  article {
    height: 100%;
    #svgDiv{
      transition: transform 0.2s ease;
      position: absolute;
      cursor: move;
    }
  }
}
</style>