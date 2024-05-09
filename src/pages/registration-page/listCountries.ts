import createElement from '../../elements/bootstrap/createElement';
import { checkboxSameAddress, inputForCountry, inputForCountryBillingForm } from './variablesForRegistrationPage';

export function generateResultsCountries(
  resultsCountries: string[],
  inputCountry: HTMLInputElement,
  containerResultsCountries: HTMLDivElement,
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
      inputCountry.classList.add('is-valid');
      inputCountry.classList.remove('openList');
      containerResultsCountries.innerHTML = '';
      containerResultsCountries.style.border = '0px';
      if (isChecked) {
        if (inputCountry === inputForCountry) {
          inputForCountryBillingForm.value = foundContry.textContent as string;
          inputForCountryBillingForm.classList.add('is-valid');
        } else {
          inputForCountry.value = foundContry.textContent as string;
          inputForCountry.classList.add('is-valid');
        }
      }
    });

    listCountries.appendChild(foundContry);
  });

  containerResultsCountries.style.border = '1px solid #ccc';
  inputCountry.classList.add('openList');
  containerResultsCountries.appendChild(listCountries);
}
