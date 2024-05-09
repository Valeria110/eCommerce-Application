import { Pages, AppEvents } from './types';

export default function switchPage(page: Pages) {
  document.dispatchEvent(
    new CustomEvent(AppEvents.switchPage, {
      detail: page,
    }),
  );
}
