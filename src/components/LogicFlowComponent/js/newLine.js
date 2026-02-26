import { HtmlNode, HtmlNodeModel } from '@logicflow/core';

class CustomLineNode extends HtmlNode {
  setHtml(rootEl) {
    // 外层容器：用于控制 padding 让线居中
    const wrapper = document.createElement('div');
    wrapper.style.width = '100%';
    wrapper.style.height = '100%';
    // wrapper.style.paddingTop = '29px';
    // wrapper.style.paddingBottom = '29px';
    wrapper.style.boxSizing = 'border-box';
    wrapper.style.display = 'flex';
    wrapper.style.alignItems = 'center';
    wrapper.style.position = 'relative'; // 让绝对定位生效

    // 横线本体：撑满 wrapper 高度（即剩下的 1px）
    const line = document.createElement('div');
    line.style.width = '100%';
    line.style.height = this.props.model.properties.isWeight ? '4px' : '2px';
    line.style.flexShrink = '0';
    line.style.minHeight = '2px';
    line.style.background = this.props.model.properties.fill || '#000';
    line.style.borderRadius = '1.5px';
    const triangle = document.createElement('div');
    triangle.style.width = '0';
    triangle.style.height = '0';
    triangle.style.border = this.props.model.properties.triangle
      ? '8px solid transparent'
      : '0 solid transparent';
    triangle.style.position = 'absolute';
    if (this.props.model.properties.triangle) {
      if (this.props.model.properties.triangle === 'left') {
        triangle.style.borderRightColor =
          this.props.model.properties.triangleColor || '#000';
        triangle.style.left = '-8.5px';
      } else {
        triangle.style.borderLeftColor =
          this.props.model.properties.triangleColor || '#000';
        triangle.style.right = '-8.5px';
      }
    }

    // 宽度显示调试文本
    const widthText = document.createElement('div');
    widthText.textContent = `W: ${this.props.model.width}px`;
    widthText.style.position = 'absolute';
    widthText.style.top = '4px';
    widthText.style.right = '6px';
    widthText.style.color = 'red';
    widthText.style.fontSize = '12px';
    widthText.style.userSelect = 'none';
    widthText.style.pointerEvents = 'none'; // 不响应鼠标事件，避免遮挡

    wrapper.appendChild(line);
    wrapper.appendChild(triangle);
    // wrapper.appendChild(widthText);

    // 清空并插入
    rootEl.innerHTML = '';
    rootEl.appendChild(wrapper);
  }
}

class CustomLineModel extends HtmlNodeModel {
  // getNodeStyle() {
  //   const style = super.getNodeStyle();
  //   style.fill = this.properties.fill || '#000';
  //   return style;
  // }
  initNodeData(data) {
    super.initNodeData(data);
    this.width = 400;
    this.height = 60; // 设置较高便于拖动 resize
    this.minWidth = 4;
    data.text = '';
    // 禁止文本编辑
    this.text.editable = false;
  }

  getDefaultAnchor() {
    return []; // 禁用连接锚点
  }

  getOutlineStyle() {
    return super.getOutlineStyle();
  }
}

export default {
  type: 'newLine',
  view: CustomLineNode,
  model: CustomLineModel,
};
