import { isContainLeadingTrailingWhitespace } from '../../elements/loginValidation';
import { ALL_LOWERCASE_LETTERS, ALL_NUMBERS, ALL_SPECIAL_CHARACTERS, ALL_UPPERCASE_LETTERS } from './validationRegex';
import * as variablesRegPage from './variablesForRegistrationPage';

const MIN_AGE = 13;
const MAX_AGE = 100;
const LENGTH_VALID_ALL_INPUTS = 13;
const LENGTH_VALID_INPUTS_WITHOUT_BILLING_FORM = 9;
const LENGTH_INVALID_INPUTS = 0;

export function showErrorOnRegistration(
  input: HTMLInputElement,
  error: HTMLDivElement,
  isInvalid: boolean,
  textContentForError = '',
) {
  if (isInvalid === true) {
    error.style.display = 'block';
    error.style.marginTop = '0.25rem';
    error.style.marginBottom = '7px';
    input.style.marginBottom = '0px';
    input.classList.add('is-invalid');
    input.classList.remove('is-valid');
    error.textContent = textContentForError;
  } else {
    input.style.marginBottom = '16px';
    error.style.display = 'none';
    error.style.marginTop = '0px';
    input.classList.remove('is-invalid');
    input.classList.add('is-valid');
  }
  activateSubmitButton();
}

export function validateInputFirstName() {
  if (variablesRegPage.inputForFirstName.value === '') {
    showErrorOnRegistration(
      variablesRegPage.inputForFirstName,
      variablesRegPage.errorForInputFirstName,
      true,
      'First name must contain at least one character',
    );
  } else if (
    ALL_NUMBERS.test(variablesRegPage.inputForFirstName.value) ||
    ALL_SPECIAL_CHARACTERS.test(variablesRegPage.inputForFirstName.value)
  ) {
    showErrorOnRegistration(
      variablesRegPage.inputForFirstName,
      variablesRegPage.errorForInputFirstName,
      true,
      'First name must not contain special characters or numbers',
    );
  } else {
    showErrorOnRegistration(variablesRegPage.inputForFirstName, variablesRegPage.errorForInputFirstName, false);
  }
}

export function validateInputLastName() {
  if (variablesRegPage.inputForLastName.value === '') {
    showErrorOnRegistration(
      variablesRegPage.inputForLastName,
      variablesRegPage.errorForInputLastName,
      true,
      'First name must contain at least one character',
    );
  } else if (
    ALL_NUMBERS.test(variablesRegPage.inputForLastName.value) ||
    ALL_SPECIAL_CHARACTERS.test(variablesRegPage.inputForLastName.value)
  ) {
    showErrorOnRegistration(
      variablesRegPage.inputForLastName,
      variablesRegPage.errorForInputLastName,
      true,
      'First name must not contain special characters or numbers',
    );
  } else {
    showErrorOnRegistration(variablesRegPage.inputForLastName, variablesRegPage.errorForInputLastName, false);
  }
}

export function validateInputEmail() {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (variablesRegPage.inputForEmail.value === '') {
    showErrorOnRegistration(
      variablesRegPage.inputForEmail,
      variablesRegPage.errorForInputEmail,
      true,
      'This field is required',
    );
  } else if (
    variablesRegPage.inputForEmail.validity.typeMismatch ||
    !emailRegex.test(variablesRegPage.inputForEmail.value)
  ) {
    showErrorOnRegistration(
      variablesRegPage.inputForEmail,
      variablesRegPage.errorForInputEmail,
      true,
      'Email must be properly formatted (e.g., user@example.com)',
    );
  } else if (variablesRegPage.inputForEmail.validity.tooShort) {
    showErrorOnRegistration(
      variablesRegPage.inputForEmail,
      variablesRegPage.errorForInputEmail,
      true,
      `Email should be at least 8 characters; you entered ${variablesRegPage.inputForEmail.value.length}`,
    );
  } else if (isContainLeadingTrailingWhitespace(variablesRegPage.inputForEmail.value)) {
    showErrorOnRegistration(
      variablesRegPage.inputForEmail,
      variablesRegPage.errorForInputEmail,
      true,
      'Email must not contain leading or trailing whitespace',
    );
  } else {
    showErrorOnRegistration(variablesRegPage.inputForEmail, variablesRegPage.errorForInputEmail, false);
  }
}

