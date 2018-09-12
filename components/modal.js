/*!
 * 膜法指南 网页版
 * https://xmader.github.io/mogicians_manual/
 * 
 * Copyright (c) 2018 Xmader
 * Released under the MIT license
 * 
 * modal.js - 模态框(对话框)Vue组件
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
    var item = json.contents[i].contents[a]
    $("#m_title").text(item.title)
    $("#m_body").html("<p>" + item.content.replace(/\n/g, "</p><p>"))

    $(".download_video").remove()
    $("#full_screen_video").remove()
    $(".modal-body").css("padding", "20px 24px 0px")
}

const init_video_img_modal = (src, title) => { // 初始化视频、图片对话框 (type==1)
    $("#m_title").text(title)
    $("#m_body").html(t == "dou" ? `<img src="${src}" class="modal_media" />` : `<video src="${src}" class="modal_media" preload="auto" controls></video>`)

    $(".download_video").remove()
    $(".modal-footer").prepend(`<a href="${src}" target="_blank" class="btn btn-primary download_video" download>下载${t == "dou" ? "图片" : "视频"}</a>`)

    $("#full_screen_video").remove()
    if (t != "dou" && (typeof _cordova == "undefined")) { $(".modal-footer").prepend(`<button type="button" class="btn btn-primary" onclick="full_screen_video()" id="full_screen_video">网页内全屏视频</button>`) }

    $(".modal-body").css("padding", "20px 0px")
}

Vue.component('vue-modal', {
    template: `
        <div class="modal" tabindex="-1" role="dialog" id="modal">
            <div class="modal-dialog" role="document">
                <div class="modal-content">
                    <div class="modal-header">
                        <h5 class="modal-title" id="m_title"></h5>
                        <button type="button" class="close" data-dismiss="modal" aria-label="Close" onclick="$('#modal').modal('hide')">
                            <span aria-hidden="true">&times;</span>
                        </button>
                    </div>
                    <div class="modal-body">
                        <p id="m_body"></p>
                    </div>
                    <div class="modal-footer">
                        <button type="button" class="btn btn-secondary" data-dismiss="modal" onclick="$('#modal').modal('hide')">关闭</button>
                    </div>
                </div>
            </div>
        </div>
    `,
    data: () => ({}),
    methods: {
    }
})

// 实现关闭对话框自动结束播放视频
$('#modal').on('hidden.bs.modal', (e) => $("#m_body").html(" "))
