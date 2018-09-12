/*!
 * 膜法指南 网页版
 * https://xmader.github.io/mogicians_manual/
 * 
 * Copyright (c) 2018 Xmader
 * Released under the MIT license
 * 
 * Source Code: https://github.com/Xmader/mogicians_manual/
 * 
*/

var _offline = !(typeof _offline == "undefined")
if (_offline) { $(".navbar-brand").append(`<small>(离线版)</small>`) }

const is_Firefox = navigator.userAgent.indexOf("Firefox") > -1

var json, t

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

const json_callback = (data) => { // 解析资源文件，显示内容

    // 清空内容
    $("#card-deck").html("")

    // 解析资源文件为json
    if (typeof data == "string") {
        var data_split = data.split("\n");
        data_split.shift();
        data_split.pop();
        json = JSON.parse(data_split.join("\n"))
    }
    else { json = data }

    // 获取媒体文件的url地址前缀
    if (json["type"] == 1) {
        var url = json["url"]
        if (_offline) { url = url.replace("https://raw.githubusercontent.com/Xmader/mogicians_manual/offline/", "") }
    }

    for (var i = 0; i < json.contents.length; i++) {
        var jc = json.contents[i]
        var items = jc["contents"]

        var item_html = ""

        for (var a = 0; a < items.length; a++) {
            var item = items[a]
            var title = item["title"]

            switch (t) {
                case "chang": {
                    item_html += `<li class="list-group-item grey chang">
                        <span class="audio_title">${title}</span>
                        <a href="${url}${item["filename"]}" target="_blank" class="download_music" download>
                            <i class="fa fa-download" aria-hidden="true"></i>
                        </a>
                        <audio class="audio${is_Firefox ? "_Firefox" : ""}" src="${url}${item["filename"]}" controls></audio>
                    </li>`
                    break;
                }
                default: {
                    var onclick = (t == "dou" || t == "videos") ? `init_video_img_modal('${url}${item["filename"]}','${title}');` : `init_modal('${i}','${a}');`
                    item_html += `<li class="list-group-item">
                        <a data-toggle="modal" href="#/${t}" data-target="#modal" onclick="${onclick}">
                            ${title}
                        </a>
                    </li>`
                }
            }
        }

        var html = `
    <div class="card">
        <h5 class="card-header">${jc["title"]}</h5>
        <ul class="list-group list-group-flush">
            ${item_html}
        </ul>
    </div>`;

        $("#card-deck").append(html);
    }

    if (t == "chang") {
        $(".list-group-item.chang").css("padding-bottom", $("audio").height() + 23 + "px")
        if (!is_Firefox) {
            $(".download_music").hide()
        }
    }
}

const init = () => { // 初始化页面
    // 获取当前的子页面名
    t = location.hash.slice(2) || "shuo"

    // 清空内容并显示加载中画面
    $("#card-deck").html(`
    <div class="card">
        <h5 class="card-header">加载中, 请稍后...</h5>
    </div>`)

    // 获取资源文件
    if (_offline) {
        // 强行解决Firefox中不能访问本地资源的问题, 不保证长期有效
        var json_element = document.createElement("script")
        json_element.src = `resource/${t}.json?callback=json_callback`
        document.getElementsByTagName("body")[0].appendChild(json_element)
    }
    else { $.get("https://raw.githubusercontent.com/Xmader/mogicians_manual/offline/resource/" + t + ".json", json_callback) }
}

// 实现关闭对话框自动结束播放视频
$('#modal').on('hidden.bs.modal', (e) => $("#m_body").html(" "))

// hash改变时自动重新初始化页面
window.onhashchange = () => init()
