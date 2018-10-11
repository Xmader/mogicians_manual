const { parseString } = require("xml2js")
const fs = require("fs")
const path = require("path")

const xml_file = "../../mogicians_manual_resource/mofa2/res/values/strings.xml"

const img_src_dir = "../../mogicians_manual_resource/mofa2/res/drawable"
const img_dest_dir = "./dou"

const files = fs.readdirSync(img_src_dir)

const xml = fs.readFileSync(xml_file).toString()

const category_order = ["高清", "原生", "颜艺", "成语", "鬼畜", "恶搞", "暴走"]

const callback = (err, result) => {
    if (err) throw err

    /** @type { {"_": string; "$": { "name": string; }; }[] } */
    const l = result.resources.string

    let formatted_l = l.map(x => ({
        title: x._,
        filename: x.$.name
    })).filter(
        x => x.filename.startsWith("dou_")
    )

    const categories = formatted_l.filter(
        x => x.filename.split("_").length == 2
    ).sort(
        ({ title: a }, { title: b }) => category_order.indexOf(a) - category_order.indexOf(b)
    )

    formatted_l = formatted_l.filter(
        x => x.filename.split("_").length > 2
    ).map(x => {
        const img = files.find(
            f => f.startsWith(x.filename)
        )

        x.filename = img
        fs.copyFileSync(
            path.join(img_src_dir, img),
            path.join(img_dest_dir, img),
        )
        return x;
    })

    const output_contents = categories.map(c => {
        const filtered = formatted_l.filter(
            x => x.filename && x.filename.startsWith(c.filename + "_")
        )

        return {
            title: c.title,
            contents: filtered
        }
    })

    const output = {
        type: 1,
        url: "https://raw.githubusercontent.com/Xmader/mogicians_manual/offline/resource/dou/",
        contents: output_contents
    }

    fs.writeFileSync("dou.json",
        "json_callback(\n"
        + JSON.stringify(output, null, 4)
        + "\n)"
    )
}

parseString(
    xml,
    { explicitArray: false, },
    callback
);
