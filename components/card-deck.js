/*!
 * 膜法指南 网页版
 * https://xmader.github.io/mogicians_manual/
 * 
 * Copyright (c) 2018 Xmader
 * Released under the MIT license
 * 
 * card-deck.js
 * 
*/

Vue.component('card-deck', {
    template: `
        <div id="card-deck">
            <div class="card" v-for="card of cards">
                <div v-html="card"></div>
            </div>
        </div>
    `,
    data: () => ({
        cards: [
            '<h5 class="card-header">加载中, 请稍后...</h5>'
        ]
    }),
    methods: {
        get_sub_page_name: () => location.hash.slice(2) || "shuo", // 获取当前的子页面名
        utf8_to_base64: (str) => window.btoa(unescape(encodeURIComponent(str))),
        json_callback: function (data) { // 解析资源文件，显示内容
            var sub_page_name = this.get_sub_page_name()

            // 清空内容
            this.cards = []

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
                            var onclick = (sub_page_name == "dou" || sub_page_name == "videos") ? `vm.$refs.modal_base.init_video_img_modal('${url}${item["filename"]}','${title}');` : `vm.$refs.modal_base.init_text_modal('${this.utf8_to_base64(item.content)}','${title}');`
                            item_html += `<li class="list-group-item">
                                <a data-toggle="modal" href="#/${sub_page_name}" data-target="#modal" onclick="${onclick}">
                                    ${title}
                                </a>
                            </li>`
                        }
                    }
                }

                var html = `<h5 class="card-header">${jc["title"]}</h5>
                            <ul class="list-group list-group-flush">
                                ${item_html}
                            </ul>`;

                this.cards.push(html)
            }

            if (sub_page_name == "chang") {
                $(".list-group-item.chang").css("padding-bottom", $("audio").height() + 23 + "px")
                if (!is_Firefox) {
                    $(".download_music").hide()
                }
            }
        }
    }
})
