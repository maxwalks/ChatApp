const express = require('express');
const router = express.Router();
const Post = require('../models/post');


router.get('/', (req,res) => {
    res.render('index')
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