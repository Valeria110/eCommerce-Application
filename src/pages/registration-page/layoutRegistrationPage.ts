import * as variablesRegPage from '../registration-page/variablesForRegistrationPage';
import * as validationShippingAndBillingForms from '../registration-page/validationInputsShippingAndBillingAddressForms';
import * as validationRegistrationForms from '../registration-page/validationInputsRegistrationForm';
import switchPage from '../../elements/switchPage';
import { generateBillingForm } from '../registration-page/layoutBillingForm';
import { copyAddress } from '../registration-page/validationInputsShippingAndBillingAddressForms';
import { Pages } from '../../elements/types';
import requestsAPI from '../../elements/requestsAPI';

function togglePasswordVisibility() {
  const { inputForPassword, iconForInputPassword } = variablesRegPage;
  const isPasswordVisible = inputForPassword.type === 'password';

  inputForPassword.type = isPasswordVisible ? 'text' : 'password';
  iconForInputPassword.classList.toggle('registration-form__toggle-password_icon', isPasswordVisible);
  iconForInputPassword.classList.toggle('registration-form__input-password_icon', !isPasswordVisible);
}

export default function generateRegistrationPage() {
  const {
    registrationForm,
    containerForShippingAddressForm,
    buttonForBillingForm,
    containerForBillingForm,
    containerForButtonSignUpAndLogin,
    buttonSignUp,
    buttonToLoginPage,
    containerForLogoAndTitleRegistrationPage,
    containerForInputsRegistrationForm,
    logoRegistrationPage,
    titleRegistrationPage,
    inputForFirstName,
    errorForInputFirstName,
    inputForLastName,
    errorForInputLastName,
    inputForEmail,
    errorForInputEmail,
    containerForInputBirth,
    errorForInputBirth,
    containerForInputPassword,
    errorForInputPassword,
    inputForBirthDate,
    inputForPassword,
    iconForInputPassword,
    titleShippingAddressForm,
    shippingAddressForm,
    containerForInputCountry,
    inputForCity,
    errorForInputCity,
    inputForStreet,
    errorForInputStreet,
    inputForPostalCode,
    errorForInputPostalCode,
    containerForCheckboxSameAddress,
    containerForCheckboxDefault,
    inputForCountry,
    containerForResultsCountries,
    errorForInputCountry,
    checkboxSameAddress,
    labelForCheckboxSameAddress,
    checkboxDefault,
    labelForCheckboxDefault,
    containerForRegistrationForms,
  } = variablesRegPage;

  document.body.style.height = 'auto';

  containerForRegistrationForms.setAttribute('autocomplete', 'off');
  containerForRegistrationForms.setAttribute('novalidate', 'true');

  containerForRegistrationForms.append(
    registrationForm,
    containerForShippingAddressForm,
    buttonForBillingForm,
    containerForBillingForm,
    containerForButtonSignUpAndLogin,
  );

  containerForInputsRegistrationForm.append(
    inputForFirstName,
    errorForInputFirstName,
    inputForLastName,
    errorForInputLastName,
    inputForEmail,
    errorForInputEmail,
    containerForInputBirth,
    errorForInputBirth,
    containerForInputPassword,
    errorForInputPassword,
  );

  shippingAddressForm.append(
    containerForInputCountry,
    inputForCity,
    errorForInputCity,
    inputForStreet,
    errorForInputStreet,
    inputForPostalCode,
    errorForInputPostalCode,
    containerForCheckboxSameAddress,
    containerForCheckboxDefault,
  );

  registrationForm.append(containerForLogoAndTitleRegistrationPage, containerForInputsRegistrationForm);
  containerForLogoAndTitleRegistrationPage.append(logoRegistrationPage, titleRegistrationPage);
  containerForInputBirth.append(inputForBirthDate);
  containerForInputPassword.append(inputForPassword, iconForInputPassword);
  containerForShippingAddressForm.append(titleShippingAddressForm, shippingAddressForm);
  containerForInputCountry.append(inputForCountry, containerForResultsCountries, errorForInputCountry);
  containerForCheckboxSameAddress.append(checkboxSameAddress, labelForCheckboxSameAddress);
  containerForCheckboxDefault.append(checkboxDefault, labelForCheckboxDefault);
  containerForButtonSignUpAndLogin.append(buttonSignUp, buttonToLoginPage);

  inputForFirstName.addEventListener('input', validationRegistrationForms.validateInputFirstName);
  inputForLastName.addEventListener('input', validationRegistrationForms.validateInputLastName);
  inputForEmail.addEventListener('input', validationRegistrationForms.validateInputEmail);
  inputForPassword.addEventListener('input', validationRegistrationForms.validateInputPassword);
  inputForStreet.addEventListener(
    'input',
    validationShippingAndBillingForms.validateInputStreet.bind(null, inputForStreet, errorForInputStreet),
  );
  inputForCity.addEventListener(
    'input',
    validationShippingAndBillingForms.validateInputCity.bind(null, inputForCity, errorForInputCity),
  );
  inputForCountry.addEventListener(
    'input',
    validationShippingAndBillingForms.validateInputCountry.bind(null, inputForCountry, errorForInputCountry),
  );
  inputForPostalCode.addEventListener(
    'input',
    validationShippingAndBillingForms.validateInputPostalCode.bind(
      null,
      inputForCountry,
      inputForPostalCode,
      errorForInputPostalCode,
    ),
  );

  buttonForBillingForm.addEventListener('click', generateBillingForm);
  iconForInputPassword.addEventListener('click', togglePasswordVisibility);
  checkboxSameAddress.addEventListener('click', copyAddress);
  inputForBirthDate.addEventListener('click', validationRegistrationForms.replaceInputType);
  buttonToLoginPage.addEventListener('click', () => {
    switchPage(Pages.LogIn);
    document.body.style.height = '';
  });
  containerForRegistrationForms.removeEventListener('submit', handleFormSubmit);
  containerForRegistrationForms.addEventListener('submit', handleFormSubmit);

  return containerForRegistrationForms;
}

