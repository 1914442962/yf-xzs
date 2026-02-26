import Konva from "konva";
/**
 * ========================================================================
 * 函数名称：setupTextEditing (间距自适应版)
 * 功能描述：支持多行换行，并基于原 Rect 宽高比实现带 Padding 的动态高度同步
 * ========================================================================
 */
export function setupTextEditing(stage) {
  function createFloatingTextEditor(textNode) {
    const group = textNode.getParent();
    const bgRect = group ? group.findOne(".textBackground") : null;
    const originalText = textNode.text();
    const originalRectHeight = bgRect ? bgRect.height() : 0;
    const originalTextHeight = textNode.height();
    // 1. 🌟 计算原始间距补偿 (Padding Gap)
    // 这样能保证换行后，文字与边框的相对距离和 Visio 原图保持一致
    const heightGap = originalRectHeight - originalTextHeight;
    const verticalPadding = heightGap > 0 ? heightGap : 4; // 至少留 4px 间距
    if (document.getElementById("text-edit-modal-dynamic")) return;
    // --- 创建 UI (略，同之前) ---
    const modal = document.createElement("div");
    modal.id = "text-edit-modal-dynamic";
    modal.style.cssText = `position: fixed; top: 50%; left: 50%; transform: translate(-50%, -50%); background: #ffffff; padding: 20px; border-radius: 8px; box-shadow: 0 8px 24px rgba(0,0,0,0.2); border: 1px solid #ddd; z-index: 10000;`;
    const inputField = document.createElement("textarea");
    inputField.value = originalText;
    inputField.style.cssText = `width: 320px; height: 140px; margin-bottom: 15px; padding: 10px; border: 1px solid #ccc; border-radius: 4px; font-size: 14px; line-height: 1.2; display: block; outline: none;`;
    const saveButton = document.createElement("button");
    saveButton.innerText = "完成";
    saveButton.id = "text-editor-save-btn";
    saveButton.style.cssText =
      "padding: 8px 20px; background: #007bff; color: white; border: none; border-radius: 4px; cursor: pointer; float: right;";
    const cancelButton = document.createElement("button");
    cancelButton.innerText = "取消";
    cancelButton.style.cssText =
      "padding: 8px 15px; background: #f0f0f0; border: none; border-radius: 4px; cursor: pointer; float: right; margin-right: 10px;";
    modal.appendChild(inputField);
    modal.appendChild(saveButton);
    modal.appendChild(cancelButton);
    document.body.appendChild(modal);
    // --- 2. 🌟 核心同步逻辑：带补偿的高度计算 ---
    const performSync = () => {
      const val = inputField.value;
      textNode.text(val);
      if (bgRect) {
        // 强制开启换行模式以精准计算高度
        // 如果是 center 对齐，使用 Rect 的宽度作为约束
        const rectWidth = bgRect.width();
        textNode.setAttrs({
          width: rectWidth,
          wrap: "word",
        });
        // 刷新度量
        textNode.getSelfRect();
        // 计算新高度：当前文字高度 + 原始 Padding 补偿
        const currentTextHeight = textNode.height();
        const targetHeight = currentTextHeight + verticalPadding;
        // 🌟 动态加减：高度不低于初始 Rect 高度，且随文字实时增减
        bgRect.height(Math.max(targetHeight, originalRectHeight));
      }
      stage.batchDraw();
    };
    // --- 事件绑定 ---
    inputField.addEventListener("input", performSync);
    saveButton.onclick = () => {
      if (modal.parentNode) modal.parentNode.removeChild(modal);
      textNode.listening(true);
      if (group) group.listening(true);
    };
    cancelButton.onclick = () => {
      textNode.text(originalText);
      if (bgRect) bgRect.height(originalRectHeight);
      stage.batchDraw();
      if (modal.parentNode) modal.parentNode.removeChild(modal);
      textNode.listening(true);
      if (group) group.listening(true);
    };
    inputField.addEventListener("keydown", (e) => {
      if (e.key === "Enter" && e.ctrlKey) {
        e.preventDefault();
        saveButton.click();
      } else if (e.key === "Escape") {
        cancelButton.click();
      }
    });
    textNode.listening(false);
    if (group) group.listening(false);
    inputField.focus();
    inputField.select();
  }
  // 遍历绑定逻辑 (保持不变)
  const textGroups = stage.find(".textGroup");
  textGroups.forEach((group) => {
    group.off("dblclick dbltap");
    group.on("dblclick dbltap", (e) => {
      const textNode = group.findOne(".textBody");
      if (!textNode) return;
      const activeBtn = document.getElementById("text-editor-save-btn");
      if (activeBtn) activeBtn.click();
      createFloatingTextEditor(textNode);
      e.cancelBubble = true;
    });
  });
}
// --- 1. 样式表解析 (CSS to Object Mapping) ---
// 目的：将 SVG 顶部 <style> 标签内的 CSS 文本转换为 JS 对象。
// 输入示例：".st1 { fill: #ff0000; font-size: 10px; }"
// 输出结构：styles = { "st1": { "fill": "#ff0000", "font-size": "10px" } }
const styles = {};
/**
 * 解析 SVG 文本逻辑并渲染至 Konva 画布
 * 最终目的：
 * 1. 还原 Visio 文本的样式（字号、颜色、粗细）。
 * 2. 精准定位文本位置（处理嵌套平移与基线偏移）。
 * 3. 实现多行文本居中对齐及交互 Hover 效果。
 * @param {Document} doc - 传入的 SVG DOM 对象
 */
