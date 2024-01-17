const emailValidator = (value) => {
  const emailRegex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
  if (!emailRegex.test(value)) return "Invalid email address.";
  return undefined;
};

module.exports = emailValidator;
