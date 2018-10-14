/*!
 * 膜法指南 网页版
 * https://mogicians-manual.github.io/
 * 
 * Copyright (c) 2018 Xmader
 * Released under the MIT license
 * 
 * Source Code: https://github.com/Xmader/mogicians_manual/
 * 
*/

// const Vue = require("vue/dist/vue.js")
import Vue from 'vue/dist/vue.runtime.esm'
import components from './components/components.js'
import make_get_request from "./make_request.js"

import copyright_info from "./copyright_info.js"
console.info(copyright_info)

const offline = !(typeof window._offline == "undefined")

const vm = new Vue({
    el: '#app',
    components,
    render: function (h) {
        return (
            <main>
                <top-nav ref="top_nav"></top-nav>

                <div class="container">
                    <card-deck ref="card_deck"></card-deck>
                </div>

                <bottom-nav ref="bottom_nav"></bottom-nav>

                <modal-base ref="modal_base"></modal-base>
            </main>
        )
    },
    provide: function () {
        return {
            offline: offline
        }
    },
    mounted: function () { this.init() },
    methods: {
        get_sub_page_name: () => location.hash.slice(2) || "shuo", // 获取当前的子页面名
        json_callback: function (text, url) {
            if (typeof text != "string") {
                text = JSON.stringify(text)
            }
            else if (text.trim().indexOf("json_callback(") == 0) {
                text = text.trim().replace("json_callback(", "").slice(0, -1)
            }

            const sub_page_name = url.match(/(\w+)\.json/)[1];
            if (url) sessionStorage && sessionStorage.setItem(sub_page_name, text); // 保存获取的资源到sessionStorage, 加快下一次访问此子页面的加载速度, 优化性能
            if (this.get_sub_page_name() != sub_page_name) {
                location.hash = "#/" + sub_page_name
                this.$refs.bottom_nav.Active(sub_page_name)
            }

            this.$refs.card_deck.json_callback(text)
        },
        init: function () { // 初始化页面
            // 获取当前的子页面名
            var sub_page_name = this.get_sub_page_name()
            var json_callback = this.json_callback

            // 清空内容并显示加载中画面
            this.$refs.card_deck.cards = [
                {
                    header: "加载中, 请稍后...",
                    items: []
                }
            ]

            if (sessionStorage && sessionStorage.getItem(sub_page_name)) { // 从sessionStorage获取资源, 避免多次重复读取资源文件拖慢加载速度
                var text = sessionStorage.getItem(sub_page_name);
                this.$refs.card_deck.json_callback(text)
            }
            else {
                // 获取资源文件
                if (offline) {
                    // 强行解决Firefox中不能访问本地资源的问题, 不保证长期有效
                    const json_element = document.createElement("script")
                    json_element.src = `resource/${sub_page_name}.json?callback=json_callback`
                    json_element.onload = (e) => e.target.remove()
                    json_element.onerror = (e) => { e.target.remove(); console.error('获取资源文件失败!') }
                    document.getElementsByTagName("body")[0].appendChild(json_element)
                }
                else {
                    make_get_request("https://raw.githubusercontent.com/Xmader/mogicians_manual/offline/resource/" + sub_page_name + ".json", json_callback, '获取资源失败!\n')
                }
            }
        }
    }
})

// 暴露出json_callback函数
window.json_callback = vm.json_callback

// hash改变时自动重新初始化页面
window.onhashchange = () => vm.init()
