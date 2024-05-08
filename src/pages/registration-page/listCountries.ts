import createElement from '../../elements/bootstrap/createElement';
import * as variablesRegPage from '../registration-page/variablesForRegistrationPage';

export function generateResultsCountries(resultsCountries: string[]) {
  if (!resultsCountries.length) {
    variablesRegPage.inputForCountry.classList.remove('openList');
    variablesRegPage.inputForCountry.classList.remove('is-valid');
    variablesRegPage.resultsCountries.innerHTML = '';
    variablesRegPage.resultsCountries.style.border = '0px';
    return;
  }

  const listCountries = createElement('ul', 'shipping-form__list-countries');

  resultsCountries.forEach((country) => {
    variablesRegPage.resultsCountries.innerHTML = '';
    variablesRegPage.inputForCountry.classList.remove('is-valid');
    const foundContry = createElement('li', 'shipping-form__list-element');
    foundContry.textContent = country;
    foundContry.addEventListener('click', () => {
      variablesRegPage.inputForCountry.value = foundContry.textContent as string;
      variablesRegPage.inputForCountry.classList.add('is-valid');
      variablesRegPage.inputForCountry.classList.remove('openList');
      variablesRegPage.resultsCountries.innerHTML = '';
      variablesRegPage.resultsCountries.style.border = '0px';
    });
    listCountries.appendChild(foundContry);
  });

  variablesRegPage.resultsCountries.style.border = '1px solid #ccc';
  variablesRegPage.inputForCountry.classList.add('openList');
  variablesRegPage.resultsCountries.appendChild(listCountries);
}
