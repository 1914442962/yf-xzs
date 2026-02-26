<template>
  <article id="view_flow_xzs">
    <VueFlow
      :nodes="nodes"
      :edges="edges"
      fit-view-on-init
      :nodes-draggable="false"
      @node-click="handleNodeClick"
    >
    </VueFlow>
  </article>
</template>

<script>
import { Handle, MarkerType, Position, VueFlow } from "@vue-flow/core";
import "@vue-flow/core/dist/style.css";
import "@vue-flow/core/dist/theme-default.css";
export default {
  name: "view_flow_xzs",
  components: { Handle, VueFlow },
  props: {
    originNodes: {
      type: Array,
      required: true,
    },
  },
  data() {
    return {
      nodes: [],
      edges: [],
    };
  },
  created() {
    this.initData();
  },
  methods: {
    initData() {
      let obj1 = {},
        obj2 = {};
      for (let i = 0; i < this.originNodes.length; i++) {
        obj1 = {
          id: this.originNodes[i].id,
          data: { label: this.originNodes[i].mc },
          position: { x: 145, y: 60 * i },
          url: this.originNodes[i].url,
          byValue: this.originNodes[i].byValue,
        };
        if (this.originNodes.length > 1) {
          if (i === 0) {
            obj1.type = "input";
          }
          if (i === this.originNodes.length - 1) {
            obj1.type = "output";
          }
          if (i !== this.originNodes.length - 1) {
            obj2 = {
              id: `e${this.originNodes[i].id}`,
              source: this.originNodes[i].id,
              type: "step",
              target: this.originNodes[i + 1].id,
              markerEnd: {
                type: MarkerType.ArrowClosed,
                color: "#03b5b7",
              },
              style: { stroke: "#03b5b7" },
            };
          }
        }
        this.nodes.push(obj1);
        this.edges.push(obj2);
      }
      for (let i = 0; i < this.nodes.length; i++) {
        this.nodes[i].style = {
          backgroundColor: "rgb(229.8, 247.6, 247.8)",
          color: "#03b5b7",
          borderColor: "#03b5b7",
        };
      }
    },
    handleNodeClick({ node }) {
      console.log(node);
      let url =
        window.location.origin +
        window.location.pathname +
        `#/autologin?path=gzt&noHeader=1&tree=${node.byValue}&gztPath=${node.url}&isXzs=1`;
      console.log(url);
      QClientJSAPI.window.openByChrome(node.data.label, url, node.id, {
        window: 800 * window.devicePixelRatio,
        height: 600 * window.devicePixelRatio,
      });
    },
  },
};
</script>
<style>
#view_flow_xzs .vue-flow__handle {
  opacity: 0 !important;
  width: 0 !important;
  height: 0 !important;
  min-height: 0 !important;
  min-width: 0 !important;
}
#view_flow_xzs .vue-flow__node.selected {
  background-image: linear-gradient(90deg, #23cda7 0%, #12b599 100%) !important;
  color: white !important;
  border: none !important;
  box-shadow: none !important;
}
</style>
<style scoped lang="scss">
#view_flow_xzs {
  width: 100%;
  height: 100%;
  padding: 12px;
}
</style>
