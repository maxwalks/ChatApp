const jwt = require('jsonwebtoken');
const User = require('../server/models/User');

const maxAge = 3 * 24 * 60 * 60;
const createToken = (id) => {
  return jwt.sign({ id }, 'secret', {
    expiresIn: maxAge
  });
};

module.exports.signup_get = async (req, res) => {
  const user = await User.find();
  res.render("register", {user, errorMessage : undefined});
};

module.exports.login_get = (req, res) => {
  const user = User.find()
  res.render('login', {user, errorMessage : undefined});
}

module.exports.signup_post = async (req, res, next) => {
  try {
    const { username, password } = req.body;
    if (!req.headers['x-forwarded-for']) {
      console.log("No x-forwarded-header detected, server is likely running in localhost.")
      await User.create({ username, password })
    } else {
      const lastip = req.headers['x-forwarded-for']
      await User.create({ username, password, lastip })
    }
    res.redirect("/login");
  } catch (error) {
    next(error)
  }
}

module.exports.login_post = async (req, res, next) => {
  const { username, password } = req.body;
  try {
    const user = await User.login(username, password);
    const token = createToken(user._id);
    res.cookie("jwt", token, { httpOnly: true, maxAge: maxAge * 1000 });
    res.redirect("/");
  } catch (error) {
    next(error);
  }
};

module.exports.logout_get = (req, res) => {
  res.cookie('jwt', '', { maxAge: 1 });
  res.redirect('/');
}