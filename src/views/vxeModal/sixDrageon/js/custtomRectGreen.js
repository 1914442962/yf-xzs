import { RectNode, RectNodeModel } from '@logicflow/core';

class CustomRectNode extends RectNode {}

class CustomRectModel extends RectNodeModel {
  getNodeStyle() {
    const style = super.getNodeStyle();
    style.stroke = '#10c89e';
    style.strokeWidth = 4;
    style.fill = '#03222c';
    return style;
  }
  getTextStyle() {
    const style = super.getTextStyle();
    style.color = '#10c89e';
    style.fontSize = 18;
    return style;
  }
  initNodeData(data) {
    super.initNodeData(data);
    data.text = data.text || '深度求索';
    this.width = 250.5;
    this.height = 55;
  }
}

export default {
  type: 'custtomRectGreen',
  view: CustomRectNode,
  model: CustomRectModel,
};
