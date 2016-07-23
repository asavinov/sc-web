export class ScAppPage {
  navigateTo() {
    return browser.get('/');
  }

  getParagraphText() {
    return element(by.css('sc-app h1')).getText();
  }
}
