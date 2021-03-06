import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subject, Subscription } from 'rxjs';

import { ContextMenu } from '../types/context-menu.type';
import { MouseOverImageEvent } from '../types/mouse-over-image-event.type';

import { ImageService } from '../services/image.service';
import { ExifToolService } from '../services/exif-tool.service';
import { EditorService } from '../services/editor.service';
import * as suffix from "../../../utilities/image-suffixes";

@Component({
  selector: 'bottom-bar-original-img',
  templateUrl: './bottom-bar-original-img.component.html',
  styleUrls: ['./bottom-bar-original-img.component.scss', '../css/hover-box.scss']
})
export class BottomBarOriginalImgComponent implements OnInit, OnDestroy {
  /**
   * Title of the Bottom bar
   */
  _bottomBar_title = "Original Images";
  /**
    * Images names of the images in the images_original folder
    */
  _imageNames_original: string[];
  /**
  * Images names of the images for the editing view (images).
  */
  private _imageNames: string[];
  /**
  * Images names of the images for the image gallery (images_edited).
  */
  private _imageNames_edited: string[];
  /**
   * This variable stores the context menu elements
   * that should be shown when there is a right click above 
   * one of the original images in the bottom bar. 
   * (When the image is not yet copied in the editing view)
   */
  private _contextMenuElements: ContextMenu[] = [
    { title: 'copy for editing', subject: new Subject() }
  ];
  /**
   * This variable stores the context menu elements
   * that should be shown when there is a right click above 
   * one of the original images in the bottom bar. 
   * (When the image is yet copied in the editing view)
   */
  private _contextMenuElements_edit: ContextMenu[] = [
    { title: 'delete copied image', subject: new Subject() }
  ];

  /**
   * This variable stores the image name the mouse is placed.
   * For the bottom bar images (original images).
   */
  private _actualImage: string;

  /**
   * This variable stores the menu items for the dropdown 
   * that controls which images should be shown in the bottom bar.
   */
  _visibleImages: string[] = ["Show all", "Show copied images", "Show images not yet copied"];

  /**
   * This method stores the actual selected value for the
   * dropdown that controls which images should be shown in the bottom bar.
   */
  _visibleImage: string;
  /**
   * This variable stores an error message that was returned
   * by the image service.
   */
  private _errorMessage_imageService: string;

  private _contextMenuElementsSubscriptions: Subscription[] = [];
  private _contextMenuElementsEditSubscriptions: Subscription[] = [];

  private _imageNamesSubscription: Subscription;
  private _imageNamesSubscriptionOriginal: Subscription;
  private _imageNamesSubscriptionEdited: Subscription;


  constructor(private _editorService: EditorService, private _imageService: ImageService) { }
  ngOnDestroy(): void {
    this._contextMenuElementsSubscriptions.forEach(subscription=> subscription.unsubscribe());
    this._contextMenuElementsEditSubscriptions.forEach(subscription=> subscription.unsubscribe());
    this._imageNamesSubscription.unsubscribe();
    this._imageNamesSubscriptionOriginal.unsubscribe();
    this._imageNamesSubscriptionEdited.unsubscribe();
  }

