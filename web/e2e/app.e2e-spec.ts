import { YacsWebPage } from './app.po';

describe('yacs-web App', () => {
  let page: YacsWebPage;

  beforeEach(() => {
    page = new YacsWebPage();
  });

  it('should display message saying app works', () => {
    page.navigateTo();
    expect(page.getParagraphText()).toEqual('app works!');
  });
});
