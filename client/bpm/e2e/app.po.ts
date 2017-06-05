import { browser, element, by } from 'protractor';

export class BpmPage {
  navigateTo() {
    return browser.get('/');
  }

  getParagraphText() {
    return element(by.css('bpm-root h1')).getText();
  }
}
