const { body, validationResult } = require("express-validator");

const userValidationRules = () => {
  return [
    body("username", "usernameValidationError").notEmpty().isAlphanumeric(),
    body("password", "passwordValidationError").isAlphanumeric(),
  ];
};

const validate = (req, res, next) => {
  const errors = validationResult(req);
  if (errors.isEmpty()) {
    return next();
  }
  const extractedErrors = [];
  errors.array().map((err) => extractedErrors.push({ msg: err.msg }));
  const FinalErrormsg = extractedErrors.length > 0 ? extractedErrors[0].msg : null;
  throw new Error(FinalErrormsg)
};

module.exports = {
    userValidationRules,
    validate,
}