import { CircleNode, CircleNodeModel } from "@logicflow/core";

class CustomCircleNode extends CircleNode {}

class CustomCircleModel extends CircleNodeModel {
  getNodeStyle() {
    const style = super.getNodeStyle();
    style.stroke = this.properties.stroke || "#000";
    style.fill = this.properties.fill || "transparent";
    return style;
  }
  getTextStyle() {
    const style = super.getTextStyle();
    style.color = this.properties.textColor || "#000";
    style.fontSize = this.properties.fontSize || 16;
    style.fontWeight = this.properties.fontWeight || "normal";
    return style;
  }
  initNodeData(data) {
    super.initNodeData(data);
    this.r = 20;
    this.minWidth = 10;
    this.minHeight = 10;
  }

  getDefaultAnchor() {
    const { x, y, id, r } = this;
    const { anchorNumber = 4 } = this.properties;
    let points = [];
    let myId = 0;
    const angleStep = (Math.PI * 2) / anchorNumber;
    for (let i = 0; i < anchorNumber; i++) {
      myId++;
      const angle = i * angleStep;
      points.push({
        x: x + r * Math.cos(angle),
        y: y + r * Math.sin(angle),
        id: id + "_" + myId,
      });
    }
    return points;
  }
}

export default {
  type: "newCircle",
  view: CustomCircleNode,
  model: CustomCircleModel,
};
