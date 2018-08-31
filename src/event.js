var variable = require('./variable'),
    search = require('./search'),
    history = require('./plugin/history/history'),
    pagination = require('./plugin/pagination/pagination'),
    list = require('./user_list');

/* 用于绑定所有事件 */
function add_event() {
    detect_submit();
    detect_click_top();
    init_pagination();
    init_history();
    show_history_list();
    hidden_history_list();
}

/* 绑定表单提交事件 */
function detect_submit() {
    variable.form.addEventListener('submit', function (e) {
        e.preventDefault();

        /* 获取搜索关键词 */
        var keyword = variable.set_keyword(variable.input.value);

        /* 如果没有关键词则返回 */
        if (!keyword) {
            alert('药，药，切克闹~');
            return;
        }

        /* 将关键词加入历史记录 */
        history.add(keyword);

        /* 先将用户列表置空 */
        list.reset_user_list();

        /* 搜索并渲染用户列表 */
        search.search(on_search_succeed);
    });
}

/* 搜索成功时执行 */
function on_search_succeed(data) {
    /* 拿到搜索数据 */
    variable.set_amount(data.total_count);
    pagination.set_amount_and_limit(variable.get_amount(), variable.get_limit());

    /* 显示组件 */
    pagination.show();

    /* 清空上次搜索的结果 */
    list.reset_user_list();

    /* 渲染 */
    list.render(data);
}

/* 当输入框focus的时候显示历史记录 */
function show_history_list() {
    variable.input.addEventListener('click', function () {
        history.show();
    });
}

/* 当搜索框和历史记录之外的地方被点击时，隐藏历史记录 */
function hidden_history_list() {
    document.addEventListener('click', function (e) {
        var el = e.target;
        var tmp = el.closest('#history-list');

        if (!tmp && el != variable.input) {
            history.hidden();
        }
    });
}

/* 初始化history插件 */
function init_history() {
    history.init({
        el: '#history-list',
        on_click: on_history_click,
        on_delete: on_history_delete
    });
}

/* 当历史记录被点击时执行 */
function on_history_click(kwd, e) {
    variable.set_keyword(kwd);

    variable.input.value = kwd;
    /* 如果按住alt键点击，则进行搜索 */
    if (e.altKey) {
        variable.input.value = kwd;
        return;
    }

    /* 直接点击，则只讲关键词上屏 */
    search.search(on_search_succeed);
}

/* 当删除按钮被点击时执行 */
function on_history_delete(kwd) {
    history.remove(kwd);
}

/* 初始化pagination插件 */
function init_pagination(data) {
    pagination.init({
        el: '#pagination',
        amount: data,
        limit: variable.get_limit(),
        on_page_change: function (page) {
            if (page == variable.get_current_page()) {
                return;
            }
            variable.set_current_page(page);
            search.search(on_search_succeed);
        }
    });
}

/* 返回最上层 */
function detect_click_top() {
    variable.top.addEventListener('click', function () {
        window.scrollTo(0, 0);
    });
}

module.exports = {
    add_event: add_event
};