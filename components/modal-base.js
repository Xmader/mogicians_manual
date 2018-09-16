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
        <div class="modal" :class="{ show: show }" :style="{'display': show ? 'block' : 'none', 'padding-right': $_getScrollbarWidth() + 'px' }" tabindex="-1" :aria-hidden="show ? null : true" role="dialog" id="modal" @click.self="hide()">
            <div class="modal-dialog" role="document">
                <div class="modal-content">
                    <div class="modal-header">
                        <h5 class="modal-title" id="m_title">{{title}}</h5>
                        <button type="button" class="close" aria-label="Close" @click="hide()">
                            <span aria-hidden="true">&times;</span>
                        </button>
                    </div>
                    <div class="modal-body" :style="modal_body_style" v-if="show">
                        <p id="m_body" v-html="body" v-if="type == 0"></p>
                        <img v-else-if="get_sub_page_name() == 'dou'" :src="src" alt="   图片加载中, 请稍后..." class="modal_media" />
                        <video v-else v-show="!full_screen" :muted="full_screen" ref="video" :src="src" class="modal_media" preload="auto" controls></video>
                    </div>
                    <div class="modal-footer">
                        <button v-if="type == 1 && get_sub_page_name() != 'dou' && (typeof _cordova == 'undefined')" type="button" class="btn btn-primary" @click="full_screen_video()" id="full_screen_video">网页内全屏视频</button>
                        <a v-if="type == 1" :href="src" target="_blank" class="btn btn-primary download_video" download>下载{{get_sub_page_name() == "dou" ? "图片" : "视频"}}</a>
                        <button type="button" class="btn btn-secondary" @click="hide()">关闭</button>
                    </div>
                </div>
            </div>
        </div>

        <template v-if="get_sub_page_name() == 'videos' && show">
            <video v-show="full_screen" :src="src" ref="video_full_screen" class="modal_media full_screen_video" preload="auto" controls></video>
            <button v-if="full_screen" type="button" class="btn btn-primary" @click="exit_full_screen_video()" id="exit_full_screen_video">退出网页内全屏</button>
        </template>
        
        <div class="modal-backdrop show" v-if="show"></div>
    </div>
    `,
    data: () => ({
        show: false,
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
    watch: {
        show: function ($_show) {
            var classList = document.body.classList
            var body_style = document.body.style
            var bottom_nav_style = document.getElementById("bottom-nav").style

            if ($_show) {
                body_style["padding-right"] = bottom_nav_style["padding-right"] = this.$_getScrollbarWidth() + "px"
                classList.add("modal-open")
            } else {
                body_style["padding-right"] = bottom_nav_style["padding-right"] = ""
                classList.remove("modal-open")
            }
        },
        full_screen: function(full_screen){
            var refs = this.$refs
            var v0 = full_screen ? refs.video_full_screen : refs.video
            var v1 = full_screen ? refs.video : refs.video_full_screen
                
            v0.currentTime = v1.currentTime
            !v1.paused && v0.play()
            v1.pause()
        }
    },
    methods: {
        $_getScrollbarWidth: () => { // 获取滚动条宽度
            var scrollDiv = document.createElement('div');
            scrollDiv.className = 'modal-scrollbar-measure';
            document.body.appendChild(scrollDiv);
            var scrollbarWidth = scrollDiv.getBoundingClientRect().width - scrollDiv.clientWidth;
            document.body.removeChild(scrollDiv);
            return scrollbarWidth;
        },
        get_sub_page_name: () => location.hash.slice(2) || "shuo",
        hide: function () { this.show = false },
        init_video_img_modal: function (src, title) { // 初始化视频、图片对话框 (type==1)
            return () => Object.assign(this, {
                show: true,
                type: 1,
                title,
                src,
                full_screen: false
            })
        },
        init_text_modal: function (content, title) { // 初始化文字对话框 (type==0)
            return () => Object.assign(this, {
                show: true,
                type: 0,
                title: title,
                body: "<p>" + content.replace(/\n/g, "</p><p>")
            })
        },
        full_screen_video: function () { // 网页内全屏视频
            this.full_screen = true
        },
        exit_full_screen_video: function () { // 退出网页内全屏视频
            this.full_screen = false
        },

    }
})
