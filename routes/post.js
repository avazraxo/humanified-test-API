const express = require('express');
const router = express.Router();
const uploadFile = require("../middlewares/upload");
const { getAllPosts, getPostById, addPost, removePost, buildFiles } = require('../controllers/postController')

/**
 * @swagger
 * /posts:
 *   get:
 *     description: All posts
 *     responses:
 *       200:
 *         description: Returns all the posts available
 */
router.get('/', async (req, res) => {
    try {
        const response = await getAllPosts();

        if (response.message) res.status(404).json(response);
        else res.status(200).json(response);
    }
    catch (e) {
        res.status(500).json({ message: e.message });
    }
});

/**
 * @swagger
 * /posts/{id}:
 *   get:
 *     parameters:
 *      - in: path
 *        name: id
 *        required: true
 *        type: string
 *        description: The post ID.
 *     description: Get a post by its ID
 *     responses:
 *       200:
 *         description: Returns the requested post
 */
router.get('/:id', async (req, res) => {
    try {
        let response = await getPostById(req.params.id);
        
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
 * /posts/{id}:
 *   post:
 *     parameters:
 *      - in: path
 *        name: id
 *        required: true
 *        type: string
 *        description: The post ID.
 *      - in: body
 *        name: post
 *        description: New post
 *        schema:
 *          type: object
 *          properties:
 *            name:
 *              type: string
 *            description:
 *              type: string
 *            files:
 *              type: [object]
 *     responses:
 *       201:
 *         description: New post created
 */
router.post('/:id', uploadFile.array('files', 10), async (req, res) => {
    if (!req.params.id) res.status(400).json({ message: `Missing post ID in params` });
    if (!req.body) res.status(400).json({ message: `Missing post body` });
    
    const body = {
        id: req.params.id,
        name: req.body.name,
        description: req.body.description,
    };

    if (req.files) body.files = buildFiles(req.files);

    try {
        const response = await addPost(body);
        res.status(201).json(response);
    }
    catch (e) {
        if (e.message.includes('is required')) res.status(400).json({ message: e.message });
        else res.status(500).json({ message: e.message });
    }
});

/**
 * @swagger
 * /posts/{id}:
 *   delete:
 *     parameters:
 *      - in: path
 *        name: id
 *        required: true
 *        type: string
 *        description: The post ID.
 *     description: Deletes a post by ID
 *     responses:
 *       200:
 *         description: Returns the deleted post
 */
router.delete('/:id', async (req, res) => {
    let response = await removePost(req.params.id)
    
    if (response.deletedPost) {
        res.status(200).json(response);
    } else if (response.message.includes(req.params.id)) {
        res.status(404).json(response);
    } else {
        res.status(500).json(response);
    }
});

module.exports = router;