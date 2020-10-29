/**
 * 监听content-script.js发布的e_queryBolgId
 */
window.addEventListener("e_queryBolgId", function (e) {
    console.log('inject.js收到content-script消息：', e);
    invokeContentScript();
}, false);



/**
 * 通过事件方式，将BolgId数据递到content-script.js
 */
function invokeContentScript() {
    var param_id = queryBolgId();
    if (null != param_id)  {
        var ce = new CustomEvent("e_blogIdBack", {detail: {id:param_id}});
        console.log(ce)
        window.dispatchEvent(ce)
    }
}

/**
 * 查询bolgId：因为content-script.js只能访问Dom对象，无法访问js对象
 * @returns {*}
 */
function queryBolgId() {

    if (typeof btw != "undefined") {
        return btw.options.blogId;
    } else {
        alert("无法获取bolgId")
        return null;
    }
}
