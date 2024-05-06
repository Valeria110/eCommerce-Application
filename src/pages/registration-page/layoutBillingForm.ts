import * as variablesRegPage from '../registration-page/variablesForRegistrationPage';

export function generateBillingForm() {
  variablesRegPage.buttonForBillingForm.style.display = 'none';
  variablesRegPage.containerForBillingForm.append(
    variablesRegPage.titleBillingForm,
    variablesRegPage.billingAddressForm,
    variablesRegPage.containerForCheckboxDefaultBillingForm,
  );

  variablesRegPage.billingAddressForm.append(
    variablesRegPage.inputForCountryBillingForm,
    variablesRegPage.inputForCityBillingForm,
    variablesRegPage.inputForStreetBillingForm,
    variablesRegPage.inputForPostalCodeBillingForm,
  );

  variablesRegPage.containerForCheckboxDefaultBillingForm.append(
    variablesRegPage.checkboxDefaultBillingForm,
    variablesRegPage.labelForCheckboxDefaultBillingForm,
  );
}
