const fs = require("fs")
const file_name = "chang.json"
fs.readFile(file_name, 'utf8', (err, data) => {

    var [first, ...j] = data.split("\r\n")
    j.pop()
    j = j.join("\n")
    json = JSON.parse(j)

    var contents = []

    for (var name in json) {
        if (name != "url") {
            var a = json[name]
            var new_a = []
            for (var a_key in a) {
                var new_obj = {}
                new_obj["title"] = a[a_key]
                new_obj["filename"] = a_key

                new_a.push(new_obj)
            }

            delete json[name]
            var contents_obj = { "title": name, "contents": new_a }
            contents.push(contents_obj)
        }
    }

    json["type"] = 1

    // 重新排序url的位置
    var url = json["url"]
    delete json["url"]
    json["url"] = url

    json["contents"] = contents
    

    fs.writeFile(file_name, "json_callback(\n" + JSON.stringify(json) + "\n)", (err) => {
        if (err) throw err
    })
})
