"use strict";

var _offline = !(typeof _offline == "undefined");
if (_offline) {
    $(".navbar-brand").append("<small>(\u79BB\u7EBF\u7248)</small>");
}

var is_Firefox = navigator.userAgent.indexOf("Firefox") > -1;

var json, t;

// 网页内全屏视频
var full_screen_video = function full_screen_video() {
    $("#modal").after($(".modal_media"));
    $(".modal_media").addClass("full_screen_video").after("<button type=\"button\" class=\"btn btn-primary\" onclick=\"exit_full_screen_video()\" id=\"exit_full_screen_video\">\u9000\u51FA\u7F51\u9875\u5185\u5168\u5C4F</button>");
};
var exit_full_screen_video = function exit_full_screen_video() {
    $("#exit_full_screen_video").remove();
    $(".modal_media").removeClass("full_screen_video");
    $("#m_body").append($(".modal_media"));
};

var init_modal = function init_modal(key, a) {
    $("#m_title").text(json[key]["titles"][a]);
    $("#m_body").html("<p>" + json[key]["contents"][a].replace(/\n/g, "</p><p>"));
    $("#m_unformatted_body")[0].value = json[key]["contents"][a];
};

var init_video_img_modal = function init_video_img_modal(src, title, type) {
    $("#m_title").text(title);
    $("#m_body").html(type == "img" ? "<img src=\"" + src + "\" class=\"modal_media\" />" : "<video src=\"" + src + "\" class=\"modal_media\" preload=\"auto\" controls></video>");

    $(".download_video").remove();
    $(".modal-footer").prepend("<a href=\"" + src + "\" target=\"_blank\" class=\"btn btn-primary download_video\" download>\u4E0B\u8F7D" + (type == "img" ? "图片" : "视频") + "</a>");

    $("#full_screen_video").remove();
    if (type != "img" && typeof _cordova == "undefined") {
        $(".modal-footer").prepend("<button type=\"button\" class=\"btn btn-primary\" onclick=\"full_screen_video()\" id=\"full_screen_video\">\u7F51\u9875\u5185\u5168\u5C4F\u89C6\u9891</button>");
    }

    $(".modal-body").css("padding", "20px 0px");
};

var json_callback = function json_callback(data) {
    if (typeof data == "string") {
        var data_split = data.split("\n");data_split.shift();data_split.pop();json = JSON.parse(data_split.join("\n"));
    } else {
        json = data;
    }

    if (json["type"] == 1 && _offline) {
        json["url"] = json["url"].replace("https://raw.githubusercontent.com/Xmader/mogicians_manual/offline/", "");
    }

    for (var i = 0; i < keys.length; i++) {
        var key = keys[i];

        if (t == "dou" || t == "chang" || t == "videos") {
            var items = _.keys(json[key]);
        } else {
            var items = json[key]["titles"];
        }

        var item_html = "";

        for (var a = 0; a < items.length; a++) {
            switch (t) {
                case "dou":
                    {
                        item_html += "<li class=\"list-group-item grey\"><a data-toggle=\"modal\" href=\"#modal\" data-target=\"#modal\" onclick=\"init_video_img_modal('" + json["url"] + items[a] + "','" + json[key][items[a]] + "','img');\">" + json[key][items[a]] + "</a></li>";
                        break;
                    }
                case "chang":
                    {
                        item_html += "<li class=\"list-group-item grey chang\"><span class=\"audio_title\">" + json[key][items[a]] + "</span><a href=\"" + json["url"] + items[a] + "\" target=\"_blank\" class=\"download_music\" download><i class=\"fa fa-download\" aria-hidden=\"true\"></i></a><audio class=\"audio" + (is_Firefox ? "_Firefox" : "") + "\" src=\"" + json["url"] + items[a] + "\" controls></audio></li>";
                        break;
                    }
                case "videos":
                    {
                        item_html += "<li class=\"list-group-item grey\"><a data-toggle=\"modal\" href=\"#modal\" data-target=\"#modal\" onclick=\"init_video_img_modal('" + json["url"] + items[a] + "','" + json[key][items[a]] + "');\">" + json[key][items[a]] + "</a></li>";
                        break;
                    }
                default:
                    {
                        item_html += "<li class=\"list-group-item\"><a data-toggle=\"modal\" href=\"#modal\" data-target=\"#modal\" onclick=\"init_modal('" + key + "'," + a + ");\">" + items[a] + "</a></li>";
                    }
            }
        }

        var html = "\n    <div class=\"card\">\n        <h5 class=\"card-header\">" + key + "</h5>\n        <ul class=\"list-group list-group-flush\">\n            " + item_html + "\n        </ul>\n    </div>";
        var card_deck = $("#card-deck");
        card_deck.append(html);
    }

    if (t == "chang") {
        $(".list-group-item.chang").css("padding-bottom", $("audio").height() + 23 + "px");
        if (!is_Firefox) {
            $(".download_music").hide();
        }
    }
};

var init = function init() {
    t = location.hash.slice(2) || "shuo";
    $(".nav-link").removeClass('active');
    $("#" + t).addClass('active');
    if (_offline) {
        // 解决Firefox中不能访问本地资源的问题
        var json_element = document.createElement("script");
        json_element.src = "resource/" + t + ".json?callback=json_callback";
        document.getElementsByTagName("body")[0].appendChild(json_element);
    } else {
        $.get("https://raw.githubusercontent.com/Xmader/mogicians_manual/offline/resource/" + t + ".json", json_callback);
    }
};

// 实现关闭对话框自动结束播放视频
$('#modal').on('hidden.bs.modal', function (e) {
    $("#m_body").html(" ");
});

window.onhashchange = function () {
    return init();
}; // hash改变时自动重新初始化页面