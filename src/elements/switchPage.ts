import { Pages, AppEvents } from './types';

export default function switchPage(page: Pages, productId: string | undefined = undefined) {
  document.dispatchEvent(
    new CustomEvent(AppEvents.switchPage, {
      detail: { page, productId },
    }),
  );
}
