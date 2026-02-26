/**
 * 处理 SVG 文档中的节点数据，并将其绘制到 Konva 舞台上
 * 支持两种节点类型：TransStation (圆圈) 和 PowerStation (波浪线)
 * * @param {Document} doc - 解析后的 SVG 文档对象
 * @returns {Konva.Layer} - 返回绘制节点的 Konva.Layer
 */
export function dealNode(doc) {


    let nodes = [];


    // ========== 核心解析逻辑 ==========
    // 同时获取 TransStation 和 PowerStation 节点
    const allNodeSvgs = doc.querySelectorAll('g#node-container > svg[nodeType="TransStation"], g#node-container > svg[nodeType="PowerStation"]');
    // 目标 PowerStation 的 xlink:href 列表，用于筛选
    const TARGET_POWER_HREFS = ["#powerPlant_220KV", "#powerPlant_500KV"];
    allNodeSvgs.forEach((svgEl, idx) => {
        const nodeType = svgEl.getAttribute("nodeType");
        const svgX = parseFloat(svgEl.getAttribute("x")) || 0;
        const svgY = parseFloat(svgEl.getAttribute("y")) || 0;
        const width = parseFloat(svgEl.getAttribute("width")) || 0;
        const height = parseFloat(svgEl.getAttribute("height")) || 0;
        const keyid = svgEl.getAttribute("keyid") || `node-${Date.now()}-${idx}`;

        let shape = null;
        let finalX = svgX;
        let finalY = svgY;

        if (nodeType === "TransStation" && svgEl.querySelector("g.lowbus")) {
            // -------------------- TransStation (双层圆圈) --------------------

            // Konva Group 的锚点（x, y）设置为 SVG 的中心点
            finalX = svgX + width / 2;
            finalY = svgY + height / 2;

            // 计算半径：使用 SVG 最小尺寸的 70% 作为圆直径
            const maxDiameter = Math.min(width, height);
            const outerRadius = (maxDiameter * 0.7) / 2;
            const innerRadius = outerRadius * 0.6; // 内圆为外圆的 60%

            shape = createCircleNode(finalX, finalY, innerRadius, outerRadius);

        } else if (nodeType === "PowerStation") {
            // -------------------- PowerStation (框内波浪线) --------------------
            const useEl = svgEl.querySelector('use');
            const href = useEl ? useEl.getAttribute('xlink:href') : null;

            // 筛选条件：必须是目标 HREFS 之一
            if (!TARGET_POWER_HREFS.includes(href)) {
                return; // 跳过不符合条件的 PowerStation
            }

            // 计算图标的统一尺寸：使用 SVG 最小维度
            const iconSize = Math.min(width, height);

            // Konva Group 的锚点（x, y）设置为 SVG 的左上角
            finalX = svgX;
            finalY = svgY;

            shape = createWaveNode(finalX, finalY, iconSize);
        } else {
            // 不处理其他节点类型
            return;
        }

        // 将创建的 Konva 形状添加到图层
        if (shape) {

            nodes.push(shape);
        }
    });

    return nodes; // 返回创建的图层



    /**
     * 创建双层节点（Group: 外层圆环 + 内层实心圆）
     */
    function createCircleNode(x, y, innerRadius, outerRadius) {
        const group = {
            x,
            y,
            name: 'TransStationNode',
            children: []
        };

        // 1. 外层圆 (圆环部分)
        const outerCircle = {
            x: 0, y: 0,
            radius: outerRadius,
            fill: "white",
            stroke: "black",
            strokeWidth: 1,
            name: 'outer-circle',
            type: 'circle'
        };
        group.children.push(outerCircle);

        // 2. 内层圆 (实心点)
        const innerCircle = {
            x: 0, y: 0,
            radius: innerRadius,
            fill: "black",
            strokeWidth: 0,
            name: 'inner-circle',
            type: 'circle'
        };
        group.children.push(innerCircle);

        return group;
    }
    /**
     * 创建框内波浪线图标节点 (更圆润的单个波峰 + 波谷)
     * @param {number} x - 节点左上角 X 坐标
     * @param {number} y - 节点左上角 Y 坐标
     * @param {number} size - 节点宽高
     */
    function createWaveNode(x, y, size) {
        const group = {
            x,
            y,
            width: size,
            height: size,
            name: 'PowerStationWaveIcon',
            children: []
        };

        // 外层矩形框
        const outerRect = {
            x: 0, y: 0,
            width: size,
            height: size,
            fill: "white",
            stroke: "black",
            strokeWidth: 2,
            name: 'outer-rect',
            type: 'rect'
        };
        group.children.push(outerRect);

        // 波浪参数
        const innerPadding = size * 0.15;
        const startX = innerPadding;
        const endX = size - innerPadding;
        const centerY = size / 2;
        const waveAmplitude = size * 0.3; // 振幅
        const midX = (startX + endX) / 2;

        // 控制点偏移比例（越小越圆润）
        const controlOffsetX = (endX - startX) * 0.1;

        // 路径数据
        const pathData = [
            `M ${startX},${centerY}`,
            // 波峰 (上半段)
            `C ${startX + controlOffsetX},${centerY - waveAmplitude}`,
            `${midX - controlOffsetX},${centerY - waveAmplitude}`,
            `${midX},${centerY}`,
            // 波谷 (下半段)
            `C ${midX + controlOffsetX},${centerY + waveAmplitude}`,
            `${endX - controlOffsetX},${centerY + waveAmplitude}`,
            `${endX},${centerY}`
        ].join(' ');

        const wavePath = {
            data: pathData,
            stroke: "black",
            strokeWidth: 2,
            fill: null,
            lineCap: "round",
            lineJoin: "round",
            name: 'wave-path',
            type: 'path'
        };
        group.children.push(wavePath);

        return group;
    }
}