import { BpmPage } from './app.po';

describe('bpm App', () => {
  let page: BpmPage;

  beforeEach(() => {
    page = new BpmPage();
  });

  it('should display message saying app works', () => {
    page.navigateTo();
    expect(page.getParagraphText()).toEqual('bpm works!');
  });
});
