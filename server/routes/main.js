const express = require('express');
const router = express.Router();
const Post = require('../models/post');
const User = require('../models/User');
const { requireAuth, checkUser } = require('../../middleware/authMiddleware');
const authController = require('../../controllers/authController');
const jwt = require('jsonwebtoken')

router.get('/signup', authController.signup_get);
router.post('/signup', authController.signup_post);
router.get('/login', authController.login_get);
router.post('/login', authController.login_post);
router.get('/logout', authController.logout_get);

router.get('/', requireAuth, async (req, res) => {
    try {
        const data = await Post.find()
        const token = req.cookies.jwt;
        jwt.verify(token, "net ninja secret", async (err, decodedToken) => {
            const user = await User.findById(decodedToken.id);
            const locals = {
                username: user.username
            }
            res.render('index', {data, user})
          });
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
        handleErrors()
    }
});

module.exports = router;