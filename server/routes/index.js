var fs = require('fs'),
    path = require('path'),
    pug = require('pug'),
    mobileDetect = require('mobile-detect'),
    cookie = require('cookie');

module.exports = function(app) {
    app.get('/', function(req, res) {
        var name = 'darkfair';
        fs.readFile(path.join(global.appRoot, '/server/data/' + name + '.json'), 'utf8', function(err, data) {
            var md = new mobileDetect(req.headers['user-agent']);
            data = JSON.parse(data);
            data.isMobile = !!md.mobile();
            res.send(getPageHtml(name, data));
        });
    });

    require('./admin/index')(app);
    require('./data_api/survey')(app);
};

function getPageHtml(name, data) {
    var html = pug.renderFile(path.join(global.appRoot, '/static/view/' + name + '.pug'), data);
    return html;
};