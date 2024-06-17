import * as variablesCatalogPage from './variablesForCatalogPage';

export function handleSearchError() {
  variablesCatalogPage.containerForErrorSearch.append(
    variablesCatalogPage.imgForErrorSearch,
    variablesCatalogPage.containerForTextErrorSearch,
    variablesCatalogPage.containerForTextToTrySearch,
  );
  variablesCatalogPage.containerForTextErrorSearch.textContent =
    'No results found for the given criteria. Please adjust your search parameters and try again.';
  variablesCatalogPage.containerForAllBooks.append(variablesCatalogPage.containerForErrorSearch);
}