function dealStyle(doc) {
  const styleElement = doc.querySelector("style");
  if (styleElement) {
    const cssText = styleElement.textContent;
    const ruleRegex = /\.([a-zA-Z0-9_-]+)\s*\{([^}]+)\}/g;
    let match;
    // 使用循环正则匹配所有样式类
    while ((match = ruleRegex.exec(cssText)) !== null) {
      const className = match[1]; // 捕获类名，如 "st1"
      // 捕获大括号内的内容并转化为 Key-Value 对象
      const properties = match[2].split(";").reduce((acc, prop) => {
        const [key, value] = prop.split(":");
        if (key && value) acc[key.trim()] = value.trim();
        return acc;
      }, {});
      styles[className] = properties;
    }
  }
}
/**
 * ========================================================================
 * 函数名称：getAbsoluteTransform
 * 功能描述：终极递归坐标解析引擎，修复嵌套缩放、位移、旋转及镜像翻转
 * * 核心逻辑：
 * 1. 深度递归：向上追溯至 SVG 根节点，实时累加所有变换矩阵。
 * 2. 缩放校正：确保平移量(translate)随父级缩放系数同步伸缩，彻底解决位移偏差。
 * 3. 兼容性：补偿嵌套 SVG 容器及 Text 节点特有的坐标属性。
 * ========================================================================
 */
function getAbsoluteTransform(el) {
  let x = 0,
    y = 0,
    rot = 0;
  let scaleX = 1,
    scaleY = 1;
  let curr = el;
  while (curr && curr.tagName !== "BODY") {
    const transform = curr.getAttribute("transform");
    if (transform) {
      // 1. 处理平移 (受父级缩放影响)
      const t = transform.match(/translate\(([^, ]+)[, ]+([^)]+)\)/);
      if (t) {
        x += parseFloat(t[1]) * scaleX;
        y += parseFloat(t[2]) * scaleY;
      }
      // 2. 处理矩阵 (同步更新缩放与位移)
      const m = transform.match(
        /matrix\(([^, ]+)[, ]+([^, ]+)[, ]+([^, ]+)[, ]+([^, ]+)[, ]+([^, ]+)[, ]+([^, ]+)\)/,
      );
      if (m) {
        const a = parseFloat(m[1]),
          d = parseFloat(m[4]);
        const e = parseFloat(m[5]),
          f = parseFloat(m[6]);
        x += e * scaleX;
        y += f * scaleY;
        scaleX *= a;
        scaleY *= d;
      }
      // 3. 处理旋转
      const r = transform.match(/rotate\(([^)]+)\)/);
      if (r) rot += parseFloat(r[1]);
    }
    // 4. 补偿嵌套容器坐标
    if (curr.tagName === "svg") {
      x += parseFloat(curr.getAttribute("x") || 0) * scaleX;
      y += parseFloat(curr.getAttribute("y") || 0) * scaleY;
    }
    curr = curr.parentElement;
    if (
      !curr ||
      (curr.tagName === "svg" && curr.parentElement?.tagName !== "g")
    )
      break;
  }
  // 5. 补充文本特有起点
  if (el.tagName === "text") {
    x += parseFloat(el.getAttribute("x") || 0) * scaleX;
    y += parseFloat(el.getAttribute("y") || 0) * scaleY;
  }
  return {
    absX: x,
    absY: y,
    absRotation: rot,
    absScaleX: scaleX,
    absScaleY: scaleY,
  };
}
/**
 * ========================================================================
 * 函数名称：dealLine
 * 功能描述：解析 SVG 路径数据，通过 Group 容器精准还原电力导线及闭合图元
 * * 识别规则 (严格模式)：
 * 1. 电气连接线 (Arrow): 识别带 marker-end 属性的路径，映射为 Konva.Arrow。
 * 2. 路径/符号主体 (Path): 识别常规 D 指令路径（如变压器、电感、母线）。
 * * 架构逻辑 (容器化)：
 * - 坐标承载 (Group): 创建 Konva.Group 承载 absX/absY/absRotation/absScale。
 * - 实体对齐 (Shape): 内部实体(wireBody)坐标初始化为 0,0，确保变换逻辑解耦。
 * * 判定与对齐逻辑 (样式断路器)：
 * - 边框判定 (Stroke): 检查 stroke 属性，若为 none 则启用 strokeEnabled: false。
 * - 填充判定 (Fill/Mask): 对以 'Z' 结尾的闭合路径默认补偿 white 填充实现物理遮挡。
 * - 拦截机制：严禁解析 switch/foreignObject，排除文本背景矩形的干扰。
 * * 命名规范：
 * - Layer ID: "lineLayer" (导线专用层)
 * - Group Name: "lineGroup" (导线复合组 - 分类查找用)
 * - Group ID: "lineGroup-[originalID]" (精准映射容器)
 * - Shape Name: "wireBody" (路径实体命名)
 * ========================================================================
 */