  ngOnInit() {
    this._contextMenuElements.forEach(element => {
      const sub = element.subject.subscribe(title => this.contextMenuBottomBar(title));
      this._contextMenuElementsSubscriptions.push(sub);
    });
    this._contextMenuElements_edit.forEach(element => {
      const sub = element.subject.subscribe(title => this.contextMenuBottomBar(title));
      this._contextMenuElementsEditSubscriptions.push(sub);
    });
    this.getImageNamesOriginal();
    this.getImageNames();
    this.getImageNamesEdited();
    this._visibleImage = this._visibleImages[0];
  }
  /**
     * Get the image names of the original images folder (images_original).
     */
  getImageNamesOriginal() {
    this._imageNamesSubscriptionOriginal = this._editorService._imageNamesInFolder_original$.subscribe(
      images => {
        this._imageNames_original = images;
      },
      error => { this._errorMessage_imageService = <any>error }
    );
  }
  /**
   * Get the image names of the images folder (images).
   */
  getImageNames() {
    this._imageNamesSubscription =this._editorService._imageNamesInFolder$.subscribe(
      images => {
        this._imageNames = images;
      },
      error => { this._errorMessage_imageService = <any>error }
    );
  }
  /**
   * Get the image names of the images_edited folder.
   */
  getImageNamesEdited() {
    this._imageNamesSubscriptionEdited =this._editorService._imageNamesInFolder_edited$.subscribe(
      images => {
        this._imageNames_edited = images;
      },
      error => { this._errorMessage_imageService = <any>error }
    );
  }
  /**
   * This method returns true, when the image exists already in
   * the image folder or the image_edited folder.
   */
  isInEditingModus(imageName: string): boolean {
    if (this._imageNames && this._imageNames_edited) {
      let imageFolder = suffix.getImageNameInList_suffixNotConsidered(imageName, this._imageNames);
      let image_editedFolder = suffix.getImageNameInList_suffixNotConsidered(imageName, this._imageNames_edited);
      if (imageFolder || image_editedFolder) {
        return true;
      }
    }
    return false;
  }
  /**
   * This method returns true, when the image exists already in
   * the image folder.
   */
  isInImagesFolder(imageName: string): boolean {
    if (this._imageNames) {
      let imageFolder = suffix.getImageNameInList_suffixNotConsidered(imageName, this._imageNames);
      if (imageFolder) {
        return true;
      }
    }
    return false;
  }
  /**
   * This method returns true, when the image exists already in
   * the image_edited folder.
   */
  isInImagesEditedFolder(imageName: string): boolean {
    if (this._imageNames_edited) {
      let image_editedInFolder = suffix.getImageNameInList_suffixNotConsidered(imageName, this._imageNames_edited);

      if (image_editedInFolder) {
        return true;
      }
    }
    return false;
  }
  /**
   * This method processes the contextMenu events of the
   * original images in the bottom bar.
   */
  private contextMenuBottomBar(title) {
    console.info('Bottom Bar Original Image: Context Menu action: ' + title);
    // For copying an image to the editing view (images folder)
    if (title === this._contextMenuElements[0].title) {
      if (!this.isInEditingModus(this._actualImage)) {
        this._imageService.copyImageForEditingAndUpdateImageNames(this._actualImage).catch(
          error => { this._errorMessage_imageService = <any>error }
        );
      }
    }
    // For deleting a copy of an image that is located in the images
    // folder.
    if (title === this._contextMenuElements_edit[0].title) {
      console.info('Bottom Bar Original Image: Delete Image in Image Editing Mode! ' + this._actualImage)
      const imageWithSuffix = suffix.getImageNameInList_suffixNotConsidered(this._actualImage, this._imageNames);
      this._imageService.deleteImageAndUpdateImageNames(imageWithSuffix).catch(
        error => { this._errorMessage_imageService = <any>error }
      );
    }
  }
  /**
   * This method is executed when the mouse is 
   * moving over /clicked on an image.
   */
  onMouseOverImage(event: MouseOverImageEvent) {
    // Update the name of the image the mouse is over.
    if (event.eventName === 'mouseOver') {
      this._actualImage = event.imgName;
    }
  }
  /**
   * This method copies all images that are not yet copied into the images folder.
   */
  copyAll() {
    let imageNames = this._imageNames_original.filter(imageName => {
      let found_edited = suffix.getImageNameInList_suffixNotConsidered(imageName, this._imageNames_edited);
      let found = suffix.getImageNameInList_suffixNotConsidered(imageName, this._imageNames);
      return !(found || found_edited);
    })
    this._imageService.copyImagesForEditing(imageNames);
  }
  /**
   * This method deletes all images in the images folder.
   */
  deleteAllCopies() {
    this._imageService.deleteAllImagesInImagesFolder(this._imageNames);
  }
  /**
   * The method changes the value that defines which images
   * are shown in the bottom bar. 
   * 
   * 1. All images
   * 
   * 2. Only images that already have been copied.
   * 
   * 3. Only the images that have not been copied yet.
   * 
   * The drop-down menu that controls the visibility of the images uses this method.
   */
  select_visibleImages(event) {
    this._visibleImage = event.target.text;
  }
}
