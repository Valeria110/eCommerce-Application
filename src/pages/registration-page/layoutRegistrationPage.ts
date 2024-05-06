import * as variablesRegPage from '../registration-page/variablesForRegistrationPage';
import { generateBillingForm } from './layoutBillingForm';

export default function generateLayoutRegistrationPage() {
  document.body.innerHTML = '';
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
    variablesRegPage.inputForUsername,
    variablesRegPage.inputForEmail,
    variablesRegPage.containerForInputBirth,
    variablesRegPage.containerForInputPassword,
  );

  variablesRegPage.containerForInputBirth.append(
    variablesRegPage.inputForBirthDate,
    variablesRegPage.iconForInputBirth,
  );

  variablesRegPage.containerForInputPassword.append(
    variablesRegPage.inputForPassword,
    variablesRegPage.iconForInputPassword,
  );

  variablesRegPage.containerForShippingAddressForm.append(
    variablesRegPage.titleShippingAddressForm,
    variablesRegPage.shippingAddressForm,
  );

  variablesRegPage.shippingAddressForm.append(
    variablesRegPage.inputForCountry,
    variablesRegPage.inputForCity,
    variablesRegPage.inputForStreet,
    variablesRegPage.inputForPostalCode,
    variablesRegPage.containerForCheckboxSameAddress,
    variablesRegPage.containerForCheckboxDefault,
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

  return variablesRegPage.containerForRegistrationForms;
}
