/*!
 * 膜法指南 网页版
 * https://xmader.github.io/mogicians_manual/
 * 
 * Copyright (c) 2018 Xmader
 * Released under the MIT license
 * 
 * card-deck.js
 * 
*/

Vue.component('card-deck', {
    template: `
        <div id="card-deck">
            <div class="card" v-for="card of cards">
                <div v-html="card"></div>
            </div>
        </div>
    `,
    data: () => ({
        cards:[
            '<h5 class="card-header">加载中, 请稍后...</h5>'
        ]
    }),
    methods: {
    }
})
