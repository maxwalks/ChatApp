function errorHandler(err, req, res, next) {
  if (err.code === 11000) {
    res.status(500).json({ error: "Username already exists" });
  }
  if (err.name === "ValidationError") {
    res.status(500).json({ error: "Minimum password length is 4 characters."})
  }
  if (err.message === "incorrect password") {
    res.status(500).json({ error : "Incorrect password."})
  }
  if (err.message === "incorrect username") {
    res.status(500).json({ error : "User not found."})
  }
  console.error(err.stack);
  res.status(500).json({ error: "Internal Server Error" });
}

module.exports = errorHandler;