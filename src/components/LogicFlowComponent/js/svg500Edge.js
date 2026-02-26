import { HtmlNode, HtmlNodeModel } from "@logicflow/core";

// 原始 SVG 内容的尺寸 (从原始 viewBox 0 0 21.03 21.03 获取)
const ORIGINAL_SVG_SIZE = 21.03;

class Custom500Node extends HtmlNode {
  setHtml(rootEl) {
    // 1. 获取属性
    const { fill = "#36542a", stroke = "#36542a" } =
      this.props.model.properties;
    const { width: nodeSize, paddingValue: paddingPx } = this.props.model;

    // 2. 动态计算新的 viewBox 值 (核心简化)
    const contentDim = nodeSize - 2 * paddingPx;

    // 缩放因子 (S = 内容/总尺寸)
    const scaleFactor = contentDim / nodeSize;

    // 扩大后的 viewBox 尺寸 (V = V0 / S)
    const viewBoxSize = ORIGINAL_SVG_SIZE / scaleFactor;

    // 偏移量 O：需要向负方向偏移的距离 (O = (V - V0) / 2)
    const viewBoxOffset = (viewBoxSize - ORIGINAL_SVG_SIZE) / 2;

    // 最终的动态 viewBox 格式： -O -O V V
    const dynamicViewBox = `${-viewBoxOffset} ${-viewBoxOffset} ${viewBoxSize} ${viewBoxSize}`;

    // 3. 构造 HTML 和 SVG
    const wrapper = document.createElement("div");

    // Wrapper 样式：保持不变，用于撑满 LogicFlow 容器并居中
    wrapper.setAttribute(
      "style",
      `width: 100%; height: 100%; display: flex; justify-content: center; align-items: center;`,
    );

    wrapper.innerHTML = `
      <svg 
        xmlns="http://www.w3.org/2000/svg" 
        viewBox="${dynamicViewBox}"
        style="width: 100%; height: 100%;"
      >
          <circle 
            fill="none" 
            stroke="${stroke}" 
            cx="10.51" cy="10.51" r="10.01"
          />
          <circle 
            fill="none" 
            stroke="${stroke}" 
            cx="10.51" cy="10.51" r="7.51"
          />
          <circle 
            fill="${fill}" 
            stroke="none" 
            cx="10.51" cy="10.51" r="5.01"
          />
      </svg>
    `;

    rootEl.innerHTML = "";
    rootEl.appendChild(wrapper);
  }
}

class Custom500Model extends HtmlNodeModel {
  initNodeData(data) {
    super.initNodeData(data);
    this.width = 43;
    this.height = 43;

    if (!data.properties) {
      this.properties = {
        fill: "#36542a",
        stroke: "#36542a",
      };
    }
    // 定义留白像素值
    this.paddingValue = 0;
  }
  getTextStyle() {
    const style = super.getTextStyle();
    style.color = this.properties.textColor || "#36542a";
    style.fontSize = this.properties.fontSize || 16;
    style.fontWeight = this.properties.fontWeight || "bold";
    return style;
  }
  getDefaultAnchor() {
    const { x, y, id, _width, _height } = this;
    const r = _width > _height ? _height / 2 : _width / 2;
    const { anchorNumber = 16 } = this.properties;
    const points = [];
    let myId = 0;
    const angleStep = (Math.PI * 2) / anchorNumber;
    for (let i = 0; i < anchorNumber; i++) {
      myId++;
      const angle = i * angleStep;
      points.push({
        x: x + r * Math.cos(angle),
        y: y + r * Math.sin(angle),
        id: id + "_" + myId,
      });
    }
    return points;
  }
  getOutlineStyle() {
    return super.getOutlineStyle();
  }
}

export default {
  type: "svg500Edge",
  view: Custom500Node,
  model: Custom500Model,
};
