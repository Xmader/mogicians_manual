const fs = require("fs")
const file_name = "xue.json"
fs.readFile(file_name, 'utf8', (err, data) => {

    var [first, ...j] = data.split("\r\n")
    j.pop()
    j = j.join("\n")
    json = JSON.parse(j)

    var contents = []

    for (var name in json) {
        var a = json[name]
        var a_titles = a["titles"]
        var a_contents = a["contents"]
        var new_a = []
        for (var i = 0; i < a_titles.length; i++) {
            var new_obj = {}
            new_obj["title"] = a_titles[i]
            new_obj["content"] = a_contents[i]

            new_a.push(new_obj)
        }

        delete json[name]
        var contents_obj = { "title": name, "contents": new_a }
        contents.push(contents_obj)

    }

    json["type"] = 0

    json["contents"] = contents


    fs.writeFile(file_name, "json_callback(\n" + JSON.stringify(json) + "\n)", (err) => {
        if (err) throw err
    })
})
