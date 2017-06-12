var mongoose = require('mongoose');
var async = require('async');
var bcrypt = require('bcrypt');
var extend = require('extend');
var config = require('../config');

var Schema = mongoose.Schema;

var userSchema = new Schema(
    {
        email: {
            type: String,
            required: true,
            validate: {
                validator: function (v) {
                    return /[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,3}$/.test(v);
                },
                message: '{VALUE} is not a valid email address!'
            }
        },
        password: {
            type: String,
            required: true
        },
        displayName: {
            type: String,
            required: true

        },
        level: {
            type: Number,
            required: true,
            min: 1,
            default: config.userLevel.leaner
        }
    },
    {
        timestamps: true
    }
);

var User = mongoose.model('User', userSchema);

User.createOne = function (inputUser, callback) {
    async.waterfall([
        function (callback) {
            User
                .findOne({
                    email: inputUser.email
                })
                .exec(function (err, user) {
                    if (err)
                        return callback(err, null);
                    if (user)
                        return callback('EmailExisted', null);
                    else
                        callback(null, user);
                });
        },
        function (prevResult, callback) {
            bcrypt.hash(inputUser.password, config.bcrypt.saltRounds, function (err, hash) {
                if (err)
                    callback(err, null);
                inputUser.password = hash;
                callback(null, inputUser);
            });
        },
        function (hashedPasswordUser, callback) {
            User.create(hashedPasswordUser, function (err, r) {
                if (err)
                    return callback(err.name, err);
                callback(null, r);
            });
        }
    ], function (err, result) {
        if (callback)
            callback(err, result);
    });
};

User.authenticate = function (inputUser, callback) {
    async.waterfall([
        function (callback) {
            User
                .findOne({
                    email: inputUser.email
                })
                .exec(function (err, user) {
                    if (err)
                        return callback(err, null);
                    if (!user)
                        return callback('UserNotExisted', null);
                    else
                        callback(null, user);
                });
        },
        function (user, callback) {
            bcrypt.compare(inputUser.password, user.password, function (err, result) {
                if (err)
                    callback(err, null);
                else
                    callback(null, user);
            });
        }
    ], function (err, result) {
        if (callback)
            callback(err, result);
    });
};

module.exports = User;