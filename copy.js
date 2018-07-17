var is_electron_app = navigator.userAgent.indexOf("Electron") > -1
var clipboard, dialog, path, copy

if (is_electron_app) {

    var { clipboard } = require('electron')
    var { dialog } = require('electron').remote

    var path = require("path")

    var copy = () => {
        var text = $("#m_unformatted_body")[0].value
        console.log(text)
        clipboard.writeText(text)

        dialog.showMessageBox({
            type: "info",
            buttons: ["确定"],
            defaultId: 0,
            title: `复制成功!`,
            message: `我感觉你们还要削习一个`,
            icon: path.join(__dirname, "../../app/mogicians_manual/icon.png")
        })
    }
}
else {
    $("#copy").remove()
}


