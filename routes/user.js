const express = require('express');
const router = express.Router();
let { getUserByUserName, addUser, removeUser, authenticate } = require('../controllers/userController')

/**
 * @swagger
 * /users/authenticate:
 *   get:
 *     parameters:
 *      - in: body
 *        name: authInfo
 *        description: authentication info
 *        schema:
 *          type: object
 *          properties:
 *            username:
 *              type: string
 *            password:
 *              type: string
 *     description: Authenticates the user by passing its username and password
 *     responses:
 *       200:
 *         description: Returns the authenticated user and the new token
 */
router.post('/authenticate', async (req, res) => {
    try {
        if (!req.body) res.status(400).json({ message: `Missing authentication body` });
        let response = await authenticate(req.body);
        
        if (!response) res.status(400).json({ message: 'User name or password is incorrect' });
        else res.status(200).json(response);
    }
    catch (e) {
        res.status(500).json({ message: e.message });
    }
});

/**
 * @swagger
 * /users/{userName}:
 *   get:
 *     parameters:
 *      - in: path
 *        name: userName
 *        required: true
 *        type: string
 *        description: The user name.
 *     description: Gets the user profile by its user name
 *     responses:
 *       200:
 *         description: Returns the requested user profile
 */
router.get('/:userName', async (req, res) => {
    try {
        if (!req.params.userName) res.status(400).json({ message: `Missing user name in params` });
        let response = await getUserByUserName(req.params.userName);
        
        if (response.message) res.status(404).json(response);
        else res.status(200).json(response);
    }
    catch (e) {
        if (e.message.includes('required')) res.status(400).json({ message: e.message });
        else res.status(500).json({ message: e.message });
    }
});

/**
 * @swagger
 * /users/register:
 *   post:
 *     parameters:
 *      - in: body
 *        name: user
 *        description: New user
 *        schema:
 *          type: object
 *          properties:
 *            userName:
 *              type: string
 *            firstName:
 *              type: string
 *            lastName:
 *              type: string
 *            password:
 *              type: string
 *            title:
 *              type: string
 *     responses:
 *       201:
 *         description: New user created
 */
router.post('/register', async (req, res) => {
    if (!req.body) res.status(400).json({ message: `Missing user body` });
    if (!req.body.userName) res.status(400).json({ message: `Missing user name in params` });
    
    let body = {
        userName: req.body.userName,
        firstName: req.body.firstName,
        lastName: req.body.lastName,
        password: req.body.password,
        title: req.body.title,
        followers: [],
        following: []
    };

    try {
        let response = await addUser(body);
        res.status(201).json(response);
    }
    catch (e) {
        if (e.message.includes('is required') || e.message.includes('is already taken')) res.status(400).json({ message: e.message });
        else res.status(500).json({ message: e.message });
    }
});

/**
 * @swagger
 * /users/{userName}:
 *   delete:
 *     parameters:
 *      - in: path
 *        name: userName
 *        required: true
 *        type: string
 *        description: The user name.
 *     description: Deletes a post by its user name
 *     responses:
 *       200:
 *         description: Returns the deleted user
 */
router.delete('/:userName', async (req, res) => {
    let response = await removeUser(req.params.userName)
    
    if (response.deletedUser) {
        res.status(200).json(response);
    } else if (response.message.includes(req.params.userName)) {
        res.status(404).json(response);
    } else {
        res.status(500).json(response);
    }
});

module.exports = router;