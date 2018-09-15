/*!
 * 膜法指南 网页版
 * https://xmader.github.io/mogicians_manual/
 * 
 * Copyright (c) 2018 Xmader
 * Released under the MIT license
 * 
 * modal-base.js - 模态框(对话框)Vue基础组件
 * 
*/



const full_screen_video = () => { // 网页内全屏视频
    $("#modal").after($(".modal_media"))
    $(".modal_media")
        .addClass("full_screen_video")
        .after(`<button type="button" class="btn btn-primary" onclick="exit_full_screen_video()" id="exit_full_screen_video">退出网页内全屏</button>`)
}

const exit_full_screen_video = () => { // 退出网页内全屏视频
    $("#exit_full_screen_video").remove()
    $(".modal_media").removeClass("full_screen_video")
    $("#m_body").append($(".modal_media"))
}

const init_modal = (i, a) => { // 初始化文字对话框 (type==0)
    var modal_base = vm.$refs.modal_base
    var item = json.contents[i].contents[a]
    modal_base.type = 0
    modal_base.title = item.title
    modal_base.body = "<p>" + item.content.replace(/\n/g, "</p><p>")

}

const init_video_img_modal = (src, title) => { // 初始化视频、图片对话框 (type==1)
    var modal_base = vm.$refs.modal_base
    modal_base.type = 1
    modal_base.title = title
    modal_base.body = (t == "dou" ? `<img src="${src}" class="modal_media" />` : `<video src="${src}" class="modal_media" preload="auto" controls></video>`)

    $(".download_video").remove()
    $(".modal-footer").prepend(`<a href="${src}" target="_blank" class="btn btn-primary download_video" download>下载${t == "dou" ? "图片" : "视频"}</a>`)

    $("#full_screen_video").remove()
    if (t != "dou" && (typeof _cordova == "undefined")) { $(".modal-footer").prepend(`<button type="button" class="btn btn-primary" onclick="full_screen_video()" id="full_screen_video">网页内全屏视频</button>`) }
}

Vue.component('modal-base', {
    // props: {
    //     type: Number
    // },
    template: `
        <div class="modal" tabindex="-1" role="dialog" id="modal">
            <div class="modal-dialog" role="document">
                <div class="modal-content">
                    <div class="modal-header">
                        <h5 class="modal-title" id="m_title">{{title}}</h5>
                        <button type="button" class="close" data-dismiss="modal" aria-label="Close" onclick="$('#modal').modal('hide')">
                            <span aria-hidden="true">&times;</span>
                        </button>
                    </div>
                    <div class="modal-body" :style="modal_body_style">
                        <p id="m_body" v-html="body"></p>
                    </div>
                    <div class="modal-footer">
                        <button type="button" class="btn btn-secondary" data-dismiss="modal" onclick="$('#modal').modal('hide')">关闭</button>
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
    }
})
