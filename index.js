const getArgs = () => {
    var args = {};
    var match = null;
    var search = decodeURIComponent(location.search.substring(1));
    var reg = /(?:([^&]+)=([^&]+))/g;
    while ((match = reg.exec(search)) !== null) {
        args[match[1]] = match[2];
    }
    return args;
}

// 网页内全屏视频
const full_screen_video = () => {
    $("#modal").after($(".modal_media"))
    $(".modal_media").addClass("full_screen_video")
    $(".modal_media").css('margin-left', '0');
    $(".modal_media").after(`<button type="button" class="btn btn-primary" style="position: fixed;z-index: 9999;right: 0;top: 0;" onclick="exit_full_screen_video()" id="exit_full_screen_video">退出网页内全屏</button>`)
}
const exit_full_screen_video = () => {
    $("#exit_full_screen_video").remove()
    $(".modal_media").removeClass("full_screen_video")
    $(".modal_media").css('margin-left', '-27px');
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
    $("#copy").hide()

    $(".download_video").remove()
    $(".modal-footer").prepend(`<a href="${src}" target="_blank" class="btn btn-primary download_video" download>下载${type == "img" ? "图片" : "视频"}</a>`)

    $("#full_screen_video").remove()
    if (type != "img" && (typeof _cordova == "undefined")) { $(".modal-footer").prepend(`<button type="button" class="btn btn-primary" onclick="full_screen_video()" id="full_screen_video">网页内全屏视频</button>`) }

    $(".modal-body").css("padding", "20px 0px")
}

var _offline = !(typeof _offline == "undefined")
if (_offline) { $(".navbar-brand").append(`<small>(离线版)</small>`) }

var is_electron_app = navigator.userAgent.indexOf("Electron") > -1
const is_Firefox = navigator.userAgent.indexOf("Firefox") > -1;
const is_Android = navigator.userAgent.indexOf("Android") > -1;
const is_Chrome = (navigator.userAgent.indexOf("Chrome") > -1) && navigator.userAgent.indexOf("Safari") > -1 && !(navigator.userAgent.indexOf("Edge") > -1) && is_Android;

var t = getArgs()["type"] || "shuo"

var link = $("#" + t)
link.addClass('active');

var json
const json_callback = (data) => {
    if (typeof data == "string") { var data_split = data.split("\n"); data_split.shift(); data_split.pop(); json = JSON.parse(data_split.join("\n")) }
    else { json = data }

    var keys = _.keys(json)
    var card_deck = $("#card-deck")
    if (t == "dou" || t == "chang" || t == "videos") {
        keys.shift()
        if (_offline) { json["url"] = json["url"].replace("https://raw.githubusercontent.com/Xmader/mogicians_manual/offline/", "") }
    }

    for (var i = 0; i < keys.length; i++) {
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
                    item_html += `<li class="list-group-item grey chang ${is_Android ? "chang_Android" : (is_Chrome || is_electron_app ? "chang_chrome" : " ")}">${json[key][items[a]]}<br><a href="${json["url"]}${items[a]}.mp3" target="_blank" class="download_music" download><i class="fa fa-download" aria-hidden="true"></i></a><audio class="audio${is_Firefox ? "_Firefox" : ""}" src="${json["url"]}${items[a]}.mp3" controls></audio></li>`
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
    </div>
    <p> &nbsp;</p>`;
        card_deck.append(html);
        if (!is_Firefox) {
            $(".download_music").hide()
        }
    }
}

if (_offline) {  // 解决Firefox中不能访问本地资源的问题
    var json_element = document.createElement("script")
    json_element.src = `resource/${t}.json?callback=json_callback`;
    document.getElementsByTagName("body")[0].appendChild(json_element)
}
else {
    $.get("https://raw.githubusercontent.com/Xmader/mogicians_manual/offline/resource/" + t + ".json", json_callback)
}

$('#modal').on('hidden.bs.modal', function (e) {
    $("#m_body").html(" ")
})
