var jwt = require('jsonwebtoken');
var request = require('request');
var config = require('../../config');
var _ = require('lodash');
var util = require('util');

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

        handleLearnerChat(socket);
    });
};

function handleLearnerChat(socket) {
    console.log('an learner connected');

    // request init data
    socket.on('request init data for learner', function () {
        socket.emit('respond init data for learner', {
            onlineLearners: onlineLearners
        });
    });

    // get learner info from token
    var decoded = jwt.decode(socket.request._query['token'], {complete: true}),
        decodedUser = decoded.payload;

    // check if learner is online
    var onlineLearnerIndex = _.findIndex(onlineLearners, function (onlineLearner) {
        return onlineLearner.user._id === decodedUser._id;
    });

    // case learner hasn't existed, create new
    if (onlineLearnerIndex === -1) {
        onlineLearners.push({
            sockets: [socket.id],
            user: decodedUser
        });
        socket.broadcast.emit('a learner comes online', decodedUser);
        console.log('a learner comes online');
    }
    // case learner existed, just push socket id
    else {
        onlineLearners[onlineLearnerIndex].sockets.push(socket.id)
    }

    console.log('online learners', util.inspect(onlineLearners, {showHidden: false, depth: null}));

    /*=== WHEN THIS LEARNER GOES OFFLINE ===*/
    socket.on('disconnect', function () {
        console.log('a learner disconnected', socket.id);

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
            socket.broadcast.emit('a learner comes offline', onlineLearners[onlineLearnerIndex].user);
            onlineLearners.splice(onlineLearnerIndex, 1);
        }

        console.log('learners', util.inspect(onlineLearners, {showHidden: false, depth: null}));
    });
}