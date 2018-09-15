/*!
 * 膜法指南 网页版
 * https://xmader.github.io/mogicians_manual/
 * 
 * Copyright (c) 2018 Xmader
 * Released under the MIT license
 * 
 * Source Code: https://github.com/Xmader/mogicians_manual/
 * 
*/

var _offline = !(typeof _offline == "undefined")

const init = () => { // 初始化页面
    // 获取当前的子页面名
    var sub_page_name = location.hash.slice(2) || "shuo"

    // 清空内容并显示加载中画面
    vm.$refs.card_deck.cards = [
        {
            header: "加载中, 请稍后...",
            items: []
        }
    ]

    var json_callback = vm.$refs.card_deck.json_callback

    // 获取资源文件
    if (_offline) {
        // 强行解决Firefox中不能访问本地资源的问题, 不保证长期有效
        var json_element = document.createElement("script")
        json_element.src = `resource/${sub_page_name}.json?callback=json_callback`
        document.getElementsByTagName("body")[0].appendChild(json_element)
    }
    else { $.get("https://raw.githubusercontent.com/Xmader/mogicians_manual/offline/resource/" + sub_page_name + ".json", json_callback) }
}

// hash改变时自动重新初始化页面
window.onhashchange = () => init()

// 实现关闭对话框自动结束播放视频
$('#modal').on('hidden.bs.modal', () => { vm.$refs.modal_base.body = " " })
