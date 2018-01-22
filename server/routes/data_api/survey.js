'use strict';

var mongoose = require('mongoose'),
    Survey = mongoose.model('survey');

module.exports = function(app) {
    app.get('/surveys', function(req, res) {
        Survey.find({}, function(err, data) {
            res.json(data);
        });
    });

    app.get('/survey_names', function(req, res) {
        Survey.find({}, function(err, data) {
            res.json(data.map((entry) => { return {id: entry.id, name: entry.name}}));
        });
    });

    app.get('/surveys/:id', function(req, res, next) {
        Survey.findById(req.params.id, function(err, data) {
            if(err) return next(err);
            res.json(data);
        });
    });

    app.post('/admin/surveys', function(req, res, next) {
        var survey = new Survey(JSON.parse(req.body.data));
        survey.save(function(err, data) {
            if(err) return next(err);
            res.json(data);
        });
    });

    app.put('/admin/surveys/:id', function(req, res, next) {
        Survey.findByIdAndUpdate(req.params.id, req.body, {runValidators: true}, function(err, data) {
            if(err) return next(err);
            res.json(data);
        });
    });

    app.delete('/admin/surveys/:id', function(req, res, next) {
        Survey.findByIdAndRemove(req.params.id, function(err, data) {
            if(err) return next(err);
            res.json(data);
        });
    });
}