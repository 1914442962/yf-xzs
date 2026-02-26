import { BezierEdge, BezierEdgeModel, h } from "@logicflow/core";

class customBezierEdge extends BezierEdge {
  getStartArrow() {
    const { model } = this.props;
    const {
      properties: { arrowType, arrowFill },
    } = model;
    if (arrowType === "points") {
      return h("circle", {
        fill: arrowFill,
        cx: 5,
        cy: 0,
        r: 3,
      });
    } else {
      return super.getStartArrow();
    }
  }
  getEndArrow() {
    const { model } = this.props;
    const {
      properties: { arrowType, arrowFill },
    } = model;
    if (arrowType === "point" || arrowType === "points") {
      return h("circle", {
        fill: arrowFill,
        cx: -5,
        cy: 0,
        r: 3,
      });
    } else {
      return super.getEndArrow();
    }
  }
}

class CustomBezierEdgeModel extends BezierEdgeModel {
  getEdgeStyle() {
    const style = super.getEdgeStyle();
    const { fill = "#000", strokeDasharray = "0 0" } = this.properties;
    style.stroke = fill;
    style.strokeDasharray = strokeDasharray;
    style.strokeWidth = 2;
    return style;
  }
  getArrowStyle() {
    const style = super.getArrowStyle();
    const { isArrow, arrowFill = "#000" } = this.properties;
    style.stroke = isArrow ? arrowFill : "transparent";
    return style;
  }
  initEdgeData(data) {
    super.initEdgeData(data);
  }
}

export default {
  type: "customBezierEdge",
  view: customBezierEdge,
  model: CustomBezierEdgeModel,
};
