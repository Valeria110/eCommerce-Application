import * as variablesRegPage from '../registration-page/variablesForRegistrationPage';
import { generateBillingForm } from './layoutBillingForm';
import { generateResultsCountries } from './listCountries';

const ALL_NUMBERS = /\d/;
const ALL_SPECIAL_CHARACTERS = /[!@#$%^&*()_+\-=[\]{};':"`\\|,.<>~/?]/;
const ALL_UPPERCASE_LETTERS = /[A-Z]/;
const ALL_LOWERCASE_LETTERS = /[a-z]/;
const ALL_CONTRIES: Record<string, RegExp> = {
  'Germany (DE)': /^\d{5}$/,
  'United States (US)': /^\d{5}(-\d{4})?$/,
  'Russia (RU)': /^\d{6}$/,
  'Ukraine (UA)': /^\d{5}$/,
  'Italy (IT)': /^\d{5}$/,
  'Belarus (BY)': /^\d{6}$/,
  'Kazakhstan (KZ)': /^\d{6}$/,
  'France (FR)': /^\d{5}$/,
  'Poland (PL)': /^\d{2}-\d{3}$/,
  'Bulgaria (BG)': /^\d{4}$/,
  'China (CN)': /^\d{6}$/,
  'Czechia (CZ)': /^\d{3} \d{2}$/,
  'Spain (ES)': /^\d{5}$/,
  'Sweden (SE)': /^\d{3} \d{2}$/,
  'Canada (CA)': /^[A-Za-z]\d[A-Za-z] \d[A-Za-z]\d$/,
};

function newStyleForError(input: HTMLInputElement, error: HTMLDivElement, isInvalid: boolean) {
  if (isInvalid === true) {
    error.style.display = 'block';
    error.style.marginTop = '0.25rem';
    error.style.marginBottom = '7px';
    input.style.marginBottom = '0px';
    input.classList.add('is-invalid');
    input.classList.remove('is-valid');
  } else {
    input.style.marginBottom = '16px';
    error.style.display = 'none';
    error.style.marginTop = '0px';
    input.classList.remove('is-invalid');
    input.classList.add('is-valid');
  }
}

export function generateValidationInputFirstName() {
  if (variablesRegPage.inputForFirstName.value === '') {
    variablesRegPage.errorForInputFirstName.textContent = 'First name must contain at least one character';
    newStyleForError(variablesRegPage.inputForFirstName, variablesRegPage.errorForInputFirstName, true);
  } else if (
    ALL_NUMBERS.test(variablesRegPage.inputForFirstName.value) ||
    ALL_SPECIAL_CHARACTERS.test(variablesRegPage.inputForFirstName.value)
  ) {
    variablesRegPage.errorForInputFirstName.textContent = 'First name must not contain special characters or numbers';
    newStyleForError(variablesRegPage.inputForFirstName, variablesRegPage.errorForInputFirstName, true);
  } else {
    newStyleForError(variablesRegPage.inputForFirstName, variablesRegPage.errorForInputFirstName, false);
  }
}

export function generateValidationInputLastName() {
  if (variablesRegPage.inputForLastName.value === '') {
    variablesRegPage.errorForInputLastName.textContent = 'First name must contain at least one character';
    newStyleForError(variablesRegPage.inputForLastName, variablesRegPage.errorForInputLastName, true);
  } else if (
    ALL_NUMBERS.test(variablesRegPage.inputForLastName.value) ||
    ALL_SPECIAL_CHARACTERS.test(variablesRegPage.inputForLastName.value)
  ) {
    variablesRegPage.errorForInputLastName.textContent = 'First name must not contain special characters or numbers';
    newStyleForError(variablesRegPage.inputForLastName, variablesRegPage.errorForInputLastName, true);
  } else {
    newStyleForError(variablesRegPage.inputForLastName, variablesRegPage.errorForInputLastName, false);
  }
}

export function generateValidationInputEmail() {
  if (variablesRegPage.inputForEmail.value === '') {
    variablesRegPage.errorForInputEmail.textContent = 'This field is required';
    newStyleForError(variablesRegPage.inputForEmail, variablesRegPage.errorForInputEmail, true);
  } else if (
    variablesRegPage.inputForEmail.validity.typeMismatch ||
    !variablesRegPage.inputForEmail.value.endsWith('com')
  ) {
    variablesRegPage.errorForInputEmail.textContent = 'Email must be properly formatted (e.g., user@example.com)';
    newStyleForError(variablesRegPage.inputForEmail, variablesRegPage.errorForInputEmail, true);
  } else {
    newStyleForError(variablesRegPage.inputForEmail, variablesRegPage.errorForInputEmail, false);
  }
}

export function generateValidationBirthDate() {
  variablesRegPage.inputForBirthDate.type = 'date';
}

export function generateValidationInputPassword() {
  if (variablesRegPage.inputForPassword.value === '') {
    variablesRegPage.errorForInputPassword.textContent = 'This field is required';
    variablesRegPage.containerForInputPassword.style.marginBottom = '0px';
    newStyleForError(variablesRegPage.inputForPassword, variablesRegPage.errorForInputPassword, true);
  } else if (!ALL_NUMBERS.test(variablesRegPage.inputForPassword.value)) {
    variablesRegPage.errorForInputPassword.textContent = 'Password must must contain at least one digit';
    variablesRegPage.containerForInputPassword.style.marginBottom = '0px';
    newStyleForError(variablesRegPage.inputForPassword, variablesRegPage.errorForInputPassword, true);
  } else if (!ALL_LOWERCASE_LETTERS.test(variablesRegPage.inputForPassword.value)) {
    variablesRegPage.errorForInputPassword.textContent = 'Password must must contain at least one lowercase letter';
    variablesRegPage.containerForInputPassword.style.marginBottom = '0px';
    newStyleForError(variablesRegPage.inputForPassword, variablesRegPage.errorForInputPassword, true);
  } else if (!ALL_UPPERCASE_LETTERS.test(variablesRegPage.inputForPassword.value)) {
    variablesRegPage.errorForInputPassword.textContent = 'Password must must contain at least one uppercase letter';
    variablesRegPage.containerForInputPassword.style.marginBottom = '0px';
    newStyleForError(variablesRegPage.inputForPassword, variablesRegPage.errorForInputPassword, true);
  } else if (variablesRegPage.inputForPassword.value.length < 8) {
    variablesRegPage.errorForInputPassword.textContent = `Password should be at least 8 characters; you entered ${variablesRegPage.inputForPassword.value.length}`;
    variablesRegPage.containerForInputPassword.style.marginBottom = '0px';
    newStyleForError(variablesRegPage.inputForPassword, variablesRegPage.errorForInputPassword, true);
  } else {
    variablesRegPage.containerForInputPassword.style.marginBottom = '16px';
    newStyleForError(variablesRegPage.inputForPassword, variablesRegPage.errorForInputPassword, false);
  }
}

export function generateValidationInputStreet(inputStreet: HTMLInputElement, error: HTMLDivElement) {
  const isChecked = variablesRegPage.checkboxSameAddress.checked;
  const isEmpty = inputStreet.value === '';

  if (isEmpty) {
    error.textContent = 'Street must contain at least one character';
    newStyleForError(inputStreet, error, true);
  } else {
    newStyleForError(inputStreet, error, false);
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
    newStyleForError(billingInput, billingError, isEmpty);
  }
}

export function generateValidationInputCity(inputCity: HTMLInputElement, error: HTMLDivElement) {
  const isChecked = variablesRegPage.checkboxSameAddress.checked;
  const isEmpty = inputCity.value === '';
  const containsNumbersOrSpecialCharacters =
    ALL_NUMBERS.test(inputCity.value) || ALL_SPECIAL_CHARACTERS.test(inputCity.value);

  if (isEmpty) {
    error.textContent = 'City must contain at least one character';
    newStyleForError(inputCity, error, true);
  } else if (containsNumbersOrSpecialCharacters) {
    error.textContent = 'City must not contain special characters or numbers';
    newStyleForError(inputCity, error, true);
  } else {
    newStyleForError(inputCity, error, false);
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
    newStyleForError(billingInput, billingError, isEmpty || containsNumbersOrSpecialCharacters);
  }
}

export function genarateValidationInputCountry(inputCountry: HTMLInputElement, error: HTMLDivElement) {
  const isEmpty = inputCountry.value === '';

  if (isEmpty) {
    error.textContent = 'This field is required';
    newStyleForError(inputCountry, error, true);
  } else {
    newStyleForError(inputCountry, error, false);
  }

  let resultsCountries: string[] = [];

  if (inputCountry.value.length !== 0) {
    const countries = Object.keys(ALL_CONTRIES);
    resultsCountries = countries.filter((country) => {
      return country.toLowerCase().includes(inputCountry.value.toLowerCase());
    });
  }

  if (resultsCountries.length === 0 && !isEmpty) {
    error.textContent = 'Country must be a valid';
    newStyleForError(inputCountry, error, true);
  }

  if (inputCountry === variablesRegPage.inputForCountry) {
    variablesRegPage.inputForCity.value = '';
    variablesRegPage.inputForCity.classList.remove('is-valid');
    variablesRegPage.inputForStreet.value = '';
    variablesRegPage.inputForStreet.classList.remove('is-valid');
    variablesRegPage.inputForPostalCode.value = '';
    variablesRegPage.inputForPostalCode.classList.remove('is-valid');
    generateResultsCountries(resultsCountries, inputCountry, variablesRegPage.containerForResultsCountries);
  } else {
    variablesRegPage.inputForCityBillingForm.value = '';
    variablesRegPage.inputForCityBillingForm.classList.remove('is-valid');
    variablesRegPage.inputForStreetBillingForm.value = '';
    variablesRegPage.inputForStreetBillingForm.classList.remove('is-valid');
    variablesRegPage.inputForPostalCodeBillingForm.value = '';
    variablesRegPage.inputForPostalCodeBillingForm.classList.remove('is-valid');
    generateResultsCountries(resultsCountries, inputCountry, variablesRegPage.containerResultsCountriesBillingForm);
  }
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
    newStyleForError(inputPostalCode, error, true);
  } else if (isEmptyPostalCode) {
    error.textContent = 'This field is required';
    newStyleForError(inputPostalCode, error, true);
  } else if (!truePostalCode) {
    error.textContent =
      'Postal code must follow the format for the country (e.g., 12345 or A1B 2C3 for the U.S. and Canada, respectively)';
    newStyleForError(inputPostalCode, error, true);
  } else {
    newStyleForError(inputPostalCode, error, false);
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
    newStyleForError(billingInput, billingError, isEmptyPostalCode || !truePostalCode || isEmptyCountry);
  }
}

function copyFieldValue(shippingInput: HTMLInputElement, billingInput: HTMLInputElement) {
  if (shippingInput.value !== '' && !shippingInput.classList.contains('is-invalid')) {
    billingInput.value = shippingInput.value;
    billingInput.classList.add('is-valid');
  } else if (shippingInput.classList.contains('is-invalid')) {
    billingInput.classList.add('is-invalid');
  }
}

export function generateCopyAddress() {
  generateBillingForm();
  const isChecked = variablesRegPage.checkboxSameAddress.checked;

  if (isChecked) {
    copyFieldValue(variablesRegPage.inputForCountry, variablesRegPage.inputForCountryBillingForm);
    copyFieldValue(variablesRegPage.inputForCity, variablesRegPage.inputForCityBillingForm);
    copyFieldValue(variablesRegPage.inputForStreet, variablesRegPage.inputForStreetBillingForm);
    copyFieldValue(variablesRegPage.inputForPostalCode, variablesRegPage.inputForPostalCodeBillingForm);
  }
}
