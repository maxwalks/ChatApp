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
  } else if (error.name === "CastError") {
    res.status(400).json({ error: "Invalid Post Id" })
  } else if (error.message == "passwordValidationError") {
    res.render("register", { user, errorMessage : "Password should not contain spaces and must be alphanumeric." })
  } else if (error.message == "usernameValidationError") {
    res.render("register", {user, errorMessage : "Username should not contain spaces and must be alphanumeric."})
  } else {
    console.error(error.stack);
    res.status(500).json({ error: "Internal Server Error."})
  }
}

module.exports = errorHandler;