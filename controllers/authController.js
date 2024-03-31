const jwt = require('jsonwebtoken');
const User = require('../server/models/User');
const Post = require('../server/models/post')
const UserCollection = require('../server/models/User')

const maxAge = 3 * 24 * 60 * 60;
const createToken = (id) => {
  return jwt.sign({ id }, 'secret', {
    expiresIn: maxAge
  });
};

module.exports.signup_get = async (req, res) => {
    try {
        const user = await User.find()
        res.render('register', {user})
    } catch (error) {
        console.log(error)
    }
}

module.exports.login_get = (req, res) => {
    const user = User.find()
  res.render('login', {user});
}

module.exports.signup_post = async (req, res) => {
  const { username, password } = req.body;

  try {
    const user = await User.create({ username, password });
    const token = createToken(user._id);
    res.cookie('jwt', token, { httpOnly: true, maxAge: maxAge * 1000 });
    res.status(201).json({ user: user._id });
  }
  catch(err) {
    console.log(err)
  }
 
}

module.exports.login_post = async (req, res) => {
  const { username, password } = req.body;

  try {
    const user = await User.login(username, password);
    const token = createToken(user._id);
    res.cookie('jwt', token, { httpOnly: true, maxAge: maxAge * 1000 });
    res.status(200).json({ user: user._id });
  } 
  catch (err) {
    console.log(err)
  }

}

module.exports.logout_get = (req, res) => {
  res.cookie('jwt', '', { maxAge: 1 });
  res.redirect('/');
}