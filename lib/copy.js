'use strict';

var is_electron_app = navigator.userAgent.indexOf("Electron") > -1;
var clipboard, dialog, path, copy;

if (is_electron_app) {
    var _require = require('electron'),
        clipboard = _require.clipboard;

    var dialog = require('electron').remote.dialog;

    var path = require("path");

    var copy = function copy() {
        var text = $("#m_unformatted_body")[0].value;
        console.log(text);
        clipboard.writeText(text);

        dialog.showMessageBox({
            type: "info",
            buttons: ["确定"],
            defaultId: 0,
            title: '\u590D\u5236\u6210\u529F!',
            message: '\u6211\u611F\u89C9\u4F60\u4EEC\u8FD8\u8981\u524A\u4E60\u4E00\u4E2A',
            icon: path.join(__dirname, "../../app/mogicians_manual/icon.png")
        });
    };
} else {
    $("#copy").remove();
}