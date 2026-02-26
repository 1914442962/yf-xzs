import { TextNode, TextNodeModel } from '@logicflow/core';

class CustomTextNode extends TextNode {}

class CustomTextModel extends TextNodeModel {
  getTextStyle() {
    const style = super.getTextStyle();
    style.color = this.properties.textColor || '#000';
    style.fontSize = this.properties.fontSize || 16;
    style.fontWeight = this.properties.fontWeight || 'normal';
    return style;
  }
  initNodeData(data) {
    super.initNodeData(data);
  }
  // getDefaultAnchor() {
  //   return []; // 禁用连接锚点
  // }
}

export default {
  type: 'newText',
  view: CustomTextNode,
  model: CustomTextModel,
};
