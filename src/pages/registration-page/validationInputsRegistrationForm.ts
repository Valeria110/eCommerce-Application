import { ALL_LOWERCASE_LETTERS, ALL_NUMBERS, ALL_SPECIAL_CHARACTERS, ALL_UPPERCASE_LETTERS } from './validationRegex';
import * as variablesRegPage from './variablesForRegistrationPage';

const MIN_AGE = 13;
const MAX_AGE = 100;
const LENGTH_VALID_ALL_INPUTS = 13;
const LENGTH_VALID_INPUTS_WITHOUT_BILLING_FORM = 9;
const LENGTH_INVALID_INPUTS = 0;

export function applyNewStyleForError(input: HTMLInputElement, error: HTMLDivElement, isInvalid: boolean) {
  if (isInvalid === true) {
    error.style.display = 'block';
    error.style.marginTop = '0.25rem';
    error.style.marginBottom = '7px';
    input.style.marginBottom = '0px';
    input.classList.add('is-invalid');
    input.classList.remove('is-valid');
  } else {
    input.style.marginBottom = '16px';
    error.style.display = 'none';
    error.style.marginTop = '0px';
    input.classList.remove('is-invalid');
    input.classList.add('is-valid');
  }
  activateSubmitButton();
}

export function generateValidationInputFirstName() {
  if (variablesRegPage.inputForFirstName.value === '') {
    variablesRegPage.errorForInputFirstName.textContent = 'First name must contain at least one character';
    applyNewStyleForError(variablesRegPage.inputForFirstName, variablesRegPage.errorForInputFirstName, true);
  } else if (
    ALL_NUMBERS.test(variablesRegPage.inputForFirstName.value) ||
    ALL_SPECIAL_CHARACTERS.test(variablesRegPage.inputForFirstName.value)
  ) {
    variablesRegPage.errorForInputFirstName.textContent = 'First name must not contain special characters or numbers';
    applyNewStyleForError(variablesRegPage.inputForFirstName, variablesRegPage.errorForInputFirstName, true);
  } else {
    applyNewStyleForError(variablesRegPage.inputForFirstName, variablesRegPage.errorForInputFirstName, false);
  }
}

export function generateValidationInputLastName() {
  if (variablesRegPage.inputForLastName.value === '') {
    variablesRegPage.errorForInputLastName.textContent = 'First name must contain at least one character';
    applyNewStyleForError(variablesRegPage.inputForLastName, variablesRegPage.errorForInputLastName, true);
  } else if (
    ALL_NUMBERS.test(variablesRegPage.inputForLastName.value) ||
    ALL_SPECIAL_CHARACTERS.test(variablesRegPage.inputForLastName.value)
  ) {
    variablesRegPage.errorForInputLastName.textContent = 'First name must not contain special characters or numbers';
    applyNewStyleForError(variablesRegPage.inputForLastName, variablesRegPage.errorForInputLastName, true);
  } else {
    applyNewStyleForError(variablesRegPage.inputForLastName, variablesRegPage.errorForInputLastName, false);
  }
}

export function generateValidationInputEmail() {
  if (variablesRegPage.inputForEmail.value === '') {
    variablesRegPage.errorForInputEmail.textContent = 'This field is required';
    applyNewStyleForError(variablesRegPage.inputForEmail, variablesRegPage.errorForInputEmail, true);
  } else if (
    variablesRegPage.inputForEmail.validity.typeMismatch ||
    !variablesRegPage.inputForEmail.value.endsWith('.com')
  ) {
    variablesRegPage.errorForInputEmail.textContent = 'Email must be properly formatted (e.g., user@example.com)';
    applyNewStyleForError(variablesRegPage.inputForEmail, variablesRegPage.errorForInputEmail, true);
  } else {
    applyNewStyleForError(variablesRegPage.inputForEmail, variablesRegPage.errorForInputEmail, false);
  }
}

