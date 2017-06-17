var jwt = require('jsonwebtoken');
var request = require('request');
var config = require('../../config');
var _ = require('lodash');
var util = require('util');

var MessageModel = require('../../model/message');

var onlineLearners = [
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
            // console.log('socket handshake established');
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
        // var decoded = jwt.decode(socket.request._query['token'], {complete: true}),
        //     decodedUser = decoded.payload;

        handleLearnerChat(socket);
    });
};

function handleLearnerChat(socket) {
    // console.log('an learner connected');

    /*=== WHEN INITIALIZING ===*/
    // request init data
    socket.on('request init data for learner', function () {
        socket.emit('respond init data for learner', {
            onlineLearners: onlineLearners
        });
    });

    // get learner info from token
    var decoded = jwt.decode(socket.request._query['token'], {complete: true}),
        decodedUser = decoded.payload;

    // check if learner is existed
    var onlineLearnerIndex = _.findIndex(onlineLearners, function (onlineLearner) {
        return onlineLearner.user._id === decodedUser._id;
    });

    // case learner hasn't existed, create new
    if (onlineLearnerIndex === -1) {
        var onlineLearner = {
            sockets: [socket.id],
            user: decodedUser
        };
        onlineLearners.push(onlineLearner);
        socket.broadcast.emit('a learner comes online', onlineLearner);
        // console.log('a learner comes online');
    }
    // case learner existed, just push socket id
    else {
        onlineLearners[onlineLearnerIndex].sockets.push(socket.id)
    }

    // console.log('online learners', util.inspect(onlineLearners, {showHidden: false, depth: null}));


    /*=== CHAT TIME  ===*/
    socket.on('learner wants to join room', function (roomId) {
        socket.join(roomId);
    });

    socket.on('learner says in room', function (message) {
        // send message to room
        socket.to(message.room).emit('learner says in room', message);

        // save message to db
        MessageModel.createOne({
            createdBy: decodedUser._id,
            room: message.room,
            content: message.content
        }, function (err, r) {
            if (err)
                socket.emit('save message failed', r);
            else {
                socket.emit('save message success', r);

                // announce the receiver in case he online && isn't in room yet (auto popup chat box). Place in this callback to make sure when popup appears the latest message is saved success
                var onlineLearnerIndex = _.findIndex(onlineLearners, function (onlineLearner) {
                    return onlineLearner.user._id === message.receiver._id;
                });
                if (onlineLearnerIndex !== -1) {
                    onlineLearners[onlineLearnerIndex].sockets.forEach(function (socketId) {
                        socket.to(socketId).emit('a learner says', message);
                    })
                }
            }
        })
    });

    /*=== WHEN THIS LEARNER GOES OFFLINE ===*/
    socket.on('disconnect', function () {
        // console.log('a learner disconnected', socket.id);

        // find the online learner by socket.id
        var onlineLearnerIndex = _.findIndex(onlineLearners, function (onlineLearner) {
            if (_.indexOf(onlineLearner.sockets, socket.id) !== -1)
                return true;
        });

        // find socket id index by socket.id
        var onlineLearnerSocketIndex = _.indexOf(onlineLearners[onlineLearnerIndex].sockets, socket.id);

        // remove the socket.id from that learner
        onlineLearners[onlineLearnerIndex].sockets.splice(onlineLearnerSocketIndex, 1);

        // if sum of socket id of that learner equals 0, then remove that user (come offline)
        if (onlineLearners[onlineLearnerIndex].sockets.length === 0) {
            socket.broadcast.emit('a learner comes offline', onlineLearners[onlineLearnerIndex]);
            onlineLearners.splice(onlineLearnerIndex, 1);
        }

        // console.log('online learners', util.inspect(onlineLearners, {showHidden: false, depth: null}));
    });
}