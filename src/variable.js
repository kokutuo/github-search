/* 定义所有的变量，选中页面中的元素 */

var form = document.getElementById('search-form'),
    input = document.getElementById('search-input'),
    sum_total = document.getElementById('sum-total'),
    user_list = document.getElementById('user-list'),
    placeholer = document.getElementById('placeholer'),
    loading = document.getElementById('loading'),
    top = document.getElementById('top');

var keyword,
    amount,
    current_page = 1,
    limit = 8,
    MAX_LIMIT = 999;

function set_keyword(val) {
    return keyword = val;
}

function get_keyword() {
    return keyword;
}

function set_amount(val) {
    return amount = val;
}

function get_amount() {
    return amount;
}

function set_current_page(val) {
    return current_page = val;
}

function get_current_page() {
    return current_page;
}

function set_limit(val) {
    return limit = val;
}

function get_limit() {
    return limit;
}

/* 显示加载中 */
function show_loading() {
    loading.hidden = false;
}

/* 隐藏加载中 */
function hide_loading() {
    loading.hidden = true;
}

module.exports = {
    form: form,
    input: input,
    loading: loading,
    sum_total: sum_total,
    user_list: user_list,
    placeholer: placeholer,
    top: top,
    set_keyword: set_keyword,
    get_keyword: get_keyword,
    set_amount: set_amount,
    get_amount: get_amount,
    set_current_page: set_current_page,
    get_current_page: get_current_page,
    set_limit: set_limit,
    get_limit: get_limit,
    show_loading: show_loading,
    hide_loading: hide_loading,
    MAX_LIMIT: MAX_LIMIT
};