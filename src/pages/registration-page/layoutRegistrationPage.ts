import * as variablesRegPage from '../registration-page/variablesForRegistrationPage';
import * as validationShippingAndBillingForms from '../registration-page/validationInputsShippingAndBillingAddressForms';
import * as validationRegistrationForms from '../registration-page/validationInputsRegistrationForm';
import switchPage from '../../elements/switchPage';
import { generateBillingForm } from '../registration-page/layoutBillingForm';
import { generateCopyAddress } from '../registration-page/validationInputsShippingAndBillingAddressForms';
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
    containerForRegistrationForms,
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
  } = variablesRegPage;

  document.body.style.height = 'auto';

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

  inputForFirstName.addEventListener('input', validationRegistrationForms.generateValidationInputFirstName);
  inputForLastName.addEventListener('input', validationRegistrationForms.generateValidationInputLastName);
  inputForEmail.addEventListener('input', validationRegistrationForms.generateValidationInputEmail);
  inputForPassword.addEventListener('input', validationRegistrationForms.generateValidationInputPassword);
  inputForStreet.addEventListener(
    'input',
    validationShippingAndBillingForms.generateValidationInputStreet.bind(null, inputForStreet, errorForInputStreet),
  );
  inputForCity.addEventListener(
    'input',
    validationShippingAndBillingForms.generateValidationInputCity.bind(null, inputForCity, errorForInputCity),
  );
  inputForCountry.addEventListener(
    'input',
    validationShippingAndBillingForms.genarateValidationInputCountry.bind(null, inputForCountry, errorForInputCountry),
  );
  inputForPostalCode.addEventListener(
    'input',
    validationShippingAndBillingForms.generateValidationInputPostalCode.bind(
      null,
      inputForCountry,
      inputForPostalCode,
      errorForInputPostalCode,
    ),
  );

  buttonForBillingForm.addEventListener('click', generateBillingForm);
  iconForInputPassword.addEventListener('click', togglePasswordVisibility);
  checkboxSameAddress.addEventListener('click', generateCopyAddress);
  inputForBirthDate.addEventListener('click', validationRegistrationForms.replaceInputType);
  buttonToLoginPage.addEventListener('click', () => {
    switchPage(Pages.LogIn);
    document.body.style.height = '';
  });

  containerForRegistrationForms.addEventListener('submit', async (event) => {
    event.preventDefault();
    switchPage(Pages.Main);
    document.body.style.height = '';
    const customerInfo = await requestsAPI.registerCustomer(
      inputForEmail.value.trim(),
      inputForFirstName.value.trim(),
      inputForLastName.value.trim(),
      inputForPassword.value.trim(),
      inputForBirthDate.value,
    );
    const customerId = customerInfo.customer.id;
    requestsAPI.addAddress(
      customerId,
      inputForFirstName.value.trim(),
      inputForLastName.value.trim(),
      inputForStreet.value,
      inputForPostalCode.value,
      inputForCity.value,
      inputForCountry.value,
      inputForEmail.value.trim(),
    );
  });

  return containerForRegistrationForms;
}
