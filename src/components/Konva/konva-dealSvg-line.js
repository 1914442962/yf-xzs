/**
 * 处理 SVG path 数据，将其转换为 Konva.Line 对象，
 * 支持 style 属性，并包含 keyid。
 *
 * @param {Document} doc - 包含 SVG 结构的文档对象。
 * @returns {Array} 包含线条数据和 Konva 形状对象的数组。
 */
export function dealLine(doc) {


    // ------------------------------------
    // ========== 解析线路 ==========
    // ------------------------------------
    const lines = [];
    const paths = doc.querySelectorAll("g.nari_current_container g#link-container path");

    paths.forEach((path) => {
        const d = path.getAttribute("d");
        const styleStr = path.getAttribute("style");
        const keyid = path.getAttribute("keyid"); // <-- 新增：提取 keyid

        const styles = parseStyle(styleStr);
        const pts = parsePathD(d);

        if (pts.length >= 4) {
            for (let i = 0; i < pts.length - 2; i += 2) {
                const shape = createLine(
                    pts[i], pts[i + 1], pts[i + 2], pts[i + 3], styles, keyid // <-- 传递 keyid
                );
                lines.push(shape)
            }
        }
    });

    return lines; // <-- 确保返回 lines 数组



    function parsePathD(d) {
        const cmds = d.trim().split(/(?=[ML])/);
        const points = [];
        cmds.forEach((cmd) => {
            const type = cmd[0];
            const nums = cmd
                .slice(1)
                .trim()
                .split(/[\s,]+/)
                .map(Number);
            if (type === "M" || type === "L") points.push(...nums);
        });
        return points;
    }

    /**
     * 解析 path 的 style 字符串，提取并替换 stroke 和 stroke-width。
     */
    function parseStyle(styleStr) {
        const styles = {
            stroke: "black", // 默认颜色
            strokeWidth: 2,  // 默认线宽
        };

        // 定义颜色映射规则 (使用更亮的 Hex 值)
        const brightRed = "#F04D41";    // 亮红
        const brightPurple = "#9E88E5"; // 亮紫

        const colorMap = {
            "rgb(247,2,2)": "black",
            "rgb(107,131,248)": brightRed,
            "rgb(0,128,183)": brightPurple,
            "#fcff01": brightRed,
        };

        if (!styleStr) return styles;

        styleStr.split(';').forEach(declaration => {
            const [key, value] = declaration.split(':').map(s => s ? s.trim() : '');

            if (key === 'stroke') {
                let originalColor = value.toLowerCase().replace(/[\s;]/g, '');

                if (colorMap[originalColor]) {
                    styles.stroke = colorMap[originalColor];
                } else {
                    styles.stroke = value;
                }
            } else if (key === 'stroke-width') {
                const width = parseFloat(value);
                if (!isNaN(width)) {
                    styles.strokeWidth = width;
                }
            }
        });

        return styles;
    }

    /**
     * 创建 Konva.Line 形状并添加到图层，增加 keyId 属性。
     */
    function createLine(x1, y1, x2, y2, style, keyid) {

        return {
            points: [x1, y1, x2, y2],
            stroke: style.stroke,
            strokeWidth: style.strokeWidth,
            keyId: keyid, // <-- 新增：将 keyid 作为 Konva 属性
            draggable: true,
            name: keyid
        };
    }
}