function dealLine(stage, doc) {
  // 1. 获取或创建导线层
  let lineLayer =
    stage.findOne("#lineLayer") ||
    new Konva.Layer({ id: "lineLayer", name: "lineLayer" });
  if (!stage.findOne("#lineLayer")) stage.add(lineLayer);
  const allPaths = doc.querySelectorAll("path");
  allPaths.forEach((pathElement) => {
    // --- 2. 严格拦截：排除嵌套干扰与文本附属线 ---
    if (pathElement.closest("switch") || pathElement.closest("foreignObject"))
      return;
    const group = pathElement.closest("g");
    if (group && group.querySelector("text")) return;
    const d = pathElement.getAttribute("d");
    if (!d) return;
    // --- 3. 递归坐标与全局变换解析 ---
    const { absX, absY, absRotation, absScaleX, absScaleY } =
      getAbsoluteTransform(pathElement);
    const className = pathElement.getAttribute("class");
    const style = styles[className] || {};
    // --- 4. 创建 Group 容器：承载变换属性 ---
    const lineGroup = new Konva.Group({
      x: absX,
      y: absY,
      rotation: absRotation,
      scaleX: absScaleX,
      scaleY: absScaleY,
      name: "lineGroup",
      id: `lineGroup-${
        group ? group.id : Math.random().toString(36).substr(2, 9)
      }`,
    });
    // --- 5. 样式断路器逻辑 ---
    const rawStroke = (style["stroke"] || "").toLowerCase();
    const isStrokeVisible = rawStroke && rawStroke !== "none";
    const rawFill = (style["fill"] || "").toLowerCase();
    const isFillVisible = rawFill && rawFill !== "none";
    const isClosed = d.trim().toLowerCase().endsWith("z");
    // 配置内部实体属性：坐标回归 0,0
    const commonProps = {
      x: 0,
      y: 0,
      stroke: isStrokeVisible ? rawStroke : undefined,
      strokeEnabled: isStrokeVisible,
      strokeWidth: isStrokeVisible ? parseFloat(style["stroke-width"]) || 1 : 0,
      fill: isFillVisible ? rawFill : isClosed ? "white" : undefined,
      fillEnabled: isFillVisible || isClosed,
      lineCap: "round",
      lineJoin: "round",
      dash: style["stroke-dasharray"]
        ? style["stroke-dasharray"].split(/[, ]+/).map(Number)
        : null,
      name: "wireBody",
    };
    let shapeNode;
    const hasArrow =
      style["marker-end"] || pathElement.getAttribute("marker-end");
    if (hasArrow) {
      const points = d
        .replace(/[MLZz]/g, " ")
        .trim()
        .split(/[ ,]+/)
        .map(Number);
      shapeNode = new Konva.Arrow({
        ...commonProps,
        points: points,
        pointerLength: 8,
        pointerWidth: 6,
        fill: isStrokeVisible ? rawStroke : undefined,
      });
    } else {
      shapeNode = new Konva.Path({
        ...commonProps,
        data: d,
      });
    }
    // --- 6. 交互高亮 ---
    if (isStrokeVisible) {
      shapeNode.on("mouseenter", () => {
        stage.container().style.cursor = "pointer";
        shapeNode.stroke("#00A1FF");
        lineLayer.batchDraw();
      });
      shapeNode.on("mouseleave", () => {
        stage.container().style.cursor = "default";
        shapeNode.stroke(isStrokeVisible ? rawStroke : undefined);
        lineLayer.batchDraw();
      });
    }
    lineGroup.add(shapeNode);
    lineLayer.add(lineGroup);
  });
  lineLayer.batchDraw();
}
/**
 * ========================================================================
 * 函数名称：dealNode
 * 功能描述：从 SVG Doc 中精准识别并创建图元节点，封装入规范化的 Konva.Group
 * * 识别规则 (严格模式)：
 * 1. 矩形开关 (Breaker): 仅含一个 <title> 和一个 <rect> 的 <g> 标签
 * 2. 圆形节点 (Circle): 仅含一个 <title> 和一个 <ellipse> 的 <g> 标签
 * * 判定逻辑：
 * - 必须有且仅有一个形状（rect 或 ellipse）
 * - 必须有一个 title 标签（Visio 默认导出结构）
 * - 组内不得含有 path 或 text（防止误伤含有背景矩形的文字或复杂图形）
 * * 命名规范：
 * - Layer ID: "nodeLayer" (唯一图层)
 * - Group Name: "breakerGroup" 或 "circleNodeGroup" (分类查找用)
 * - Group ID: "nodeGroup-[type]-[originalID]" (精准映射用)
 * - Shape Name: "nodeBody" (内部实体统一命名)
 * ========================================================================
 */
function dealNode(stage, doc) {
  // 1. 获取或创建统一节点图层
  let nodeLayer =
    stage.findOne("#nodeLayer") ||
    new Konva.Layer({ id: "nodeLayer", name: "nodeLayer" });
  if (!stage.findOne("#nodeLayer")) stage.add(nodeLayer);
  const allGroups = doc.querySelectorAll("g");
  allGroups.forEach((group) => {
    // --- 识别特征提取 ---
    // :scope > 确保只查找当前 g 标签下的直接子元素，防止深度嵌套干扰
    const rects = group.querySelectorAll(":scope > rect");
    const ellipses = group.querySelectorAll(":scope > ellipse");
    const titles = group.querySelectorAll(":scope > title");
    // 判定条件：必须有 1 个 title，且形状总数为 1，且无 path/text 干扰
    const shapeCount = rects.length + ellipses.length;
    const hasOneTitle = titles.length === 1;
    const hasNoOthers = !group.querySelector("path, text");
    if (shapeCount !== 1 || !hasOneTitle || !hasNoOthers) return;
    // --- 坐标与变换解析 (应用递归缩放与旋转) ---
    const { absX, absY, absRotation, absScaleX, absScaleY } =
      getAbsoluteTransform(group);
    const nodeType = rects.length > 0 ? "breaker" : "circleNode";
    // --- 创建容器 Group ---
    // 使用统一的命名规范，将所有变换属性应用在 Group 容器上
    const nodeGroup = new Konva.Group({
      x: absX,
      y: absY,
      rotation: absRotation,
      scaleX: absScaleX,
      scaleY: absScaleY,
      name: `${nodeType}Group`,
      id: `nodeGroup-${nodeType}-${group.id}`,
    });
    let mainShape;
    // --- 形状构造逻辑：内部实体使用 SVG 相对偏移坐标 ---
    if (nodeType === "breaker") {
      const el = rects[0];
      const style = styles[el.getAttribute("class")] || {};
      mainShape = new Konva.Rect({
        x: parseFloat(el.getAttribute("x")) || 0,
        y: parseFloat(el.getAttribute("y")) || 0,
        width: parseFloat(el.getAttribute("width")) || 0,
        height: parseFloat(el.getAttribute("height")) || 0,
        fill: style["fill"] || "#ffffff",
        stroke: style["stroke"] || "#ffffff",
        strokeWidth: parseFloat(style["stroke-width"]) || 1,
        name: "nodeBody", // 内部组件统一命名
      });
    } else {
      const el = ellipses[0];
      const style = styles[el.getAttribute("class")] || {};
      mainShape = new Konva.Ellipse({
        x: parseFloat(el.getAttribute("cx")) || 0,
        y: parseFloat(el.getAttribute("cy")) || 0,
        radiusX: parseFloat(el.getAttribute("rx")) || 0,
        radiusY: parseFloat(el.getAttribute("ry")) || 0,
        fill: style["fill"] || "#ffffff",
        stroke: style["stroke"] || "#ffffff",
        strokeWidth: parseFloat(style["stroke-width"]) || 1,
        name: "nodeBody",
      });
    }
    // --- 挂载与渲染 ---
    nodeGroup.add(mainShape);
    nodeLayer.add(nodeGroup);
  });
  nodeLayer.batchDraw();
}
/**
 * ========================================================================
 * 函数名称：dealText
 * 功能描述：解析文本及其关联背景，并根据背景视觉特征自动匹配定位算法
 * * 识别规则 (严格模式)：
 * 1. 文本主体 (Text Body): 识别 <text> 标签，递归解析子节点 (tspan, newlineChar)
 * 2. 关联背景 (Background Rect): 识别与 <text> 同级且在同一 <g> 容器下的 <rect>
 * * 判定与对齐逻辑 (动态流转)：
 * - 情况 A (可见背景框): 当 Rect 具备可见填充(非none/#fff)或有边框时，借用 Rect
 * 的 x 与 width，启用 align: "center"，实现文字在物理框内精准居中。
 * - 情况 B (透明/占位背景): 当 Rect 为无填充(none/#fff)且无边框时，视为纯标注文本，
 * 回归 text 标签原始 x/y 坐标，align 设为 left，防止因宽度计算产生的位移。
 * * 命名规范：
 * - Layer ID: "textLayer" (独立文本层)
 * - Group Name: "textGroup" (文本复合组)
 * - Group ID: "textGroup-[originalID]" (精准映射)
 * - Rect Name: "textBackground" (背景实体)
 * - Text Name: "textBody" (文本实体)
 * ========================================================================
 */
