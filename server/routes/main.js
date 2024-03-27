const express = require('express');
const router = express.Router();
const Post = require('../models/post');


router.get('/', async (req,res) => {
    try {
        const data = await Post.find()
        res.render('index', {data})
    } catch (error) {
        console.log(error)
    }
})

router.post('/send', async (req, res) => {
    try {
        const NewMessage = new Post({
            message : req.body.message
        })
        await Post.create(NewMessage)
        res.redirect('/')
    } catch (error) {
        console.log(error);
    }
})

module.exports = router;