function createRequest(url, method, data, callback) {
    var xhr = new XMLHttpRequest();
    xhr.open(method, url, true);
    data && xhr.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
    xhr.onreadystatechange = function() {
        if(xhr.readyState == 4 && xhr.status == 200) {
            callback(JSON.parse(xhr.responseText));
        }
    };
    xhr.send(data ? 'data=' + JSON.stringify(data) : null);
};

function gBID(id) {
    return document.getElementById(id)
};

function addClassToElement(el, className) {
    el.className += ' ' + className;
};

function removeClassFromElement(el, className) {
    el.className = el.className.replace(' ' + className, '');
};

function stringFormat(tpl) {
    for(var i = 1; i < arguments.length; i++) {
        tpl = tpl.replace('{' + (i - 1) + '}', arguments[i]);
    }
    return tpl;
};

function createElementFromHTML(htmlString) {
    var div = document.createElement('div');
    div.innerHTML = htmlString.trim();
    return div.firstChild;
};

module.exports = {
    createRequest: createRequest,
    gBID: gBID,
    addClassToElement: addClassToElement,
    removeClassFromElement: removeClassFromElement,
    stringFormat: stringFormat,
    createElementFromHTML: createElementFromHTML
};