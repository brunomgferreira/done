const { addError } = require("../../utils/errorUtils");
const isRequiredValidator = require("../../validators/isRequiredValidator");
const emailValidator = require("../../validators/emailValidator");
const isUnique = require("../../validators/isUniqueValidator");
const passwordValidator = require("../../validators/passwordValidator");

const validateRegistrationInput = async (
  firstName,
  lastName,
  email,
  password
) => {
  const errors = {};

  const isValidEmail = async (email) => {
    if (!email) return isRequiredValidator(email);

    const emailValidationResult = emailValidator(email);

    if (emailValidationResult) {
      return emailValidationResult;
    } else {
      const isUniqueResult = await isUnique(email, "user", "email");
      return isUniqueResult;
    }
  };

  const isValidPassword = (password) => {
    if (!password) return isRequiredValidator(password);
    else return passwordValidator(password);
  };

  const [firstNameError, lastNameError, emailError, passwordError] =
    await Promise.all([
      isRequiredValidator(firstName),
      isRequiredValidator(lastName),
      isValidEmail(email),
      isValidPassword(password),
    ]);

  addError(errors, "firstName", firstNameError);
  addError(errors, "lastName", lastNameError);
  addError(errors, "email", emailError);
  addError(errors, "password", passwordError);

  if (Object.keys(errors).length > 0) throw errors;
};

module.exports = { validateRegistrationInput: validateRegistrationInput };
