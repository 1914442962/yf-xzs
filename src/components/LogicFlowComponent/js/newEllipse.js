import { EllipseNode, EllipseNodeModel } from "@logicflow/core";

class CustomEllipseNode extends EllipseNode {}

class CustomEllipseModel extends EllipseNodeModel {
  getNodeStyle() {
    const style = super.getNodeStyle();
    const { stroke = "#000", fill = "transparent" } = this.properties;
    style.stroke = stroke;
    style.fill = fill;
    return style;
  }
  getTextStyle() {
    const style = super.getTextStyle();
    const {
      textColor = "#000",
      fontSize = 16,
      fontWeight = "normal",
    } = this.properties;
    style.color = textColor;
    style.fontSize = fontSize;
    style.fontWeight = fontWeight;
    return style;
  }
  initNodeData(data) {
    super.initNodeData(data);
    this.rx = 45;
    this.ry = 30;
    this.minWidth = 10;
    this.minHeight = 10;
  }
  // getDefaultAnchor() {
  //   return []; // 禁用连接锚点
  // }
}

export default {
  type: "newEllipse",
  view: CustomEllipseNode,
  model: CustomEllipseModel,
};
