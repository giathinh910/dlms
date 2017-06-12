var secret = 'loremipsum';

module.exports = {
    db: {
        url: 'mongodb://mongo/bpm'
    },
    bcrypt: {
        secret: secret,
        saltRounds: 10
    },
    jwt: {
        secret: secret
    },
    session: {
        secret: secret
    },
    userLevel: {
        admin: 1,
        instructor: 11,
        leaner: 21
    }
};