function dealText(stage, doc) {
  // 1. 获取或创建独立文本图层
  let textLayer =
    stage.findOne("#textLayer") ||
    new Konva.Layer({ id: "textLayer", name: "textLayer" });
  if (!stage.findOne("#textLayer")) stage.add(textLayer);
  const allTexts = doc.querySelectorAll("text");
  allTexts.forEach((textElement) => {
    const group = textElement.closest("g");
    if (!group) return;
    // --- 2. 递归累加变换 (坐标累加逻辑) ---
    let groupX = 0,
      groupY = 0,
      groupRotation = 0;
    let parent = textElement.parentElement;
    while (parent && parent.tagName !== "svg") {
      const transform = parent.getAttribute("transform");
      if (transform) {
        const translateMatch = transform.match(
          /translate\(([^, ]+)[, ]+([^)]+)\)/,
        );
        if (translateMatch) {
          groupX += parseFloat(translateMatch[1]) || 0;
          groupY += parseFloat(translateMatch[2]) || 0;
        }
        const rotateMatch = transform.match(/rotate\(([^)]+)\)/);
        if (rotateMatch) groupRotation += parseFloat(rotateMatch[1]) || 0;
      }
      parent = parent.parentElement;
    }
    const textGroup = new Konva.Group({
      x: groupX,
      y: groupY,
      rotation: groupRotation,
      name: "textGroup",
      id: "textGroup-" + (group.id || Math.random().toString(36).substr(2, 9)),
    });
    // --- 3. 背景视觉特征判定 ---
    const bgRectNode = group.querySelector(":scope > rect");
    let rectBounds = { x: 0, y: 0, w: 0, h: 0 };
    let hasVisibleRect = false;
    if (bgRectNode) {
      const rectClass = bgRectNode.getAttribute("class");
      // 注意：确保全局 styles 对象存在
      const rectStyle =
        (typeof styles !== "undefined" ? styles[rectClass] : {}) || {};
      const rawFill = (rectStyle["fill"] || "").toLowerCase();
      const rawStroke = (rectStyle["stroke"] || "").toLowerCase();
      // 判定视觉特征
      const isFillTransparent =
        !rawFill ||
        rawFill === "none" ||
        rawFill === "#ffffff" ||
        rawFill === "white";
      const isStrokeNone = !rawStroke || rawStroke === "none";
      hasVisibleRect = !isFillTransparent || !isStrokeNone;
      rectBounds.x = parseFloat(bgRectNode.getAttribute("x")) || 0;
      rectBounds.y = parseFloat(bgRectNode.getAttribute("y")) || 0;
      rectBounds.w = parseFloat(bgRectNode.getAttribute("width")) || 0;
      rectBounds.h = parseFloat(bgRectNode.getAttribute("height")) || 0;
      if (hasVisibleRect) {
        const konvaBgRect = new Konva.Rect({
          x: rectBounds.x,
          y: rectBounds.y,
          width: rectBounds.w,
          height: rectBounds.h,
          fill: isFillTransparent ? undefined : rectStyle["fill"],
          fillEnabled: !isFillTransparent,
          stroke: isStrokeNone ? undefined : rectStyle["stroke"],
          strokeEnabled: !isStrokeNone,
          strokeWidth: parseFloat(rectStyle["stroke-width"]) || 0.72,
          name: "textBackground",
          listening: false,
        });
        textGroup.add(konvaBgRect);
      }
    }
    // --- 4. 文本多行解析 ---
    let lines = [];
    let currentLine = "";
    textElement.childNodes.forEach((node) => {
      if (node.nodeType === 3) {
        // Node.TEXT_NODE
        currentLine += node.textContent.trim();
      } else if (node.localName === "newlineChar") {
        lines.push(currentLine);
        currentLine = "";
      } else if (node.localName === "tspan") {
        if (
          node.getAttribute("dy") &&
          parseFloat(node.getAttribute("dy")) > 0.5
        ) {
          if (currentLine) lines.push(currentLine);
          currentLine = node.textContent.trim();
        } else {
          currentLine += node.textContent.trim();
        }
      }
    });
    if (currentLine) lines.push(currentLine);
    // --- 5. 样式与对齐策略派发 ---
    const textClass = textElement.getAttribute("class");
    const textStyle =
      (typeof styles !== "undefined" ? styles[textClass] : {}) || {};
    let fontSize = 12;
    if (textStyle["font-size"]) {
      fontSize =
        parseFloat(textStyle["font-size"]) *
        (textStyle["font-size"].includes("em") ? 12 : 1);
    }
    // 核心定位属性
    const textX = hasVisibleRect
      ? rectBounds.x
      : parseFloat(textElement.getAttribute("x")) || 0;
    const textW = hasVisibleRect ? rectBounds.w : undefined;
    const textAlign = hasVisibleRect ? "center" : "left";
    const konvaText = new Konva.Text({
      x: textX,
      y: parseFloat(textElement.getAttribute("y")) || 0,
      width: textW,
      align: textAlign,
      offsetY: lines.length > 1 ? fontSize * 1.0 : fontSize * 0.85,
      text: lines.join("\n"),
      fontSize: fontSize,
      fontFamily: (textStyle["font-family"] || "楷体").replace(/'/g, ""),
      fill: textStyle["fill"] || "black",
      fontStyle: textStyle["font-weight"] === "bold" ? "bold" : "normal",
      lineHeight: 1.2,
      name: "textBody",
    });
    textGroup.add(konvaText);
    textLayer.add(textGroup);
  });
  textLayer.batchDraw();
}
/**
 * ========================================================================
 * 优化后的主函数
 * ========================================================================
 */
