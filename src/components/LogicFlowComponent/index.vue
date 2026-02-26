<template>
  <div class="page_content">
    <header>
      <section>
        <div class="header-item">
          颜色：
          <vxe-color-picker
              v-model="color"
              :colors="this.$store.state.staticOptionsObj.colors"
              style="vertical-align: middle"
              @clear="color = 'transparent'"></vxe-color-picker>
        </div>
        <div class="header-item">
          大小
          <el-input-number
              v-model="pxValue"
              size="small"
              :step="1"
              :min="4"
              :max="100"></el-input-number>
        </div>
        <div class="header-item">
          连线类型：
          <el-radio-group v-model="logicParams.edgeType">
            <el-radio value="customEdge" size="large">自动转弯连线</el-radio>
            <el-radio value="customLineEdge" size="large">直线连线</el-radio>
            <el-radio value="customBezierEdge" size="large">曲线连线</el-radio>
          </el-radio-group>
        </div>
        <div class="header-item">
          是否高亮：
          <el-switch v-model="logicParams.isHighLight" size="large"/>
        </div>
      </section>
      <section>
        <div class="header-item">
          <el-button type="primary" @click="doExport">导出</el-button>
        </div>
      </section>
    </header>
    <article>
      <div id="logic" ref="logic"></div>
    </article>
  </div>

</template>
<script>
import LogicFlow from '@logicflow/core';
import '@logicflow/core/es/index.css';
import {Control, DndPanel, Highlight, Menu, SelectionSelect, Snapshot} from '@logicflow/extension';
import '@logicflow/extension/lib/style/index.css';
import customEdge from "@/components/LogicFlowComponent/js/customEdge.js";
import customLineEdge from "@/components/LogicFlowComponent/js/customLineEdge.js";
import customBezierEdge from "@/components/LogicFlowComponent/js/customBezierEdge.js";
import customEdgeAnimation from "@/components/LogicFlowComponent/js/customEdgeAnimation.js";
import emptyNode from "@/components/LogicFlowComponent/js/emptyNode.js";
import newText from "@/components/LogicFlowComponent/js/newText.js";
import specialX from "@/components/LogicFlowComponent/js/specialX.js";
import specialS from "@/components/LogicFlowComponent/js/specialS.js";
import newCircle from "@/components/LogicFlowComponent/js/newCircle.js";
import newRect from "@/components/LogicFlowComponent/js/newRect.js";
import newEllipse from "@/components/LogicFlowComponent/js/newEllipse.js";
import newLine from "@/components/LogicFlowComponent/js/newLine.js";

