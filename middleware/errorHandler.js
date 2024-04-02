const User = require('../server/models/User');

async function errorHandler(err, req, res, next) {
  if (err.code === 11000) {
    const user = await User.find()
    res.render('register', {errorMessage: "Username already exists.", user})
  }
  if (err.name === "ValidationError") {
    const user = await User.find()
    res.render('register', {errorMessage: "Minimum password length is 4 characters.", user})
  }
  if (err.message === "Incorrect password.") {
    const user = await User.find()
    res.render('login', {errorMessage: err.message, user})
  }
  if (err.message === "User not found.") {
    const user = await User.find()
    res.render('login', {errorMessage: err.message, user})
  }
  console.error(err.stack);
  res.status(500).json({ error: "Internal Server Error."})
}

module.exports = errorHandler;