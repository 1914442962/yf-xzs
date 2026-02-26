import { RectNode, RectNodeModel } from "@logicflow/core";

class CustomRectNode extends RectNode {}

class CustomRectModel extends RectNodeModel {
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
    this.minWidth = 10;
    this.minHeight = 10;
  }
  // getDefaultAnchor() {
  //   return []; // 禁用连接锚点
  // }
}

export default {
  type: "newRect",
  view: CustomRectNode,
  model: CustomRectModel,
};
