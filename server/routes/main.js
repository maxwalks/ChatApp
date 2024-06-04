const express = require('express');
const router = express.Router();
const Post = require('../models/post');
const User = require('../models/user');
const { requireAuth } = require('../../middleware/authMiddleware');
const authController = require('../../controllers/authController');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt')
const { userValidationRules, validate } = require("../../middleware/validator")

router.get('/signup', authController.signup_get);
router.post('/signup', userValidationRules(), validate, authController.signup_post);
router.get('/login', authController.login_get);
router.post('/login', authController.login_post);
router.get('/logout', authController.logout_get);



router.get("/", requireAuth, async (req, res) => {
    try {
        const data = await Post.find()
        const token = req.cookies.jwt;
        jwt.verify(token, 'secret', async (err, decodedToken) => {
            const user = await User.findById(decodedToken.id);
            if (!user) {
                res.cookie('jwt', '', { maxAge : 1 })
                res.redirect('/login')
            } else {
                const locals = {
                    username: user.username
                };
                res.render('index', {data, user, locals})
            }
        })
    } catch (error) {
        console.log(error)
    }
});

router.post('/send', requireAuth, async (req, res) => {
    try {
        const token = req.cookies.jwt;
        jwt.verify(token, "secret", async (err, decodedToken) => {
            const user = await User.findById(decodedToken.id);
            const NewMessage = new Post({
                message : req.body.message,
                author : user.username
            })
            await Post.create(NewMessage)
            res.redirect('/')
          });
    } catch (error) {
        console.log(error)
    }
});

router.get('/settings', requireAuth, async (req, res, next) => {
    const token = req.cookies.jwt
    jwt.verify(token, "secret", async (err, decodedToken) => {
        const user = await User.findById(decodedToken.id)
        res.render('settings', {user})
    })
})

router.post('/update', requireAuth, async (req, res, next) => {
    try {
        const token = req.cookies.jwt;
        jwt.verify(token, "secret", async (err, decodedToken) => {
          const user = await User.findById(decodedToken.id);
          const filter = { _id: user._id }
          const update = { bio: req.body.input }
          await User.findOneAndUpdate(filter, update);
          res.render('settings', { user, successMessage : "Bio successfully updated." })
        });
    } catch (error) {
        next(error)
    }
})

router.get('/post/:id', async (req, res, next) => {
    try {
        let slug = req.params.id;
        const post = await Post.findOne({ _id: slug })
        if(!post) {
            res.status(404).json({ error : "Post not found." })
        } else {
            const token = req.cookies.jwt;
            jwt.verify(token, "secret", async (err, decodedToken) => {
              const user = await User.findById(decodedToken.id);
              const author = await User.findOne({ username: post.author });
              res.render("postinfo", { user, author });
            });
        }
    } catch (error) {
        next(error)
    }
})

router.get('/settings/security', requireAuth, (req, res, next) => {
    try {
        const token = req.cookies.jwt;
        jwt.verify(token, "secret", async (err, decodedToken) => {
          const user = await User.findById(decodedToken.id);
          res.render("security", { user });
        });
    } catch (error) {
        next(error)
    }
})

router.post('/updatepassword', requireAuth, (req, res, next) => {
    try {
        const token = req.cookies.jwt;
        jwt.verify(token, "secret", async (err, decodedToken) => {
            const user = await User.findById(decodedToken.id)
            if(!user) {
                res.cookie('jwt', '', { maxAge : 1 })
                res.redirect('/login')
            } else {
                const filter = { _id : user._id }
                const salt = await bcrypt.genSalt(10);
                req.body.password = await bcrypt.hash(req.body.password, salt);
                const update = { password : req.body.password }
                await User.findByIdAndUpdate(filter, update);
                res.render('security', {user, successMessage : "Password successfully updated."})
            }
        })
    } catch (error) {
        next(error)
    }
})

module.exports = router;