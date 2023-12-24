class UserValidator {
  static validateRegistrationInput(firstName, lastName, email, password) {
    const errors = {};

    if (!firstName) errors.firstName = "This field is required.";

    if (!lastName) errors.lastName = "This field is required.";

    if (!email) errors.email = "This field is required.";
    else if (!UserValidator.isValidEmail(email))
      errors.email = "Invalid email address.";

    if (!password) errors.password = "This field is required.";
    else if (password.length < 8)
      errors.password = "Password must be at least 8 characters long.";

    if (Object.keys(errors).length > 0) throw errors;
  }

  static isValidEmail(email) {
    const emailRegex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
    return emailRegex.test(email);
  }
}

module.exports = UserValidator;
