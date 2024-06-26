import switchPage from '../../elements/switchPage';
import { Pages } from '../../elements/types';
import * as variablesCatalogPage from '../catalogPage/variablesForCatalogPage';
import { getBooks, handlePriceInputChange, resetSorting, searchBook } from './layoutCatalogPage';

export function buildCatalogStructure() {
  const {
    containerForCatalogPage,
    containerForBreadcrumb,
    containerForBooksFilterPanel,
    containerForAllBooks,
    containerForPagination,
    linkMain,
    arrowToBreadcrumb,
    linkCatalog,
    containerForCategoryAndPrice,
    containerForInputSearchBooks,
    containerforCategoryAndSort,
    containerForPriceAndCurrency,
    dropDownBooksCategories,
    listCategories,
    dropDownBooksSort,
    listSort,
    inputMinPrice,
    clearInputMinPrice,
    inputMaxPrice,
    priceCurrency,
    buttonAllBooks,
    buttonSort,
    listItemAllBooks,
    listItemClassic,
    listItemScience,
    listItemRomantic,
    listItemIT,
    listItemBestsellers,
    listItemPsychology,
    listItemNoSort,
    listItemCheap,
    listItemExpensive,
    listItemAlphabetically,
    inputSearchBooks,
    iconForInputSearchBooks,
    iconArrowLeft,
    containerForNumbersPages,
    iconArrowRight,
    nameCategory,
    newArrow,
    containerForInputMinPrice,
    containerForInputMaxPrice,
    clearInputMaxPrice,
    buttonClearSorting,
    containerForModalWindowInfoCart,
    shadowButtonOpenWindow,
    containerForSearchAndButtonClearFilters,
  } = variablesCatalogPage;

  containerForCatalogPage.append(
    containerForModalWindowInfoCart,
    shadowButtonOpenWindow,
    containerForBreadcrumb,
    containerForBooksFilterPanel,
    containerForAllBooks,
    containerForPagination,
  );

  containerForBreadcrumb.append(linkMain, arrowToBreadcrumb, linkCatalog);

  containerForBooksFilterPanel.append(containerForCategoryAndPrice, containerForSearchAndButtonClearFilters);

  containerForCategoryAndPrice.append(containerforCategoryAndSort, containerForPriceAndCurrency);

  containerforCategoryAndSort.append(dropDownBooksCategories, listCategories, dropDownBooksSort, listSort);

  containerForPriceAndCurrency.append(containerForInputMinPrice, containerForInputMaxPrice, priceCurrency);

  containerForInputMinPrice.append(inputMinPrice, clearInputMinPrice);
  containerForInputMaxPrice.append(inputMaxPrice, clearInputMaxPrice);

  dropDownBooksCategories.append(buttonAllBooks);
  dropDownBooksSort.append(buttonSort);

  listCategories.append(
    listItemAllBooks,
    listItemClassic,
    listItemScience,
    listItemRomantic,
    listItemIT,
    listItemBestsellers,
    listItemPsychology,
  );

  listSort.append(listItemNoSort, listItemCheap, listItemExpensive, listItemAlphabetically);

  containerForSearchAndButtonClearFilters.append(containerForInputSearchBooks, buttonClearSorting);

  containerForInputSearchBooks.append(inputSearchBooks, iconForInputSearchBooks);

  containerForPagination.append(iconArrowLeft, containerForNumbersPages, iconArrowRight);

  if (containerForBreadcrumb.contains(nameCategory)) {
    newArrow.remove();
    nameCategory.remove();
  }

  variablesCatalogPage.containerForModalWindowInfoCart.append(variablesCatalogPage.modalWindowInfoCart);
  variablesCatalogPage.modalWindowInfoCart.append(variablesCatalogPage.contentModalWindowInfoCart);
  variablesCatalogPage.contentModalWindowInfoCart.append(
    variablesCatalogPage.headerModalWindowInfoCart,
    variablesCatalogPage.bodyModalWindowInfoCart,
  );

  variablesCatalogPage.bodyModalWindowInfoCart.append(
    variablesCatalogPage.textbodyModalWindowInfoCart,
    variablesCatalogPage.buttonCart,
  );

  variablesCatalogPage.headerModalWindowInfoCart.append(
    variablesCatalogPage.titleModalWindowInfoCart,
    variablesCatalogPage.buttonCloseModalWindowInfoCart,
  );
}

export function attachCatalogEventListeners() {
  const {
    iconArrowRight,
    iconArrowLeft,
    iconForInputSearchBooks,
    inputSearchBooks,
    linkMain,
    inputMinPrice,
    inputMaxPrice,
    clearInputMaxPrice,
    clearInputMinPrice,
    buttonClearSorting,
    buttonCart,
  } = variablesCatalogPage;

  iconArrowRight.onclick = swapCatalogPages.bind(null, 'right');
  iconArrowLeft.onclick = swapCatalogPages.bind(null, 'left');

  iconForInputSearchBooks.addEventListener('click', () => {
    if (inputSearchBooks.value.length !== 0) {
      inputSearchBooks.value = '';
      searchBook();
    }
  });

  clearInputMaxPrice.addEventListener('click', () => {
    inputMaxPrice.value = '';
    handlePriceInputChange();
  });

  clearInputMinPrice.addEventListener('click', () => {
    inputMinPrice.value = '';
    handlePriceInputChange();
  });

  linkMain.addEventListener('click', () => {
    switchPage(Pages.Main);
  });

  buttonClearSorting.addEventListener('click', () => {
    resetSorting();
  });

  buttonCart.addEventListener('click', () => {
    switchPage(Pages.Basket);
  });

  inputMinPrice.addEventListener('input', handlePriceInputChange);
  inputMaxPrice.addEventListener('input', handlePriceInputChange);
}

function swapCatalogPages(direction: string) {
  const currentPageString = localStorage.getItem('numberPageBooks');
  const currentPage = currentPageString !== null ? Number(currentPageString) : 0;
  let newPage;

  if (direction === 'right') {
    newPage = currentPage + 1;
  } else {
    newPage = currentPage - 1;
  }

  localStorage.setItem('numberPageBooks', String(newPage));

  document
    .querySelectorAll('.catalog-page__pagination_item.active-page')
    .forEach((item) => item.classList.remove('active-page'));

  const newPageElement = document.getElementById(String(newPage));
  if (newPageElement) {
    newPageElement.classList.add('active-page');
  }

  getBooks();
}
