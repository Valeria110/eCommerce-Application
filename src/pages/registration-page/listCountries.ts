import createElement from '../../elements/bootstrap/createElement';
import { showErrorOnRegistration } from './validationInputsRegistrationForm';
import * as variablesRegPage from '../registration-page/variablesForRegistrationPage';
import { generateValidationInputPostalCode } from './validationInputsShippingAndBillingAddressForms';

function clearResultsAndStyles(inputCountry: HTMLInputElement, containerResultsCountries: HTMLDivElement) {
  inputCountry.classList.remove('openList', 'is-valid');
  containerResultsCountries.innerHTML = '';
  containerResultsCountries.style.border = '0px';
}

export function generateResultsCountries(
  resultsCountries: string[],
  inputCountry: HTMLInputElement,
  containerResultsCountries: HTMLDivElement,
  error: HTMLDivElement,
) {
  const isChecked = variablesRegPage.checkboxSameAddress.checked;

  if (!resultsCountries.length) {
    clearResultsAndStyles(inputCountry, containerResultsCountries);
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
      showErrorOnRegistration(inputCountry, error, false);
      inputCountry.classList.remove('openList');
      containerResultsCountries.innerHTML = '';
      containerResultsCountries.style.border = '0px';
      if (inputCountry === variablesRegPage.inputForCountry) {
        generateValidationInputPostalCode(
          variablesRegPage.inputForCountry,
          variablesRegPage.inputForPostalCode,
          variablesRegPage.errorForInputPostalCode,
        );
      } else {
        generateValidationInputPostalCode(
          variablesRegPage.inputForCountryBillingForm,
          variablesRegPage.inputForPostalCodeBillingForm,
          variablesRegPage.errorForInputPostalCodeBillingForm,
        );
      }

      if (isChecked) {
        if (inputCountry === variablesRegPage.inputForCountry) {
          variablesRegPage.inputForCountryBillingForm.value = foundContry.textContent as string;
          showErrorOnRegistration(
            variablesRegPage.inputForCountryBillingForm,
            variablesRegPage.errorForInputCountryBillingForm,
            false,
          );
        } else {
          variablesRegPage.inputForCountry.value = foundContry.textContent as string;
          showErrorOnRegistration(variablesRegPage.inputForCountry, variablesRegPage.errorForInputCountry, false);
        }
      }
    });

    listCountries.appendChild(foundContry);
  });

  containerResultsCountries.style.border = '1px solid #ccc';
  inputCountry.classList.add('openList');
  containerResultsCountries.appendChild(listCountries);
}
