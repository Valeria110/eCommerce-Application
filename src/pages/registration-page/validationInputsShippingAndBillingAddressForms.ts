import * as variablesRegPage from '../registration-page/variablesForRegistrationPage';
import { generateBillingForm } from './layoutBillingForm';
import { generateResultsCountries } from './listCountries';
import { showErrorOnRegistration } from './validationInputsRegistrationForm';
import { ALL_CONTRIES, ALL_NUMBERS, ALL_SPECIAL_CHARACTERS } from './validationRegex';

export function splitStreetNameAndNumber(street: string): { name: string; number: string } {
  const words = street.trim().split(' ');
  let name = '';
  let number = '';

  for (let i = 0; i < words.length; i++) {
    if (!isNaN(Number(words[i]))) {
      name = words.slice(0, i).join(' ');
      number = words.slice(i).join(' ');
      break;
    }
  }
  if (number === '') {
    name = street;
  }

  return { name, number };
}

export function validateInputStreet(inputStreet: HTMLInputElement, error: HTMLDivElement) {
  const isChecked = variablesRegPage.checkboxSameAddress.checked;
  const isEmpty = inputStreet.value === '';

  if (isEmpty) {
    showErrorOnRegistration(inputStreet, error, true, 'Street must contain at least one character');
  } else {
    showErrorOnRegistration(inputStreet, error, false);
  }

  if (isChecked) {
    const billingInput =
      inputStreet === variablesRegPage.inputForStreet
        ? variablesRegPage.inputForStreetBillingForm
        : variablesRegPage.inputForStreet;
    const billingError =
      inputStreet === variablesRegPage.inputForStreet
        ? variablesRegPage.errorForInputStreetBillingForm
        : variablesRegPage.errorForInputStreet;
    billingInput.value = isEmpty ? '' : inputStreet.value;
    showErrorOnRegistration(billingInput, billingError, isEmpty, 'Street must contain at least one character');
  }
}

export function validateInputCity(inputCity: HTMLInputElement, error: HTMLDivElement) {
  const isChecked = variablesRegPage.checkboxSameAddress.checked;
  const isEmpty = inputCity.value === '';
  const containsNumbersOrSpecialCharacters =
    ALL_NUMBERS.test(inputCity.value) || ALL_SPECIAL_CHARACTERS.test(inputCity.value);

  if (isEmpty) {
    showErrorOnRegistration(inputCity, error, true, 'City must contain at least one character');
  } else if (containsNumbersOrSpecialCharacters) {
    showErrorOnRegistration(inputCity, error, true, 'City must not contain special characters or numbers');
  } else {
    showErrorOnRegistration(inputCity, error, false);
  }

  if (isChecked) {
    const billingInput =
      inputCity === variablesRegPage.inputForCity
        ? variablesRegPage.inputForCityBillingForm
        : variablesRegPage.inputForCity;
    const billingError =
      inputCity === variablesRegPage.inputForCity
        ? variablesRegPage.errorForInputCityBillingForm
        : variablesRegPage.errorForInputCity;
    billingInput.value = isEmpty ? '' : inputCity.value;
    if (isEmpty) {
      showErrorOnRegistration(billingInput, billingError, true, 'City must contain at least one character');
    } else if (containsNumbersOrSpecialCharacters) {
      showErrorOnRegistration(billingInput, billingError, true, 'City must not contain special characters or numbers');
    } else {
      showErrorOnRegistration(billingInput, billingError, false);
    }
  }
}

export function validateInputCountry(inputCountry: HTMLInputElement, error: HTMLDivElement) {
  const isEmpty = inputCountry.value === '';
  const countries = Object.keys(ALL_CONTRIES);
  let resultsCountries: string[] = [];

  if (isEmpty) {
    showErrorOnRegistration(inputCountry, error, true, 'This field is required');
  } else {
    showErrorOnRegistration(inputCountry, error, false);
  }

  if (!isEmpty) {
    resultsCountries = countries.filter((country) => {
      return country.toLowerCase().includes(inputCountry.value.toLowerCase());
    });
  }

  if (resultsCountries.length === 0 || !isEmpty) {
    showErrorOnRegistration(inputCountry, error, true, 'Country must be a valid');
  }

  const container =
    inputCountry === variablesRegPage.inputForCountry
      ? variablesRegPage.containerForResultsCountries
      : variablesRegPage.containerResultsCountriesBillingForm;
  const errorContainer =
    inputCountry === variablesRegPage.inputForCountry
      ? variablesRegPage.errorForInputCountry
      : variablesRegPage.errorForInputCountryBillingForm;
  generateResultsCountries(resultsCountries, inputCountry, container, errorContainer);
}

