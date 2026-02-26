import { h, PolylineEdge, PolylineEdgeModel } from "@logicflow/core";

class CustomEdge extends PolylineEdge {
  // getStartArrow() {
  //   const { model } = this.props
  //   const {
  //     properties: { arrowType, arrowFill },
  //   } = model
  //   if (arrowType === 'points') {
  //     return h('circle', {
  //       fill: arrowFill,
  //       cx: 5,
  //       cy: 0,
  //       r: 3,
  //     })
  //   } else {
  //     return super.getStartArrow()
  //   }
  // }
  getPointAtRatio(pointList, ratio) {
    if (pointList.length < 2) return null;
    let totalLength = 0;
    const segments = [];
    for (let i = 0; i < pointList.length - 1; i++) {
      const p1 = pointList[i];
      const p2 = pointList[i + 1];
      const length = Math.sqrt(
        Math.pow(p2.x - p1.x, 2) + Math.pow(p2.y - p1.y, 2),
      );
      segments.push({ start: totalLength, length, p1, p2 });
      totalLength += length;
    }
    if (totalLength === 0) return null;
    const targetLength = totalLength * ratio;
    let targetSegment = null;
    for (const segment of segments) {
      if (targetLength <= segment.start + segment.length) {
        targetSegment = segment;
        break;
      }
    }
    if (!targetSegment) {
      targetSegment = segments[segments.length - 1];
      if (!targetSegment) return null;
    }
    const { start, length, p1, p2 } = targetSegment;
    const relativeLength = targetLength - start;
    const segmentRatio = length > 0 ? relativeLength / length : 0;
    const x = p1.x + (p2.x - p1.x) * segmentRatio;
    const y = p1.y + (p2.y - p1.y) * segmentRatio;
    const angle = Math.atan2(p2.y - p1.y, p2.x - p1.x) * (180 / Math.PI);
    return { x, y, angle };
  }
  getEndArrow() {
    const { model } = this.props;
    const {
      properties: { arrowType, arrowFill, jtPercent },
      endPoint,
      startPoint,
    } = model;
    if (arrowType === "point" || arrowType === "points") {
      return h("circle", {
        fill: arrowFill,
        cx: -5,
        cy: 0,
        r: 3,
      });
    } else {
      console.log(startPoint, endPoint);
      let transX = endPoint.x - startPoint.x;
      let transY = endPoint.y - startPoint.y;
      const pathData = this.getPointAtRatio([startPoint, endPoint], jtPercent);
      console.log(pathData);
      const { x, y, angle } = pathData;
      // let cz = jtPercent < 0.5? 6 : -8//箭头差值
      // let trans = Math.sqrt(transX*transX + transY*transY);
      return h("path", {
        d: "M-8,-6 L8,0 L-8,6 Z",
        fill: arrowFill,
        transform: `translate(${-x} , ${-y}) rotate(${angle})`,
      });
      // return super.getEndArrow()
    }
  }
}

class CustomEdgeModel extends PolylineEdgeModel {
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
  type: "customEdge",
  view: CustomEdge,
  model: CustomEdgeModel,
};
