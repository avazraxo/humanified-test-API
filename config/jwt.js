const expressJwt = require('express-jwt');
const config = require('../config/config.json');
const userController = require('../controllers/userController');

module.exports = jwt;

function jwt() {
    const secret = config.secret;
    return expressJwt({ secret, algorithms: ['HS256'], isRevoked }).unless({
        path: [
            // public routes that don't require authentication
            '/users/authenticate',
            '/users/register',
            /^\/api-docs\//,
            /^\/favicon.ico\//
        ]
    });
}

async function isRevoked(req, payload, done) {
    const user = await userController.getUserByUserName(payload.sub);

    // revoke token if user no longer exists
    if (!user) {
        return done(null, true);
    }

    done();
};