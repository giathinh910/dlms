var mongoose = require('mongoose');
var async = require('async');

var Schema = mongoose.Schema;

var messageSchema = new Schema(
    {
        createdBy: {
            type: Schema.Types.ObjectId,
            ref: 'User',
            required: true
        },
        room: {
            type: Schema.Types.ObjectId,
            ref: 'Room',
            required: true
        },
        content: String
    },
    {
        timestamps: true
    }
);

var Message = mongoose.model('Message', messageSchema);

Message.createOne = function (data, callback) {
    var message = {
        createdBy: data.createdBy,
        room: data.room,
        content: data.content
    };
    Message.create(message, function (err, r) {
        callback(err, r);
    })
};

module.exports = Message;