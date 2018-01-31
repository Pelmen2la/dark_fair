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
    el.classList.add(className);
};

function removeClassFromElement(el, className) {
    el.classList.remove(className);
};

function toggleElementClass(condition, el, className) {
    condition ? addClassToElement(el, className) : removeClassFromElement(el, className);
};

function stringFormat(tpl) {
    for(var i = 1; i < arguments.length; i++) {
        tpl = tpl.replace(new RegExp('\\{' + (i - 1) + '\\}', 'g'), arguments[i]);
    }
    return tpl;
};

function capitalizeString(str) {
    return str[0].toUpperCase() + str.substring(1);
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
    toggleElementClass: toggleElementClass,
    stringFormat: stringFormat,
    capitalizeString: capitalizeString,
    createElementFromHTML: createElementFromHTML
};