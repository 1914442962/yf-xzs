import { CircleNode, CircleNodeModel, h } from '@logicflow/core';

class CustomCircleNode extends CircleNode {}

class CustomCircleModel extends CircleNodeModel {
  getNodeStyle() {
    const style = super.getNodeStyle();
    style.stroke = this.properties.fill || '#23cafb';
    style.fill = 'transparent';
    return style;
  }
  initNodeData(data) {
    super.initNodeData(data);
    this.r = 16;
  }
}

export default {
  type: 'smallCircle',
  view: CustomCircleNode,
  model: CustomCircleModel,
};
