var mongoose = require('mongoose');
var async = require('async');
var _ = require('lodash');

var User = require('./user');
var Message = require('./message');

var Schema = mongoose.Schema;

var roomSchema = new Schema(
    {
        displayName: String,
        users: [{
            type: Schema.Types.ObjectId,
            ref: 'User',
            required: true
        }],
        isDirectRoom: {
            type: Boolean,
            required: true
        }
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

// check if room existed, if it did, return room, else create room
Room.findOrCreateDirectRoom = function (data, callback) {
    if (data.reqUserId === data.learnerIdToChat) {
        callback({
            error: 'TuKyAhDcm'
        });
        return;
    }
    async.waterfall([
        function (callback) { // check if room existed
            Room
                .findOne({
                    isDirectRoom: true,
                    users: {
                        $all: data.usersInRoom // matching regardless of order
                    }
                })
                .exec(function (err, room) {
                    if (err)
                        return callback(err, null);
                    else {
                        if (room)
                            return callback('RoomExisted', room); // trick to break waterfall
                        else
                            callback(null, null)
                    }
                })
        },
        function (foo, callback) { // if room hasn't existed, create a new one
            Room.create({
                name: '',
                users: data.usersInRoom,
                isDirectRoom: true
            }, function (err, room) {
                if (err)
                    callback(err, null);
                else
                    callback(null, room)
            })
        }
    ], function (err, room) {
        async.parallel({
            room: function (callback) {
                User.findById(data.learnerIdToChat, function (err, user) {
                    if (err)
                        callback(err, null);
                    else {
                        room.displayName = user.displayName;
                        callback(null, room);
                    }
                });
            },
            messages: function (callback) {
                Message
                    .find({
                        room: room._id
                    })
                    .populate('createdBy')
                    .exec(function (err, messages) {
                        if (err)
                            callback(err, null);
                        else {
                            if (!messages)
                                callback(null, []);
                            else
                                callback(null, messages)
                        }
                    })
            }
        }, function (err, roomAndMessages) {
            callback(err, roomAndMessages);
        });
    });
};

module.exports = Room;