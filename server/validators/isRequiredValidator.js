const isRequiredValidator = (value) => {
  if (!value) return "This field is required.";
  return undefined;
};

module.exports = isRequiredValidator;
