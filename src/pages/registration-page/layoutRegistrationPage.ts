import * as variablesRegPage from '../registration-page/variablesForRegistrationPage';
import { generateBillingForm } from './layoutBillingForm';
import * as validationRegPage from '../registration-page/validationInputsRegPage';
import { generateCopyAddress } from '../registration-page/validationInputsRegPage';
import switchPage from '../../elements/switchPage';
import { Pages } from '../../elements/types';

function togglePasswordVisibility() {
  if (variablesRegPage.inputForPassword.type === 'password') {
    variablesRegPage.inputForPassword.type = 'text';
    variablesRegPage.iconForInputPassword.classList.add('registration-form__toggle-password_icon');
    variablesRegPage.iconForInputPassword.classList.remove('registration-form__input-password_icon');
  } else {
    variablesRegPage.inputForPassword.type = 'password';
    variablesRegPage.iconForInputPassword.classList.remove('registration-form__toggle-password_icon');
    variablesRegPage.iconForInputPassword.classList.add('registration-form__input-password_icon');
  }
}

export default function generateRegistrationPage() {
  document.body.style.height = 'auto';
  variablesRegPage.containerForRegistrationForms.append(
    variablesRegPage.registrationForm,
    variablesRegPage.containerForShippingAddressForm,
    variablesRegPage.buttonForBillingForm,
    variablesRegPage.containerForBillingForm,
    variablesRegPage.containerForButtonSignUpAndLogin,
  );

  variablesRegPage.registrationForm.append(
    variablesRegPage.containerForLogoAndTitleRegistrationPage,
    variablesRegPage.containerForInputsRegistrationForm,
  );

  variablesRegPage.containerForLogoAndTitleRegistrationPage.append(
    variablesRegPage.logoRegistrationPage,
    variablesRegPage.titleRegistrationPage,
  );

  variablesRegPage.containerForInputsRegistrationForm.append(
    variablesRegPage.inputForFirstName,
    variablesRegPage.errorForInputFirstName,
    variablesRegPage.inputForLastName,
    variablesRegPage.errorForInputLastName,
    variablesRegPage.inputForEmail,
    variablesRegPage.errorForInputEmail,
    variablesRegPage.containerForInputBirth,
    variablesRegPage.errorForInputBirth,
    variablesRegPage.containerForInputPassword,
    variablesRegPage.errorForInputPassword,
  );

  variablesRegPage.containerForInputBirth.append(variablesRegPage.inputForBirthDate);

  variablesRegPage.containerForInputPassword.append(
    variablesRegPage.inputForPassword,
    variablesRegPage.iconForInputPassword,
  );

  variablesRegPage.containerForShippingAddressForm.append(
    variablesRegPage.titleShippingAddressForm,
    variablesRegPage.shippingAddressForm,
  );

  variablesRegPage.shippingAddressForm.append(
    variablesRegPage.containerForInputCountry,
    variablesRegPage.inputForCity,
    variablesRegPage.errorForInputCity,
    variablesRegPage.inputForStreet,
    variablesRegPage.errorForInputStreet,
    variablesRegPage.inputForPostalCode,
    variablesRegPage.errorForInputPostalCode,
    variablesRegPage.containerForCheckboxSameAddress,
    variablesRegPage.containerForCheckboxDefault,
  );

  variablesRegPage.containerForInputCountry.append(
    variablesRegPage.inputForCountry,
    variablesRegPage.containerForResultsCountries,
    variablesRegPage.errorForInputCountry,
  );

  variablesRegPage.containerForCheckboxSameAddress.append(
    variablesRegPage.checkboxSameAddress,
    variablesRegPage.labelForCheckboxSameAddress,
  );

  variablesRegPage.containerForCheckboxDefault.append(
    variablesRegPage.checkboxDefault,
    variablesRegPage.labelForCheckboxDefault,
  );

  variablesRegPage.containerForButtonSignUpAndLogin.append(
    variablesRegPage.buttonSignUp,
    variablesRegPage.buttonToLoginPage,
  );

  variablesRegPage.buttonForBillingForm.addEventListener('click', generateBillingForm);

  variablesRegPage.containerForRegistrationForms.addEventListener('submit', (event) => {
    event.preventDefault();
    console.log(123);
  });

  variablesRegPage.inputForFirstName.addEventListener('input', validationRegPage.generateValidationInputFirstName);
  variablesRegPage.inputForLastName.addEventListener('input', validationRegPage.generateValidationInputLastName);
  variablesRegPage.inputForEmail.addEventListener('input', validationRegPage.generateValidationInputEmail);
  variablesRegPage.inputForBirthDate.addEventListener('click', validationRegPage.replaceInputType);
  variablesRegPage.inputForPassword.addEventListener('input', validationRegPage.generateValidationInputPassword);
  variablesRegPage.inputForStreet.addEventListener(
    'input',
    validationRegPage.generateValidationInputStreet.bind(
      null,
      variablesRegPage.inputForStreet,
      variablesRegPage.errorForInputStreet,
    ),
  );
  variablesRegPage.inputForCity.addEventListener(
    'input',
    validationRegPage.generateValidationInputCity.bind(
      null,
      variablesRegPage.inputForCity,
      variablesRegPage.errorForInputCity,
    ),
  );
  variablesRegPage.inputForCountry.addEventListener(
    'input',
    validationRegPage.genarateValidationInputCountry.bind(
      null,
      variablesRegPage.inputForCountry,
      variablesRegPage.errorForInputCountry,
    ),
  );
  variablesRegPage.inputForPostalCode.addEventListener(
    'input',
    validationRegPage.generateValidationInputPostalCode.bind(
      null,
      variablesRegPage.inputForCountry,
      variablesRegPage.inputForPostalCode,
      variablesRegPage.errorForInputPostalCode,
    ),
  );

  variablesRegPage.iconForInputPassword.addEventListener('click', togglePasswordVisibility);
  variablesRegPage.checkboxSameAddress.addEventListener('click', generateCopyAddress);
  variablesRegPage.buttonToLoginPage.addEventListener('click', () => {
    switchPage(Pages.LogIn);
    document.body.style.height = '';
  });

  variablesRegPage.buttonSignUp.addEventListener('click', () => {
    switchPage(Pages.Main);
    document.body.style.height = '';
  });

  return variablesRegPage.containerForRegistrationForms;
}