function generateValidationBirthDate() {
  const selectedDate = new Date(variablesRegPage.inputForBirthDate.value);
  const currentDate = new Date();
  const ageDifference = currentDate.getFullYear() - selectedDate.getFullYear();

  if (variablesRegPage.inputForBirthDate.value === '') {
    variablesRegPage.errorForInputBirth.textContent = 'This field is required';
    applyNewStyleForError(variablesRegPage.inputForBirthDate, variablesRegPage.errorForInputBirth, true);
    variablesRegPage.containerForInputBirth.style.marginBottom = '0px';
  } else if (ageDifference < MIN_AGE) {
    variablesRegPage.errorForInputBirth.textContent = 'Minimum age must be at least 13 years';
    applyNewStyleForError(variablesRegPage.inputForBirthDate, variablesRegPage.errorForInputBirth, true);
    variablesRegPage.containerForInputBirth.style.marginBottom = '0px';
  } else if (ageDifference > MAX_AGE) {
    variablesRegPage.errorForInputBirth.textContent = 'Age cannot exceed 100 years';
    applyNewStyleForError(variablesRegPage.inputForBirthDate, variablesRegPage.errorForInputBirth, true);
    variablesRegPage.containerForInputBirth.style.marginBottom = '0px';
  } else {
    variablesRegPage.containerForInputBirth.style.marginBottom = '16px';
    applyNewStyleForError(variablesRegPage.inputForBirthDate, variablesRegPage.errorForInputBirth, false);
  }
}

export function replaceInputType() {
  variablesRegPage.inputForBirthDate.type = 'date';
  variablesRegPage.inputForBirthDate.removeEventListener('click', replaceInputType);
  variablesRegPage.inputForBirthDate.addEventListener('input', generateValidationBirthDate);
}

export function generateValidationInputPassword() {
  if (variablesRegPage.inputForPassword.value === '') {
    variablesRegPage.errorForInputPassword.textContent = 'This field is required';
    variablesRegPage.containerForInputPassword.style.marginBottom = '0px';
    applyNewStyleForError(variablesRegPage.inputForPassword, variablesRegPage.errorForInputPassword, true);
  } else if (!ALL_NUMBERS.test(variablesRegPage.inputForPassword.value)) {
    variablesRegPage.errorForInputPassword.textContent = 'Password must must contain at least one digit';
    variablesRegPage.containerForInputPassword.style.marginBottom = '0px';
    applyNewStyleForError(variablesRegPage.inputForPassword, variablesRegPage.errorForInputPassword, true);
  } else if (!ALL_LOWERCASE_LETTERS.test(variablesRegPage.inputForPassword.value)) {
    variablesRegPage.errorForInputPassword.textContent = 'Password must must contain at least one lowercase letter';
    variablesRegPage.containerForInputPassword.style.marginBottom = '0px';
    applyNewStyleForError(variablesRegPage.inputForPassword, variablesRegPage.errorForInputPassword, true);
  } else if (!ALL_UPPERCASE_LETTERS.test(variablesRegPage.inputForPassword.value)) {
    variablesRegPage.errorForInputPassword.textContent = 'Password must must contain at least one uppercase letter';
    variablesRegPage.containerForInputPassword.style.marginBottom = '0px';
    applyNewStyleForError(variablesRegPage.inputForPassword, variablesRegPage.errorForInputPassword, true);
  } else if (!ALL_SPECIAL_CHARACTERS.test(variablesRegPage.inputForPassword.value)) {
    variablesRegPage.errorForInputPassword.textContent = `Password must must contain at least one special character (e.g., !@#$%^&*)`;
    variablesRegPage.containerForInputPassword.style.marginBottom = '0px';
    applyNewStyleForError(variablesRegPage.inputForPassword, variablesRegPage.errorForInputPassword, true);
  } else if (variablesRegPage.inputForPassword.value.length < 8) {
    variablesRegPage.errorForInputPassword.textContent = `Password should be at least 8 characters; you entered ${variablesRegPage.inputForPassword.value.length}`;
    variablesRegPage.containerForInputPassword.style.marginBottom = '0px';
    applyNewStyleForError(variablesRegPage.inputForPassword, variablesRegPage.errorForInputPassword, true);
  } else {
    variablesRegPage.containerForInputPassword.style.marginBottom = '16px';
    applyNewStyleForError(variablesRegPage.inputForPassword, variablesRegPage.errorForInputPassword, false);
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
}
