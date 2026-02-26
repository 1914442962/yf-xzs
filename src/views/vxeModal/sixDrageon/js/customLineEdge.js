import LogicFlow, { h, LineEdge, LineEdgeModel } from '@logicflow/core';

class CustomEdge extends LineEdge {}

class CustomEdgeModel extends LineEdgeModel {
  getEdgeStyle() {
    const style = super.getEdgeStyle();
    style.stroke = this.properties.fill || '#23cafb';
    style.strokeDasharray = this.properties.strokeDasharray || '0 0';
    style.strokeWidth = 3;
    return style;
  }
  getArrowStyle() {
    const style = super.getEdgeStyle();
    style.stroke = 'transparent';
    return style;
  }
  initEdgeData(data) {
    super.initEdgeData(data);
  }
}

export default {
  type: 'customLineEdge',
  view: CustomEdge,
  model: CustomEdgeModel,
};
