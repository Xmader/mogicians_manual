const is_electron_app = navigator.userAgent.indexOf("Electron") > -1
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
    var copy = () => {

    }
    var clipboard = new Clipboard("#copy")
    clipboard.on('success', function (e) {
        // console.info('Action:', e.action);
        // console.info('Text:', e.text);
        // console.info('Trigger:', e.trigger);
        if (is_Firefox) { alert('复制失败!\n\n请手动进行复制!') }
        else { alert("复制成功!\n\n我感觉你们还要削习一个") }
        e.clearSelection();
    });
    clipboard.on('error', function (e) {
        alert('复制失败!\n\n请手动进行复制!')
    });
}


