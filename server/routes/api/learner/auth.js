var express = require('express');
var router = express.Router();
var async = require('async');
var jwt = require('jsonwebtoken');
var config = require('../../../config');

var UserModel = require('../../../model/user');

router
    .post('/register', function (req, res, next) {
        var newUser = req.body;
        newUser.level = config.userLevel.leaner;

        UserModel.createOne(newUser, function (err, result) {
            if (err)
                res.send({
                    error: err
                });
            else
                res.send(result)
        });
    })
    .post('/login', function (req, res, next) {
        async.waterfall([
            function (callback) {
                UserModel.authenticate(req.body, function (err, user) {
                    if (err)
                        return callback(err, null);
                    else {
                        if (user)
                            callback(null, user);
                        else
                            return callback('InvalidCredential', {})
                    }
                });
            },
            function (user, callback) {
                var token = jwt.sign({
                    _id: user._id,
                    email: user.email,
                    displayName: user.displayName,
                    level: user.level
                }, config.jwt.secret);
                res.send({
                    'token': token,
                    _id: user._id,
                    email: user.email,
                    displayName: user.displayName,
                    level: user.level
                });
            }
        ], function (err, result) {
            if (err)
                res.send({
                    error: err
                });
            else
                res.send(result)
        });

    });

module.exports = router;