async function handleFormSubmit(event: SubmitEvent) {
  event.preventDefault();
  document.body.style.height = '';
  try {
    const customerInfo = await requestsAPI.registerCustomer(
      variablesRegPage.inputForEmail.value,
      variablesRegPage.inputForFirstName.value,
      variablesRegPage.inputForLastName.value,
      variablesRegPage.inputForPassword.value,
      variablesRegPage.inputForBirthDate.value,
    );

    const customerId = customerInfo.customer.id;

    await requestsAPI.addAddress(
      customerId,
      variablesRegPage.inputForFirstName.value,
      variablesRegPage.inputForLastName.value,
      variablesRegPage.inputForStreet.value,
      variablesRegPage.inputForPostalCode.value,
      variablesRegPage.inputForCity.value,
      variablesRegPage.inputForCountry.value,
      variablesRegPage.inputForEmail.value,
    );
    const shippingAddressId = await requestsAPI.getCustomerAddressData(customerId, 0);
    await requestsAPI.setShippingAddress(shippingAddressId, customerId);

    if (variablesRegPage.containerForBillingForm.contains(variablesRegPage.inputForCountryBillingForm)) {
      await requestsAPI.addAddress(
        customerId,
        variablesRegPage.inputForFirstName.value,
        variablesRegPage.inputForLastName.value,
        variablesRegPage.inputForStreetBillingForm.value,
        variablesRegPage.inputForPostalCodeBillingForm.value,
        variablesRegPage.inputForCityBillingForm.value,
        variablesRegPage.inputForCountryBillingForm.value,
        variablesRegPage.inputForEmail.value,
      );
      const billingAddressId = await requestsAPI.getCustomerAddressData(customerId, 1);
      await requestsAPI.setBillingAddress(billingAddressId, customerId);
    }

    if (variablesRegPage.checkboxDefault.checked) {
      await requestsAPI.addAddress(
        customerId,
        variablesRegPage.inputForFirstName.value,
        variablesRegPage.inputForLastName.value,
        variablesRegPage.inputForStreet.value,
        variablesRegPage.inputForPostalCode.value,
        variablesRegPage.inputForCity.value,
        variablesRegPage.inputForCountry.value,
        variablesRegPage.inputForEmail.value,
      );
      const shippingDefAddressId = await requestsAPI.getCustomerAddressData(customerId, 0);
      await requestsAPI.setDefShippingAddress(shippingDefAddressId, customerId);
    }

    if (variablesRegPage.checkboxDefaultBillingForm.checked) {
      await requestsAPI.addAddress(
        customerId,
        variablesRegPage.inputForFirstName.value,
        variablesRegPage.inputForLastName.value,
        variablesRegPage.inputForStreetBillingForm.value,
        variablesRegPage.inputForPostalCodeBillingForm.value,
        variablesRegPage.inputForCityBillingForm.value,
        variablesRegPage.inputForCountryBillingForm.value,
        variablesRegPage.inputForEmail.value,
      );
      const billingDefAddressId = await requestsAPI.getCustomerAddressData(customerId, 1);
      await requestsAPI.setDefBillingAddress(billingDefAddressId, customerId);
    }
    await localStorage.setItem('registerTrue', 'true');
  } catch (error) {
    validationRegistrationForms.showErrorOnRegistration(
      variablesRegPage.inputForEmail,
      variablesRegPage.errorForInputEmail,
      true,
      'There is already an existing customer with the provided email',
    );
    return;
  }
  requestsAPI
    .authCustomersLogin(variablesRegPage.inputForEmail.value, variablesRegPage.inputForPassword.value)
    .then(() => {
      switchPage(Pages.Main);
      resetRegistrationForm();
      validationRegistrationForms.activateSubmitButton();
    })
    .catch((error) => {
      console.error('Ошибка входа:', error);
    });
}

export function resetRegistrationForm() {
  const allInputs = [
    variablesRegPage.inputForFirstName,
    variablesRegPage.inputForLastName,
    variablesRegPage.inputForEmail,
    variablesRegPage.inputForBirthDate,
    variablesRegPage.inputForPassword,
    variablesRegPage.inputForCountry,
    variablesRegPage.inputForCity,
    variablesRegPage.inputForStreet,
    variablesRegPage.inputForPostalCode,
    variablesRegPage.inputForCountryBillingForm,
    variablesRegPage.inputForCityBillingForm,
    variablesRegPage.inputForStreetBillingForm,
    variablesRegPage.inputForPostalCodeBillingForm,
  ];

  const allCheckbox = [
    variablesRegPage.checkboxDefault,
    variablesRegPage.checkboxDefaultBillingForm,
    variablesRegPage.checkboxSameAddress,
  ];

  allInputs.forEach((input) => {
    input.value = '';
    input.classList.remove('is-valid');
    if (input === variablesRegPage.inputForBirthDate) {
      input.type = '';
    }
  });

  allCheckbox.forEach((checkbox) => {
    checkbox.checked = false;
  });

  if (variablesRegPage.containerForBillingForm) {
    variablesRegPage.buttonForBillingForm.style.display = 'flex';
    variablesRegPage.containerForBillingForm.innerHTML = '';
  }
}

export function splitCountry(inputValueCountry: string) {
  return inputValueCountry.split(' ')[inputValueCountry.split(' ').length - 1].replace('(', '').replace(')', '');
}
