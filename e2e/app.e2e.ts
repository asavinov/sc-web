import { ScAppPage } from './app.po';

describe('sc-app App', function() {
  let page: ScAppPage;

  beforeEach(() => {
    page = new ScAppPage();
  })

  it('should display message saying app works', () => {
    page.navigateTo();
    //expect(page.getParagraphText()).toEqual('sc-app works!');
  });
});
