import { CircleNode, CircleNodeModel, h } from "@logicflow/core";

class xNode extends CircleNode {
  getShape() {
    const { x, y, fill, fontSize = 5 } = this.props.model;
    return h(
      "g",
      {},
      // 横线
      h("path", {
        d: `M ${x - fontSize} ${y + fontSize} L ${x + fontSize} ${y - fontSize} M ${x + fontSize} ${y + fontSize} L ${x - fontSize} ${y - fontSize}`,
        fill: "none",
        stroke: fill,
        "stroke-width": 2,
      }),
    );
  }
}

class CustomCircleModel extends CircleNodeModel {
  setAttributes() {
    const { fill = "#000", fontSize = 5 } = this.properties;
    this.fill = fill;
    this.fontSize = fontSize;
  }

  getDefaultAnchor() {
    return []; // 禁用连接锚点
  }

  initNodeData(data) {
    super.initNodeData(data);
    this.r = 16;
  }
}

export default {
  type: "specialX",
  view: xNode,
  model: CustomCircleModel,
};
