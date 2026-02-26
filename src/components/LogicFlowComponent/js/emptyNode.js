import { CircleNode, CircleNodeModel } from '@logicflow/core';

class CustomCircleNode extends CircleNode {}

class CustomCircleModel extends CircleNodeModel {
  getNodeStyle() {
    const style = super.getNodeStyle();
    style.stroke = 'transparent';
    style.fill = 'transparent';
    return style;
  }
  initNodeData(data) {
    super.initNodeData(data);
    this.r = 16;
  }
}

export default {
  type: 'emptyNode',
  view: CustomCircleNode,
  model: CustomCircleModel,
};
