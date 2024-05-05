import createElement from '../../elements/bootstrap/createElement';
import './styleRegistrationPage.scss';

export const containerForRegistrationForms = createElement('div', 'd-flex justify-content-center align-items-center');
containerForRegistrationForms.style.minHeight = '100vh';

export const registrationForm = createElement('div');
export const containerForLogoAndTitleRegistrationPage = createElement(
  'div',
  'd-flex justify-content-center align-items-center flex-column',
);
export const logoRegistrationPage = createElement('div');
logoRegistrationPage.innerHTML =
  '<svg width="47" height="38" viewBox="0 0 47 38" fill="none" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" clip-rule="evenodd" d="M22.2253 7.07832C22.2257 7.05475 22.2259 7.03115 22.2259 7.00753C22.2259 3.13738 17.2505 0 11.113 0C4.97544 0 0 3.13738 0 7.00753C0 7.03115 0.000185372 7.05475 0.000555249 7.07832H0V37.0904H0.0754082C0.719837 33.1847 5.41573 30.1536 11.113 30.1536C16.8102 30.1536 21.5061 33.1847 22.1505 37.0904H22.2259V7.07832H22.2253Z" fill="#FD7E14"/><path fill-rule="evenodd" clip-rule="evenodd" d="M24.7747 7.07832C24.7743 7.05475 24.7741 7.03115 24.7741 7.00753C24.7741 3.13738 29.7495 0 35.887 0C42.0246 0 47 3.13738 47 7.00753C47 7.03115 46.9998 7.05475 46.9994 7.07832H47V37.0904H46.9246C46.2802 33.1847 41.5843 30.1536 35.887 30.1536C30.1898 30.1536 25.4939 33.1847 24.8495 37.0904H24.7741V7.07832H24.7747Z" fill="#FD7E14"/></svg>';
export const titleRegistrationPage = createElement('h2', 'registration-form__title', 'Sign up');

export const containerForInputsRegistrationForm = createElement(
  'form',
  'd-flex justify-content-center align-items-center flex-column gap-3',
);
export const inputForUsername = createElement('input', 'form-control registration-form__input');
inputForUsername.placeholder = 'Username';
export const inputForEmail = createElement('input', 'registration-form__input form-control');
inputForEmail.placeholder = 'Email';

export const containerForInputBirth = createElement('div', 'registration-form__input-content');
export const inputForBirthDate = createElement('input', 'registration-form__input-birth form-control');
inputForBirthDate.placeholder = 'Birth date';
export const iconForInputBirth = createElement('span', 'registration-form__input-birth_icon');

export const containerForInputPassword = createElement('div', 'registration-form__input-content');
export const inputForPassword = createElement('input', 'registration-form__input-password form-control');
inputForPassword.placeholder = 'Password';
export const iconForInputPassword = createElement('span', 'registration-form__input-password_icon');

export const shippingAddressForm = createElement('div');
