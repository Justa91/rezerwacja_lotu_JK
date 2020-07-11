import { Hostowanie01Page } from './app.po';

describe('hostowanie01 App', function() {
  let page: Hostowanie01Page;

  beforeEach(() => {
    page = new Hostowanie01Page();
  });

  it('should display message saying app works', () => {
    page.navigateTo();
    expect(page.getParagraphText()).toEqual('app works!');
  });
});
