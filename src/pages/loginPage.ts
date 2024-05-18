import './loginPage.scss';
import litHubLogo from '../img/lithub-logo.svg';
import eyeOffIcon from '../img/eye-off-icon.svg';
import { validateLoginForm, showOrHidePassword, showError } from '../elements/loginValidation';
import switchPage from '../elements/switchPage';
import { Pages } from '../elements/types';
import request from '../elements/requestsAPI';

function loginPage(): HTMLElement {
  document.body.classList.add('justify-content-center', 'align-items-center');

  const main = document.createElement('main');
  main.classList.add('login-page-main');
  document.body.appendChild(main);

  const loginFormWrapper = document.createElement('div');
  loginFormWrapper.classList.add('login-form-wrapper');
  const loginForm = document.createElement('form');
  loginForm.classList.add('main__login-form');
  loginForm.setAttribute('novalidate', '');
  loginForm.addEventListener('submit', (e) => {
    e.preventDefault();
    if (validateLoginForm()) {
      handleServerLogin(inputsContainer);
    }
  });

  const loginFormHeader = document.createElement('div');
  loginFormHeader.classList.add('login-form__header');
  const loginFormLogo = document.createElement('img');
  loginFormLogo.classList.add('login-form__header-logo');
  loginFormLogo.src = litHubLogo as string;
  const loginFormTitle = document.createElement('h1');
  loginFormTitle.classList.add('login-form__title');
  loginFormTitle.textContent = 'Log in';
  loginFormHeader.append(loginFormLogo, loginFormTitle);

  const inputsContainer = document.createElement('div');
  inputsContainer.classList.add('login-form__inputs-container');

  for (let i = 0; i < 2; i += 1) {
    const inputWrapper = document.createElement('div');
    inputWrapper.classList.add('input-wrapper');
    const input = document.createElement('input');
    input.classList.add('login-form__input', 'form-control');
    input.setAttribute('required', '');
    const error = document.createElement('div');
    error.classList.add('error', 'text-danger');

    if (i === 0) {
      input.classList.add('login-form__email-input');
      input.setAttribute('name', 'email');
      input.setAttribute('type', 'email');
      input.setAttribute('placeholder', 'Email');
      input.setAttribute('minlength', '8');

      input.addEventListener('input', () => {
        input.value = input.value.replace(/\s/g, '');
      });
    }

    if (i === 1) {
      input.classList.add('login-form__password-input');
      input.setAttribute('type', 'password');
      input.setAttribute('placeholder', 'Password');
      input.setAttribute('minlength', '8');

      const showPasswordBtn = document.createElement('img');
      showPasswordBtn.classList.add('login-form__show-password-btn');
      showPasswordBtn.src = eyeOffIcon as string;
      showPasswordBtn.addEventListener('click', showOrHidePassword);
      inputWrapper.appendChild(showPasswordBtn);
    }

    input.addEventListener('input', validateLoginForm);
    inputWrapper.append(input, error);
    inputsContainer.appendChild(inputWrapper);
  }

  const submitFormBtn = document.createElement('button');
  submitFormBtn.type = 'submit';
  submitFormBtn.classList.add('login-form__submit-btn', 'btn', 'disabled');

  const registrationLink = document.createElement('a');
  registrationLink.classList.add('login-form-wrapper__registration-link');
  registrationLink.href = '#';
  registrationLink.textContent = 'Don’t have an account? Sign up';
  submitFormBtn.textContent = 'Log in';
  registrationLink.addEventListener('click', () => switchPage(Pages.SignUp));

  main.appendChild(loginFormWrapper);
  loginFormWrapper.appendChild(loginForm);
  loginForm.appendChild(loginFormHeader);
  loginForm.appendChild(inputsContainer);
  loginForm.appendChild(submitFormBtn);
  loginFormWrapper.appendChild(registrationLink);

  return main;
}

function handleServerLogin(inputsContainer: HTMLDivElement) {
  const loginField = inputsContainer.querySelector('.login-form__email-input') as HTMLInputElement;
  const passwordField = inputsContainer.querySelector('.login-form__password-input') as HTMLInputElement;

  if (loginField && passwordField) {
    request
      .authCustomersLogin(loginField.value, passwordField.value)
      .then((serverAnswer) => {
        if (serverAnswer.isOk) {
          switchPage(Pages.Main);
        } else {
          if (serverAnswer.field === 'login') {
            showError(loginField, serverAnswer.message);
          } else if (serverAnswer.field === 'password') {
            showError(passwordField, serverAnswer.message);
          }
        }
      })
      .catch((error) => {
        console.error(`Error: ${error}`);
      });
  }
}

export { loginPage };
