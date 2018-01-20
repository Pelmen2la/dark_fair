'use strict';

var mongoose = require('mongoose');

var UserScheme = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    }
});

mongoose.model('user', UserScheme);