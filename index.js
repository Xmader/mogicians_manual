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

var json, sub_page_name

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

            switch (sub_page_name) {
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
                    var onclick = (sub_page_name == "dou" || sub_page_name == "videos") ? `vm.$refs.modal_base.init_video_img_modal('${url}${item["filename"]}','${title}');` : `init_modal('${i}','${a}');`
                    item_html += `<li class="list-group-item">
                        <a data-toggle="modal" href="#/${sub_page_name}" data-target="#modal" onclick="${onclick}">
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

    if (sub_page_name == "chang") {
        $(".list-group-item.chang").css("padding-bottom", $("audio").height() + 23 + "px")
        if (!is_Firefox) {
            $(".download_music").hide()
        }
    }
}

const init = () => { // 初始化页面
    // 获取当前的子页面名
    sub_page_name = location.hash.slice(2) || "shuo"

    // 清空内容并显示加载中画面
    $("#card-deck").html(`
    <div class="card">
        <h5 class="card-header">加载中, 请稍后...</h5>
    </div>`)

    // 获取资源文件
    if (_offline) {
        // 强行解决Firefox中不能访问本地资源的问题, 不保证长期有效
        var json_element = document.createElement("script")
        json_element.src = `resource/${sub_page_name}.json?callback=json_callback`
        document.getElementsByTagName("body")[0].appendChild(json_element)
    }
    else { $.get("https://raw.githubusercontent.com/Xmader/mogicians_manual/offline/resource/" + sub_page_name + ".json", json_callback) }
}

// hash改变时自动重新初始化页面
window.onhashchange = () => init()

