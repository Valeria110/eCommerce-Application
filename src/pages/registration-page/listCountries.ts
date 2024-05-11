import createElement from '../../elements/bootstrap/createElement';
import { generateValidationInputPostalCode, newStyleForError } from './validationInputsRegPage';
import {
  checkboxSameAddress,
  errorForInputCountry,
  errorForInputCountryBillingForm,
  errorForInputPostalCode,
  errorForInputPostalCodeBillingForm,
  inputForCountry,
  inputForCountryBillingForm,
  inputForPostalCode,
  inputForPostalCodeBillingForm,
} from './variablesForRegistrationPage';

export function generateResultsCountries(
  resultsCountries: string[],
  inputCountry: HTMLInputElement,
  containerResultsCountries: HTMLDivElement,
  error: HTMLDivElement,
) {
  const isChecked = checkboxSameAddress.checked;

  if (!resultsCountries.length) {
    inputCountry.classList.remove('openList');
    inputCountry.classList.remove('is-valid');
    containerResultsCountries.innerHTML = '';
    containerResultsCountries.style.border = '0px';
    return;
  }

  const listCountries = createElement('ul', 'shipping-form__list-countries');

  resultsCountries.forEach((country) => {
    containerResultsCountries.innerHTML = '';
    inputCountry.classList.remove('is-valid');
    const foundContry = createElement('li', 'shipping-form__list-element');
    foundContry.textContent = country;

    foundContry.addEventListener('click', () => {
      inputCountry.value = foundContry.textContent as string;
      newStyleForError(inputCountry, error, false);
      inputCountry.classList.remove('openList');
      containerResultsCountries.innerHTML = '';
      containerResultsCountries.style.border = '0px';
      if (inputCountry === inputForCountry) {
        generateValidationInputPostalCode(inputForCountry, inputForPostalCode, errorForInputPostalCode);
      } else {
        generateValidationInputPostalCode(
          inputForCountryBillingForm,
          inputForPostalCodeBillingForm,
          errorForInputPostalCodeBillingForm,
        );
      }

      if (isChecked) {
        if (inputCountry === inputForCountry) {
          inputForCountryBillingForm.value = foundContry.textContent as string;
          newStyleForError(inputForCountryBillingForm, errorForInputCountryBillingForm, false);
        } else {
          inputForCountry.value = foundContry.textContent as string;
          newStyleForError(inputForCountry, errorForInputCountry, false);
        }
      }
    });

    listCountries.appendChild(foundContry);
  });

  containerResultsCountries.style.border = '1px solid #ccc';
  inputCountry.classList.add('openList');
  containerResultsCountries.appendChild(listCountries);
}
