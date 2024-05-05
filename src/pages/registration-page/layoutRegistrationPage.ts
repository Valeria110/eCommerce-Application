import * as variablesRegPage from '../registration-page/variablesForRegistrationPage';

export default function generateLayoutRegistrationPage() {
  variablesRegPage.containerForRegistrationForms.append(
    variablesRegPage.registrationForm,
    variablesRegPage.shippingAddressForm,
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

  return variablesRegPage.containerForRegistrationForms;
}
