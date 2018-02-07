var fs = require('fs'),
    path = require('path'),
    pug = require('pug'),
    mobileDetect = require('mobile-detect'),
    cookie = require('cookie');

const VIEWS_PATH = '/static/view/';

module.exports = function(app) {
    require('./admin/index')(app);
    require('./data_api/survey')(app);

    app.get('/', function(req, res) {
        sendPageHtml(getGameName(), '', getIsMobile(req), res);
    });

    app.get('/:pageName', function(req, res) {
        sendPageHtml(getGameName(), req.params.pageName, getIsMobile(req),  res);
    });
};

function getGameName() {
    return 'darkfair';
};

function getIsMobile(req) {
    var md = new mobileDetect(req.headers['user-agent']);
    return !!md.mobile();
};

function sendPageHtml(gameName, pageName, isMobile, res) {
    getPageHtml(gameName, pageName, isMobile, (html) => {
        res.send(html);
    });
};

function getTplPath(gameName, pageName) {
    return path.join(global.appRoot, VIEWS_PATH, gameName, pageName + '.pug');
};

function getPageHtml(gameName, pageName, isMobile, clb) {
    fs.exists(getTplPath(gameName, pageName), (exists) => {
        pageName = exists ? pageName : 'index';
        fs.readFile(path.join(global.appRoot, '/server/data/' + gameName + '.json'), 'utf8', function(err, data) {
            data = JSON.parse(data);
            data.isMobile = isMobile;
            data.gameName = gameName;
            data.pageName = pageName;
            clb(pug.renderFile(getTplPath(gameName, pageName), data));
        });
    });
};