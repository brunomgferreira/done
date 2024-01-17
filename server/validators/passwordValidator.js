const passwordValidator = (value) => {
  if (value.length < 8) return "Password must be at least 8 characters long.";
  return undefined;
};

module.exports = passwordValidator;
