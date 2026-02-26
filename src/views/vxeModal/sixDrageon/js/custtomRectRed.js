import { RectNode, RectNodeModel } from '@logicflow/core';

class CustomRectNode extends RectNode {}

class CustomRectModel extends RectNodeModel {
  getNodeStyle() {
    const style = super.getNodeStyle();
    style.stroke = '#ef2a50';
    style.strokeWidth = 4;
    style.fill = '#03222c';
    return style;
  }
  getTextStyle() {
    const style = super.getTextStyle();
    style.color = '#ef2a50';
    style.fontSize = 18;
    return style;
  }
  initNodeData(data) {
    super.initNodeData(data);
    data.text = data.text || '110kV广场变';
    this.width = 150.5;
    this.height = 55;
  }
}

export default {
  type: 'custtomRectRed',
  view: CustomRectNode,
  model: CustomRectModel,
};
