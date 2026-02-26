import { h, PolylineEdge, PolylineEdgeModel } from "@logicflow/core";

class CustomEdge extends PolylineEdge {
  getEdge() {
    const { model } = this.props;
    const { points } = model;
    const style = model.getEdgeStyle();

    // 位置点数组转路径
    function pointStrToPath(pointsStr) {
      if (!pointsStr) return "";
      const points = pointsStr.trim().split(" ");
      return points
        .map((pt, index) => {
          const [x, y] = pt.split(",");
          return `${index === 0 ? "M" : "L"}${x},${y}`;
        })
        .join(" ");
    }
    // 反转路径方向
    let reversedPointsStr = points.trim().split(" ").join(" ");
    if (model.properties.reverse) {
      reversedPointsStr = points.trim().split(" ").reverse().join(" ");
    }
    const pathD = pointStrToPath(reversedPointsStr);
    return h("g", {}, [
      // 主 polyline 边
      h("polyline", {
        points,
        ...style,
        fill: "none",
      }),
      // 动画箭头
      h(
        "path",
        {
          d: "M-10,-6 L10,0 L-10,6 Z", // 中心对称三角形
          fill: style.stroke || "#000",
        },
        [
          h("animateMotion", {
            dur: "2s",
            repeatCount: "indefinite",
            rotate: "auto", // 方向自动匹配轨迹
            path: pathD,
          }),
        ],
      ),
    ]);
  }
}

class CustomEdgeModel extends PolylineEdgeModel {
  getEdgeStyle() {
    const style = super.getEdgeStyle();
    const { fill = "#000", strokeDasharray = "0 0" } = this.properties;
    style.stroke = fill;
    style.strokeDasharray = strokeDasharray;
    style.strokeWidth = 3;
    return style;
  }
}

export default {
  type: "customEdgeAnimation",
  view: CustomEdge,
  model: CustomEdgeModel,
};
