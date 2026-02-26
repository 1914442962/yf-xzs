import { RectNode, RectNodeModel } from '@logicflow/core';

class CustomRectNode extends RectNode {}

class CustomRectModel extends RectNodeModel {
  getNodeStyle() {
    const style = super.getNodeStyle();
    style.stroke = this.properties.fill || '#23cafb';
    style.strokeWidth = 3;
    style.fill = '#162233';
    return style;
  }
  initNodeData(data) {
    super.initNodeData(data);
    this.width = 20.5;
    this.height = 13;
  }
  // 关闭描点
  getDefaultAnchor() {
    return [];
  }
}

export default {
  type: 'smallEmptyRect',
  view: CustomRectNode,
  model: CustomRectModel,
};
