var variable = require('./variable'),
    pagination = require('./plugin/pagination/pagination'),
    send = require('./util/send');

/* 设置搜索关键词 */
function set_keyword(val) {
    variable.input.value = val;
    variable.set_keyword(val);
}

function search(on_succeed, on_faild) {
    search_user(on_succeed, on_faild, before_search, after_search);
}

function before_search() {
    variable.show_loading();
    pagination.disable();
}

function after_search() {
    variable.hide_loading();
    pagination.enable();
}

function search_user(on_succeed, on_faild, before, after) {
    var url = 'https://api.github.com/search/users?q=' +
        variable.get_keyword() +
        '&page=' +
        variable.get_current_page() +
        '&per_page=' +
        variable.get_limit();

    if (before) {
        before();
    }

    send.ajax({
        url: url,
        header: {
            Authorization: btoa('kokutuo:3cde251583b6e4715f5cb02354c4b5c3a621f5d8')
        },
        on_succeed: function (data) {
            if (on_succeed) {
                on_succeed(data);
            }
        },
        on_faild: function () {
            if (on_faild) {
                on_faild();
            }
        },
        on_load: function () {
            after();
        }
    });
}

module.exports = {
    search: search,
    set_keyword: set_keyword
};