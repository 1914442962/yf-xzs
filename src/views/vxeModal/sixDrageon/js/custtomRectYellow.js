import { RectNode, RectNodeModel } from '@logicflow/core';

class CustomRectNode extends RectNode {}

class CustomRectModel extends RectNodeModel {
  getNodeStyle() {
    const style = super.getNodeStyle();
    style.stroke = '#e9c451';
    style.strokeWidth = 4;
    style.fill = '#03222c';
    return style;
  }
  getTextStyle() {
    const style = super.getTextStyle();
    style.color = '#e9c451';
    style.fontSize = 18;
    return style;
  }
  initNodeData(data) {
    super.initNodeData(data);
    data.text = data.text || '500kV仁和变';
    this.width = 330.5;
    this.height = 55;
  }
}

export default {
  type: 'custtomRectYellow',
  view: CustomRectNode,
  model: CustomRectModel,
};
