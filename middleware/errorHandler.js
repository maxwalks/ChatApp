const User = require('../server/models/user');

async function errorHandler(error, req, res, next) {
  const user = User.find()
  if (error.code === 11000) {
    res.render('register', {errorMessage: "Username already exists.", user})
  } else if (error.name === "ValidationError") {
    res.render('register', {errorMessage: "Minimum password length is 4 characters.", user})
  } else if (error.message === "Incorrect password.") {
    res.render('login', {errorMessage: error.message, user})
  } else if (error.message === "User not found.") {
    res.render('login', {errorMessage: error.message, user})
  } else {
    console.error(error.stack);
    res.status(500).json({ error: "Internal Server Error."})
  }
}

module.exports = errorHandler;