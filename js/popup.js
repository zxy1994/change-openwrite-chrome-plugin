console.log('你好，我是popup！');

$(function () {

    $('#type01').click(() => {
        sendMessageToContentScript({cmd: 'zjrg', msg: '请求直接绕过'}, (response) => {
            if (response) {
                if ('success' == response.cmd) {
                    alert(response.msg)
                }
            }
            ;
        });
    })
    $('#type02').click(() => {
        sendMessageToContentScript({cmd: "queryId", msg: '查询bolgId'}, (response) => {
            if (response) {
                if ('reblogId' == response.cmd) {
                    alert(response.msg)
                }
            }
            ;
        });
    })

});


/**
 * 获取当前选项卡ID
 * @param callback
 */
function getCurrentTabId(callback) {
    chrome.tabs.query({active: true, currentWindow: true}, function (tabs) {
        if (callback) callback(tabs.length ? tabs[0].id : null);
    });
}


/**
 * 向content-script主动发送消息
 * @param message
 * @param callback
 */
function sendMessageToContentScript(message, callback) {
    getCurrentTabId((tabId) => {
        chrome.tabs.sendMessage(tabId, message, function (response) {
            if (callback) callback(response);
        });
    });
}

/**
 * 监听来自content-script的消息
 */
chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
    console.log('我是popup，我已收到消息：' + JSON.stringify(request));
    if (request) {
        if (null != request.cmd && "bolgId" == request.cmd && null != request.data && undefined != request.data) {
            console.log('获取到的bolgId=' + request.data)
            // 发送ajax请求获取验证码
            // alert("将会在新页面中获取验证码")
            $.ajax({
                type: "GET",
                url: "https://my.openwrite.cn/code/generate?blogId=" + request.data,
                //dataType:"json",
                success: function (data) {
                    if (data) {
                        $("#mySearchResult").html(data);
                    }
                },
                error: function (jqXHR) {
                    aler("发生错误：" + jqXHR.status);
                }
            });

        }
    }
    sendResponse('popup已收到你的消息：' + JSON.stringify(request));
});