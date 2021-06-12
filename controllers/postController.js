const fs = require('fs');
const path = require('path');
const Post = require('../models/post');
const appDir = path.dirname(require.main.filename);

async function getAllPosts() {
    try {
        const posts = await Post.find();
        
        if (!posts) return { message: "Posts not found" };

        return posts;
    } catch (err) {
        throw new Error(err.message);
    }
}

async function getPostById(id) {
    try {
        const post = await Post.findOne({ id });
        
        if (!post) {
            return { message: `Cannot find the post with ID ${id}` };
        }

        return post.toJSON();
    } catch (err) {
        throw new Error(err.message);
    }
}

function buildFiles(files) {
    return files.map((file) => {
        return {
            name: file.filename,
            file: fs.readFileSync(path.join(appDir + '/resources/static/assets/uploads/' + file.filename))
        };
    });
}

async function addPost(body) {
    const newPost = new Post(body);

    try {
        await newPost.save();
        return newPost.toJSON();
    } catch (err) {
        throw new Error(err.message);
    }
}

async function removePost(id) {
    const postToRemove = await Post.findOne({ id });
        
    if (!postToRemove) {
        return { message: `Cannot find post with ID ${id}` };
    }

    try {
        await postToRemove.remove()
        
        return {
            deletedPost: postToRemove.toJSON()
        };
    } catch (err) {
        throw new Error(err.message);
    }
}

module.exports = {
    getAllPosts,
    getPostById,
    addPost,
    removePost,
    buildFiles
}