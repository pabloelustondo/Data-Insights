import { Dad2Page } from './app.po';

describe('dad2 App', function() {
  let page: Dad2Page;

  beforeEach(() => {
    page = new Dad2Page();
  });

  it('should display message saying app works', () => {
    page.navigateTo();
    expect(page.getParagraphText()).toEqual('app works!');
  });
});
