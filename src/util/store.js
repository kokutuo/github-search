function set(key, val) {
    var json = JSON.stringify(val);
    localStorage.setItem(key, json);
}

function get(key) {
    var json = localStorage.getItem(key);
    return JSON.parse(json);
}

module.exports = {
    set: set,
    get: get
};