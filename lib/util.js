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
//# sourceMappingURL=util.js.map
