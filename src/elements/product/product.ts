import Bootstrap from '../bootstrap/Bootstrap';
import { generateSectionPopularBooks } from '../popularBooks/generateSectionPopularBooks';
import requestsAPI from '../requestsAPI';
import switchPage from '../switchPage';
import { Pages } from '../types';

export default function product(id: string) {
  const page = Bootstrap.createElement('div', 'd-flex flex-column justify-content-center align-items-center');

  (async () => {
    const response = await requestsAPI.getProductsByID(id);
    if (response) {
      page.append(Bootstrap.createElement('h2', '', response.title));
      page.append(Bootstrap.createElement('p', '', response.description));
      page.append(generateSectionPopularBooks('You might like it'));
    } else {
      switchPage(Pages.Error404);
    }
  })();

  return page;
}
