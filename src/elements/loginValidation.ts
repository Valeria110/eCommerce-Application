import { isNull } from '../utils/utils';
import eyeOffIcon from '../img/eye-off-icon.svg';
import eyeIcon from '../img/eye-icon.svg';

function validateLoginForm(): boolean {
  const emailInput = document.querySelector('.login-form__email-input');
  const passwordInput = document.querySelector('.login-form__password-input');
  isNull<HTMLInputElement>(emailInput);
  isNull<HTMLInputElement>(passwordInput);

  return validateInputs(emailInput.value, passwordInput.value);
}

function validateInputs(emailValue: string, passwordValue: string): boolean {
  validateEmail(emailValue);
  validatePassword(passwordValue);

  return canSubmitForm();
}

function validateEmail(emailValue: string): void {
  console.log(`_${emailValue}_`);
  const emailInput = document.querySelector('.login-form__email-input');
  isNull<HTMLInputElement>(emailInput);
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  if (emailValue === '') {
    showError(emailInput, 'This field is required');
  } else if (emailInput.validity.typeMismatch) {
    showError(emailInput, 'The email should be in the following format: user@example.com');
  } else if (emailInput.validity.tooShort) {
    showError(
      emailInput,
      `Email should be at least ${emailInput.minLength} characters; you entered ${emailValue.length}.`,
    );
  } else if (!emailRegex.test(emailInput.value)) {
    showError(emailInput, 'Email address must contain a domain name (e.g., example.com).');
  } else if (emailInput.validity.valid) {
    const error = emailInput.nextElementSibling;
    isNull<HTMLDivElement>(error);
    error.textContent = '';
    emailInput.classList.add('is-valid');
    emailInput.classList.remove('is-invalid');
  } else if (isContainLeadingTrailingWhitespace(emailInput.value)) {
    showError(emailInput, 'Email must not contain leading or trailing whitespace');
  }
}

function validatePassword(passwordValue: string): void {
  const passwordInput = document.querySelector('.login-form__password-input');
  isNull<HTMLInputElement>(passwordInput);
  const numberPattern = /\d/;
  const uppercaseLetterPattern = /[A-Z]/;
  const lowercaseLetterPattern = /[a-z]/;
  const specialCharacterPattern = /[!@#$%^&*]/;

  if (passwordValue === '') {
    showError(passwordInput, 'This field is required');
  } else if (passwordValue.length < 8) {
    showError(
      passwordInput,
      `Password should be at least ${passwordInput.minLength} characters; you entered ${passwordValue.length}.`,
    );
  } else if (!numberPattern.test(passwordValue)) {
    showError(passwordInput, 'Password must contain at least one digit (0-9)');
  } else if (!uppercaseLetterPattern.test(passwordValue)) {
    showError(passwordInput, 'Password must contain at least one uppercase letter (A-Z)');
  } else if (!lowercaseLetterPattern.test(passwordValue)) {
    showError(passwordInput, 'Password must contain at least one lowercase letter (a-z)');
  } else if (!specialCharacterPattern.test(passwordValue)) {
    showError(passwordInput, 'Password must contain at least one special character (e.g., !@#$%^&*)');
  } else if (isContainLeadingTrailingWhitespace(passwordValue)) {
    showError(passwordInput, 'Password must not contain leading or trailing whitespace');
  } else if (passwordInput.validity.valid) {
    const error = passwordInput.nextElementSibling;
    isNull<HTMLDivElement>(error);
    error.textContent = '';
    passwordInput.classList.add('is-valid');
    passwordInput.classList.remove('is-invalid');
  }
}

function isContainLeadingTrailingWhitespace(str: string) {
  return str !== str.trim();
}

function showError(input: HTMLInputElement, errorMessage: string) {
  const error = input.nextElementSibling;
  isNull<HTMLDivElement>(error);
  error.textContent = errorMessage;
  input.classList.add('is-invalid');
  input.classList.remove('is-valid');

  const submitBtn = document.querySelector('.login-form__submit-btn');
  isNull<HTMLButtonElement>(submitBtn);
  submitBtn.classList.add('disabled');
}

function canSubmitForm(): boolean {
  const emailInput = document.querySelector('.login-form__email-input');
  const passwordInput = document.querySelector('.login-form__password-input');
  const submitBtn = document.querySelector('.login-form__submit-btn');
  isNull<HTMLInputElement>(emailInput);
  isNull<HTMLInputElement>(passwordInput);
  isNull<HTMLButtonElement>(submitBtn);
  const isEmailValid = emailInput.classList.contains('is-valid');
  const isPasswordValid = passwordInput.classList.contains('is-valid');

  if (!isEmailValid || !isPasswordValid) {
    submitBtn.classList.add('disabled');
    return false;
  }
  submitBtn.classList.remove('disabled');
  return true;
}

function showOrHidePassword() {
  const passwordInput = document.querySelector('.login-form__password-input');
  const showPasswordBtn = document.querySelector('.login-form__show-password-btn');
  isNull<HTMLInputElement>(passwordInput);
  isNull<HTMLImageElement>(showPasswordBtn);

  if (passwordInput.type === 'password') {
    passwordInput.type = 'text';
    showPasswordBtn.src = eyeIcon as string;
  } else {
    passwordInput.type = 'password';
    showPasswordBtn.src = eyeOffIcon as string;
  }
}

export { validateLoginForm, showOrHidePassword, showError };
