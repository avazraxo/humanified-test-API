const User = require('../models/user');
const config = require('../config/config.json');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

async function getUserByUserName(userName) {
    try {
        const user = await User.findOne({ userName });
        
        if (!user) {
            return { message: `Cannot find the user with user name ${userName}` };
        }

        return {
            userName: user.userName,
            firstName: user.firstName,
            lastName: user.lastName,
            title: user.title,
            followers: user.followers,
            following: user.following
        };
    } catch (err) {
        throw new Error(err.message);
    }
}

async function authenticate({ userName, password }) {
    try {
        const user = await User.findOne({ userName });
        
        if (user && bcrypt.compareSync(password, user.hash)) {
            const token = jwt.sign({ sub: user.id }, config.secret, { expiresIn: '7d' });
            return {
                ...user.toJSON(),
                token
            };
        }
    }
    catch (e) {
        throw new Error(e.message);
    }
}

async function addUser(body) {
    if (await User.findOne({ username: body.username })) {
        throw new Error(`User name ${body.username} is already taken`);
    }
    
    const newUser = new User(body);

    if (body.password) {
        newUser.hash = bcrypt.hashSync(body.password, 10);
    }

    try {
        await newUser.save();
        return newUser;
    } catch (err) {
        throw new Error(err.message);
    }
}

async function removeUser(userName) {
    const userToRemove = await User.findOne({ userName });
        
    if (!userToRemove) {
        return { message: `Cannot find user with user name ${userName}` };
    }

    try {
        await userToRemove.remove()
        
        return {
            deletedUser: userToRemove,
        };
    } catch (err) {
        throw new Error(err.message);
    }
}

module.exports = {
    getUserByUserName,
    addUser,
    authenticate,
    removeUser
}