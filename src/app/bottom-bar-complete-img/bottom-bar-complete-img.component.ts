import { Component, OnInit, OnDestroy } from '@angular/core';
import { EditorService } from '../services/editor.service';
import { ImageService } from '../services/image.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'bottom-bar-complete-img',
  templateUrl: './bottom-bar-complete-img.component.html',
  styleUrls: ['./bottom-bar-complete-img.component.scss', '../css/hover-box.scss']
})
export class BottomBarCompleteImgComponent implements OnInit, OnDestroy {
  /**
   * Title of the Bottom bar
   */
  _bottomBar_title = "Completed Images";
  /**
   * List of the images names that exist in the folder: images complete 
   */
  _imageNames_complete: string[];

  private _imageNameSubscription: Subscription;
  /**
   * This variable stores an error message that was returned
   * by the image service.
   */
  private _errorMessage_imageService: string;
  constructor(private _editorService: EditorService, private _imageService: ImageService) { }
  ngOnDestroy(): void {
    this._imageNameSubscription.unsubscribe();
    }

  ngOnInit() {
    this.getImageNamesOriginal();
    this._imageService.updateImageNamesInFolder_complete();
  }
  /**
   * Get the image names of the original images folder (images_original).
   */
  getImageNamesOriginal() {
    this._imageNameSubscription = this._editorService._imageNamesInFolder_complete$.subscribe(
      images => {
        this._imageNames_complete = images;
      },
      error => { this._errorMessage_imageService = <any>error }
    );
  }

}
