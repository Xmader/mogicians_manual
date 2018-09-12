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
            <a class="nav-link" :href="'#/'+id" :id="id">
                <i :class="['fa','fa-'+icon]" aria-hidden="true"></i> &nbsp;{{name}}
            </a>
        </li>
    `,
})

Vue.component('bottom-nav', {
    data: () => ({
        "bottom_nav": ["nav", "nav-pills", "nav-fill", "bottom-nav"],
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
            <nav-item v-bind="nav" v-for="nav of navs"></nav-item>
        </ul>
    `
})