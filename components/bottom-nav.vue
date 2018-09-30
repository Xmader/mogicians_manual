<!--
/*!
 * 膜法指南 网页版
 * https://mogicians-manual.github.io/
 * 
 * Copyright (c) 2018 Xmader
 * Released under the MIT license
 * 
 * bottom-nav.vue - 底部导航条Vue组件
 * 
*/
-->

<template>
    <ul :class="bottom_nav_classes" id="bottom-nav">
        <li class="nav-item" v-for="nav_item of nav_items" :key="nav_item.id">
            <a :class="['nav-link',{ active: active_item == nav_item.id }]" :href="'#/'+nav_item.id" :id="nav_item.id" @click="Active(nav_item.id)">
                <i :class="['fa','fa-'+nav_item.icon]" aria-hidden="true"></i> &nbsp;{{nav_item.name}}
            </a>
        </li>
    </ul>
</template>

<script>
import "../libs/Object.assign.polyfill.js"

export default {
    data: () => ({
        bottom_nav_classes: ["nav", "nav-pills", "nav-fill", "bottom-nav"],
        active_item: location.hash.slice(2) || "shuo",
        nav_items: [
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
    methods: {
        Active: function (id) {
            this.active_item = id;
        }
    }
};

</script>