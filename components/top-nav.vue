<!--
/*!
 * 膜法指南 网页版
 * https://mogicians-manual.github.io/
 * 
 * Copyright (c) 2018 Xmader
 * Released under the MIT license
 * 
 * top-nav.js - 顶部导航条Vue组件
 * 
*/
-->

<template>
    <nav class="navbar navbar-dark bg-primary top-nav">
        <span class="navbar-brand">
            <i class="fa fa-graduation-cap" aria-hidden="true"></i> 膜法指南
            <small v-if="offline">(离线版)</small>
        </span>

        <div class="search form-inline">
            <i class="fa fa-search" aria-hidden="true" @click="search_toggle()"></i>
            <input v-if="search_open" @keypress.esc="search_open = false; search_keyword = ''" v-model.trim="search_keyword" type="text" class="form-control" :placeholder="'搜索 \''+ sub_page_zh_name +'\''">
        </div>
    </nav>
</template>


<script>
export default {
    inject: ['offline'],
    data: () => ({
        search_open: false,
        sub_page_zh_name: "",
        search_keyword: ""
    }),
    watch: {
        search_keyword: function (keyword) {
            this.$root.$refs.card_deck.search(keyword)
        },
        sub_page_zh_name: function () {
            this.$root.$refs.card_deck.search(this.search_keyword)
        }
    },
    methods: {
        get_sub_page_zh_name: function () {
            var bottom_nav = this.$root.$refs.bottom_nav
            var id = this.$root.get_sub_page_name()
            var name = bottom_nav.nav_items.filter(n => n.id == id)[0].name

            return name
        },
        search_toggle: function () {
            this.search_open = !this.search_open
            this.sub_page_zh_name = this.get_sub_page_zh_name()
            this.search_keyword = ""
        }
    }
}
</script>
