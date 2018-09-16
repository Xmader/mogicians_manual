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
                <h5 class="card-header">{{card.header}}</h5>
                <ul class="list-group list-group-flush">
                    <template v-if="get_sub_page_name() != 'chang'">
                        <li class="list-group-item" v-for="item of card.items">
                            <a href="javascript:;" @click="item.onclick()">
                            {{item.title}}
                            </a>
                        </li>
                    </template>

                    <template v-else>
                        <li class="list-group-item grey chang" v-for="item of card.items">
                            <span class="audio_title">{{item.title}}</span>
                            <a v-if="is_Firefox" :href="item.src" target="_blank" class="download_music" download>
                                <i class="fa fa-download" aria-hidden="true"></i>
                            </a>
                            <audio :class="audio_class" :src="item.src" controls></audio>
                        </li>
                    </template>
                </ul>
            </div>
        </div>
    `,
    inject: ['offline'],
    data: () => ({
        is_Firefox: (navigator.userAgent.indexOf("Firefox") > -1),
        cards: [
            {
                header: "加载中, 请稍后...",
                items: []
            }
        ]
    }),
    computed: {
        audio_class: function () { return `audio${this.is_Firefox ? "_Firefox" : ""}` }
    },
    methods: {
        get_sub_page_name: () => location.hash.slice(2) || "shuo", // 获取当前的子页面名
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
                if (this.offline) { url = url.replace("https://raw.githubusercontent.com/Xmader/mogicians_manual/offline/", "") }
            }

            for (var i = 0; i < json.contents.length; i++) {
                var jc = json.contents[i]
                var json_items = jc["contents"]
                var items = []

                for (var a = 0; a < json_items.length; a++) {
                    var json_item = json_items[a]
                    var title = json_item["title"]

                    if (sub_page_name == "chang") {
                        items.push({
                            title,
                            src: `${url}${json_item["filename"]}`
                        })
                    } else {
                        items.push({
                            title,
                            onclick: (sub_page_name == "dou" || sub_page_name == "videos") ?
                                vm.$refs.modal_base.init_video_img_modal(`${url}${json_item["filename"]}`, `${title}`) :
                                vm.$refs.modal_base.init_text_modal(`${json_item.content}`, `${title}`)
                        })
                    }
                }

                var card = {
                    header: jc["title"],
                    items: items
                }

                this.cards.push(card)
            }

            if (sub_page_name == "chang") {
                $(".list-group-item.chang").css("padding-bottom", $("audio").height() + 23 + "px")
            }
        }
    }
})
