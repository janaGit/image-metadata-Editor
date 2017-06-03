import { ImageMetadataEditorPage } from './app.po';

describe('image-metadata-editor App', () => {
  let page: ImageMetadataEditorPage;

  beforeEach(() => {
    page = new ImageMetadataEditorPage();
  });

  it('should display message saying app works', () => {
    page.navigateTo();
    expect(page.getParagraphText()).toEqual('app works!');
  });
});
