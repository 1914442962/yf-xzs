import {
  dealSvg,
  setupTextEditing,
  setupStencilModule,
  setupGlobalSelection,
  setupContextMenu,
  highlightAndCenterNodesByBoundary,
  batchUpdatePowerStatus,
} from "./konva-dealSvg.js";
import {
  syncStageSizeToContainer,
  toggleGroupsDraggable,
  fitAllNodesToView,
  wheelHandler,
} from "./konva-deal.js";
function setupKonvaEdit(stage, flag, parentId = "KonvaPage") {
  // 1. 基础布局与视图适配
  syncStageSizeToContainer(stage);
  toggleGroupsDraggable(stage);
  // 2. 视图交互逻辑
  fitAllNodesToView(stage);
  wheelHandler(stage);
  if (flag) {
    // 3. 业务插件初始化
    setupTextEditing(stage); // 双击编辑文本
    setupStencilModule(stage, parentId); // 拖拽面板生成
    setupGlobalSelection(stage); // 全局选中系统
    setupContextMenu(stage); // 纯 JS 右键菜单
  }
}
// --- 第三步：统一导出 ---
export {
  // 基础函数
  dealSvg,
  setupTextEditing,
  setupStencilModule,
  setupGlobalSelection,
  setupContextMenu,
  syncStageSizeToContainer,
  toggleGroupsDraggable,
  fitAllNodesToView,
  wheelHandler,
  // 组合入口
  setupKonvaEdit,
  highlightAndCenterNodesByBoundary,
  batchUpdatePowerStatus,
};
