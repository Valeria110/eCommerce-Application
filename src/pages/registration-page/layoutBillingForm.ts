import * as variablesRegPage from '../registration-page/variablesForRegistrationPage';
import * as validationRegPage from './validationInputsShippingAndBillingAddressForms';

export function generateBillingForm() {
  const {
    buttonForBillingForm,
    containerForBillingForm,
    titleBillingForm,
    billingAddressForm,
    containerForCheckboxDefaultBillingForm,
    inputForStreetBillingForm,
    errorForInputStreetBillingForm,
    inputForCountryBillingForm,
    errorForInputCountryBillingForm,
    inputForCityBillingForm,
    errorForInputCityBillingForm,
    inputForPostalCodeBillingForm,
    errorForInputPostalCodeBillingForm,
  } = variablesRegPage;

  const {
    containerForInputCountryBillingForm,
    containerResultsCountriesBillingForm,
    checkboxDefaultBillingForm,
    labelForCheckboxDefaultBillingForm,
  } = variablesRegPage;

  buttonForBillingForm.style.display = 'none';

  containerForBillingForm.append(titleBillingForm, billingAddressForm, containerForCheckboxDefaultBillingForm);

  containerForInputCountryBillingForm.append(
    inputForCountryBillingForm,
    containerResultsCountriesBillingForm,
    errorForInputCountryBillingForm,
  );

  billingAddressForm.append(
    containerForInputCountryBillingForm,
    inputForCityBillingForm,
    errorForInputCityBillingForm,
    inputForStreetBillingForm,
    errorForInputStreetBillingForm,
    inputForPostalCodeBillingForm,
    errorForInputPostalCodeBillingForm,
  );

  containerForCheckboxDefaultBillingForm.append(checkboxDefaultBillingForm, labelForCheckboxDefaultBillingForm);

  inputForStreetBillingForm.addEventListener('input', () =>
    validationRegPage.generateValidationInputStreet(inputForStreetBillingForm, errorForInputStreetBillingForm),
  );

  inputForCountryBillingForm.addEventListener('input', () =>
    validationRegPage.genarateValidationInputCountry(inputForCountryBillingForm, errorForInputCountryBillingForm),
  );

  inputForCityBillingForm.addEventListener('input', () =>
    validationRegPage.generateValidationInputCity(inputForCityBillingForm, errorForInputCityBillingForm),
  );

  inputForPostalCodeBillingForm.addEventListener('input', () =>
    validationRegPage.generateValidationInputPostalCode(
      inputForCountryBillingForm,
      inputForPostalCodeBillingForm,
      errorForInputPostalCodeBillingForm,
    ),
  );
}
