'use strict';

var mongoose = require('mongoose'),
    passport = require('passport'),
    adminLoginUrl = '/adminlogin',
    fs = require('fs'),
    path= require('path');

module.exports = function(app) {
    var authMw = function (req, res, next) {
        req.isAuthenticated() ? next() : res.redirect(adminLoginUrl);
    };

    app.all('/admin', authMw);
    app.all('/admin/*', authMw);

    app.post(adminLoginUrl, passport.authenticate('login', {
        failureRedirect: adminLoginUrl,
        failureFlash: true
    }), function (req, res) {
        if (req.body.remember == 'on') {
            req.session.cookie.maxAge = 30 * 24 * 60 * 60 * 1000; // Cookie expires after 30 days
        } else {
            req.session.cookie.expires = false; // Cookie expires at end of session
        }
        res.redirect('/admin' + req.body.hash);
    });

    app.get(adminLoginUrl, function(req, res) {
        fs.readFile(path.join(global.appRoot, '/static/html/admin/login.html'), 'utf8', function(err, loginPageHtml) {
            res.send(loginPageHtml);
        });
    });

    app.get('/admin', function(req, res) {
        fs.readFile(path.join(global.appRoot, '/static/html/admin/index.html'), 'utf8', function(err, indexPageHtml) {
            res.send(indexPageHtml);
        });
    });

    app.get('/admin/logout', function(req, res) {
        req.logout();
        res.redirect(adminLoginUrl);
    });
};