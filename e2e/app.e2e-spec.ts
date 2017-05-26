import { ImageMetadataEditor2Page } from './app.po';

describe('image-metadata-editor2 App', () => {
  let page: ImageMetadataEditor2Page;

  beforeEach(() => {
    page = new ImageMetadataEditor2Page();
  });

  it('should display message saying app works', () => {
    page.navigateTo();
    expect(page.getParagraphText()).toEqual('app works!');
  });
});
