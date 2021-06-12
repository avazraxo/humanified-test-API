const mongoose = require("mongoose");
const Schema  = mongoose.Schema;

const fileSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    sourcePath: {
        type: String,
        required: true
    },
});

const postSchema = new Schema({
    id: {
        type: String,
        required: true
    },
    name: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    files: {
        type: [fileSchema],
    },
});

const Post = mongoose.model('Post', postSchema);

module.exports = Post;