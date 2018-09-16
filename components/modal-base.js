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
    <div>
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
                        <a v-if="type == 1" :href="src" target="_blank" class="btn btn-primary download_video" download>下载{{get_sub_page_name() == "dou" ? "图片" : "视频"}}</a>
                        <button type="button" class="btn btn-secondary" data-dismiss="modal" @click="hide()">关闭</button>
                    </div>
                </div>
            </div>
        </div>

        <button v-if="full_screen" type="button" class="btn btn-primary" @click="exit_full_screen_video()" id="exit_full_screen_video">退出网页内全屏</button>
    </div>
    `,
    data: () => ({
        type: 0,
        title: "",
        body: "",
        src: "",
        full_screen: false
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
        init_video_img_modal: function (src, title) { // 初始化视频、图片对话框 (type==1)
            return () => Object.assign(this, {
                type: 1,
                title,
                body: (this.get_sub_page_name() == "dou" ? `<img src="${src}" class="modal_media" />` : `<video src="${src}" class="modal_media" preload="auto" controls></video>`),
                src
            })
        },
        init_text_modal: function (content, title) { // 初始化文字对话框 (type==0)
            return () => Object.assign(this, {
                type: 0,
                title: title,
                body: "<p>" + content.replace(/\n/g, "</p><p>")
            })
        },
        full_screen_video: function () { // 网页内全屏视频
            this.full_screen = true
            $("#modal").after($(".modal_media"))
            $(".modal_media").addClass("full_screen_video")
        },
        exit_full_screen_video: function () { // 退出网页内全屏视频
            this.full_screen = false
            $(".modal_media").removeClass("full_screen_video")
            $("#m_body").append($(".modal_media"))
        },

    }
})
