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

export function validateInputFirstName(nameInput?: HTMLInputElement, error?: HTMLDivElement) {
  const firstNameInput = nameInput ? nameInput : variablesRegPage.inputForFirstName;
  const errorBlock = error ? error : variablesRegPage.errorForInputFirstName;

  if (firstNameInput.value === '') {
    showErrorOnRegistration(firstNameInput, errorBlock, true, 'First name must contain at least one character');
  } else if (ALL_NUMBERS.test(firstNameInput.value) || ALL_SPECIAL_CHARACTERS.test(firstNameInput.value)) {
    showErrorOnRegistration(
      firstNameInput,
      errorBlock,
      true,
      'First name must not contain special characters or numbers',
    );
  } else {
    showErrorOnRegistration(firstNameInput, errorBlock, false);
  }
}

export function validateInputLastName(input?: HTMLInputElement, error?: HTMLDivElement) {
  const lastNameInput = input ? input : variablesRegPage.inputForLastName;
  const errorBlock = error ? error : variablesRegPage.errorForInputLastName;

  if (lastNameInput.value === '') {
    showErrorOnRegistration(lastNameInput, errorBlock, true, 'First name must contain at least one character');
  } else if (ALL_NUMBERS.test(lastNameInput.value) || ALL_SPECIAL_CHARACTERS.test(lastNameInput.value)) {
    showErrorOnRegistration(
      lastNameInput,
      errorBlock,
      true,
      'First name must not contain special characters or numbers',
    );
  } else {
    showErrorOnRegistration(lastNameInput, errorBlock, false);
  }
}

export function validateInputEmail(input?: HTMLInputElement, error?: HTMLDivElement) {
  const emailInput = input ? input : variablesRegPage.inputForEmail;
  const errorBlock = error ? error : variablesRegPage.errorForInputEmail;

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (emailInput.value === '') {
    showErrorOnRegistration(emailInput, errorBlock, true, 'This field is required');
  } else if (emailInput.validity.typeMismatch || !emailRegex.test(emailInput.value)) {
    showErrorOnRegistration(emailInput, errorBlock, true, 'Email must be properly formatted (e.g., user@example.com)');
  } else if (emailInput.validity.tooShort) {
    showErrorOnRegistration(
      emailInput,
      errorBlock,
      true,
      `Email should be at least 8 characters; you entered ${emailInput.value.length}`,
    );
  } else if (isContainLeadingTrailingWhitespace(emailInput.value)) {
    showErrorOnRegistration(emailInput, errorBlock, true, 'Email must not contain leading or trailing whitespace');
  } else {
    showErrorOnRegistration(emailInput, errorBlock, false);
  }
}

export function validateBirthDate(input?: HTMLInputElement, error?: HTMLDivElement, inputContainer?: HTMLElement) {
  const birthDateInput = input ? input : variablesRegPage.inputForBirthDate;
  const errorBlock = error ? error : variablesRegPage.errorForInputBirth;
  const birthDateInputContainer = inputContainer ? inputContainer : variablesRegPage.containerForInputBirth;
  const selectedDate = new Date(birthDateInput.value);
  const currentDate = new Date();
  const ageDifference = currentDate.getFullYear() - selectedDate.getFullYear();

  if (birthDateInput.value === '') {
    showErrorOnRegistration(birthDateInput, errorBlock, true, 'This field is required');
    birthDateInputContainer.style.marginBottom = '0px';
  } else if (ageDifference < MIN_AGE) {
    showErrorOnRegistration(birthDateInput, errorBlock, true, 'Minimum age must be at least 13 years');
    birthDateInputContainer.style.marginBottom = '0px';
  } else if (ageDifference > MAX_AGE) {
    showErrorOnRegistration(birthDateInput, errorBlock, true, 'Age cannot exceed 100 years');
    birthDateInputContainer.style.marginBottom = '0px';
  } else {
    birthDateInputContainer.style.marginBottom = '16px';
    showErrorOnRegistration(birthDateInput, errorBlock, false);
  }
}

export function replaceInputType() {
  variablesRegPage.inputForBirthDate.type = 'date';
  variablesRegPage.inputForBirthDate.removeEventListener('click', replaceInputType);
  variablesRegPage.inputForBirthDate.addEventListener('input', () => validateBirthDate());
}

export function validateInputPassword(input?: HTMLInputElement, error?: HTMLDivElement, inputContainer?: HTMLElement) {
  const passwordInput = input ? input : variablesRegPage.inputForPassword;
  const errorBlock = error ? error : variablesRegPage.errorForInputPassword;
  const passwordInputContainer = inputContainer ? inputContainer : variablesRegPage.containerForInputPassword;

  if (passwordInput.value === '') {
    passwordInputContainer.style.marginBottom = '0px';
    showErrorOnRegistration(passwordInput, errorBlock, true, 'This field is required');
  } else if (passwordInput.value.includes(' ')) {
    passwordInputContainer.style.marginBottom = '0px';
    showErrorOnRegistration(passwordInput, errorBlock, true, 'Password must not contain whitespace');
  } else if (!ALL_NUMBERS.test(passwordInput.value)) {
    passwordInputContainer.style.marginBottom = '0px';
    showErrorOnRegistration(passwordInput, errorBlock, true, 'Password must must contain at least one digit');
  } else if (!ALL_LOWERCASE_LETTERS.test(passwordInput.value)) {
    passwordInputContainer.style.marginBottom = '0px';
    showErrorOnRegistration(
      passwordInput,
      errorBlock,
      true,
      'Password must must contain at least one lowercase letter',
    );
  } else if (!ALL_UPPERCASE_LETTERS.test(passwordInput.value)) {
    passwordInputContainer.style.marginBottom = '0px';
    showErrorOnRegistration(
      passwordInput,
      errorBlock,
      true,
      'Password must must contain at least one uppercase letter',
    );
  } else if (!ALL_SPECIAL_CHARACTERS.test(passwordInput.value)) {
    passwordInputContainer.style.marginBottom = '0px';
    showErrorOnRegistration(
      passwordInput,
      errorBlock,
      true,
      'Password must must contain at least one special character (e.g., !@#$%^&*)',
    );
  } else if (passwordInput.value.length < 8) {
    passwordInputContainer.style.marginBottom = '0px';
    showErrorOnRegistration(
      passwordInput,
      errorBlock,
      true,
      `Password should be at least 8 characters; you entered ${passwordInput.value.length}`,
    );
  } else {
    passwordInputContainer.style.marginBottom = '16px';
    showErrorOnRegistration(passwordInput, errorBlock, false);
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
