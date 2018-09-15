/*!
 * 膜法指南 网页版
 * https://xmader.github.io/mogicians_manual/
 * 
 * Copyright (c) 2018 Xmader
 * Released under the MIT license
 * 
 * modal-base.js - 模态框(对话框)Vue组件
 * 
*/

Vue.component('modal-base', {
    template: `
        <div class="modal" tabindex="-1" role="dialog" id="modal">
            <div class="modal-dialog" role="document">
                <div class="modal-content">
                    <div class="modal-header">
                        <h5 class="modal-title" id="m_title">{{title}}</h5>
                        <button type="button" class="close" data-dismiss="modal" aria-label="Close" @click="hide()">
                            <span aria-hidden="true">&times;</span>
                        </button>
                    </div>
                    <div class="modal-body" :style="modal_body_style">
                        <p id="m_body" v-html="body"></p>
                    </div>
                    <div class="modal-footer">
                        <button v-if="type == 1 && get_sub_page_name() != 'dou' && (typeof _cordova == 'undefined')" type="button" class="btn btn-primary" @click="full_screen_video()" id="full_screen_video">网页内全屏视频</button>
                        <button type="button" class="btn btn-secondary" data-dismiss="modal" @click="hide()">关闭</button>
                    </div>
                </div>
            </div>
        </div>
    `,
    data: () => ({
        type: 0,
        title: "",
        body: ""
    }),
    computed: {
        modal_body_style: function () {
            return ({
                padding: (this.type == 0) ? "20px 24px 0px" : "20px 0px"
            })
        }
    },
    methods: {
        get_sub_page_name: () => location.hash.slice(2) || "shuo",
        hide: () => $('#modal').modal('hide'),
        full_screen_video: () => { // 网页内全屏视频
            $("#modal").after($(".modal_media"))
            $(".modal_media")
                .addClass("full_screen_video")
                .after(`<button type="button" class="btn btn-primary" onclick="modal_base.exit_full_screen_video()" id="exit_full_screen_video">退出网页内全屏</button>`)
        },
        exit_full_screen_video: () => { // 退出网页内全屏视频
            $("#exit_full_screen_video").remove()
            $(".modal_media").removeClass("full_screen_video")
            $("#m_body").append($(".modal_media"))
        },
        
    }
})