function validateBirthDate() {
  const selectedDate = new Date(variablesRegPage.inputForBirthDate.value);
  const currentDate = new Date();
  const ageDifference = currentDate.getFullYear() - selectedDate.getFullYear();

  if (variablesRegPage.inputForBirthDate.value === '') {
    showErrorOnRegistration(
      variablesRegPage.inputForBirthDate,
      variablesRegPage.errorForInputBirth,
      true,
      'This field is required',
    );
    variablesRegPage.containerForInputBirth.style.marginBottom = '0px';
  } else if (ageDifference < MIN_AGE) {
    showErrorOnRegistration(
      variablesRegPage.inputForBirthDate,
      variablesRegPage.errorForInputBirth,
      true,
      'Minimum age must be at least 13 years',
    );
    variablesRegPage.containerForInputBirth.style.marginBottom = '0px';
  } else if (ageDifference > MAX_AGE) {
    showErrorOnRegistration(
      variablesRegPage.inputForBirthDate,
      variablesRegPage.errorForInputBirth,
      true,
      'Age cannot exceed 100 years',
    );
    variablesRegPage.containerForInputBirth.style.marginBottom = '0px';
  } else {
    variablesRegPage.containerForInputBirth.style.marginBottom = '16px';
    showErrorOnRegistration(variablesRegPage.inputForBirthDate, variablesRegPage.errorForInputBirth, false);
  }
}

export function replaceInputType() {
  variablesRegPage.inputForBirthDate.type = 'date';
  variablesRegPage.inputForBirthDate.removeEventListener('click', replaceInputType);
  variablesRegPage.inputForBirthDate.addEventListener('input', validateBirthDate);
}

export function validateInputPassword() {
  if (variablesRegPage.inputForPassword.value === '') {
    variablesRegPage.containerForInputPassword.style.marginBottom = '0px';
    showErrorOnRegistration(
      variablesRegPage.inputForPassword,
      variablesRegPage.errorForInputPassword,
      true,
      'This field is required',
    );
  } else if (variablesRegPage.inputForPassword.value.includes(' ')) {
    variablesRegPage.containerForInputPassword.style.marginBottom = '0px';
    showErrorOnRegistration(
      variablesRegPage.inputForPassword,
      variablesRegPage.errorForInputPassword,
      true,
      'Password must not contain whitespace',
    );
  } else if (!ALL_NUMBERS.test(variablesRegPage.inputForPassword.value)) {
    variablesRegPage.containerForInputPassword.style.marginBottom = '0px';
    showErrorOnRegistration(
      variablesRegPage.inputForPassword,
      variablesRegPage.errorForInputPassword,
      true,
      'Password must must contain at least one digit',
    );
  } else if (!ALL_LOWERCASE_LETTERS.test(variablesRegPage.inputForPassword.value)) {
    variablesRegPage.containerForInputPassword.style.marginBottom = '0px';
    showErrorOnRegistration(
      variablesRegPage.inputForPassword,
      variablesRegPage.errorForInputPassword,
      true,
      'Password must must contain at least one lowercase letter',
    );
  } else if (!ALL_UPPERCASE_LETTERS.test(variablesRegPage.inputForPassword.value)) {
    variablesRegPage.containerForInputPassword.style.marginBottom = '0px';
    showErrorOnRegistration(
      variablesRegPage.inputForPassword,
      variablesRegPage.errorForInputPassword,
      true,
      'Password must must contain at least one uppercase letter',
    );
  } else if (!ALL_SPECIAL_CHARACTERS.test(variablesRegPage.inputForPassword.value)) {
    variablesRegPage.containerForInputPassword.style.marginBottom = '0px';
    showErrorOnRegistration(
      variablesRegPage.inputForPassword,
      variablesRegPage.errorForInputPassword,
      true,
      'Password must must contain at least one special character (e.g., !@#$%^&*)',
    );
  } else if (variablesRegPage.inputForPassword.value.length < 8) {
    variablesRegPage.containerForInputPassword.style.marginBottom = '0px';
    showErrorOnRegistration(
      variablesRegPage.inputForPassword,
      variablesRegPage.errorForInputPassword,
      true,
      `Password should be at least 8 characters; you entered ${variablesRegPage.inputForPassword.value.length}`,
    );
  } else {
    variablesRegPage.containerForInputPassword.style.marginBottom = '16px';
    showErrorOnRegistration(variablesRegPage.inputForPassword, variablesRegPage.errorForInputPassword, false);
  }
}

export function activateSubmitButton() {
  if (document.body.contains(variablesRegPage.billingAddressForm)) {
    if (document.querySelectorAll('.is-valid').length === LENGTH_VALID_ALL_INPUTS) {
      variablesRegPage.buttonSignUp.classList.remove('disabled');
    }
  }

  if (document.querySelectorAll('.is-valid').length === LENGTH_VALID_INPUTS_WITHOUT_BILLING_FORM) {
    variablesRegPage.buttonSignUp.classList.remove('disabled');
  }

  if (document.querySelectorAll('.is-invalid').length > LENGTH_INVALID_INPUTS) {
    variablesRegPage.buttonSignUp.classList.add('disabled');
  }

  if (document.querySelectorAll('.is-valid').length === 0) {
    variablesRegPage.buttonSignUp.classList.add('disabled');
  }
}
