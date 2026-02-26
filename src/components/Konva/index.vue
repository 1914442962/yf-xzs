<template>
<div class="page_content" id="konva" :style="{backgroundColor:backgroundColor}">
  <header>
    <input type="file" id="upload" @change="doImport($event)" ref="uploadFile" />
  </header>
  <article>
    <v-stage :config="stageSize" ref="stageRef">
      <v-layer>
        <v-line v-for="(item,index) in lines" :key="'lines' + index" :config="item"></v-line>
        <v-group v-for="(item,index) in nodes" :key="'nodes' + index" :config="item" >
          <template v-for="(item1,index1) in item.children" :key="'nodes' + index + 'children'+index1">
            <v-circle :config="item1" v-if="item1.type==='circle'"></v-circle>
            <v-path :config="item1" v-if="item1.type==='path'"></v-path>
            <v-rect :config="item1" v-if="item1.type==='rect'"></v-rect>
          </template>
        </v-group>
        <v-group v-for="(item,index) in texts" :key="'texts' + index" :config="item" >
          <template v-for="(item1,index1) in item.children" :key="'texts' + index + 'children'+index1">
            <v-text :config="item1" v-if="item1.type==='text'"></v-text>
            <v-rect :config="item1" v-if="item1.type==='rect'"></v-rect>
          </template>
        </v-group>
      </v-layer>

    </v-stage>
  </article>
</div>
</template>
<script>
import {dealLine} from "@/components/Konva/konva-dealSvg-line.js";
import {dealNode} from "@/components/Konva/konva-dealSvg-node.js";
import {dealText} from "@/components/Konva/konva-dealSvg-text.js";

export default {
  name: "Konva",
  computed:{
    stageSize(){
      return {
        width: window.innerWidth,
        height: window.innerHeight - 40,
        draggable: true,
        fill: 'black'
      }
    }
  },
  data(){
    return {
      lines: [],
      nodes: [],
      texts: [],
      backgroundColor: ""
    }
  },
  methods:{
    doImport(e){
      const file = e.target.files[0];
      if (!file) return;
      const reader = new FileReader();
      let that = this;
      reader.onload = function (evt) {
        const parser = new DOMParser();
        const doc = parser.parseFromString(
            evt.target.result,
            "image/svg+xml"
        );
        console.log(doc);
        // let svg = doc.getElementById('svgobj');
        // that.backgroundColor = svg.style.backgroundColor;
        // ========== 解析线路 ==========
        that.lines = dealLine(doc);

        // ========== 解析节点 ==========
        that.nodes = dealNode(doc);

        // // ========== 解析文本 ==========
        that.texts = dealText(doc);
        console.log(that.texts)

      };
      reader.readAsText(file);
    }
  }
}
</script>
<style scoped lang="scss">
#konva{

}
</style>