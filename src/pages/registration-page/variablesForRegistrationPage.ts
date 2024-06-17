import createElement from '../../elements/bootstrap/createElement';
import './styleRegistrationPage.scss';

export const containerForRegistrationForms = createElement(
  'form',
  'd-flex justify-content-center align-items-center flex-column needs-validation',
);

export const registrationForm = createElement('div');
registrationForm.style.marginTop = '110px';
export const containerForLogoAndTitleRegistrationPage = createElement(
  'div',
  'd-flex justify-content-center align-items-center flex-column',
);
export const logoRegistrationPage = createElement('div');
logoRegistrationPage.innerHTML =
  '<svg width="47" height="38" viewBox="0 0 47 38" fill="none" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" clip-rule="evenodd" d="M22.2253 7.07832C22.2257 7.05475 22.2259 7.03115 22.2259 7.00753C22.2259 3.13738 17.2505 0 11.113 0C4.97544 0 0 3.13738 0 7.00753C0 7.03115 0.000185372 7.05475 0.000555249 7.07832H0V37.0904H0.0754082C0.719837 33.1847 5.41573 30.1536 11.113 30.1536C16.8102 30.1536 21.5061 33.1847 22.1505 37.0904H22.2259V7.07832H22.2253Z" fill="#FD7E14"/><path fill-rule="evenodd" clip-rule="evenodd" d="M24.7747 7.07832C24.7743 7.05475 24.7741 7.03115 24.7741 7.00753C24.7741 3.13738 29.7495 0 35.887 0C42.0246 0 47 3.13738 47 7.00753C47 7.03115 46.9998 7.05475 46.9994 7.07832H47V37.0904H46.9246C46.2802 33.1847 41.5843 30.1536 35.887 30.1536C30.1898 30.1536 25.4939 33.1847 24.8495 37.0904H24.7741V7.07832H24.7747Z" fill="#FD7E14"/></svg>';
export const titleRegistrationPage = createElement('h2', 'registration-form__title', 'Sign up');

export const containerForInputsRegistrationForm = createElement(
  'div',
  'd-flex justify-content-center align-items-center flex-column',
);
export const inputForFirstName = createElement('input', 'form-control registration-form__input reset-inputs');
inputForFirstName.placeholder = 'First name';
inputForFirstName.required = true;
export const errorForInputFirstName = createElement('div', 'error-register text-danger');

export const inputForLastName = createElement('input', 'form-control registration-form__input reset-inputs');
inputForLastName.placeholder = 'Last name';
inputForLastName.required = true;
export const errorForInputLastName = createElement('div', 'error-register text-danger');

export const inputForEmail = createElement('input', 'registration-form__input form-control reset-inputs');
inputForEmail.placeholder = 'Email';
inputForEmail.type = 'email';
inputForEmail.required = true;
export const errorForInputEmail = createElement('div', 'error-register text-danger');

export const containerForInputBirth = createElement('div', 'registration-form__input-content reset-inputs');
export const inputForBirthDate = createElement('input', 'registration-form__input-birth form-control');
inputForBirthDate.placeholder = 'Birth date';
export const errorForInputBirth = createElement('div', 'error-register text-danger');

export const containerForInputPassword = createElement('div', 'registration-form__input-content reset-inputs');
export const inputForPassword = createElement('input', 'registration-form__input-password form-control');
inputForPassword.placeholder = 'Password';
inputForPassword.type = 'password';
export const iconForInputPassword = createElement('span', 'registration-form__input-password_icon');
export const errorForInputPassword = createElement('div', 'error-register text-danger');

export const containerForShippingAddressForm = createElement('div', 'shipping-form justify-content-start');
export const titleShippingAddressForm = createElement('h6', 'shipping-form__title', 'Shipping Address');
export const shippingAddressForm = createElement('div', 'd-flex justify-content-center align-items-center flex-column');

export const containerForInputCountry = createElement('div', 'shipping-form__container-list');
export const inputForCountry = createElement('input', 'form-control registration-form__input reset-inputs');
inputForCountry.placeholder = 'Country*';
export const containerForResultsCountries = createElement('div', 'shipping-form__container-list_results');
export const errorForInputCountry = createElement('div', 'error-register text-danger');

export const inputForCity = createElement('input', 'form-control registration-form__input reset-inputs');
inputForCity.placeholder = 'City*';
export const errorForInputCity = createElement('div', 'error-register text-danger');

export const inputForStreet = createElement('input', 'form-control registration-form__input reset-inputs');
inputForStreet.placeholder = 'Street*';
export const errorForInputStreet = createElement('div', 'error-register text-danger');

