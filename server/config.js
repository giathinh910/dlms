var secret = 'loremipsum';

var env = process.env.NODE_ENV;

switch (env) {
    case 'production':
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
        break;
    default: // development
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
}