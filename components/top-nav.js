/*!
 * 膜法指南 网页版
 * https://xmader.github.io/mogicians_manual/
 * 
 * Copyright (c) 2018 Xmader
 * Released under the MIT license
 * 
 * top-nav.js - 顶部导航条Vue组件
 * 
*/

Vue.component('top-nav', {
    template: `
    <nav class="navbar navbar-dark bg-primary top-nav">
        <span class="navbar-brand">
            <i class="fa fa-graduation-cap" aria-hidden="true"></i> 膜法指南
            <small v-if="offline">(离线版)</small>
        </span>
    </nav>
    `,
    data: () => ({
        offline: false
    }),
    methods: {}
})