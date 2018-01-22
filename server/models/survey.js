'use strict';

var mongoose = require('mongoose');

var SurveyScheme = new mongoose.Schema({
    name: String,
    questions: [{
        text: String
    }]
});

mongoose.model('survey', SurveyScheme);