const Post = require('../models/post');

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

        return post;
    } catch (err) {
        throw new Error(err.message);
    }
}

async function addPost(body) {
    const newPost = new Post(body);

    try {
        return await newPost.save();
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
            deletedPost: postToRemove,
        };
    } catch (err) {
        throw new Error(err.message);
    }
}

module.exports = {
    getAllPosts,
    getPostById,
    addPost,
    removePost
}