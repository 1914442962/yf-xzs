import { CircleNode, CircleNodeModel, h } from '@logicflow/core';

class CircleNode1 extends CircleNode {
  getShape() {
    const { x, y } = this.props.model;
    return h(
      'g',
      {},
      h('circle', {
        cx: x,
        cy: y,
        r: 20,
        fill: 'transparent',
        stroke: 'transparent',
        'stroke-width': 2,
      })
    );
  }
}

class CustomCircleModel extends CircleNodeModel {
  // 设置描点
  getDefaultAnchor() {
    const { id, x, y } = this;
    const anchors = [];
    const outerRadius = 20;
    for (let i = 0; i < 8; i++) {
      const angle = (2 * Math.PI * i) / 8;
      const outerX = x + outerRadius * Math.cos(angle);
      const outerY = y + outerRadius * Math.sin(angle);
      // 大圆锚点
      anchors.push({
        x: outerX,
        y: outerY,
        id: `${id}_outer_${i}`,
        type: 'outer',
      });
    }
    return anchors;
  }
}

export default {
  type: 'emptyNode',
  view: CircleNode1,
  model: CustomCircleModel,
};