export default {
  name: "LogicFlowComponent",
  props: {
    disabled: {
      type: Boolean,
      default: () => {
        return false
      },
    }
  },
  data() {
    return {
      lf: null,
      color: '',
      pxValue: 16,
      logicParams:{
        edgeType: 'customEdge',
        isHighLight: false
      }
    }
  },
  watch:{
    "logicParams.edgeType": {
      handler(val) {
        if (val) {
          this.setLineType(val)
        }
      },
      immediate: false
    },
    "logicParams.isHighLight": {
      handler(val) {
       this.lf.extension.highlight.setEnable(val)
      },
      immediate: false
    },
  },
  mounted() {
    this.initFlow()
  },
  methods: {
    initFlow() {
      const lf = new LogicFlow({
        container: this.$refs.logic,
        allowResize: true,
        allowRotate: true,
        snapline: true,//是否启用节点辅助对齐线
        history: true,//是否开启历史记录功能
        edgeType: 'customEdge',
        adjustEdge: true,//允许拖动边
        isSilentMode: this.disabled,//只读模式
        nodeTextDraggable: true,//允许节点文本可以拖拽
        edgeTextDraggable: true,//允许边文本可以拖拽
        multipleSelectKey: 'ctrl',//多选按键
        overlapMode: 1,//元素重合的堆叠模式，默认为连线在下，节点在上，1的时候表示自增模式
        stopMoveGraph: true,
        stopScrollGraph: true,//禁止鼠标滚动拖动画布，与stopZoomGraph冲突
        stopZoomGraph: false,
        plugins: [DndPanel, Menu, Control, SelectionSelect, Highlight, Snapshot],
        pluginsOptions:{
          highlight: {
            enable: false,
          }
        }
      })
      this.lf = lf;
      // 拖拽面板
      const menuList = [
        {
          type: 'newCircle',
          label: '圆型',
          icon: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABQAAAAUCAYAAAH6ji2bAAAABGdBTUEAALGPC/xhBQAAAnBJREFUOBGdVL1rU1EcPfdGBddmaZLiEhdx1MHZQXApraCzQ7GKLgoRBxMfcRELuihWKcXFRcEWF8HBf0DdDCKYRZpnl7p0svLe9Zzbd29eQhTbC8nv+9zf130AT63jvooOGS8Vf9Nt5zxba7sXQwODfkWpkbjTQfCGUd9gIp3uuPP8bZ946g56dYQvnBg+b1HB8VIQmMFrazKcKSvFW2dQTxJnJdQ77urmXWOMBCmXM2Rke4S7UAW+/8ywwFoewmBps2tu7mbTdp8VMOkIRAkKfrVawalJTtIliclFbaOBqa0M2xImHeVIfd/nKAfVq/LGnPss5Kh00VEdSzfwnBXPUpmykNss4lUI9C1ga+8PNrBD5YeqRY2Zz8PhjooIbfJXjowvQJBqkmEkVnktWhwu2SM7SMx7Cj0N9IC0oQXRo8xwAGzQms+xrB/nNSUWVveI48ayrFGyC2+E2C+aWrZHXvOuz+CiV6iycWe1Rd1Q6+QUG07nb5SbPrL4426d+9E1axKjY3AoRrlEeSQo2Eu0T6BWAAr6COhTcWjRaYfKG5csnvytvUr/WY4rrPMB53Uo7jZRjXaG6/CFfNMaXEu75nG47X+oepU7PKJvvzGDY1YLSKHJrK7vFUwXKkaxwhCW3u+sDFMVrIju54RYYbFKpALZAo7sB6wcKyyrd+aBMryMT2gPyD6GsQoRFkGHr14TthZni9ck0z+Pnmee460mHXbRAypKNy3nuMdrWgVKj8YVV8E7PSzp1BZ9SJnJAsXdryw/h5ctboUVi4AFiCd+lQaYMw5z3LGTBKjLQOeUF35k89f58Vv/tGh+l+PE/wG0rgfIUbZK5AAAAABJRU5ErkJggg==',
        },
        {
          type: 'newRect',
          label: '矩形',
          icon: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABQAAAAUCAYAAAH6ji2bAAAABGdBTUEAALGPC/xhBQAAAnBJREFUOBGdVL1rU1EcPfdGBddmaZLiEhdx1MHZQXApraCzQ7GKLgoRBxMfcRELuihWKcXFRcEWF8HBf0DdDCKYRZpnl7p0svLe9Zzbd29eQhTbC8nv+9zf130AT63jvooOGS8Vf9Nt5zxba7sXQwODfkWpkbjTQfCGUd9gIp3uuPP8bZ946g56dYQvnBg+b1HB8VIQmMFrazKcKSvFW2dQTxJnJdQ77urmXWOMBCmXM2Rke4S7UAW+/8ywwFoewmBps2tu7mbTdp8VMOkIRAkKfrVawalJTtIliclFbaOBqa0M2xImHeVIfd/nKAfVq/LGnPss5Kh00VEdSzfwnBXPUpmykNss4lUI9C1ga+8PNrBD5YeqRY2Zz8PhjooIbfJXjowvQJBqkmEkVnktWhwu2SM7SMx7Cj0N9IC0oQXRo8xwAGzQms+xrB/nNSUWVveI48ayrFGyC2+E2C+aWrZHXvOuz+CiV6iycWe1Rd1Q6+QUG07nb5SbPrL4426d+9E1axKjY3AoRrlEeSQo2Eu0T6BWAAr6COhTcWjRaYfKG5csnvytvUr/WY4rrPMB53Uo7jZRjXaG6/CFfNMaXEu75nG47X+oepU7PKJvvzGDY1YLSKHJrK7vFUwXKkaxwhCW3u+sDFMVrIju54RYYbFKpALZAo7sB6wcKyyrd+aBMryMT2gPyD6GsQoRFkGHr14TthZni9ck0z+Pnmee460mHXbRAypKNy3nuMdrWgVKj8YVV8E7PSzp1BZ9SJnJAsXdryw/h5ctboUVi4AFiCd+lQaYMw5z3LGTBKjLQOeUF35k89f58Vv/tGh+l+PE/wG0rgfIUbZK5AAAAABJRU5ErkJggg==',
        },
        {
          type: 'newEllipse',
          label: '椭圆',
          icon: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABQAAAAUCAYAAAH6ji2bAAAABGdBTUEAALGPC/xhBQAAAnBJREFUOBGdVL1rU1EcPfdGBddmaZLiEhdx1MHZQXApraCzQ7GKLgoRBxMfcRELuihWKcXFRcEWF8HBf0DdDCKYRZpnl7p0svLe9Zzbd29eQhTbC8nv+9zf130AT63jvooOGS8Vf9Nt5zxba7sXQwODfkWpkbjTQfCGUd9gIp3uuPP8bZ946g56dYQvnBg+b1HB8VIQmMFrazKcKSvFW2dQTxJnJdQ77urmXWOMBCmXM2Rke4S7UAW+/8ywwFoewmBps2tu7mbTdp8VMOkIRAkKfrVawalJTtIliclFbaOBqa0M2xImHeVIfd/nKAfVq/LGnPss5Kh00VEdSzfwnBXPUpmykNss4lUI9C1ga+8PNrBD5YeqRY2Zz8PhjooIbfJXjowvQJBqkmEkVnktWhwu2SM7SMx7Cj0N9IC0oQXRo8xwAGzQms+xrB/nNSUWVveI48ayrFGyC2+E2C+aWrZHXvOuz+CiV6iycWe1Rd1Q6+QUG07nb5SbPrL4426d+9E1axKjY3AoRrlEeSQo2Eu0T6BWAAr6COhTcWjRaYfKG5csnvytvUr/WY4rrPMB53Uo7jZRjXaG6/CFfNMaXEu75nG47X+oepU7PKJvvzGDY1YLSKHJrK7vFUwXKkaxwhCW3u+sDFMVrIju54RYYbFKpALZAo7sB6wcKyyrd+aBMryMT2gPyD6GsQoRFkGHr14TthZni9ck0z+Pnmee460mHXbRAypKNy3nuMdrWgVKj8YVV8E7PSzp1BZ9SJnJAsXdryw/h5ctboUVi4AFiCd+lQaYMw5z3LGTBKjLQOeUF35k89f58Vv/tGh+l+PE/wG0rgfIUbZK5AAAAABJRU5ErkJggg==',
        },
        {
          type: 'newLine',
          label: '简单直线',
          icon: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABQAAAAUCAYAAAH6ji2bAAAABGdBTUEAALGPC/xhBQAAAnBJREFUOBGdVL1rU1EcPfdGBddmaZLiEhdx1MHZQXApraCzQ7GKLgoRBxMfcRELuihWKcXFRcEWF8HBf0DdDCKYRZpnl7p0svLe9Zzbd29eQhTbC8nv+9zf130AT63jvooOGS8Vf9Nt5zxba7sXQwODfkWpkbjTQfCGUd9gIp3uuPP8bZ946g56dYQvnBg+b1HB8VIQmMFrazKcKSvFW2dQTxJnJdQ77urmXWOMBCmXM2Rke4S7UAW+/8ywwFoewmBps2tu7mbTdp8VMOkIRAkKfrVawalJTtIliclFbaOBqa0M2xImHeVIfd/nKAfVq/LGnPss5Kh00VEdSzfwnBXPUpmykNss4lUI9C1ga+8PNrBD5YeqRY2Zz8PhjooIbfJXjowvQJBqkmEkVnktWhwu2SM7SMx7Cj0N9IC0oQXRo8xwAGzQms+xrB/nNSUWVveI48ayrFGyC2+E2C+aWrZHXvOuz+CiV6iycWe1Rd1Q6+QUG07nb5SbPrL4426d+9E1axKjY3AoRrlEeSQo2Eu0T6BWAAr6COhTcWjRaYfKG5csnvytvUr/WY4rrPMB53Uo7jZRjXaG6/CFfNMaXEu75nG47X+oepU7PKJvvzGDY1YLSKHJrK7vFUwXKkaxwhCW3u+sDFMVrIju54RYYbFKpALZAo7sB6wcKyyrd+aBMryMT2gPyD6GsQoRFkGHr14TthZni9ck0z+Pnmee460mHXbRAypKNy3nuMdrWgVKj8YVV8E7PSzp1BZ9SJnJAsXdryw/h5ctboUVi4AFiCd+lQaYMw5z3LGTBKjLQOeUF35k89f58Vv/tGh+l+PE/wG0rgfIUbZK5AAAAABJRU5ErkJggg==',
        },

        {
          type: 'emptyNode',
          label: '占位元素',
          icon: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABQAAAAUCAYAAAH6ji2bAAAABGdBTUEAALGPC/xhBQAAAnBJREFUOBGdVL1rU1EcPfdGBddmaZLiEhdx1MHZQXApraCzQ7GKLgoRBxMfcRELuihWKcXFRcEWF8HBf0DdDCKYRZpnl7p0svLe9Zzbd29eQhTbC8nv+9zf130AT63jvooOGS8Vf9Nt5zxba7sXQwODfkWpkbjTQfCGUd9gIp3uuPP8bZ946g56dYQvnBg+b1HB8VIQmMFrazKcKSvFW2dQTxJnJdQ77urmXWOMBCmXM2Rke4S7UAW+/8ywwFoewmBps2tu7mbTdp8VMOkIRAkKfrVawalJTtIliclFbaOBqa0M2xImHeVIfd/nKAfVq/LGnPss5Kh00VEdSzfwnBXPUpmykNss4lUI9C1ga+8PNrBD5YeqRY2Zz8PhjooIbfJXjowvQJBqkmEkVnktWhwu2SM7SMx7Cj0N9IC0oQXRo8xwAGzQms+xrB/nNSUWVveI48ayrFGyC2+E2C+aWrZHXvOuz+CiV6iycWe1Rd1Q6+QUG07nb5SbPrL4426d+9E1axKjY3AoRrlEeSQo2Eu0T6BWAAr6COhTcWjRaYfKG5csnvytvUr/WY4rrPMB53Uo7jZRjXaG6/CFfNMaXEu75nG47X+oepU7PKJvvzGDY1YLSKHJrK7vFUwXKkaxwhCW3u+sDFMVrIju54RYYbFKpALZAo7sB6wcKyyrd+aBMryMT2gPyD6GsQoRFkGHr14TthZni9ck0z+Pnmee460mHXbRAypKNy3nuMdrWgVKj8YVV8E7PSzp1BZ9SJnJAsXdryw/h5ctboUVi4AFiCd+lQaYMw5z3LGTBKjLQOeUF35k89f58Vv/tGh+l+PE/wG0rgfIUbZK5AAAAABJRU5ErkJggg==',
        },
        {
          type: 'specialX',
          label: '特殊图形×',
          icon: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABQAAAAUCAYAAAH6ji2bAAAABGdBTUEAALGPC/xhBQAAAnBJREFUOBGdVL1rU1EcPfdGBddmaZLiEhdx1MHZQXApraCzQ7GKLgoRBxMfcRELuihWKcXFRcEWF8HBf0DdDCKYRZpnl7p0svLe9Zzbd29eQhTbC8nv+9zf130AT63jvooOGS8Vf9Nt5zxba7sXQwODfkWpkbjTQfCGUd9gIp3uuPP8bZ946g56dYQvnBg+b1HB8VIQmMFrazKcKSvFW2dQTxJnJdQ77urmXWOMBCmXM2Rke4S7UAW+/8ywwFoewmBps2tu7mbTdp8VMOkIRAkKfrVawalJTtIliclFbaOBqa0M2xImHeVIfd/nKAfVq/LGnPss5Kh00VEdSzfwnBXPUpmykNss4lUI9C1ga+8PNrBD5YeqRY2Zz8PhjooIbfJXjowvQJBqkmEkVnktWhwu2SM7SMx7Cj0N9IC0oQXRo8xwAGzQms+xrB/nNSUWVveI48ayrFGyC2+E2C+aWrZHXvOuz+CiV6iycWe1Rd1Q6+QUG07nb5SbPrL4426d+9E1axKjY3AoRrlEeSQo2Eu0T6BWAAr6COhTcWjRaYfKG5csnvytvUr/WY4rrPMB53Uo7jZRjXaG6/CFfNMaXEu75nG47X+oepU7PKJvvzGDY1YLSKHJrK7vFUwXKkaxwhCW3u+sDFMVrIju54RYYbFKpALZAo7sB6wcKyyrd+aBMryMT2gPyD6GsQoRFkGHr14TthZni9ck0z+Pnmee460mHXbRAypKNy3nuMdrWgVKj8YVV8E7PSzp1BZ9SJnJAsXdryw/h5ctboUVi4AFiCd+lQaYMw5z3LGTBKjLQOeUF35k89f58Vv/tGh+l+PE/wG0rgfIUbZK5AAAAABJRU5ErkJggg==',
        },
        {
          type: 'specialS',
          label: '特殊图形波浪线',
          icon: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABQAAAAUCAYAAAH6ji2bAAAABGdBTUEAALGPC/xhBQAAAnBJREFUOBGdVL1rU1EcPfdGBddmaZLiEhdx1MHZQXApraCzQ7GKLgoRBxMfcRELuihWKcXFRcEWF8HBf0DdDCKYRZpnl7p0svLe9Zzbd29eQhTbC8nv+9zf130AT63jvooOGS8Vf9Nt5zxba7sXQwODfkWpkbjTQfCGUd9gIp3uuPP8bZ946g56dYQvnBg+b1HB8VIQmMFrazKcKSvFW2dQTxJnJdQ77urmXWOMBCmXM2Rke4S7UAW+/8ywwFoewmBps2tu7mbTdp8VMOkIRAkKfrVawalJTtIliclFbaOBqa0M2xImHeVIfd/nKAfVq/LGnPss5Kh00VEdSzfwnBXPUpmykNss4lUI9C1ga+8PNrBD5YeqRY2Zz8PhjooIbfJXjowvQJBqkmEkVnktWhwu2SM7SMx7Cj0N9IC0oQXRo8xwAGzQms+xrB/nNSUWVveI48ayrFGyC2+E2C+aWrZHXvOuz+CiV6iycWe1Rd1Q6+QUG07nb5SbPrL4426d+9E1axKjY3AoRrlEeSQo2Eu0T6BWAAr6COhTcWjRaYfKG5csnvytvUr/WY4rrPMB53Uo7jZRjXaG6/CFfNMaXEu75nG47X+oepU7PKJvvzGDY1YLSKHJrK7vFUwXKkaxwhCW3u+sDFMVrIju54RYYbFKpALZAo7sB6wcKyyrd+aBMryMT2gPyD6GsQoRFkGHr14TthZni9ck0z+Pnmee460mHXbRAypKNy3nuMdrWgVKj8YVV8E7PSzp1BZ9SJnJAsXdryw/h5ctboUVi4AFiCd+lQaYMw5z3LGTBKjLQOeUF35k89f58Vv/tGh+l+PE/wG0rgfIUbZK5AAAAABJRU5ErkJggg==',
        },
        {
          type: 'newText',
          label: '文字',
          icon: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABQAAAAUCAYAAAH6ji2bAAAABGdBTUEAALGPC/xhBQAAAnBJREFUOBGdVL1rU1EcPfdGBddmaZLiEhdx1MHZQXApraCzQ7GKLgoRBxMfcRELuihWKcXFRcEWF8HBf0DdDCKYRZpnl7p0svLe9Zzbd29eQhTbC8nv+9zf130AT63jvooOGS8Vf9Nt5zxba7sXQwODfkWpkbjTQfCGUd9gIp3uuPP8bZ946g56dYQvnBg+b1HB8VIQmMFrazKcKSvFW2dQTxJnJdQ77urmXWOMBCmXM2Rke4S7UAW+/8ywwFoewmBps2tu7mbTdp8VMOkIRAkKfrVawalJTtIliclFbaOBqa0M2xImHeVIfd/nKAfVq/LGnPss5Kh00VEdSzfwnBXPUpmykNss4lUI9C1ga+8PNrBD5YeqRY2Zz8PhjooIbfJXjowvQJBqkmEkVnktWhwu2SM7SMx7Cj0N9IC0oQXRo8xwAGzQms+xrB/nNSUWVveI48ayrFGyC2+E2C+aWrZHXvOuz+CiV6iycWe1Rd1Q6+QUG07nb5SbPrL4426d+9E1axKjY3AoRrlEeSQo2Eu0T6BWAAr6COhTcWjRaYfKG5csnvytvUr/WY4rrPMB53Uo7jZRjXaG6/CFfNMaXEu75nG47X+oepU7PKJvvzGDY1YLSKHJrK7vFUwXKkaxwhCW3u+sDFMVrIju54RYYbFKpALZAo7sB6wcKyyrd+aBMryMT2gPyD6GsQoRFkGHr14TthZni9ck0z+Pnmee460mHXbRAypKNy3nuMdrWgVKj8YVV8E7PSzp1BZ9SJnJAsXdryw/h5ctboUVi4AFiCd+lQaYMw5z3LGTBKjLQOeUF35k89f58Vv/tGh+l+PE/wG0rgfIUbZK5AAAAABJRU5ErkJggg==',
        },
      ];
      let that = this;
      lf.extension.menu.addMenuConfig({
        edgeMenu: [
          // {
          //   text: '设置正向动画的线条',
          //   callback(edge) {
          //     lf.changeEdgeType(edge.id, 'customEdgeAnimation');
          //     lf.setProperties(edge.id, {
          //       reverse: true,
          //     });
          //   },
          // },
          // {
          //   text: '设置反向动画的线条',
          //   callback(edge) {
          //     lf.changeEdgeType(edge.id, 'customEdgeAnimation');
          //     lf.setProperties(edge.id, {
          //       reverse: false,
          //     });
          //   },
          // },
          {
            text: '设置为对应颜色线条',
            callback(node) {
              lf.setProperties(node.id, {fill: that.color});
            },
          },
          {
            text: '设置自动转弯线条',
            callback(edge) {
              lf.changeEdgeType(edge.id, 'customEdge');
            },
          },
          {
            text: '设置曲线线条',
            callback(edge) {
              lf.changeEdgeType(edge.id, 'customBezierEdge');
            },
          },
          {
            text: '设置直线线条',
            callback(edge) {
              lf.changeEdgeType(edge.id, 'customLineEdge');
            },
          },
          {
            text: '设置箭头线条',
            callback(edge) {
              lf.setProperties(edge.id, {
                isArrow: true,
                arrowType: '',
              });
            },
          },
          {
            text: '设置单点箭头线条',
            callback(edge) {
              lf.setProperties(edge.id, {
                isArrow: true,
                arrowType: 'point',
              });
            },
          },
          {
            text: '设置双点箭头线条',
            callback(edge) {
              lf.setProperties(edge.id, {
                isArrow: true,
                arrowType: 'points',
              });
            },
          },
          {
            text: '设置为对应颜色箭头',
            callback(node) {
              lf.setProperties(node.id, {arrowFill: that.color});
            },
          },
          {
            text: '设置无箭头线条',
            callback(edge) {
              lf.setProperties(edge.id, {
                isArrow: false,
                arrowType: '',
              });
            },
          },
          {
            text: '设置为完整线条',
            callback(edge) {
              lf.setProperties(edge.id, {
                strokeDasharray: '0 0',
              });
            },
          },
          {
            text: '设置为间隔线段（大）',
            callback(edge) {
              lf.setProperties(edge.id, {
                strokeDasharray: '14 7',
              });
            },
          },
          {
            text: '设置为间隔线段（小）',
            callback(edge) {
              lf.setProperties(edge.id, {
                strokeDasharray: '8 3',
              });
            },
          },
        ],
        nodeMenu: [
          {
            text: '实心设置为对应颜色',
            callback(node) {
              lf.setProperties(node.id, {fill: that.color});
            },
          },
          {
            text: '边框设置为对应颜色',
            callback(node) {
              lf.setProperties(node.id, {stroke: that.color});
            },
          },
          {
            text: '文字设置为对应颜色',
            callback(node) {
              lf.setProperties(node.id, {textColor: that.color});
            },
          },
          {
            text: '文字设置为加粗',
            callback(node) {
              lf.setProperties(node.id, {fontWeight: 'bold'});
            },
          },
          {
            text: '文字设置为正常',
            callback(node) {
              lf.setProperties(node.id, {fontWeight: 'normal'});
            },
          },
          {
            text: '文字设置为细长',
            callback(node) {
              lf.setProperties(node.id, {fontWeight: '200'});
            },
          },
          {
            text: '文字设置为对应大小',
            callback(node) {
              lf.setProperties(node.id, {fontSize: that.pxValue});
            },
          },
          // {
          //   text: '设置锚点数',
          //   callback(node) {
          //     lf.setProperties(node.id, {anchorNumber: that.pxValue});
          //   },
          // },
        ],
      });
      lf.extension.dndPanel.setPatternItems(menuList);
      lf.extension.highlight.setMode('single');

      lf.openSelectionSelect();
      lf.setMenuByType({
        type: 'lf:defaultSelectionMenu',
        menu: [
          {
            text: '删除',
            callback: (elements) => {
              lf.clearSelectElements();
              elements.edges.forEach((edge) => lf.deleteEdge(edge.id));
              elements.nodes.forEach((node) => lf.deleteNode(node.id));
            },
          },
          {
            text: '复制节点',
            callback(elements) {
              elements.nodes.forEach((node) => lf.cloneNode(node.id));
            },
          },
          {
            text: '保存为复杂图形',
            callback(elements) {
              console.log(elements)
              // this.$prompt('请输入复杂图形名称', '提示', {
              //       confirmButtonText: '确定',
              //       cancelButtonText: '取消',
              //       inputPattern: /^.+$/,
              //       inputErrorMessage: '名称不能为空',
              //     })
              //     .then(({value}) => {
              //       // that.saveZj({type: '1', ...elements, name: value});
              //     });
            },
          },
        ],
      });
      lf.setMenuByType({
        type: 'newLine',
        menu: [
          {
            text: '删除',
            callback(node) {
              lf.deleteNode(node.id);
            },
          },
          {
            text: '复制',
            callback(node) {
              lf.cloneNode(node.id);
            },
          },
          {
            text: '设置为对应颜色线条',
            callback(node) {
              lf.setProperties(node.id, {fill: that.color});
            },
          },
          {
            text: '设置为加粗线条',
            callback(node) {
              lf.setProperties(node.id, {isWeight: true});
            },
          },
          {
            text: '设置为不加粗线条',
            callback(node) {
              lf.setProperties(node.id, {isWeight: false});
            },
          },
          {
            text: '设置为左向箭头线条',
            callback(node) {
              lf.setProperties(node.id, {triangle: 'left'});
            },
          },
          {
            text: '设置为右向箭头线条',
            callback(node) {
              lf.setProperties(node.id, {triangle: 'right'});
            },
          },
          {
            text: '设置为无箭头线条',
            callback(node) {
              lf.setProperties(node.id, {triangle: ''});
            },
          },
          {
            text: '设置为对应颜色箭头',
            callback(node) {
              lf.setProperties(node.id, {triangleColor: that.color});
            },
          },
        ],
      });
      lf.setMenuByType({
        type: 'specialX',
        menu: [
          {
            text: '删除',
            callback(node) {
              lf.deleteNode(node.id);
            },
          },
          {
            text: '复制',
            callback(node) {
              lf.cloneNode(node.id);
            },
          },
          {
            text: '设置为对应颜色',
            callback(node) {
              lf.setProperties(node.id, {fill: that.color});
            },
          },
          {
            text: '设置为对应尺寸',
            callback(node) {
              lf.setProperties(node.id, {fontSize: that.pxValue});
            },
          },
        ],
      });
      lf.setMenuByType({
        type: 'specialS',
        menu: [
          {
            text: '删除',
            callback(node) {
              lf.deleteNode(node.id);
            },
          },
          {
            text: '复制',
            callback(node) {
              lf.cloneNode(node.id);
            },
          },
          {
            text: '设置为对应颜色',
            callback(node) {
              lf.setProperties(node.id, {fill: that.color});
            },
          },
          {
            text: '设置为对应尺寸',
            callback(node) {
              lf.setProperties(node.id, {fontSize: that.pxValue});
            },
          },
        ],
      });

      lf.register(customEdge);
      lf.register(customLineEdge);
      lf.register(customBezierEdge);
      lf.register(customEdgeAnimation);
      lf.register(emptyNode);
      lf.register(newText);
      lf.register(specialX);
      lf.register(specialS);
      lf.register(newCircle);
      lf.register(newRect);
      lf.register(newEllipse);
      lf.register(newLine);
      lf.render();
      lf.extension.selectionSelect.openSelectionSelect();
    },
    async doExport() {
      // const {data: base64} = await this.lf.getSnapshotBase64("#fff",'png',{
      //   partial: true
      // })
      // console.log(base64)
      this.lf.getSnapshot('测试图片',{
        partial: true,
      })
    },
    setLineType(type) {
      this.lf.setDefaultEdgeType(type);
      this.$message.success('已切换线条类型');
    },
  }
}
</script>
<style scoped lang="scss">
.page_content {
  article {
    height: calc(100% - 48px);

    #logic {
      width: 100%;
      height: 100%;
    }
  }
}

</style>