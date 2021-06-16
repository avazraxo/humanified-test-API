const expressJwt = require('express-jwt');
const config = require('../config/config.json');
const userController = require('../controllers/userController');

module.exports = jwt;

function jwt() {
    const secret = config.secret;
    return expressJwt({ secret, algorithms: ['HS256'], isRevoked }).unless({
        path: [
            // Routes that requires authentication
            { url: /^(?!\/api\/v1\/posts\/).+$/, methods: ['GET', 'PUT'] },
            { url: /^(?!\/api\/v1\/users\/).+$/, methods: ['GET', 'PUT'] },

            // Routes that does not require authentication
            /\/api\/v1\/users\/authenticate/i,
            /\/api\/v1\/users\/register/i,
            /\/api-docs/i,
            /\/favicon.ico/i
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