/*!
 * 膜法指南 网页版
 * https://xmader.github.io/mogicians_manual/
 * 
 * Copyright (c) 2018 Xmader
 * Released under the MIT license
 * 
 * modal.js - 模态框(对话框)Vue组件
 * 
*/


// 实现关闭对话框自动结束播放视频
$('#modal').on('hidden.bs.modal', (e) => $("#m_body").html(" "))
