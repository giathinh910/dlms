var jwt = require('jsonwebtoken');
var request = require('request');
var config = require('../../config');
var _ = require('lodash');
var util = require('util');

var onlineUsers = [
    // {
    //     sockets: [],
    //     user: {
    //         _id: '',
    //         email: '',
    //         displayName: '',
    //         level: '',
    //         domain: ''
    //     }
    // }
];

module.exports = function (io) {
    // Establish handshake
    io.use(function (socket, next) {
        var handshakeData = socket.request;
        var token = handshakeData._query['token'];
        try {
            var user = jwt.verify(token, config.jwt.secret);
            console.log('socket handshake established');
            if (user)
                next();
        } catch (err) {
            console.log('jwt verify failed', {
                name: err.name,
                message: err.message
            });
            next(new Error('Authentication error'));
        }
    });

    io.of('/ws/chat').on('connect', function (socket) {
        var decoded = jwt.decode(socket.request._query['token'], {complete: true}),
            decodedUser = decoded.payload;

        //
    });
};
