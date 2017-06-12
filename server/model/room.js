var mongoose = require('mongoose');
var async = require('async');
var _ = require('lodash');

var User = require('./user');

var Schema = mongoose.Schema;

var roomSchema = new Schema(
    {
        displayName: String,
        users: [{
            type: Schema.Types.ObjectId,
            ref: 'User',
            required: true
        }]
    },
    {
        timestamps: true
    }
);

var Room = mongoose.model('Room', roomSchema);

Room.createOne = function (data, callback) {
    Room.create(data, function (err, r) {
        callback(err, r);
    });
};

Room.getOneByCustomerId = function (customerId, callback) {
    Room
        .findOne({
            users: {
                $in: [customerId]
            }
        })
        .select('_id displayName')
        .exec(function (err, r) {
            callback(err, r);
        })
};

module.exports = Room;