var store = require('../../util/store'),
    helper = require('../../util/helper');

var list = [],
    el,
    on_click,
    on_delete;

function init(config) {
    el = document.querySelector(config.el);
    on_click = config.on_click;
    on_delete = config.on_delete;

    if (!el || !config.el) {
        throw 'Invalid root element';
    }

    sync_to_ladle(); // 取得最新的数据
    render();
}

function render() {
    el.innerHTML = '';

    list.forEach(function (keyword) {
        /* 生成模板 */
        var el_history = document.createElement('div');
        el_history.innerHTML = `
        <div class="text">${keyword}</div>
        <div class="tool">
          <span class="delete">删除</span>
        </div>
       `;
        el_history.classList.add('history');
        el.appendChild(el_history);

        /* 为每一个记录添加点击事件 */
        el_history.addEventListener('click', function (e) {
            if (on_click) {
                on_click(keyword, e);
            }
        });

        /* 为删除按钮添加点击事件 */
        el_history.querySelector('.delete').addEventListener('click', function (e) {
            e.stopPropagation();
            if (on_delete) {
                on_delete(keyword, e);
            }
        });
    });
}

/* ============================================== */

/* 将数据放入存储器 */
function sync_to_store() {
    store.set('history_list', list);
}

/* 从存储器中取得数据 */
function sync_to_ladle() {
    list = store.get('history_list') || [];
}

/* 将关键词推入list数组中 并渲染 */
function add(keyword) {
    /* 不管有没有先删除一遍 */
    helper.find_and_delete(list, keyword);
    /* 推入 */
    list.unshift(keyword);
    /* 存储 */
    sync_to_store();
    /* 渲染 */
    render();
}

/* 删除一条历史记录 */
function remove(keyword) {
    helper.find_and_delete(list, keyword);
    sync_to_store();
    render();
}

/* 清空历史记录 */
function clear() {
    list = [];
    sync_to_store();
    render();
}

/* 显示记录列表 */
function show() {
    el.hidden = false;
}

/* 隐藏记录列表 */
function hidden() {
    el.hidden = true;
}

module.exports = {
    add: add,
    remove: remove,
    clear: clear,
    show: show,
    hidden: hidden,
    init: init
}