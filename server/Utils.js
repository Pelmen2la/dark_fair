var cookie = require('cookie');

function getUid() {
    function getPart() {
        var part = (Math.random() * 46656) | 0;
        return ("000" + part.toString(36)).slice(-3);
    }
    return getPart() + getPart();
};

function getGuid() {
    function s4() {
        return Math.floor((1 + Math.random()) * 0x10000).toString(16).substring(1);
    }
    return s4() + s4() + '-' + s4() + '-' + s4() + '-' +
        s4() + '-' + s4() + s4() + s4();
};

function parseCookie(cookieStr) {
    return cookie.parse(cookieStr);
};

function apply(obj0, obj1) {
    for(var key in obj1) {
        obj1.hasOwnProperty(key) && (obj0[key] = obj1[key]);
    }
    return obj0;
};

module.exports = {
    getUid: getUid,
    getGuid: getGuid,
    parseCookie: parseCookie,
    apply: apply
};