import * as variablesRegPage from '../registration-page/variablesForRegistrationPage';
import { generateBillingForm } from './layoutBillingForm';
import { generateResultsCountries } from './listCountries';
import { applyNewStyleForError } from './validationInputsRegistrationForm';
import { ALL_CONTRIES, ALL_NUMBERS, ALL_SPECIAL_CHARACTERS } from './validationRegex';

export function generateValidationInputStreet(inputStreet: HTMLInputElement, error: HTMLDivElement) {
  const isChecked = variablesRegPage.checkboxSameAddress.checked;
  const isEmpty = inputStreet.value === '';

  if (isEmpty) {
    error.textContent = 'Street must contain at least one character';
    applyNewStyleForError(inputStreet, error, true);
  } else {
    applyNewStyleForError(inputStreet, error, false);
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
    billingError.textContent = isEmpty ? 'Street must contain at least one character' : '';
    applyNewStyleForError(billingInput, billingError, isEmpty);
  }
}

export function generateValidationInputCity(inputCity: HTMLInputElement, error: HTMLDivElement) {
  const isChecked = variablesRegPage.checkboxSameAddress.checked;
  const isEmpty = inputCity.value === '';
  const containsNumbersOrSpecialCharacters =
    ALL_NUMBERS.test(inputCity.value) || ALL_SPECIAL_CHARACTERS.test(inputCity.value);

  if (isEmpty) {
    error.textContent = 'City must contain at least one character';
    applyNewStyleForError(inputCity, error, true);
  } else if (containsNumbersOrSpecialCharacters) {
    error.textContent = 'City must not contain special characters or numbers';
    applyNewStyleForError(inputCity, error, true);
  } else {
    applyNewStyleForError(inputCity, error, false);
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
    billingError.textContent = isEmpty ? 'City must contain at least one character' : '';
    billingError.textContent = isEmpty
      ? 'City must contain at least one character'
      : containsNumbersOrSpecialCharacters
        ? 'City must not contain special characters or numbers'
        : '';
    applyNewStyleForError(billingInput, billingError, isEmpty || containsNumbersOrSpecialCharacters);
  }
}

export function genarateValidationInputCountry(inputCountry: HTMLInputElement, error: HTMLDivElement) {
  const isEmpty = inputCountry.value === '';
  const countries = Object.keys(ALL_CONTRIES);
  let resultsCountries: string[] = [];

  if (isEmpty) {
    error.textContent = 'This field is required';
    applyNewStyleForError(inputCountry, error, true);
  } else {
    applyNewStyleForError(inputCountry, error, false);
  }

  if (!isEmpty) {
    resultsCountries = countries.filter((country) => {
      return country.toLowerCase().includes(inputCountry.value.toLowerCase());
    });
  }

  if (resultsCountries.length === 0 && !isEmpty) {
    error.textContent = 'Country must be a valid';
    applyNewStyleForError(inputCountry, error, true);
  } else {
    error.textContent = 'Country must be a valid';
    applyNewStyleForError(inputCountry, error, true);
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

export function generateValidationInputPostalCode(
  inputCountry: HTMLInputElement,
  inputPostalCode: HTMLInputElement,
  error: HTMLDivElement,
) {
  const countries = Object.keys(ALL_CONTRIES);
  const isEmptyCountry = inputCountry.value === '';
  const isEmptyPostalCode = inputPostalCode.value === '';
  const isChecked = variablesRegPage.checkboxSameAddress.checked;
  const postalCodeRegex = ALL_CONTRIES[inputCountry.value];
  const truePostalCode = postalCodeRegex && postalCodeRegex.test(inputPostalCode.value);

  if (inputCountry.value === '' || !countries.includes(inputCountry.value)) {
    error.textContent = 'Please select a country';
    applyNewStyleForError(inputPostalCode, error, true);
  } else if (isEmptyPostalCode) {
    error.textContent = 'This field is required';
    applyNewStyleForError(inputPostalCode, error, true);
  } else if (!truePostalCode) {
    error.textContent =
      'Postal code must follow the format for the country (e.g., 12345 or A1B 2C3 for the U.S. and Canada, respectively)';
    applyNewStyleForError(inputPostalCode, error, true);
  } else {
    applyNewStyleForError(inputPostalCode, error, false);
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
    billingError.textContent = isEmptyCountry
      ? 'Please select a country'
      : isEmptyPostalCode
        ? 'This field is required'
        : !truePostalCode
          ? 'Postal code must follow the format for the country (e.g., 12345 or A1B 2C3 for the U.S. and Canada, respectively)'
          : '';
    applyNewStyleForError(billingInput, billingError, isEmptyPostalCode || !truePostalCode || isEmptyCountry);
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
    applyNewStyleForError(billingInput, errorInputBillingForm, false);
  } else {
    if (billingInput.value !== '' && !billingInput.classList.contains('is-invalid')) {
      shippingInput.value = billingInput.value;
      shippingInput.classList.remove('is-invalid');
      shippingInput.classList.add('is-valid');
      applyNewStyleForError(shippingInput, errorInputShippingForm, false);
    } else {
      if (shippingInput.classList.contains('is-invalid')) {
        billingInput.value = shippingInput.value;
        billingInput.classList.remove('is-valid');
        billingInput.classList.add('is-invalid');
        errorInputBillingForm.textContent = errorInputShippingForm.textContent;
        applyNewStyleForError(billingInput, errorInputBillingForm, true);
      } else if (billingInput.classList.contains('is-invalid')) {
        shippingInput.value = billingInput.value;
        shippingInput.classList.remove('is-valid');
        shippingInput.classList.add('is-invalid');
        errorInputShippingForm.textContent = errorInputBillingForm.textContent;
        applyNewStyleForError(shippingInput, errorInputShippingForm, true);
      }
    }
  }
}

export function generateCopyAddress() {
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
