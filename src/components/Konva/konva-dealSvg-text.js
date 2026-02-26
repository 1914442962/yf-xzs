
/**
 * 专门处理 SVG 文档中的文本标签，并将其绘制到 Konva 舞台上。
 * @param {Document} doc - 解析后的 SVG 文档对象
 * @returns {*[]} - 包含图层和文本标签数据的对象
 */
export function dealText(doc) {


    const labels = [];

    // 定义常量颜色 (已标准化为不带空格的 rgb(r,g,b) 格式)
    const TARGET_COLOR_GREEN = 'rgb(0,255,0)';
    const TARGET_COLOR_ORANGE_YELLOW = 'rgb(255,191,0)';
    const TARGET_COLOR_BRIGHT_YELLOW = 'rgb(255,255,51)';
    const TARGET_COLOR_LIGHT_ORANGE = 'rgb(255,204,0)'; // <--- 新增目标颜色

    // 垂直校正因子 (基线对齐)
    const V_CORRECTION_FACTOR = 0.4;






    // ========== 解析文本标签 ==========
    const textElements = doc.querySelectorAll('g#node-container > text');

    textElements.forEach((textEl, idx) => {
        const x = parseFloat(textEl.getAttribute("x")) || 0;
        const y = parseFloat(textEl.getAttribute("y")) || 0;
        const width = parseFloat(textEl.getAttribute("width")) || 0;
        const height = parseFloat(textEl.getAttribute("height")) || 0;
        const styleString = textEl.getAttribute("style");
        const transformString = textEl.getAttribute("transform");
        const originalFill = textEl.getAttribute("fill");
        const originalStyleFill = parseStyle(styleString, 'fill');

        let color = originalStyleFill || originalFill;
        const normalizedOriginalColor = normalizeColor(color); // <-- 标准化颜色

        // 移除 TARGET_COLOR_GREEN 的标签
        if (normalizedOriginalColor === TARGET_COLOR_GREEN) {
            return;
        }

        const fontSize = parseStyle(styleString, 'font-size') || textEl.getAttribute('font-size');
        const parsedFontSize = parseFloat(fontSize) || 12;
        const rotation = parseRotation(transformString);
        const textAnchor = parseStyle(styleString, 'text-anchor');

        let textContent = '';
        let lineHeight = parsedFontSize;
        const tspans = textEl.querySelectorAll('tspan');
        if (tspans.length > 0) {
            const lines = [];
            let firstDy = 0;
            tspans.forEach((tspan, lineIdx) => {
                lines.push(tspan.textContent.trim());
                const dy = parseFloat(tspan.getAttribute('dy'));
                if (lineIdx === 0) {
                    firstDy = dy;
                } else if (!isNaN(dy) && dy > 0 && dy !== firstDy) {
                    lineHeight = dy;
                }
            });
            textContent = lines.join('\n');
        } else {
            textContent = textEl.textContent.trim();
        }

        let finalColor = color || 'black';
        let hasBorder = false;

        // --- 颜色转换逻辑 ---

        if (normalizedOriginalColor === TARGET_COLOR_ORANGE_YELLOW) {
            finalColor = 'black';
            hasBorder = true;
        }
        else if (normalizedOriginalColor === TARGET_COLOR_LIGHT_ORANGE) { // <--- 处理新增的颜色
            finalColor = 'black';
        }
        else if (normalizedOriginalColor === TARGET_COLOR_BRIGHT_YELLOW || normalizedOriginalColor === '#ffff33') {
            finalColor = '#FF3333';
        }
        else if (normalizedOriginalColor === 'rgb(255,255,255)' || normalizedOriginalColor === '#ffffff' || normalizedOriginalColor === 'white') {
            finalColor = 'black';
        }
        // ------------------

        // 创建 Konva.Group
        const shape = createLabelGroup(
            x, y, textContent,
            finalColor, fontSize,
            rotation, textAnchor,
            hasBorder, lineHeight,
            width,height
        );

        labels.push(shape);
    });

    return labels;

    /**
     * 创建 Konva 文本 Group，将所有交互属性应用到 Group 上。
     * ... (createLabelGroup 函数保持不变) ...
     */
    function createLabelGroup(x, y, text, color, fontSize, rotation, anchor, hasBorder, lineHeight,width,height) {
        const parsedFontSize = parseFloat(fontSize) || 12;
        const padding = hasBorder ? 5 : 0;
        const strokeWidth = hasBorder ? 2 : 0;

        const konvaAlign = anchor === 'middle' ? 'center' : (anchor === 'end' ? 'right' : 'left');

        // 1. 创建 Konva.Text 实例 (不带 rotation/offset)
        let konvaText = {
            x: 0, // 文本的内部 X 坐标
            y: 0,
            text,
            fontSize: parsedFontSize,
            fill: color || 'black',
            lineHeight: lineHeight / parsedFontSize,
            align: konvaAlign,
            draggable: true,
            type: 'text'
        };

        // // 2. 尺寸
        // const { width: textWidth, height: textHeight } = konvaText.getSelfRect();
        //
        // // 3. 计算 Group 的偏移量 (锚点)
        let offsetX = 0;
        let rectX = 0;
        let textX = 0;
        //
        // // 水平偏移量 (用于 Group 的 offsetX)
        if (anchor === 'middle') {
            offsetX = width / 2 + padding;
            rectX = -(width / 2 + padding);
            textX = 0;
        } else if (anchor === 'end') {
            offsetX = width + padding; // 调整为更合理的偏移量
            rectX = -(width + padding); // 调整背景矩形的 x
            textX = 0;
        } else { // text-anchor: start
            offsetX = padding;
            rectX = -padding;
            textX = 0;
        }

        // 垂直偏移量 (用于 Group 的 offsetY)
        const baselineOffset = parsedFontSize * V_CORRECTION_FACTOR;
        const offsetY = baselineOffset + padding;
        //
        // // Konva Text 内部偏移量：使文本基线位于 Group 锚点 (0, 0) 处
        konvaText.offsetY = baselineOffset;
        // konvaText.offsetY(baselineOffset);
        // konvaText.x(textX);

        // 4. 创建 Group 容器，应用所有交互和定位属性
        const group = {
            x,
            y,
            rotation, // 旋转应用到 Group
            offsetX,
            offsetY,
            listening: true,
            name: 'selectable-shape', // 统一名称，用于选择功能
            draggable: true,// 可拖拽
            children: []
        };

        // 5. 背景矩形 (定位基于 Group 锚点)
        if (hasBorder) {
            const backgroundRect = {
                x: rectX, // 相对 Group 锚点的 X 坐标
                y: -(baselineOffset + padding), // 相对 Group 锚点的 Y 坐标
                width: width + 10,
                height: height + 10,
                fill: 'white',
                stroke: '#87CEEB',
                strokeWidth: strokeWidth,
                listening: false, // 背景不参与交互
                type: 'rect',
            };
            group.children.push(backgroundRect);
        }
        group.children.push(konvaText);
        return group;
    }

    /**
     * 辅助函数：从 CSS style 字符串中提取指定的属性值
     */
    function parseStyle(styleString, propertyName) {
        if (!styleString) return null;
        const regex = new RegExp(`${propertyName}\\s*:\\s*([^;]+)`, 'i');
        const match = styleString.match(regex);
        if (match && match[1]) {
            return match[1].trim().toLowerCase().replace(/['"]/g, '');
        }
        return null;
    }

    /**
     * 辅助函数：从 transform 属性中提取旋转角度
     */
    function parseRotation(transformString) {
        if (!transformString) return 0;
        const regex = /rotate\(([^)\s]+)/;
        const match = transformString.match(regex);
        return match ? parseFloat(match[1]) : 0;
    }

    /**
     * 辅助函数：将颜色字符串转换为标准格式进行比较
     * 注意：会将 RGB 转换为 'rgb(r,g,b)' 格式，并去除空格
     */
    function normalizeColor(color) {
        if (!color) return '';

        // 1. 处理 HEX 颜色
        if (color.startsWith('#')) {
            return color.toLowerCase();
        }

        // 2. 处理 RGB/RGBA 颜色
        const cleanedColor = color.toLowerCase().replace(/\s/g, '');
        if (cleanedColor.startsWith('rgb(') || cleanedColor.startsWith('rgba(')) {
            return cleanedColor.split('(')[0] + '(' + cleanedColor.split('(')[1].split(')')[0].split(',').map(c => parseInt(c)).join(',') + ')';
        }

        // 3. 其他命名颜色
        return cleanedColor;
    }

}