export const inputForPostalCode = createElement('input', 'form-control registration-form__input reset-inputs');
inputForPostalCode.placeholder = 'Postal code*';
export const errorForInputPostalCode = createElement('div', 'error-register text-danger');

export const containerForCheckboxSameAddress = createElement('div', 'shipping-form__checkbox-container mt-2');
export const checkboxSameAddress = createElement('input', 'form-check-input shipping-form__checkbox');
checkboxSameAddress.type = 'checkbox';
checkboxSameAddress.id = 'checkSameAddress';
export const labelForCheckboxSameAddress = createElement(
  'label',
  'form-check-label shipping-form__checkbox_label',
  'Use the same address for billing and shipping',
);

export const containerForCheckboxDefault = createElement('div', 'shipping-form__checkbox-container');
export const checkboxDefault = createElement('input', 'form-check-input shipping-form__checkbox');
checkboxDefault.type = 'checkbox';
checkboxDefault.id = 'checkDefault';
export const labelForCheckboxDefault = createElement(
  'label',
  'form-check-label shipping-form__checkbox_label',
  'Use by default',
);

export const buttonForBillingForm = createElement('div', 'billing-form__button', 'Add billing address');
export const containerForBillingForm = createElement('div');
export const titleBillingForm = createElement('h6', 'billing-form__title', 'Billing Address');
export const billingAddressForm = createElement('div', 'd-flex justify-content-center align-items-center flex-column');

export const containerForInputCountryBillingForm = createElement('div', 'shipping-form__container-list');
export const inputForCountryBillingForm = createElement('input', 'form-control registration-form__input reset-inputs');
inputForCountryBillingForm.placeholder = 'Country*';
export const containerResultsCountriesBillingForm = createElement('div', 'shipping-form__container-list_results');
export const errorForInputCountryBillingForm = createElement('div', 'error-register text-danger');

export const inputForCityBillingForm = createElement('input', 'form-control registration-form__input reset-inputs');
inputForCityBillingForm.placeholder = 'City*';
export const errorForInputCityBillingForm = createElement('div', 'error-register text-danger');

export const inputForStreetBillingForm = createElement('input', 'form-control registration-form__input reset-inputs');
inputForStreetBillingForm.placeholder = 'Street*';
export const errorForInputStreetBillingForm = createElement('div', 'error-register text-danger');

export const inputForPostalCodeBillingForm = createElement(
  'input',
  'form-control registration-form__input reset-inputs',
);
inputForPostalCodeBillingForm.placeholder = 'Postal code*';
export const errorForInputPostalCodeBillingForm = createElement('div', 'error-register text-danger');

export const containerForCheckboxDefaultBillingForm = createElement('div', 'billing-form__checkbox-container');
export const checkboxDefaultBillingForm = createElement('input', 'form-check-input billing-form__checkbox');
checkboxDefaultBillingForm.type = 'checkbox';
checkboxDefaultBillingForm.id = 'checkDefaultBillingForm';
export const labelForCheckboxDefaultBillingForm = createElement(
  'label',
  'form-check-label billing-form__checkbox_label',
  'Use by default',
);

export const containerForButtonSignUpAndLogin = createElement('div');
export const buttonSignUp = createElement('button', 'registration-page__button-signup btn disabled', 'Sign up');
export const buttonToLoginPage = createElement(
  'div',
  'registration-page__button-login',
  'Already have an account? Log in',
);

export const buttonToMainPage = createElement(
  'div',
  'registration-page__button-main my-3',
  'Continue without registration',
);

export const shadowButton = createElement('button', 'btn btn-primary d-none');
shadowButton.setAttribute('data-bs-toggle', 'modal');
shadowButton.setAttribute('data-bs-target', '#1234');

export const containerForModalWindow = createElement('div', 'modal fade modal_registration_successful');
containerForModalWindow.id = '1234';
containerForModalWindow.setAttribute('tabindex', '-1');
containerForModalWindow.setAttribute('aria-hidden', 'true');
export const modalWindow = createElement('div', 'modal-dialog');
export const contentModalWindow = createElement('div', 'modal-content');
export const headerModalWindow = createElement('div', 'modal-header');
export const titleModalWindow = createElement('h6', 'modal-title', 'Registration was successful!');
export const buttonCloseModalWindow = createElement('button', 'btn-close');
buttonCloseModalWindow.setAttribute('data-bs-dismiss', 'modal');
export const bodyModalWindow = createElement('div', 'modal-body', '');
bodyModalWindow.innerHTML =
  'Thank you for registering at our online bookstore! 🎉🎉🎉<br>Now you can enjoy exclusive offers, discounts, and track your orders online. Start your journey into the world of books right now! 🛍️✨';
