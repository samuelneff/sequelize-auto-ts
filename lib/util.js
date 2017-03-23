function camelCase(s) {
    switch (s.length) {
        case 0:
            return '';
        case 1:
            return s.toLowerCase();
        default:
            return s.charAt(0).toLowerCase() + s.substr(1);
    }
}
exports.camelCase = camelCase;
function arrayToDictionary(array, key) {
    var d = {};
    var keyFn;
    if (typeof key === 'string') {
        keyFn = function (t) {
            return t[key];
        };
    }
    else {
        keyFn = key;
    }
    array.forEach(function (item) { return d[keyFn(item)] = item; });
    return d;
}
exports.arrayToDictionary = arrayToDictionary;
