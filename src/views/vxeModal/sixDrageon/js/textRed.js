import { TextNode, TextNodeModel } from '@logicflow/core';

class CustomEdge extends TextNode {}

class CustomEdgeModel extends TextNodeModel {
  getTextStyle() {
    const style = super.getTextStyle();
    style.color = this.properties.fill || '#fff';
    style.fontSize = 15;
    return style;
  }
  initNodeData(data) {
    data.text =
      data.text ||
      `1号主变
有功：30.12MW
负载率：60.55%
2号主变
有功：30.12MW
负载率：60.55%`;
    super.initNodeData(data);
  }
}

export default {
  type: 'textRed',
  view: CustomEdge,
  model: CustomEdgeModel,
};
