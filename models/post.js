const mongoose = require("mongoose");
const Schema  = mongoose.Schema;

const fileSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    file: {
        data: Buffer,
        contentType: String
    }
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

postSchema.set('toJSON', {
    virtuals: true,
    versionKey: false,
    transform: function (doc, ret) {
        delete ret._id;
    }
});

const Post = mongoose.model('Post', postSchema);

module.exports = Post;