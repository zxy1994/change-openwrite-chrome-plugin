(function () {
    console.log('去除openwrite验证码插件-->自动加载的content-script！');
})();

// 注意，必须设置了run_at=document_start 此段代码才会生效
document.addEventListener('DOMContentLoaded', function () {
    // 注入自定义JS
    injectCustomJs();
    // initCustomEventListen();
});

// 向页面注入JS
function injectCustomJs(jsPath) {
    jsPath = jsPath || 'js/inject.js';
    var temp = document.createElement('script');
    temp.setAttribute('type', 'text/javascript');
    // 获得的地址类似：chrome-extension://ihcokhadfjfchaeagdoclpnjdiokfakg/js/inject.js
    temp.src = chrome.extension.getURL(jsPath);
    temp.onload = function () {
        // 放在页面不好看，执行完后移除掉
        this.parentNode.removeChild(this);
    };
    document.body.appendChild(temp);
}

/**
 * js直接绕过方式
 * @returns {number}
 */
function zjrg() {
    console.log("直接绕过开始")
    'use strict';
    var container = document.getElementById('container');
    if (null != container && undefined != container) {
        document.getElementById('container').style = 'position: relative;height: auto;';
    }
    var tmp = document.getElementById('read-more-mask');
    if (null != tmp && undefined != tmp) {
        console.log(tmp)
        var parent = tmp.parentElement;
        var removed = parent.removeChild(tmp);
        parent.removeChild(parent.children[0])
        removed === tmp;
        return 1;
    }
    return 0;
    console.log("直接绕过结束")
}


/**
 * 接收来自popup的消息
 */
chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
    console.log('收到popup主动推送的消息：', request);
    // 消息判断
    console.log(request.cmd)
    if (request.cmd === 'zjrg') {
        var r = zjrg();
        if (1 == r) {
            sendResponse({cmd: 'success', msg: "直接绕过成功，请查看结果"})
        } else {
            sendResponse({cmd: 'success', msg: "绕过失败了，请尝试其他方式"})
        }
    } else if (request.cmd === 'queryId') {
        // 发布事件通知inject.js去查收bolgId
        invokeInjectJs();
    } else {
        sendResponse('我收到你的消息了：' + JSON.stringify(request));
    }
});



/**
 * 发布的e_queryBolgId事件
 */
function invokeInjectJs() {
    console.log("发布e_queryBolgId事件")
    window.dispatchEvent(new CustomEvent("e_queryBolgId"))
}


/**
 * 监听来自inject.js发布的e_blogIdBack 事件
 */
window.addEventListener("e_blogIdBack", function (e) {
    console.log('content-script收到inject.js消息：', e);
    if (null != e.detail && null != e.detail.id) {
        sendMessageToPopup({cmd:'bolgId', data: e.detail.id})
    } else {
        alert("bolgId获取失败，该方式无效")
    }
}, false);


/**
 * 主动发送消息到popup
 * @param message
 */
function sendMessageToPopup(message) {
    chrome.runtime.sendMessage(message, function (response) {
        console.log('收到来自popup的回复：' + response);
    });
}