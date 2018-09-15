/*!
 * 膜法指南 网页版
 * https://xmader.github.io/mogicians_manual/
 * 
 * Copyright (c) 2018 Xmader
 * Released under the MIT license
 * 
 * modal-functions.js - 对话框相关的函数
 * 
*/

var modal_base = vm.$refs.modal_base

const init_modal = (i, a) => { // 初始化文字对话框 (type==0)
    var item = json.contents[i].contents[a]
    Object.assign(modal_base, {
        type: 0,
        title: item.title,
        body: "<p>" + item.content.replace(/\n/g, "</p><p>")
    })
}

const init_video_img_modal = (src, title) => { // 初始化视频、图片对话框 (type==1)
    Object.assign(modal_base, {
        type: 1,
        title: title,
        body: (sub_page_name == "dou" ? `<img src="${src}" class="modal_media" />` : `<video src="${src}" class="modal_media" preload="auto" controls></video>`)
    })
    $(".download_video").remove()
    $(".modal-footer").prepend(`<a href="${src}" target="_blank" class="btn btn-primary download_video" download>下载${sub_page_name == "dou" ? "图片" : "视频"}</a>`)
}

// 实现关闭对话框自动结束播放视频
$('#modal').on('hidden.bs.modal', () => {vm.$refs.modal_base.body = " "})

