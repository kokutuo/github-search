/* 用于发送请求 */

function get(url, on_succeed, on_fail) {
    ajax({
        url: url,
        method: 'get',
        on_succeed: on_succeed,
        on_fail: on_fail,
    });
}

function post(url, data, on_succeed, on_fail) {
    ajax({
        url: url,
        method: 'post',
        data: data,
        on_succeed: on_succeed,
        on_fail: on_fail,
        headers: {
            "Content-Type": "application/json;charset=UTF-8"
        },
    });
}

function ajax(config) {

    /*要发请求就必须有地址*/
    if (!config.url)
        throw 'Invalid url';

    var http = new XMLHttpRequest(),
        headers = config.headers,
        data;

    /*准备发射，如果没有设置方法默认发送get请求*/
    http.open(config.method || 'get', config.url);

    /*是否传了headers，如果传了headers就分别设置headers*/
    if (headers) {
        for (var key in headers) {
            http.setRequestHeader(key, headers[key]);
        }
    }

    /*发射*/
    http.send(JSON.stringify(config.data));

    /*当请求返回时*/
    http.addEventListener('load', function () {
        /*如果请求状态码大于200则为失败，否则为成功*/
        if (http.status > 200) { // 失败
            if (config.on_fail)
                config.on_fail(data, http);
        } else { // 成功
            data = JSON.parse(http.responseText);
            if (config.on_succeed)
                config.on_succeed(data, http);
        }

        /*无论成功或失败都会触发*/
        if (config.on_load)
            config.on_load();
    });
}

module.exports = {
    get: get,
    post: post,
    ajax: ajax
};