/**
 * ========================================================================
 * 模板配置中心：在此处定义所有 Stencil（工具箱）节点
 * ========================================================================
 */
const NODE_TEMPLATES = {
  "drag-text": {
    label: "拖拽文本",
    create: (pos) => {
      // 创建 Group 容器
      const group = new Konva.Group({
        x: pos.x,
        y: pos.y,
        draggable: true,
        name: "textGroup", // 关键：对应 setupTextEditing 的选择器
      });
      // 创建背景矩形 (参考 Visio st7 样式)
      const rect = new Konva.Rect({
        width: 80,
        height: 25,
        fill: "#ffffff",
        stroke: "#000000",
        strokeWidth: 1,
        name: "textBackground", // 关键：对应 setupTextEditing 的逻辑
      });
      // 创建文本 (参考 Visio st9 样式)
      const text = new Konva.Text({
        x: 0,
        y: 6, // 垂直居中补偿
        width: 80,
        text: "新节点",
        fontSize: 12,
        fontFamily: "黑体",
        align: "center",
        fontWeight: "bold",
        fill: "#000000",
        name: "textBody", // 关键：对应 setupTextEditing 的逻辑
      });
      group.add(rect, text);
      return group;
    },
  },
  "breaker-node": {
    label: "开关节点",
    create: (pos) => {
      const group = new Konva.Group({
        x: pos.x,
        y: pos.y,
        draggable: true,
        name: "breakerGroup",
      });
      const rect = new Konva.Rect({
        width: 40,
        height: 20,
        fill: "#ffffff",
        stroke: "#ff0000",
        strokeWidth: 2,
        name: "nodeBody",
      });
      group.add(rect);
      return group;
    },
  },
};
/**
 * ========================================================================
 * 完整函数：setupStencilModule
 * ========================================================================
 */
export function setupStencilModule(stage, parentId) {
  // --- 1. 面板 UI 渲染 (HTML 纯 JS 实现) ---
  const panelId = "konva-stencil-panel";
  if (!document.getElementById(panelId)) {
    const panel = document.createElement("div");
    panel.id = panelId;
    panel.style.cssText = `
      position: absolute; left: 10px; top: 10px; width: 110px; height: calc(100% - 20px);
      background: #fff; padding: 20px 10px; display: flex; 
      flex-direction: column; gap: 12px; z-index: 9999;
      box-shadow: 0 0 10px rgba(0,0,0,0.5);
    `;
    // 标题
    const title = document.createElement("div");
    title.innerText = "图元库";
    title.style.cssText =
      "color: #888; font-size: 12px; text-align: center; margin-bottom: 10px;";
    panel.appendChild(title);
    // 动态生成按钮
    Object.keys(NODE_TEMPLATES).forEach((key) => {
      const btn = document.createElement("div");
      btn.innerText = NODE_TEMPLATES[key].label;
      btn.draggable = true;
      btn.style.cssText = `
        padding: 10px 5px; background: #fff; color: #333; cursor: grab;
        border: 1px solid #888; border-radius: 4px; text-align: center; 
        font-size: 11px; transition: all 0.2s;
      `;
      btn.onmouseenter = () => (btn.style.borderColor = "#007bff");
      btn.onmouseleave = () => (btn.style.borderColor = "#444");
      // 开始拖拽：存储 key
      btn.ondragstart = (e) => {
        e.dataTransfer.setData("konva-type", key);
      };
      panel.appendChild(btn);
    });
    document.getElementById(parentId).appendChild(panel);
  }
  // --- 2. 画布放置逻辑 ---
  const container = stage.container();
  // 拖拽经过
  container.addEventListener("dragover", (e) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = "copy";
  });
  // 释放放置
  container.addEventListener("drop", (e) => {
    e.preventDefault();
    const type = e.dataTransfer.getData("konva-type");
    const template = NODE_TEMPLATES[type];
    if (!template) return;
    // A. 核心：精准坐标计算 (处理 Stage 缩放和平移)
    stage.setPointersPositions(e);
    const pointerPos = stage.getPointerPosition();
    // 逆转矩阵转换，确保鼠标在哪节点就在哪
    const stageTransform = stage.getAbsoluteTransform().copy().invert();
    const pos = stageTransform.point(pointerPos);
    // B. 工厂模式生成节点
    const newNode = template.create(pos);
    // C. 路由到正确图层
    let layerName = newNode.name() === "textGroup" ? "textLayer" : "nodeLayer";
    let targetLayer =
      stage.findOne("#" + layerName) || stage.findOne("." + layerName);
    // 容错：如果图层不存在则动态创建
    if (!targetLayer) {
      targetLayer = new Konva.Layer({ id: layerName, name: layerName });
      stage.add(targetLayer);
    }
    targetLayer.add(newNode);
    targetLayer.batchDraw();
    // D. 交互补丁：如果是文本节点，重新绑定双击编辑功能
    if (type === "drag-text" && typeof setupTextEditing === "function") {
      setupTextEditing(stage);
    }
    console.log(`Successfully created: ${type} at`, pos);
  });
}
/**
 * ========================================================================
 * 函数名称：setupGlobalSelection
 * 功能描述：极致精简的全局统一选中系统
 * 适用对象：dealLine, dealNode, dealText 生成的所有 Group
 * ========================================================================
 */
