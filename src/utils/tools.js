// import Vue from 'vue'

export function base64ImgToFile (dataurl, filename = 'file') {
    //将base64格式分割：['data:image/png;base64','XXXX']
    const arr = dataurl.split(',')
    // .*？ 表示匹配任意字符到下一个符合条件的字符 刚好匹配到：
    // image/png
    const mime = arr[0].match(/:(.*?);/)[1]  //image/png
    //[image,png] 获取图片类型后缀
    const suffix = mime.split('/')[1] //png
    const bstr = atob(arr[1])   //atob() 方法用于解码使用 base-64 编码的字符串
    let n = bstr.length
    const u8arr = new Uint8Array(n)
    while (n--) {
        u8arr[n] = bstr.charCodeAt(n)
    }
    return new File([u8arr], `${filename}.${suffix}`, {
        type: mime
    })
}

export function parseBase64ToBlob(dataUrl, fileType) {
    const bstr = window.atob(dataUrl)
    let n = bstr.length
    const u8arr = new Uint8Array(n)
    while (n--) {
        u8arr[n] = bstr.charCodeAt(n)
    }
    return new Blob([u8arr], {type: fileType || 'pdf'})
}


//html代码或者parseBase64ToBlob返回的数据
export function downloadFileByBlob(data, fileName, fileSuffix) {
    let fileTypeMime = '' // 文件 mime 类型，移动端必传，否则下载不成功；pc端可传可不传
    switch (fileSuffix) { // 获取后缀对应的 mime
        case 'png': fileTypeMime = 'image/png'; break;
        case 'doc': fileTypeMime = 'application/msword'; break;
        case 'docx': fileTypeMime = 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'; break;
        case 'jpg': case 'jpeg': fileTypeMime = 'image/jpeg'; break;
        case 'gif': fileTypeMime = 'image/gif'; break;
        case 'svg': fileTypeMime = 'image/svg+xml'; break;
        case 'tif': case 'tiff': fileTypeMime = 'image/tiff'; break;
        case 'txt': fileTypeMime = 'text/plain'; break;
        case 'ppt': fileTypeMime = 'application/vnd.ms-powerpoint'; break;
        case 'pptx': fileTypeMime = 'application/vnd.openxmlformats-officedocument.presentationml.presentation'; break;
        case 'xls': fileTypeMime = 'application/vnd.ms-excel'; break;
        case 'xlsx': fileTypeMime = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'; break;
        case 'zip': fileTypeMime = 'application/zip'; break;
        case '7z': fileTypeMime = 'application/x-7z-compressed'; break;
        case 'pdf': fileTypeMime = 'application/pdf;charset-UTF-8'; break;
    }
    let blob = window.URL.createObjectURL(new Blob([data], {
        'type': fileTypeMime
    }))
    let link = document.createElement('a')
    link.style.display = 'none';
    link.href = blob;
    link.setAttribute('download', fileName)
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link) //下载完成移除元素
    window.URL.revokeObjectURL(blob) //释放掉 blob 对象
}
export function downloadFileByUrl(file){
    const a = document.createElement('a')
    a.download = file.name;
    a.href = file.url
    a.click()
    a.remove()
}
export function getBase64(file) {
    return new Promise((resolve, reject) => {
        const reader = new FileReader()
        let fileResult = ''
        reader.readAsDataURL(file)
        // 开始转
        reader.onload = () => {
            fileResult = reader.result
        }
        // 转 失败
        reader.onerror = error => {
            reject(error)
        }
        // 转 结束
        reader.onloadend = () => {
            let arr = fileResult.split(';base64,');
            resolve(arr[1])
        }
    })
}

export function fileToBlobUrl(data, fileSuffix) {
    let fileTypeMime = '' // 文件 mime 类型，移动端必传，否则下载不成功；pc端可传可不传
    switch (fileSuffix) { // 获取后缀对应的 mime
        case 'png': fileTypeMime = 'image/png'; break;
        case 'doc': fileTypeMime = 'application/msword'; break;
        case 'docx': fileTypeMime = 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'; break;
        case 'jpg': case 'jpeg': fileTypeMime = 'image/jpeg'; break;
        case 'gif': fileTypeMime = 'image/gif'; break;
        case 'svg': fileTypeMime = 'image/svg+xml'; break;
        case 'tif': case 'tiff': fileTypeMime = 'image/tiff'; break;
        case 'txt': fileTypeMime = 'text/plain'; break;
        case 'ppt': fileTypeMime = 'application/vnd.ms-powerpoint'; break;
        case 'pptx': fileTypeMime = 'application/vnd.openxmlformats-officedocument.presentationml.presentation'; break;
        case 'xls': fileTypeMime = 'application/vnd.ms-excel'; break;
        case 'xlsx': fileTypeMime = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'; break;
        case 'zip': fileTypeMime = 'application/zip'; break;
        case '7z': fileTypeMime = 'application/x-7z-compressed'; break;
        case 'pdf': fileTypeMime = 'application/pdf;charset-UTF-8'; break;
    }
    return window.URL.createObjectURL(new Blob([data], {
        'type': fileTypeMime
    }))
}

export function fileToBlobBase64(data) {
    return new Promise((resolve,reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(data);
        reader.onload = ()=>{
            const result = reader.result;
            resolve(result)
        }
        reader.onerror = reject
    })
}
