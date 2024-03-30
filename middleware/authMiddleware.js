const jwt = require('jsonwebtoken');
const User = require('../server/models/User');
const Post = require('../server/models/post');

const requireAuth = (req, res, next) => {
  try {
    const token = req.cookies.jwt;
    if (token) {
      jwt.verify(token, "net ninja secret", (err, decodedToken) => {
        if (err) {
          console.log(err.message);
          res.redirect("/login");
        } else {
          next();
          console.log(decodedToken);
        }
      });
    } else {
      res.redirect("/login");
    }
  } catch (error) {
    console.log(error)
  }
};

const checkUser = (req, res, next) => {
  try {
    const token = req.cookies.jwt;
    if (token) {
      jwt.verify(token, "net ninja secret", async (err, decodedToken) => {
        if (err) {
          res.locals.user = null;
          next();
        } else {
          const user = await User.findById(decodedToken.id);
          res.locals.user = user;
          next();
        }
      });
    } else {
      res.locals.user = null;
      next();
    }
  } catch (error) {
    console.log(error);
  }
};


module.exports = { requireAuth, checkUser };