export function setupGlobalSelection(stage) {
  const SELECTION_LAYER_NAME = "selection-layer";
  // 1. 获取或创建唯一的选中控制层
  let selectionLayer = stage.findOne("." + SELECTION_LAYER_NAME);
  if (!selectionLayer) {
    selectionLayer = new Konva.Layer({
      name: SELECTION_LAYER_NAME,
      listening: true,
    });
    stage.add(selectionLayer);
  }
  // 2. 创建唯一的 Transformer
  const tr = new Konva.Transformer({
    nodes: [],
    rotateEnabled: true,
    keepRatio: true,
    borderStroke: "#00A1FF",
    borderStrokeWidth: 2,
    anchorSize: 8,
    name: "globalTransformer",
    padding: 2,
    // 限制最小缩放，防止节点缩成一个点消失
    boundBoxFunc: (oldBox, newBox) => {
      if (Math.abs(newBox.width) < 5 || Math.abs(newBox.height) < 5)
        return oldBox;
      return newBox;
    },
  });
  selectionLayer.add(tr);
  // 3. 统一点击/触摸监听
  stage.on("click tap", (e) => {
    // 屏蔽辅助层干扰
    if (stage.findOne("#helperLayer")) return;
    const target = e.target;
    // A. 点击背景或 Transformer 自身 -> 清空选中
    if (
      target === stage ||
      target instanceof Konva.Layer ||
      target.getParent() instanceof Konva.Transformer ||
      target.name()?.includes("Transformer")
    ) {
      tr.nodes([]);
      selectionLayer.batchDraw();
      return;
    }
    // B. 向上递归查找目标 Group
    let nodeToSelect = null;
    let curr = target;
    while (curr && curr !== stage) {
      if (curr instanceof Konva.Group) {
        const name = curr.name() || "";
        // 匹配 dealLine(lineGroup), dealNode(breakerGroup...), dealText(textGroup)
        if (name.toLowerCase().includes("group")) {
          nodeToSelect = curr;
          break;
        }
      }
      curr = curr.getParent();
    }
    // C. 更新 Transformer 状态
    if (nodeToSelect) {
      if (!tr.nodes().includes(nodeToSelect)) {
        tr.nodes([nodeToSelect]);
        // 选中后自动置顶，增强交互感
        nodeToSelect.moveToTop();
        selectionLayer.moveToTop();
      }
      selectionLayer.batchDraw();
      e.cancelBubble = true;
    } else {
      tr.nodes([]);
      selectionLayer.batchDraw();
    }
  });
  // 4. 针对拖拽和变换的实时同步
  stage.on("dragmove transform", (e) => {
    // 只要是当前选中的节点在变，就更新 Transformer 框
    if (tr.nodes().includes(e.target)) {
      tr.update();
      selectionLayer.batchDraw();
    }
  });
  selectionLayer.batchDraw();
  return tr;
}
/**
 * ========================================================================
 * 函数名称：setupContextMenu (终极修复版)
 * ========================================================================
 */
