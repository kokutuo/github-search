var config,
    page_amount, //通过计算获取总页数
    el, // 插件插入的根元素
    on_page_change,
    def_config = { // 默认配置项
        amount: null,
        limit: null,
        range: 5,
        current: 1
    },
    el_pagination_fieldset, // <fieldset> 元素，用于快速禁用所有按钮和其他输入元素
    el_pagination_list; // 页码插入的元素

/* 入口函数
 *@param object user_config 配置项 
 *{
 *    -------- 属性 ---------
 *    el: 选择器 / 必填项
 *    amount: 总数据量 / 使用set_amount_and_limit()设置
 *    limit: 每页显示数 / 使用set_amount_and_limit()设置
 *    range: 显示页码数 / 默认为5
 *    current_page: 当前页面 / 默认为1
 *    -------- 方法 ---------
 *    on_page_change() // 当页面发生改变时触发用户的函数 
 *}
 */
function init(user_config) {
    /* 选中插入的元素 */
    el = document.querySelector(user_config.el);

    if (!el) {
        throw 'Invalid root element.';
    }

    /* 合并配置项 */
    config = Object.assign({}, def_config, user_config);

    /* 对组件进行初始化渲染 */
    init_render();

    if (!config.amount || !config.limit) {
        return;
    }

    /* 计算总页数 */
    calc_page_amount();

    change_page(config.current, true);

    /* 渲染组件 */
    render_list();
}

/* 渲染插件的基本HTML结构 */
function init_render() {
    el.classList.add('pagination');
    el.innerHTML = `
      <fieldset class="pagination-fieldset">
        <div class="pagination-pre">
          <button class="pagination-first">First</button>
          <button class="pagination-prev">Prev</button>
        </div>
        <div class="pagination-list"></div>
        <div class="pagination-post">
          <button class="pagination-next">Next</button>
          <button class="pagination-last">Last</button>
        </div>
      </fieldset>
    `;

    el_pagination_list = el.querySelector('.pagination-list');
    el_pagination_fieldset = el.querySelector('.pagination-fieldset');

    /* 在页码组件的上一级绑定事件，来监听页码组件的冒泡 */
    el.addEventListener('click', function (e) {
        var target = e.target; // 冒泡事件的起点

        var is_btn_page = target.classList.contains('pagination-item'), // 点击的是页码按钮吗？
            is_first = target.classList.contains('pagination-first'), // 点击的是"首页"按钮吗？
            is_last = target.classList.contains('pagination-last'), // 点击的是"尾页"按钮吗？
            is_prev = target.classList.contains('pagination-prev'), // 点击的是"上一页"按钮吗？
            is_next = target.classList.contains('pagination-next'); // 点击的是"下一页"按钮吗？

        if (is_btn_page) {
            var page = parseInt(target.dataset.page);
            change_page(page);
        } else if (is_first) {
            change_page(1);
        } else if (is_last) {
            change_page(page_amount);
        } else if (is_prev) {
            change_page(config.current - 1);
        } else if (is_next) {
            change_page(config.current + 1);
        }

        render_list();
    });
}

/* 渲染页码组件 */
function render_list() {
    /* 每次渲染先清空 */
    el_pagination_list.innerHTML = '';


    var scope = decide_page_scope();
    var start = scope.start,
        end = scope.end;

    /* 循环生成页码按钮并插入组件 */
    for (var i = start; i <= end; i++) {
        var num = i;
        var btn = document.createElement('button');
        btn.innerText = num;
        btn.dataset.page = num;
        btn.classList.add('pagination-item');
        if (num == config.current) {
            btn.classList.add('active');
        }
        el_pagination_list.appendChild(btn);
    }
}

/* 禁用组件 */
function disable() {
    el_pagination_fieldset.disabled = true;
}

/* 启用组件 */
function enable() {
    el_pagination_fieldset.disabled = false;
}

function show() {
    el.hidden = false;
}

function hide() {
    el.hidden = true;
}

/* 判断页码的开始和结束范围 */
function decide_page_scope() {
    var start,
        end,
        middle = Math.ceil(config.range / 2);

    /* 判断条件 */
    var reaching_left = config.current <= middle, // 靠近左边
        reaching_right = config.current > page_amount - middle; // 靠近右边

    if (reaching_left) {
        start = 1;
        end = config.range;
    } else if (reaching_right) {
        start = page_amount - config.range + 1;
        end = page_amount;
    } else {
        start = config.current - middle + 1;
        end = config.current + middle - 1;
    }

    if (start < 1) {
        start = 1;
    }

    if (end > page_amount) {
        end = page_amount;
    }

    return {
        start: start,
        end: end
    };
}

/*验证且更改当前页面（比如说从1改为2）
 * 更改后通知在乎的人（触发回调函数）
 * @param Number page 当前页
 * */
function change_page(page, force) {

    var old = config.current;

    config.current = page;

    /*如果大于最大页面，就强制等于最后一页*/
    if (page > page_amount)
        config.current = page_amount;

    /*如果小于最小页面，就强制等于第一页*/
    if (page < 1)
        config.current = 1;

    if (!force && old == config.current)
        return;

    /*通知使用者*/
    if (config.on_page_change)
        config.on_page_change(config.current);
}

/* 计算总页数 */
function calc_page_amount() {
    page_amount = Math.ceil(config.amount / config.limit);
}

function set_amount_and_limit(amount, limit) {
    config.amount = amount;
    config.limit = limit;
    calc_page_amount();

    render_list();
}

module.exports = {
    init: init,
    change_page: change_page,
    show: show,
    hide: hide,
    disable: disable,
    enable: enable,
    set_amount_and_limit: set_amount_and_limit
};