/*!
 * 膜法指南 网页版
 * https://xmader.github.io/mogicians_manual/
 * 
 * Copyright (c) 2018 Xmader
 * Released under the MIT license
 * 
*/

var _offline = !(typeof _offline == "undefined")
if (_offline) { $(".navbar-brand").append(`<small>(离线版)</small>`) }

const is_Firefox = navigator.userAgent.indexOf("Firefox") > -1

var json, t

// 网页内全屏视频
const full_screen_video = () => {
    $("#modal").after($(".modal_media"))
    $(".modal_media")
        .addClass("full_screen_video")
        .after(`<button type="button" class="btn btn-primary" onclick="exit_full_screen_video()" id="exit_full_screen_video">退出网页内全屏</button>`)
}
const exit_full_screen_video = () => {
    $("#exit_full_screen_video").remove()
    $(".modal_media").removeClass("full_screen_video")
    $("#m_body").append($(".modal_media"))
}

const init_modal = (key, a) => {
    $("#m_title").text(json[key]["titles"][a])
    $("#m_body").html("<p>" + json[key]["contents"][a].replace(/\n/g, "</p><p>"))
    $("#m_unformatted_body")[0].value = json[key]["contents"][a]
}

const init_video_img_modal = (src, title, type) => {
    $("#m_title").text(title)
    $("#m_body").html(type == "img" ? `<img src="${src}" class="modal_media" />` : `<video src="${src}" class="modal_media" preload="auto" controls></video>`)

    $(".download_video").remove()
    $(".modal-footer").prepend(`<a href="${src}" target="_blank" class="btn btn-primary download_video" download>下载${type == "img" ? "图片" : "视频"}</a>`)

    $("#full_screen_video").remove()
    if (type != "img" && (typeof _cordova == "undefined")) { $(".modal-footer").prepend(`<button type="button" class="btn btn-primary" onclick="full_screen_video()" id="full_screen_video">网页内全屏视频</button>`) }

    $(".modal-body").css("padding", "20px 0px")
}

const json_callback = (data) => { // 解析资源文件，显示内容
    if (typeof data == "string") { var data_split = data.split("\n"); data_split.shift(); data_split.pop(); json = JSON.parse(data_split.join("\n")) }
    else { json = data }

    if (json["type"] == 1 && _offline) { json["url"] = json["url"].replace("https://raw.githubusercontent.com/Xmader/mogicians_manual/offline/", "") }

    var contents = json["contents"]
    for (var i = 0; i < contents.length; i++) {
        var key = keys[i]

        if (t == "dou" || t == "chang" || t == "videos") {
            var items = _.keys(json[key])
        } else {
            var items = json[key]["titles"]
        }

        var item_html = ""


        for (var a = 0; a < items.length; a++) {
            switch (t) {
                case "dou": {
                    item_html += `<li class="list-group-item grey"><a data-toggle="modal" href="#modal" data-target="#modal" onclick="init_video_img_modal('${json["url"]}${items[a]}','${json[key][items[a]]}','img');">${json[key][items[a]]}</a></li>`
                    break;
                }
                case "chang": {
                    item_html += `<li class="list-group-item grey chang"><span class="audio_title">${json[key][items[a]]}</span><a href="${json["url"]}${items[a]}" target="_blank" class="download_music" download><i class="fa fa-download" aria-hidden="true"></i></a><audio class="audio${is_Firefox ? "_Firefox" : ""}" src="${json["url"]}${items[a]}" controls></audio></li>`
                    break;
                }
                case "videos": {
                    item_html += `<li class="list-group-item grey"><a data-toggle="modal" href="#modal" data-target="#modal" onclick="init_video_img_modal('${json["url"]}${items[a]}','${json[key][items[a]]}');">${json[key][items[a]]}</a></li>`
                    break;
                }
                default: {
                    item_html += `<li class="list-group-item"><a data-toggle="modal" href="#modal" data-target="#modal" onclick="init_modal('${key}',${a});">${items[a]}</a></li>`
                }
            }
        }

        var html = `
    <div class="card">
        <h5 class="card-header">${key}</h5>
        <ul class="list-group list-group-flush">
            ${item_html}
        </ul>
    </div>`;
        var card_deck = $("#card-deck")
        card_deck.append(html);
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

    // 底部导航条高亮当前子页面
    $(".nav-link").removeClass('active')
    $("#" + t).addClass('active')

    // 获取资源文件
    if (_offline) {
        // 强行解决Firefox中不能访问本地资源的问题
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
