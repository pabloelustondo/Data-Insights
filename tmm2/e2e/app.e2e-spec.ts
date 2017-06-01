import { TmmPage } from './app.po';

describe('tmm App', () => {
  let page: TmmPage;

  beforeEach(() => {
    page = new TmmPage();
  });

  it('should have a table with two headers', () => {
    page.navigateTo();
    expect(page.getTableHeaders().count()).toEqual(2);
  });
});
