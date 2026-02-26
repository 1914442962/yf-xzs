import { h, LineEdge, LineEdgeModel } from "@logicflow/core";

class CustomEdge extends LineEdge {
  // getStartArrow() {
  //   const { model } = this.props
  //   const { properties: { arrowType, arrowFill }, } = model
  //   if (arrowType === 'points') {
  //     return h('circle', {
  //       fill: arrowFill,
  //       cx: 5,
  //       cy: 0,
  //       r: 3,
  //     })
  //   } else {
  //     // return h('polygon', {
  //     //   fill: arrowFill,
  //     //   points: '2.7 0 3.45 0 3.45 0 6.25 0 3.13 5.61 0 0 2.7 0 2.7 0',
  //     //   transform: `translate(10 , 0) rotate(30)`,
  //     // })
  //     return h('path', {
  //       d: 'M-10,-6 L10,0 L-10,6 Z',
  //       fill: arrowFill,
  //       transform: `translate(10 , 0)`,
  //     })
  //     // return super.getStartArrow()
  //   }
  // }
  getEndArrow() {
    const { model } = this.props;
    const {
      properties: { arrowType, arrowFill, jtPercent },
      startPoint,
      endPoint,
    } = model;
    if (arrowType === "point" || arrowType === "points") {
      return h("circle", {
        fill: arrowFill,
        cx: -5,
        cy: 0,
        r: 3,
      });
    } else {
      let transX = endPoint.x - startPoint.x;
      let transY = endPoint.y - startPoint.y;

      let cz = jtPercent < 0.5 ? 6 : -8; //箭头差值
      let trans = Math.sqrt(transX * transX + transY * transY);
      return h("path", {
        d: "M-8,-6 L8,0 L-8,6 Z",
        fill: arrowFill,
        transform: `translate(${-cz - trans * jtPercent} , 0)`,
      });

      // return super.getEndArrow()
    }
  }
}

class CustomEdgeModel extends LineEdgeModel {
  getEdgeStyle() {
    const style = super.getEdgeStyle();
    style.stroke = this.properties.fill || "#000";
    style.strokeDasharray = this.properties.strokeDasharray || "0 0";
    style.strokeWidth = 2;
    return style;
  }
  getArrowStyle() {
    const style = super.getArrowStyle();
    style.stroke = this.properties.isArrow
      ? this.properties.arrowFill || "#000"
      : "transparent";
    return style;
  }
  initEdgeData(data) {
    super.initEdgeData(data);
  }
}

export default {
  type: "customLineEdge",
  view: CustomEdge,
  model: CustomEdgeModel,
};
