import LogicFlow, { h, PolylineEdge, PolylineEdgeModel } from '@logicflow/core';

class CustomEdge extends PolylineEdge {}

class CustomEdgeModel extends PolylineEdgeModel {
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
  // setAttributes() {
  //   // this.style.stroke = this.properties.fill || '#40c376';
  // }
}

export default {
  type: 'customEdge',
  view: CustomEdge,
  model: CustomEdgeModel,
};