export function setupContextMenu(stage) {
  const MENU_ID = "konva-dynamic-context-menu";
  const TR_SELECTOR = ".globalTransformer";
  // --- 1. 获取或创建菜单 ---
  let menuContainer = document.getElementById(MENU_ID);
  if (!menuContainer) {
    menuContainer = document.createElement("div");
    menuContainer.id = MENU_ID;
    menuContainer.style.cssText = `
      position: fixed; display: none; width: 150px; background: #2b2b2b;
      border: 1px solid #444; border-radius: 4px; flex-direction: column;
      padding: 5px 0; z-index: 10000; box-shadow: 0 4px 12px rgba(0,0,0,0.5);
      font-family: Arial, sans-serif; color: #eee; font-size: 13px; cursor: default;
    `;
    document.body.appendChild(menuContainer);
  }
  // --- 2. 核心：定义一个变量存储当前选中的节点 ---
  let nodesToOperate = [];
  // --- 3. 动态刷新菜单内容的内部函数 ---
  const refreshMenuContent = () => {
    menuContainer.innerHTML = ""; // 清空旧内容
    // A. 颜色项
    const colorItem = document.createElement("div");
    colorItem.style.cssText = `display:flex; align-items:center; padding: 8px 12px; border-bottom: 1px solid #333; cursor: pointer;`;
    colorItem.innerHTML = `<span style="flex:1">修改颜色</span><input type="color" id="picker-inner" style="width:24px; height:24px; border:none; background:none; cursor:pointer;">`;
    const picker = colorItem.querySelector("input");
    picker.oninput = (e) => {
      const color = e.target.value;
      nodesToOperate.forEach((group) => {
        const shapes = group.find("Text, Line, Rect, Circle, Path");
        shapes.forEach((s) => {
          if (s.getClassName() === "Text") s.fill(color);
          else if (
            s.hasFill() &&
            !["transparent", "white", "#ffffff"].includes(s.fill())
          )
            s.fill(color);
          else s.stroke(color);
        });
      });
      stage.batchDraw();
    };
    menuContainer.appendChild(colorItem);
    // B. 切换虚线项
    const hasLine = nodesToOperate.some(
      (n) => n.findOne(".wireBody") || n.findOne("Line"),
    );
    if (hasLine) {
      const dashBtn = document.createElement("div");
      dashBtn.innerText = "切换虚线";
      dashBtn.style.cssText = `padding: 8px 12px; cursor: pointer;`;
      dashBtn.onclick = (e) => {
        e.stopPropagation();
        nodesToOperate.forEach((node) => {
          const line = node.findOne(".wireBody") || node.findOne("Line");
          if (line) {
            const isDashed = line.dash() && line.dash().length > 0;
            line.dash(isDashed ? [] : [10, 5]);
          }
        });
        stage.batchDraw();
        menuContainer.style.display = "none";
      };
      // Hover 效果
      dashBtn.onmouseenter = () => (dashBtn.style.background = "#3e95ff");
      dashBtn.onmouseleave = () => (dashBtn.style.background = "transparent");
      menuContainer.appendChild(dashBtn);
    }
    // C. 删除项
    const delBtn = document.createElement("div");
    delBtn.innerText = "删除选中";
    delBtn.style.cssText = `padding: 8px 12px; cursor: pointer; color: #ff5555;`;
    delBtn.onclick = (e) => {
      e.stopPropagation();
      nodesToOperate.forEach((node) => node.destroy());
      const tr = stage.findOne(TR_SELECTOR);
      if (tr) tr.nodes([]);
      stage.batchDraw();
      menuContainer.style.display = "none";
    };
    delBtn.onmouseenter = () => (delBtn.style.background = "#3e95ff");
    delBtn.onmouseleave = () => (delBtn.style.background = "transparent");
    menuContainer.appendChild(delBtn);
  };
  // --- 4. 右键激活逻辑 ---
  stage.on("contextmenu", (e) => {
    e.evt.preventDefault();
    const tr = stage.findOne(TR_SELECTOR);
    const selectedNodes = tr ? tr.nodes() : [];
    let clickedNode = null;
    let curr = e.target;
    while (curr && curr !== stage) {
      if (
        curr instanceof Konva.Group &&
        curr.name()?.toLowerCase().includes("group")
      ) {
        clickedNode = curr;
        break;
      }
      curr = curr.getParent();
    }
    const isTr = e.target.getParent() instanceof Konva.Transformer;
    if (clickedNode || isTr) {
      nodesToOperate = selectedNodes.includes(clickedNode)
        ? selectedNodes
        : clickedNode
          ? [clickedNode]
          : [];
      // 动态生成菜单项（解决按钮引用为 null 的根本方法）
      refreshMenuContent();
      menuContainer.style.display = "flex";
      menuContainer.style.left = e.evt.clientX + "px";
      menuContainer.style.top = e.evt.clientY + "px";
    } else {
      menuContainer.style.display = "none";
    }
  });
  // 点击空白关闭
  window.addEventListener("click", () => {
    menuContainer.style.display = "none";
  });
}
export function dealSvg(stage, doc) {
  dealStyle(doc);
  // ========== 解析线路 ==========
  dealLine(stage, doc);
  // ========== 解析文本 ==========
  dealNode(stage, doc);
  // ========== 解析节点 ==========
  dealText(stage, doc);
}
/**
 * ========================================================================
 * 函数名称：highlightAndCenterNodesByBoundary (自动关联 Rect 版)
 * 功能描述：根据 id 查找目标节点，并自动搜索周边最近的 Rect（如状态块），
 * 计算它们的整体边界进行平滑定位，最后让它们同步闪烁。
 * ========================================================================
 */
export function highlightAndCenterNodesByBoundary(
  stage,
  targetId,
  paddingRatio = 1.2,
  intervalMs = 500,
  absoluteMaxScale = 1.01,
  searchNearestRect = true, // 默认开启：寻找最近的矩形状态块
  maxSearchDist = 60, // 寻找矩形的半径范围（像素）
) {
  if (!stage || stage.getClassName() !== "Stage" || !targetId) {
    console.error("未提供有效的 Konva Stage 实例或 targetId。");
    return [];
  }
  const FLASH_ANIMATION_PROP = "konvaFlashAnimation";
  // --- 1. 停止旧动画并恢复初始状态 ---
  stage.find("Group, Line, Rect, Ellipse, Path, Text").forEach((shape) => {
    const oldAnim = shape.getAttr(FLASH_ANIMATION_PROP);
    if (oldAnim) {
      if (oldAnim.isRunning()) oldAnim.stop();
      shape.setAttr(FLASH_ANIMATION_PROP, null);
    }
    shape.opacity(1);
  });
  // --- 2. 解析传入的 ID ---
  const targetIds = Array.isArray(targetId)
    ? targetId.map((id) => String(id).trim())
    : String(targetId)
        .split(",")
        .map((id) => String(id).trim());
  const validTargetIds = targetIds.filter(Boolean);
  if (validTargetIds.length === 0) return [];
  // --- 3. 查找原始目标节点 ---
  const allShapes = stage.find("Group, Line, Rect, Ellipse, Path, Text");
  let allFoundShapes = allShapes.filter((shape) => {
    const shapeId = shape.id();
    if (!shapeId) return false;
    return validTargetIds.includes(String(shapeId));
  });
  if (allFoundShapes.length === 0) {
    console.warn(`未找到与 id: ${validTargetIds.join(", ")} 关联的节点/线路。`);
    return [];
  }
  // --- 4. 🌟 核心新增：自动寻找最近的 Rect ---
  if (searchNearestRect) {
    const additionalRects = [];
    // 获取所有的矩形，排除掉那些仅仅是文字背景的矩形（由 dealText 创建的）
    const allRects = stage
      .find("Rect")
      .filter((r) => r.name() !== "textBackground");
    allFoundShapes.forEach((target) => {
      const tBox = target.getClientRect();
      const tCenter = {
        x: tBox.x + tBox.width / 2,
        y: tBox.y + tBox.height / 2,
      };
      let minBoxDist = Infinity;
      let closestRect = null;
      allRects.forEach((rect) => {
        // 如果 target 本身就是这个 Rect，跳过
        if (rect === target) return;
        const rBox = rect.getClientRect();
        const rCenter = {
          x: rBox.x + rBox.width / 2,
          y: rBox.y + rBox.height / 2,
        };
        // 计算距离
        const dist = Math.sqrt(
          Math.pow(tCenter.x - rCenter.x, 2) +
            Math.pow(tCenter.y - rCenter.y, 2),
        );
        if (dist < minBoxDist && dist <= maxSearchDist) {
          minBoxDist = dist;
          closestRect = rect;
        }
      });
      if (closestRect && !allFoundShapes.includes(closestRect)) {
        additionalRects.push(closestRect);
      }
    });
    // 合并查找到的 Rect 进闪烁队列
    allFoundShapes = [...allFoundShapes, ...additionalRects];
  }
  // --- 5. 边界计算（包含新找到的 Rect） ---
  let minX = Infinity,
    minY = Infinity,
    maxX = -Infinity,
    maxY = -Infinity;
  allFoundShapes.forEach((shape) => {
    const rect = shape.getClientRect({ relativeTo: stage });
    minX = Math.min(minX, rect.x);
    minY = Math.min(minY, rect.y);
    maxX = Math.max(maxX, rect.x + rect.width);
    maxY = Math.max(maxY, rect.y + rect.height);
  });
  const bboxWidth = Math.max(1, maxX - minX);
  const bboxHeight = Math.max(1, maxY - minY);
  const bboxCenterX = minX + bboxWidth / 2;
  const bboxCenterY = minY + bboxHeight / 2;
  const stageWidth = stage.width();
  const stageHeight = stage.height();
  const scaleX = stageWidth / (bboxWidth * paddingRatio);
  const scaleY = stageHeight / (bboxHeight * paddingRatio);
  let newScale = Math.min(scaleX, scaleY);
  newScale = Math.min(Math.max(newScale, 0.1), absoluteMaxScale);
  const newStageX = stageWidth / 2 - bboxCenterX * newScale;
  const newStageY = stageHeight / 2 - bboxCenterY * newScale;
  // --- 6. 闪烁动画函数 ---
  function startFlashing(shape) {
    const oldAnim = shape.getAttr(FLASH_ANIMATION_PROP);
    if (oldAnim && oldAnim.isRunning()) oldAnim.stop();
    let lastToggleTime = 0;
    let isVisible = true;
    const anim = new Konva.Animation((frame) => {
      if (!frame) return;
      if (frame.time - lastToggleTime > intervalMs) {
        isVisible = !isVisible;
        shape.opacity(isVisible ? 1 : 0);
        lastToggleTime = frame.time;
      }
    }, shape.getLayer());
    shape.setAttr(FLASH_ANIMATION_PROP, anim);
    anim.start();
  }
  // --- 7. 执行平滑转换 (Tween) ---
  new Konva.Tween({
    node: stage,
    duration: 0.8,
    x: newStageX,
    y: newStageY,
    scaleX: newScale,
    scaleY: newScale,
    easing: Konva.Easings.EaseInOut,
    onFinish: () => {
      allFoundShapes.forEach(startFlashing);
      stage.batchDraw();
    },
  }).play();
  return allFoundShapes;
}
/**
 * ========================================================================
 * 函数名称：batchUpdatePowerStatus
 * 功能描述：批量更新电力图元颜色状态。
 * 解决痛点：强制刷新属性，确保所有匹配到的节点同步变色。
 * ========================================================================
 */
