import { TextNode, TextNodeModel } from '@logicflow/core';

class CustomEdge extends TextNode {}

class CustomEdgeModel extends TextNodeModel {
  getTextStyle() {
    const style = super.getTextStyle();
    style.color = this.properties.fill || '#1500e9';
    style.fontSize = 50;
    return style;
  }
}

export default {
  type: 'textBlue',
  view: CustomEdge,
  model: CustomEdgeModel,
};
