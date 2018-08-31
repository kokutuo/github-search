function find_and_delete(arr, element) {
    var i = arr.indexOf(element);

    if (i == -1) {
        return false;
    }

    arr.splice(i, 1);
    return true;
}

module.exports = {
    find_and_delete: find_and_delete
};