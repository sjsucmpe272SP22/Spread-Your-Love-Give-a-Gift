import { EKUGiftsEmporiumPage } from './app.po';

describe('ekugifts-emporium App', () => {
  let page: EKUGiftsEmporiumPage;

  beforeEach(() => {
    page = new EKUGiftsEmporiumPage();
  });

  it('should display welcome message', () => {
    page.navigateTo();
    expect(page.getParagraphText()).toEqual('Welcome to app!');
  });
});
