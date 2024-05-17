import switchPage from './switchPage';
import { AppEvents, Pages } from './types';

describe('switchPage', () => {
  it('should dispatch a custom event with the correct detail', () => {
    const page: Pages = Pages.Main;
    const mockFn = jest.fn();

    document.addEventListener(AppEvents.switchPage, mockFn);
    switchPage(page);

    expect(mockFn).toHaveBeenCalledWith(
      expect.objectContaining({
        type: AppEvents.switchPage,
        detail: page,
      }),
    );
  });
});
