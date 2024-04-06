const User = require('../server/models/User');

async function errorHandler(err, req, res, next) {
  const user = User.find()
  if (err.code === 11000) {
    res.render('register', {errorMessage: "Username already exists.", user})
  } else if (err.name === "ValidationError") {
    res.render('register', {errorMessage: "Minimum password length is 4 characters.", user})
  } else if (err.message === "Incorrect password.") {
    res.render('login', {errorMessage: err.message, user})
  } else if (err.message === "User not found.") {
    res.render('login', {errorMessage: err.message, user})
  } else {
    console.error(err.stack);
    res.status(500).json({ error: "Internal Server Error."})
  }
}

module.exports = errorHandler;