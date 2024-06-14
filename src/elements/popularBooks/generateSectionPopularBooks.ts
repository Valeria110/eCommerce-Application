import { extractBookInfo } from '../../pages/catalogPage/layoutCardsProducts';
import { splitArrayIntoChunks } from '../../pages/catalogPage/layoutCatalogPage';
import createElement from '../bootstrap/createElement';
import requestsAPI from '../requestsAPI';
import './styleSectionPopularBooks.scss';

let POPULAR_BOOKS: [] = [];
const COUNT_CHUNKS = 5;
const COUNT_PAGES = 0;

export function generateSectionPopularBooks(textTitle: string) {
  const containerForSectionPopularBook = createElement('div', 'main-page__popular-books-container');
  const titleSectionPopularBook = createElement('div', 'main-page__popular-books-title', textTitle);
  const containerForBooks = createElement('div', 'd-flex main-page__popular-books');
  setTimeout(async () => {
    try {
      const resultBooks = await requestsAPI.getProducts();
      POPULAR_BOOKS = resultBooks.results;
      extractBookInfo(splitArrayIntoChunks(POPULAR_BOOKS, COUNT_CHUNKS, false), COUNT_PAGES, containerForBooks);
      document.querySelectorAll('.catalog-page__button-cart').forEach((button) => {
        button.classList.add('d-none');
      });
    } catch (error) {
      console.error('API error:', (error as Error).message);
    }
  }, 500);

  containerForSectionPopularBook.append(titleSectionPopularBook, containerForBooks);
  return containerForSectionPopularBook;
}