export function batchUpdatePowerStatus(stage, statusList, maxSearchDist = 60) {
  if (!stage || !Array.isArray(statusList)) {
    return;
  }
  const affectedLayers = new Set();
  const DEFAULT_BLUE = "#0000ff"; // 默认/分
  const ACTIVE_WHITE = "#ffffff"; // 合
  // 1. 获取所有候选 Rect
  const allRects = stage
    .find("Rect")
    .filter((r) => r.name() !== "textBackground");
  // 2. 【全量初始化】先将所有状态块重置为蓝色
  allRects.forEach((rect) => {
    // 关键：清除可能存在的缓存，并强制设置属性
    if (rect.isCached()) rect.clearCache();
    rect.setAttrs({
      fill: DEFAULT_BLUE,
      opacity: 1,
      visible: true,
      fillEnabled: true,
    });
    const layer = rect.getLayer();
    if (layer) affectedLayers.add(layer);
  });
  // 3. 获取所有可能的节点（用于匹配 jsonId）
  const allShapes = stage.find("Group, Line, Rect, Ellipse, Path, Text");
  // 4. 【精准覆盖】
  statusList.forEach((item) => {
    const { jsonId, statusDesc } = item;
    if (!jsonId) return;
    // 查找目标节点
    const targetNode = allShapes.find((shape) => {
      const shapeId = shape.id();
      return shapeId && String(shapeId) === String(jsonId).trim();
    });
    if (!targetNode) return;
    // 空间搜索最近的矩形
    const tBox = targetNode.getClientRect();
    const tCenter = {
      x: tBox.x + tBox.width / 2,
      y: tBox.y + tBox.height / 2,
    };
    let minBoxDist = Infinity;
    let closestRect = null;
    allRects.forEach((rect) => {
      if (rect === targetNode) return;
      const rBox = rect.getClientRect();
      const rCenter = {
        x: rBox.x + rBox.width / 2,
        y: rBox.y + rBox.height / 2,
      };
      const dist = Math.sqrt(
        Math.pow(tCenter.x - rCenter.x, 2) + Math.pow(tCenter.y - rCenter.y, 2),
      );
      if (dist < minBoxDist && dist <= maxSearchDist) {
        minBoxDist = dist;
        closestRect = rect;
      }
    });
    // 5. 应用状态颜色并强制刷新
    if (closestRect) {
      const targetColor = statusDesc === "合" ? ACTIVE_WHITE : DEFAULT_BLUE;
      // 使用 setAttrs 确保属性被引擎检测到变更
      closestRect.setAttrs({
        fill: targetColor,
        fillEnabled: true,
      });
      // 额外保险：如果之前有动画残留，强制停止
      const FLASH_ANIMATION_PROP = "konvaFlashAnimation";
      const oldAnim = closestRect.getAttr(FLASH_ANIMATION_PROP);
      if (oldAnim && oldAnim.isRunning()) {
        // 如果正在闪烁，我们通常保持不透明度为 1
        closestRect.opacity(1);
      }
      const layer = closestRect.getLayer();
      if (layer) affectedLayers.add(layer);
    }
  });
  // 6. 最终重绘
  affectedLayers.forEach((layer) => {
    layer.batchDraw();
  });
}
