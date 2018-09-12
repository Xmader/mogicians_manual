/*!
 * 膜法指南 网页版
 * https://xmader.github.io/mogicians_manual/
 * 
 * Copyright (c) 2018 Xmader
 * Released under the MIT license
 * 
 * bottom-nav.js - 底部导航条Vue组件
 * 
*/

Vue.component('nav-item', {
    props: ["id", "icon", "name"],
    template: `
        <li class="nav-item">
            <a :class="['nav-link',{ active: isActive }]" :href="'#/'+id" :id="id" @click="active()">
                <i :class="['fa','fa-'+icon]" aria-hidden="true"></i> &nbsp;{{name}}
            </a>
        </li>
    `,
    computed: {
        isActive: function () {
            return (location.hash.slice(2) || "shuo") == this.id
        }
    },
    methods: {
        active: function () {
            // this.isActive = (location.hash.slice(2) || "shuo") == this.id
            // 底部导航条高亮当前子页面
            $(".nav-link").removeClass('active')
            $("#" + this.id).addClass('active')
        }
    }
})

Vue.component('bottom-nav', {
    data: () => ({
        "bottom_nav": ["nav", "nav-pills", "nav-fill", "bottom-nav"],
        "Active_Item": (location.hash.slice(2) || "shuo"),
        "navs": [
            {
                id: "shuo",
                name: "说",
                icon: "microphone"
            },
            {
                id: "xue",
                name: "学",
                icon: "book"
            },
            {
                id: "dou",
                name: "逗",
                icon: "smile-o"
            },
            {
                id: "chang",
                name: "唱",
                icon: "music"
            },
            {
                id: "videos",
                name: "赏",
                icon: "film"
            }
        ]
    }),
    template: `
        <ul :class="bottom_nav" id="bottom-nav">
            <li class="nav-item" v-for="nav of navs">
                <a :class="['nav-link',{ active: Active_Item == nav.id }]" :href="'#/'+nav.id" :id="nav.id" @click="active(nav.id)">
                    <i :class="['fa','fa-'+nav.icon]" aria-hidden="true"></i> &nbsp;{{nav.name}}
                </a>
            </li>
        </ul>
    `,
    methods: {
        active: function (id) {
            this.Active_Item =  id
        }
    }
})