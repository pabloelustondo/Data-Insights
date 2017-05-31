import { Dss2Page } from './app.po';

describe('dss2 App', () => {
  let page: Dss2Page;

  beforeEach(() => {
    page = new Dss2Page();
  });

  it('should display message saying app works', () => {
    page.navigateTo();
    expect(page.getParagraphText()).toEqual('app works!');
  });
});
