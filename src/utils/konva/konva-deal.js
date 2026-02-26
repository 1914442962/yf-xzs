import Konva from "konva";
/**
 * ========================================================================
 * 函数名称：toggleGroupsDraggable
 * 功能描述：批量控制画布中所有 Group 的拖拽属性与交互状态
 * * 核心逻辑：
 * 1. 范围限定：仅检索 'Group' 类型节点（符合 lineGroup, nodeGroup, textGroup 规范）。
 * 2. 状态切换：通过 isEnabled 参数统一开启或关闭 draggable。
 * 3. 性能优化：使用 batchDraw 确保大规模图元状态更新后画布平滑重绘。
 * 4. 交互隔离：当禁用拖拽时，可选关闭 listening 以彻底封印内部 Shapes 的事件。
 * ========================================================================
 * @param {Konva.Stage} stage - Konva Stage 实例
 * @param {boolean} isEnabled - 是否允许拖拽 (true: 编辑模式, false: 纯视图模式)
 */
export function toggleGroupsDraggable(stage, isEnabled = true) {
  // 1. 仅查找所有 Group 节点
  const groups = stage.find("Group");
  groups.forEach((group) => {
    // 2. 设置拖拽状态
    group.draggable(isEnabled);
    // 3. 进阶处理：如果处于“视图模式”，通常也需要关闭事件监听
    // 这样鼠标经过线段时，之前 dealLine 里的 hover 变色效果也会同步失效
    group.listening(isEnabled);
    // 如果你希望在只读模式下仍然保留 Hover 提示，只需保留 listening(true)
    // 仅修改 group.draggable(isEnabled) 即可
  });
  // 4. 舞台始终保持可拖拽，以便用户平移查看大图
  stage.draggable(true);
  // 5. 触发重绘
  stage.batchDraw();
  console.log(`[交互控制] 所有 Group 拖拽状态已设为: ${isEnabled}`);
}
/**
 * 自动设置 Konva Stage 的宽度和高度，使其占满其父容器，
 * 并绑定 window resize 事件，确保 Stage 始终响应容器大小变化。
 * * @param {Konva.Stage} stage - Konva Stage 实例。
 * @returns {void}
 */
export function syncStageSizeToContainer(stage) {
  // 1. 定义核心尺寸同步逻辑
  const updateSize = () => {
    // 获取 Stage 的 DOM 容器 (通常是 Stage.container() 的父节点)
    const container = stage.container().parentNode;
    if (!container) {
      console.error("Konva Stage 容器的父节点未找到。无法同步尺寸。");
      // 如果容器丢失，移除监听器以避免错误
      window.removeEventListener("resize", updateSize);
      return;
    }
    // 2. 获取容器的实际宽高
    const containerWidth = container.offsetWidth;
    const containerHeight = container.offsetHeight;
    // 3. 仅在尺寸有变化时才进行更新，以优化性能
    if (
      stage.width() !== containerWidth ||
      stage.height() !== containerHeight
    ) {
      stage.width(containerWidth);
      stage.height(containerHeight);
      stage.batchDraw(); // 强制重绘以应用新的尺寸
      console.log(`Stage 尺寸已更新: ${containerWidth}x${containerHeight}`);
    }
  };
  // **初始调用**：确保 Stage 在函数被调用时立即拥有正确的尺寸
  updateSize();
  // **绑定 resize 事件**：当窗口大小变化时自动调用 updateSize
  // 注意：为避免重复绑定，你可能需要在组件卸载时移除此监听器。
  window.addEventListener("resize", updateSize);
}
/**
 * 设置 Konva Stage 的滚轮缩放事件监听器。
 * 实现了以鼠标指针为中心的缩放（Zoom-to-Mouse）。
 *
 * @param {Konva.Stage} stage - Konva Stage 实例。
 * @returns {void}
 */
export function wheelHandler(stage) {
  const targetFontSize = 80;
  const thresholdFontSize = 70;
  // 使用 '.Text' 选择器查找 Stage 中所有 Konva.Text 节点
  const textNodes = stage.find("Text");
  let needsRedraw = false;
  textNodes.forEach((textNode) => {
    // 使用 textNode.fontSize() 获取当前的字体大小
    const currentFontSize = textNode.fontSize();
    if (currentFontSize > thresholdFontSize) {
      // 设置新的字体大小
      textNode.fontSize(targetFontSize);
      needsRedraw = true;
    }
  });
  // 如果有任何节点被修改，重新绘制 Stage，使更改生效
  if (needsRedraw) {
    // 最好找到 Text 节点所在的 Layer 进行局部绘制，提高性能
    // 但为了简单和确保所有更改生效，我们可以在 Stage 上遍历 Layer 进行绘制
    stage.getLayers().forEach((layer) => {
      layer.batchDraw();
    });
    // 或者简单粗暴地重绘所有
    // stage.draw();
  }
  let scaleBy = 1.1;
  stage.on("wheel", (e) => {
    e.evt.preventDefault();
    const oldScale = stage.scaleX();
    const pointer = stage.getPointerPosition();
    const mousePointTo = {
      x: (pointer.x - stage.x()) / oldScale,
      y: (pointer.y - stage.y()) / oldScale,
    };
    const direction = e.evt.deltaY > 0 ? -1 : 1;
    const newScale = direction > 0 ? oldScale * scaleBy : oldScale / scaleBy;
    stage.scale({ x: newScale, y: newScale });
    const newPos = {
      x: pointer.x - mousePointTo.x * newScale,
      y: pointer.y - mousePointTo.y * newScale,
    };
    stage.position(newPos);
    stage.batchDraw();
  });
}
/**
 * 物理清理并精准适配视图
 */
export function fitAllNodesToView(stage) {
  const MARGIN_RATIO = 0.05;
  const SAFE_ZONE = 1 - MARGIN_RATIO * 2;
  // 1. 物理移除所有非业务干扰（Transformer 和辅助层）
  // 2. 获取纯净业务内容的边界 (skipTransform 确保拿到不受当前缩放影响的原始坐标)
  const box = stage.getClientRect({
    skipTransform: true,
    skipShadow: true,
  });
  // 安全检查：如果没有任何内容，重置位置并返回
  if (!box || box.width === 0 || box.height === 0) {
    stage.position({ x: 0, y: 0 });
    stage.scale({ x: 1, y: 1 });
    stage.batchDraw();
    return;
  }
  const stageWidth = stage.width();
  const stageHeight = stage.height();
  // 3. 计算自适应缩放比例
  const scaleX = (stageWidth * SAFE_ZONE) / box.width;
  const scaleY = (stageHeight * SAFE_ZONE) / box.height;
  const fitScale = Math.min(scaleX, scaleY);
  // 4. 精准居中平移公式
  // newPos = 舞台中心 - (内容原始中心 * 缩放比例)
  const contentCenterX = box.x + box.width / 2;
  const newStageX = stageWidth / 2 - contentCenterX * fitScale;
  // 顶部对齐 + 留白
  const topMargin = stageHeight * MARGIN_RATIO;
  const newStageY = topMargin - box.y * fitScale;
  // 5. 应用最终参数
  stage.setAttrs({
    scaleX: fitScale,
    scaleY: fitScale,
    x: newStageX,
    y: newStageY,
  });
  stage.batchDraw();
}
