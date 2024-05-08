import * as variablesRegPage from '../registration-page/variablesForRegistrationPage';
import {
  genarateValidationInputCountry,
  generateValidationInputCity,
  generateValidationInputPostalCode,
  generateValidationInputStreet,
} from './validationInputsRegPage';

export function generateBillingForm() {
  variablesRegPage.buttonForBillingForm.style.display = 'none';
  variablesRegPage.containerForBillingForm.append(
    variablesRegPage.titleBillingForm,
    variablesRegPage.billingAddressForm,
    variablesRegPage.containerForCheckboxDefaultBillingForm,
  );

  variablesRegPage.billingAddressForm.append(
    variablesRegPage.containerForInputCountryBillingForm,
    variablesRegPage.inputForCityBillingForm,
    variablesRegPage.errorForInputCityBillingForm,
    variablesRegPage.inputForStreetBillingForm,
    variablesRegPage.errorForInputStreetBillingForm,
    variablesRegPage.inputForPostalCodeBillingForm,
    variablesRegPage.errorForInputPostalCodeBillingForm,
  );

  variablesRegPage.containerForInputCountryBillingForm.append(
    variablesRegPage.inputForCountryBillingForm,
    variablesRegPage.containerResultsCountriesBillingForm,
    variablesRegPage.errorForInputCountryBillingForm,
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

  variablesRegPage.inputForCountryBillingForm.addEventListener(
    'input',
    genarateValidationInputCountry.bind(
      null,
      variablesRegPage.inputForCountryBillingForm,
      variablesRegPage.errorForInputCountryBillingForm,
    ),
  );

  variablesRegPage.inputForCityBillingForm.addEventListener(
    'input',
    generateValidationInputCity.bind(
      null,
      variablesRegPage.inputForCityBillingForm,
      variablesRegPage.errorForInputCityBillingForm,
    ),
  );

  variablesRegPage.inputForPostalCodeBillingForm.addEventListener(
    'input',
    generateValidationInputPostalCode.bind(
      null,
      variablesRegPage.inputForCountryBillingForm,
      variablesRegPage.inputForPostalCodeBillingForm,
      variablesRegPage.errorForInputPostalCodeBillingForm,
    ),
  );
}
