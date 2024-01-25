const addError = (errors, key, value) => {
  if (value !== undefined) {
    errors[key] = value;
  }
};

module.exports = { addError };
