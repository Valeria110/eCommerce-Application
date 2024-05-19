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
    validationRegPage.validateInputStreet(inputForStreetBillingForm, errorForInputStreetBillingForm),
  );

  inputForCountryBillingForm.addEventListener('input', () =>
    validationRegPage.validateInputCountry(inputForCountryBillingForm, errorForInputCountryBillingForm),
  );

  inputForCityBillingForm.addEventListener('input', () =>
    validationRegPage.validateInputCity(inputForCityBillingForm, errorForInputCityBillingForm),
  );

  inputForPostalCodeBillingForm.addEventListener('input', () =>
    validationRegPage.validateInputPostalCode(
      inputForCountryBillingForm,
      inputForPostalCodeBillingForm,
      errorForInputPostalCodeBillingForm,
    ),
  );
}
