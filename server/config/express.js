'use strict';

var express = require('express'),
    path = require('path'),
    bodyParser = require('body-parser'),
    expressSession = require('express-session'),
    MongoStore = require('connect-mongo')(expressSession),
    flash = require('connect-flash'),
    mongoose = require('mongoose'),
    cacheTime = 86400000 * 7; //7 days

module.exports = function(app) {
    app.use(express.static(path.join(global.appRoot, 'static'), {maxAge: cacheTime}));
    app.use(bodyParser.urlencoded({extended: false}));
    app.use(bodyParser.json());
    app.use(expressSession({
        secret: 'secret',
        resave: true,
        saveUninitialized: true,
        store: new MongoStore({mongooseConnection: mongoose.connection})
    }));
    app.use(flash());
};