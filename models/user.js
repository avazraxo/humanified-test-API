const mongoose = require("mongoose");
const Schema  = mongoose.Schema;

const userSchema = new Schema({
    userName: {
        type: String,
        required: true,
        unique: true
    },
    firstName: {
        type: String,
        required: true
    },
    lastName: {
        type: String,
        required: true
    },
    title: {
        type: String,
        required: true
    },
    followers: {
        type: [String]
    },
    following: {
        type: [String]
    },
    hash: { 
        type: String,
        required: true
    }
});

userSchema.set('toJSON', {
    virtuals: true,
    versionKey: false,
    transform: function (doc, ret) {
        delete ret._id;
        delete ret.hash;
    }
});

const User = mongoose.model('User', userSchema);

module.exports = User;