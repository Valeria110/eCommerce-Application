import * as variablesCatalogPage from './variablesForCatalogPage';

export function handleSearchError(textError: string) {
  variablesCatalogPage.containerForErrorSearch.append(
    variablesCatalogPage.imgForErrorSearch,
    variablesCatalogPage.containerForTextErrorSearch,
    variablesCatalogPage.containerForTextToTrySearch,
  );
  variablesCatalogPage.containerForTextErrorSearch.textContent = `
    Strange, but there is nothing for the request "${textError}"`;
  variablesCatalogPage.containerForAllBooks.append(variablesCatalogPage.containerForErrorSearch);
}
