<template>
  <article id="view_flow">
    <VueFlow :nodes="nodes" :edges="edges" default-marker-color="red" fit-view-on-init>
    </VueFlow>
  </article>

</template>

<script>

import {Handle, MarkerType, Position, VueFlow} from "@vue-flow/core";
import '@vue-flow/core/dist/style.css';
import '@vue-flow/core/dist/theme-default.css';
export default {
  name: "view_flow",
  components: {Handle, VueFlow},
  props: {
    originNodes: {
      type: Array,
      required: true,
      default: () => [

        {
          id: '-1',
          type: 'input',
          position: {x:300,y:0},
          data: { label: '开始'}
        },
        {
          id: '1',
          position: {x:300,y:100},
          data: { label: '运方编制'}
        },
        {
          id: '2',
          position: {x:300,y:200},
          data: { label: '继保会签'},
          current:true,
        },
        {
          id: '3',
          position: {x:300,y:300},
          data: { label: '运方主管审核'}
        },
        {
          id: '4',
          position: {x:300,y:400},
          data: { label: '调度会签'}
        },
        {
          id: '5',
          position: {x:300,y:500},
          data: { label: '主任审核'}
        },
        {
          id: '6',
          type: 'output',
          position: {x:300,y:600},
          data: { label: '结束'}
        },
        {
          id: 's20',
          type: 'return',
          position: {x:150,y:150},
          data: { label: '退回'},
        },
        {
          id: 's32',
          type: 'return',
          position: {x:450,y:250},
          data: { label: '退回'},
        },
        {
          id: 's43',
          type: 'return',
          position: {x:150,y:350},
          data: { label: '退回'},
        },
        {
          id: 's54',
          type: 'return',
          position: {x:450,y:450},
          data: { label: '退回'},
        },

      ]
    },
    originEdges: {
      type: Array,
      required: true,
      default: () => [
        {
          id: 'e-2-0',
          source: '-2',
          type: 'step',
          target: '0',
        },
        {
          id: 'e-1-1',
          source: '-1',
          type: 'step',
          target: '1',
        },
        {
          id: 'e0-2',
          source: '0',
          type: 'step',
          target: '2',
          label: '发送'
        },
        {
          id: 'e1-2',
          source: '1',
          type: 'step',
          target: '2',
          label: '发送'
        },
        {
          id: 'e2-3',
          source: '2',
          target: '3',
          label: '审核'
        },
        {
          id: 'e3-4',
          type: 'step',
          source: '3',
          target: '4',
          label: '发送'
        },
        {
          id: 'e4-5',
          type: 'step',
          source: '4',
          target: '5',
          label: '发送'
        },
        {
          id: 'e5-6',
          type: 'step',
          source: '5',
          target: '6',
          label: '归档'
        },
        {
          id: 'e2-s20',
          type: 'step',
          source: '2',
          target: 's20',
        },
        {
          id: 'es20-e1',
          type: 'step',
          source: 's20',
          target: '1',
        },
        {
          id: 'e3-s32',
          type: 'step',
          source: '3',
          target: 's32',
        },
        {
          id: 'es32-e2',
          type: 'step',
          source: 's32',
          target: '2',
        },
        {
          id: 'e4-s43',
          type: 'step',
          source: '4',
          target: 's43',
        },
        {
          id: 'es43-e3',
          type: 'step',
          source: 's43',
          target: '3',
        },
        {
          id: 'e5-s54',
          type: 'step',
          source: '5',
          target: 's54',
        },
        {
          id: 'es54-e4',
          type: 'step',
          source: 's54',
          target: '4',
        },
      ]
    }

  },
  data() {
    return {
      nodes: [],
      edges: [],
    }
  },
  created() {
    this.initData();
  },
  methods: {
    initData(){
      this.nodes = JSON.parse(JSON.stringify(this.originNodes));
      this.edges = JSON.parse(JSON.stringify(this.originEdges));
      for (let i = 0; i < this.nodes.length; i++) {
        if(this.nodes[i].current) {
          this.nodes[i].style = {
            backgroundColor: '#03b5b7',
            color: 'white',
            border: 'none',
          }
        }else if(this.nodes[i].type === 'return') {
          this.nodes[i].style = {
            backgroundColor: 'transparent',
            fontSize: '10px',
            border: 'none',
          }
          this.nodes[i].targetPosition= Position.Bottom;
          this.nodes[i].sourcePosition= Position.Top;
        }else{
          this.nodes[i].style = {
            backgroundColor: 'rgb(229.8, 247.6, 247.8)',
            color: '#03b5b7',
            borderColor: '#03b5b7',
          }
        }
      }
      for (let i = 0; i < this.edges.length; i++) {
        this.edges[i].markerEnd = {
          type: MarkerType.ArrowClosed,
          color: '#03b5b7',
        };
        this.edges[i].style = {
          stroke: '#03b5b7',
        };
      }
    },
  }

}
</script>
<style>
#view_flow .vue-flow__handle{
  opacity: 0!important;
  width: 0!important;
  height: 0!important;
  min-height: 0!important;
  min-width: 0!important;
}
</style>
<style scoped lang="scss">
#view_flow {
  width: 100%;
  height: 100%;
  padding: 0 12px 12px 12px;


}
</style>
