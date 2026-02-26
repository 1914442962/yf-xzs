import { CircleNode, CircleNodeModel, h } from "@logicflow/core";

class sNode extends CircleNode {
  getShape() {
    const { x, y, fill } = this.props.model;
    let fontSize = this.props.model.properties.fontSize || 12;
    return h(
      "g",
      {},
      // 曲线
      h("path", {
        d: `M${x - fontSize},${y} C${x - (2 * fontSize) / 3},${y - fontSize / 3} ${x - fontSize / 3},${y - fontSize / 3} ${x},${y} S${x + fontSize / 2},${y + fontSize / 2} ${x + fontSize},${y}`,
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
  type: "specialS",
  view: sNode,
  model: CustomCircleModel,
};
