let maxWidth = 1920;
let minWidth = 1280;

export function initPx2Rem() {
    document.documentElement.style.fontSize = convertPx(14) + "px";
}

export function convertPx(val) {
    let width = window.innerWidth;
    width = width > maxWidth ? maxWidth : width;
    width = width < minWidth ? minWidth : width;
    val = (width / 1920) * val;
    val = Math.ceil(val)
    return val;
}

export function initPx2RemNotInteger() {
    document.documentElement.style.fontSize = convertPxNotInteger(14) + "px";
}

export function convertPxNotInteger(val) {
    let width = window.innerWidth;
    width = width > maxWidth ? maxWidth : width;
    width = width < minWidth ? minWidth : width;
    val = (width / 1920) * val;
    return val;
}
