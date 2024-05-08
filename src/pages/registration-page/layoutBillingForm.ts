import * as variablesRegPage from '../registration-page/variablesForRegistrationPage';
import { generateValidationInputStreet } from './validationInputsRegPage';

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
    variablesRegPage.errorForInputStreetBillingForm,
    variablesRegPage.inputForPostalCodeBillingForm,
  );

  variablesRegPage.containerForCheckboxDefaultBillingForm.append(
    variablesRegPage.checkboxDefaultBillingForm,
    variablesRegPage.labelForCheckboxDefaultBillingForm,
  );

  variablesRegPage.inputForStreetBillingForm.addEventListener(
    'input',
    generateValidationInputStreet.bind(
      null,
      variablesRegPage.inputForStreetBillingForm,
      variablesRegPage.errorForInputStreetBillingForm,
    ),
  );
}
