import { RectNode, RectNodeModel } from '@logicflow/core';

class CustomRectNode extends RectNode {}

class CustomRectModel extends RectNodeModel {
  getNodeStyle() {
    const style = super.getNodeStyle();
    style.stroke = '#00a2ff';
    style.strokeWidth = 4;
    style.fill = '#03222c';
    return style;
  }
  getTextStyle() {
    const style = super.getTextStyle();
    style.color = '#00a2ff';
    style.fontSize = 18;
    return style;
  }
  initNodeData(data) {
    super.initNodeData(data);
    data.text = data.text || '220kV霞湾变';
    this.width = 330.5;
    this.height = 55;
  }
}

export default {
  type: 'custtomRectBlue',
  view: CustomRectNode,
  model: CustomRectModel,
};
