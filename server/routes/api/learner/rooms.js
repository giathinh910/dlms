var express = require('express');
var router = express.Router();
var middleware = require('./middleware');
var config = require('../../../config');

var RoomModel = require('../../../model/room');
var MessageModel = require('../../../model/message');

router
    .post('/create-or-get-direct-room', middleware.isTokenValid, function (req, res, next) {
        var data = {
            reqUserId: req.user._id,
            learnerIdToChat: req.body.learnerIdToChat,
            usersInRoom: [req.user._id, req.body.learnerIdToChat]
        };
        RoomModel.createOrGetDirectRoom(data, function (err, room) {
            if (err)
                res.send(err);
            else
                res.send(room);
        })
    });

module.exports = router;