export function validateInputPostalCode(
  inputCountry: HTMLInputElement,
  inputPostalCode: HTMLInputElement,
  error: HTMLDivElement,
) {
  const countries = Object.keys(ALL_CONTRIES);
  const isEmptyPostalCode = inputPostalCode.value === '';
  const isChecked = variablesRegPage.checkboxSameAddress.checked;
  const postalCodeRegex = ALL_CONTRIES[inputCountry.value];
  const truePostalCode = postalCodeRegex && postalCodeRegex.test(inputPostalCode.value);

  if (inputCountry.value === '' || !countries.includes(inputCountry.value)) {
    showErrorOnRegistration(inputPostalCode, error, true, 'Please select a country');
  } else if (isEmptyPostalCode) {
    showErrorOnRegistration(inputPostalCode, error, true, 'This field is required');
  } else if (!truePostalCode) {
    showErrorOnRegistration(
      inputPostalCode,
      error,
      true,
      'Postal code must follow the format for the country (e.g., 12345 or A1B 2C3 for the U.S. and Canada, respectively)',
    );
  } else {
    showErrorOnRegistration(inputPostalCode, error, false);
  }

  if (isChecked) {
    const billingInput =
      inputPostalCode === variablesRegPage.inputForPostalCode
        ? variablesRegPage.inputForPostalCodeBillingForm
        : variablesRegPage.inputForPostalCode;
    const billingError =
      inputPostalCode === variablesRegPage.inputForPostalCode
        ? variablesRegPage.errorForInputPostalCodeBillingForm
        : variablesRegPage.errorForInputPostalCode;
    billingInput.value = isEmptyPostalCode ? '' : inputPostalCode.value;
    if (inputCountry.value === '' || !countries.includes(inputCountry.value)) {
      showErrorOnRegistration(billingInput, billingError, true, 'Please select a country');
    } else if (isEmptyPostalCode) {
      showErrorOnRegistration(billingInput, billingError, true, 'This field is required');
    } else if (!truePostalCode) {
      showErrorOnRegistration(
        billingInput,
        billingError,
        true,
        'Postal code must follow the format for the country (e.g., 12345 or A1B 2C3 for the U.S. and Canada, respectively)',
      );
    } else {
      showErrorOnRegistration(billingInput, billingError, false);
    }
  }
}

function copyFieldValue(
  shippingInput: HTMLInputElement,
  billingInput: HTMLInputElement,
  errorInputShippingForm: HTMLDivElement,
  errorInputBillingForm: HTMLDivElement,
) {
  if (shippingInput.value !== '' && !shippingInput.classList.contains('is-invalid')) {
    billingInput.value = shippingInput.value;
    billingInput.classList.remove('is-invalid');
    billingInput.classList.add('is-valid');
    showErrorOnRegistration(billingInput, errorInputBillingForm, false);
  } else {
    if (billingInput.value !== '' && !billingInput.classList.contains('is-invalid')) {
      shippingInput.value = billingInput.value;
      shippingInput.classList.remove('is-invalid');
      shippingInput.classList.add('is-valid');
      showErrorOnRegistration(shippingInput, errorInputShippingForm, false);
    } else {
      if (shippingInput.classList.contains('is-invalid')) {
        billingInput.value = shippingInput.value;
        billingInput.classList.remove('is-valid');
        billingInput.classList.add('is-invalid');
        showErrorOnRegistration(
          billingInput,
          errorInputBillingForm,
          true,
          errorInputShippingForm.textContent as string,
        );
      } else if (billingInput.classList.contains('is-invalid')) {
        shippingInput.value = billingInput.value;
        shippingInput.classList.remove('is-valid');
        shippingInput.classList.add('is-invalid');
        showErrorOnRegistration(
          shippingInput,
          errorInputShippingForm,
          true,
          errorInputBillingForm.textContent as string,
        );
      }
    }
  }
}

export function copyAddress() {
  generateBillingForm();
  const isChecked = variablesRegPage.checkboxSameAddress.checked;

  if (isChecked) {
    copyFieldValue(
      variablesRegPage.inputForCountry,
      variablesRegPage.inputForCountryBillingForm,
      variablesRegPage.errorForInputCountry,
      variablesRegPage.errorForInputCountryBillingForm,
    );
    copyFieldValue(
      variablesRegPage.inputForCity,
      variablesRegPage.inputForCityBillingForm,
      variablesRegPage.errorForInputCity,
      variablesRegPage.errorForInputCityBillingForm,
    );
    copyFieldValue(
      variablesRegPage.inputForStreet,
      variablesRegPage.inputForStreetBillingForm,
      variablesRegPage.errorForInputStreet,
      variablesRegPage.errorForInputStreetBillingForm,
    );
    copyFieldValue(
      variablesRegPage.inputForPostalCode,
      variablesRegPage.inputForPostalCodeBillingForm,
      variablesRegPage.errorForInputPostalCode,
      variablesRegPage.errorForInputPostalCodeBillingForm,
    );
  }
}
