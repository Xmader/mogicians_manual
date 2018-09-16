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

import Vue from './libs/vue.esm.browser.js'
import components from './components/components.js'
import make_get_request from "./make_request.js"

var offline = !(typeof _offline == "undefined")

var vm = new Vue({
    el: '#app',
    components,
    provide: function () {
        return {
            offline: offline
        }
    }
})

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

    var json_callback = (text) => {
        sessionStorage.setItem(sub_page_name, text); // 保存获取的资源到sessionStorage, 加快下一次访问此子页面的加载速度, 优化性能
        vm.$refs.card_deck.json_callback(text)
    }

    if (sessionStorage.getItem(sub_page_name)) { // 从sessionStorage获取资源, 避免多次重复读取资源文件拖慢加载速度
        var text = sessionStorage.getItem(sub_page_name);
        vm.$refs.card_deck.json_callback(text)
    }
    else {
        // 获取资源文件
        if (offline) {
            // 强行解决Firefox中不能访问本地资源的问题, 不保证长期有效
            var json_element = document.createElement("script")
            json_element.src = `resource/${sub_page_name}.json?callback=json_callback`
            document.getElementsByTagName("body")[0].appendChild(json_element)
        }
        else {
            make_get_request("https://raw.githubusercontent.com/Xmader/mogicians_manual/offline/resource/" + sub_page_name + ".json", json_callback, '获取资源失败!\n')
        }
    }
}

// hash改变时自动重新初始化页面
window.onhashchange = () => init()

init();
