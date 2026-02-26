import { RectNode, RectNodeModel } from '@logicflow/core';

class CustomRectNode extends RectNode {}

class CustomRectModel extends RectNodeModel {
  getNodeStyle() {
    const style = super.getNodeStyle();
    style.stroke = this.properties.fill || '#23cafb';
    style.fill = this.properties.fill || '#23cafb';
    return style;
  }
  initNodeData(data) {
    super.initNodeData(data);
    this.width = 13.5;
    this.height = 20;
  }
  // 关闭描点
  getDefaultAnchor() {
    return [];
  }
}

export default {
  type: 'smallRect',
  view: CustomRectNode,
  model: CustomRectModel,
};
