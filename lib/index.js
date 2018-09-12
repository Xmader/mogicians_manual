"use strict";

var _offline = !(typeof _offline == "undefined");

if (_offline) {
  $(".navbar-brand").append("<small>(\u79BB\u7EBF\u7248)</small>");
}

var is_Firefox = navigator.userAgent.indexOf("Firefox") > -1;
var json, t;

var full_screen_video = function full_screen_video() {
  $("#modal").after($(".modal_media"));
  $(".modal_media").addClass("full_screen_video").after("<button type=\"button\" class=\"btn btn-primary\" onclick=\"exit_full_screen_video()\" id=\"exit_full_screen_video\">\u9000\u51FA\u7F51\u9875\u5185\u5168\u5C4F</button>");
};

var exit_full_screen_video = function exit_full_screen_video() {
  $("#exit_full_screen_video").remove();
  $(".modal_media").removeClass("full_screen_video");
  $("#m_body").append($(".modal_media"));
};

var init_modal = function init_modal(i, a) {
  var item = json.contents[i].contents[a];
  $("#m_title").text(item.title);
  $("#m_body").html("<p>" + item.content.replace(/\n/g, "</p><p>"));
  $(".download_video").remove();
  $("#full_screen_video").remove();
  $(".modal-body").css("padding", "20px 24px 0px");
};

var init_video_img_modal = function init_video_img_modal(src, title, type) {
  $("#m_title").text(title);
  $("#m_body").html(type == "dou" ? "<img src=\"".concat(src, "\" class=\"modal_media\" />") : "<video src=\"".concat(src, "\" class=\"modal_media\" preload=\"auto\" controls></video>"));
  $(".download_video").remove();
  $(".modal-footer").prepend("<a href=\"".concat(src, "\" target=\"_blank\" class=\"btn btn-primary download_video\" download>\u4E0B\u8F7D").concat(type == "dou" ? "图片" : "视频", "</a>"));
  $("#full_screen_video").remove();

  if (type != "dou" && typeof _cordova == "undefined") {
    $(".modal-footer").prepend("<button type=\"button\" class=\"btn btn-primary\" onclick=\"full_screen_video()\" id=\"full_screen_video\">\u7F51\u9875\u5185\u5168\u5C4F\u89C6\u9891</button>");
  }

  $(".modal-body").css("padding", "20px 0px");
};

var json_callback = function json_callback(data) {
  $("#card-deck").html("");

  if (typeof data == "string") {
    var data_split = data.split("\n");
    data_split.shift();
    data_split.pop();
    json = JSON.parse(data_split.join("\n"));
  } else {
    json = data;
  }

  if (json["type"] == 1) {
    var url = json["url"];

    if (_offline) {
      url = url.replace("https://raw.githubusercontent.com/Xmader/mogicians_manual/offline/", "");
    }
  }

  for (var i = 0; i < json.contents.length; i++) {
    var jc = json.contents[i];
    var items = jc["contents"];
    var item_html = "";

    for (var a = 0; a < items.length; a++) {
      var item = items[a];
      var title = item["title"];

      switch (t) {
        case "chang":
          {
            item_html += "<li class=\"list-group-item grey chang\">\n                        <span class=\"audio_title\">".concat(title, "</span>\n                        <a href=\"").concat(url).concat(item["filename"], "\" target=\"_blank\" class=\"download_music\" download>\n                            <i class=\"fa fa-download\" aria-hidden=\"true\"></i>\n                        </a>\n                        <audio class=\"audio").concat(is_Firefox ? "_Firefox" : "", "\" src=\"").concat(url).concat(item["filename"], "\" controls></audio>\n                    </li>");
            break;
          }

        default:
          {
            var onclick = t == "dou" || t == "videos" ? "init_video_img_modal('".concat(url).concat(item["filename"], "','").concat(title, "','").concat(t, "');") : "init_modal('".concat(i, "','").concat(a, "');");
            item_html += "<li class=\"list-group-item\">\n                        <a data-toggle=\"modal\" href=\"#modal\" data-target=\"#modal\" onclick=\"".concat(onclick, "\">\n                            ").concat(title, "\n                        </a>\n                    </li>");
          }
      }
    }

    var html = "\n    <div class=\"card\">\n        <h5 class=\"card-header\">".concat(jc["title"], "</h5>\n        <ul class=\"list-group list-group-flush\">\n            ").concat(item_html, "\n        </ul>\n    </div>");
    $("#card-deck").append(html);
  }

  if (t == "chang") {
    $(".list-group-item.chang").css("padding-bottom", $("audio").height() + 23 + "px");

    if (!is_Firefox) {
      $(".download_music").hide();
    }
  }
};

var show_bottom_nav = function show_bottom_nav() {
  var l = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : [{
    id: "shuo",
    name: "说",
    icon: "microphone"
  }, {
    id: "xue",
    name: "学",
    icon: "book"
  }, {
    id: "dou",
    name: "逗",
    icon: "smile-o"
  }, {
    id: "chang",
    name: "唱",
    icon: "music"
  }, {
    id: "videos",
    name: "赏",
    icon: "film"
  }];

  for (var i = 0; i < l.length; i++) {
    var _l$i = l[i],
        id = _l$i.id,
        name = _l$i.name,
        icon = _l$i.icon;
    $(".bottom-nav").append("\n        <li class=\"nav-item\">\n            <a class=\"nav-link\" href=\"#/".concat(id, "\" id=\"").concat(id, "\">\n                <i class=\"fa fa-").concat(icon, "\" aria-hidden=\"true\"></i> &nbsp;").concat(name, "</a>\n        </li>\n        "));
  }
};

var init = function init() {
  t = location.hash.slice(2) || "shuo";
  $(".nav-link").removeClass('active');
  $("#" + t).addClass('active');
  $("#card-deck").html("\n    <div class=\"card\">\n        <h5 class=\"card-header\">\u52A0\u8F7D\u4E2D, \u8BF7\u7A0D\u540E...</h5>\n    </div>");

  if (_offline) {
    var json_element = document.createElement("script");
    json_element.src = "resource/".concat(t, ".json?callback=json_callback");
    document.getElementsByTagName("body")[0].appendChild(json_element);
  } else {
    $.get("https://raw.githubusercontent.com/Xmader/mogicians_manual/offline/resource/" + t + ".json", json_callback);
  }
};

$('#modal').on('hidden.bs.modal', function (e) {
  return $("#m_body").html(" ");
});

window.onhashchange = function () {
  return init();
};