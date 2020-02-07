import { Component, OnInit } from '@angular/core';
import { EditorService } from '../services/editor.service';
import { ImageService } from '../services/image.service';

@Component({
  selector: 'bottom-bar-complete-img',
  templateUrl: './bottom-bar-complete-img.component.html',
  styleUrls: ['./bottom-bar-complete-img.component.css', '../css/hover-box.css']
})
export class BottomBarCompleteImgComponent implements OnInit {
  /**
   * Title of the Bottom bar
   */
  _bottomBar_title = "Completed Images";
  /**
   * List of the images names that exist in the folder: images complete 
   */
  _imageNames_complete: string[];
  /**
   * This variable stores an error message that was returned
   * by the image service.
   */
  private _errorMessage_imageService: string;
  constructor(private _editorService: EditorService, private _imageService: ImageService) { }

  ngOnInit() {
    this.getImageNamesOriginal();
    this._imageService.updateImageNamesInFolder_complete();
  }
  /**
   * Get the image names of the original images folder (images_original).
   */
  getImageNamesOriginal() {
    this._editorService._imageNamesInFolder_complete$.subscribe(
      images => {
        this._imageNames_complete = images;
      },
      error => { this._errorMessage_imageService = <any>error }
    );
  }

}
