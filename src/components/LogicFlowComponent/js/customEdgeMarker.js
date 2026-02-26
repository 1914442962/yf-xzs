import { h, PolylineEdge, PolylineEdgeModel } from "@logicflow/core";

class CustomEdgeModel extends PolylineEdgeModel {
  getEdgeStyle() {
    const style = super.getEdgeStyle();
    style.stroke = this.properties.fill || "#000";
    style.strokeDasharray = this.properties.strokeDasharray || "0 0";
    style.strokeWidth = this.properties.strokeWidth || 3;
    return style;
  }
}

class CustomEdge extends PolylineEdge {
  // 为动态定位箭头提供精确的几何数据，确保箭头能够沿着复杂的连线路径正确移动和旋转。
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

  getEdge() {
    const { model } = this.props;
    const { points, properties } = model;
    const style = model.getEdgeStyle();
    let position = 1 - properties.jtPercent ?? 0.1; // 默认设置为 10% 位置
    const showMarker = properties.isArrow ?? true; // 默认显示箭头
    // 边界判断：限制 position 在 [0, 1] 范围内
    position = Math.max(0, Math.min(1, position));
    // 转换为 {x, y} 对象数组
    const pointList = points
      .trim()
      .split(" ")
      .map((p) => {
        const [x, y] = p.split(",");
        return { x: parseFloat(x), y: parseFloat(y) };
      });
    const pathData = this.getPointAtRatio(pointList, position);
    // 默认绘制连线本体
    const edgePolyline = h("polyline", {
      points,
      ...style,
      strokeWidth: 2,
      fill: "none",
    });
    // 如果计算失败，只返回连线本体
    if (!pathData) {
      return h("g", {}, [edgePolyline]);
    }
    const { x, y, angle } = pathData;
    // 只有在 showMarker 为 true 时才渲染 path 元素
    let lastX = properties.jtPercent < 0.5 ? x - 6 : x + 8;
    let lastY = properties.jtPercent < 0.5 ? y - 6 : y + 8;
    const marker = showMarker
      ? h("path", {
          d: "M-8,-6 L8,0 L-8,6 Z",
          fill: style.stroke || "#000",
          transform: `translate(${angle && angle !== 180 ? x : lastX}, ${angle && angle !== 180 ? lastY : y}) rotate(${angle})`,
        })
      : null;
    const elements = [edgePolyline];
    if (marker) {
      elements.push(marker);
    }
    return h("g", {}, elements);
  }
}

export default {
  type: "customEdgeMarker",
  view: CustomEdge,
  model: CustomEdgeModel,
};
