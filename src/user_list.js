var variable = require('./variable');

function render(data) {
    var html = '';

    /* 每次渲染先隐藏附加信息 */
    variable.placeholer.hidden = true;

    data.items.forEach(function (user) {
        html = html + `
        <div class="user">
            <a class="avatar" target="_blank" href="${user.html_url}">
            <img src="${user.avatar_url}">
            </a>
            <div class="info">
                <div class="username">${user.login}</div>
               <div><a target="_blank" href="${user.html_url}">${user.html_url}</a></div>
            </div>
        </div>
       `;
    });

    variable.user_list.innerHTML = html;

    /* 渲染总数信息 */
    show_total();
    variable.sum_total.innerHTML = `为您找到${data.total_count}条搜索结果`;

    /* 如果是最后一页就显示附加信息 */
    var no_more = variable.get_current_page() * variable.get_limit() > data.total_count;

    if (no_more) {
        variable.placeholer.hidden = false;
    }
}

/* 显示总数 */
function show_total() {
    variable.sum_total.hidden = false;
}

/* 隐藏总数 */
function hide_total() {
    variable.sum_total.hidden = true;
}

function reset_user_list() {
    variable.user_list.innerHTML = '';
}

module.exports = {
    reset_user_list: reset_user_list,
    render: render,
};