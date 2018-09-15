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

// 实现关闭对话框自动结束播放视频
$('#modal').on('hidden.bs.modal', () => { vm.$refs.modal_base.body = " " })

