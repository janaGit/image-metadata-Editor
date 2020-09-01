
import { map } from 'rxjs/operators';
import { Component, OnInit, ViewChild, Renderer2 } from '@angular/core';
import { Subject, Observable, Subscription } from 'rxjs';
import { ImageService } from './../services/image.service';
import { ExifToolService } from './../services/exif-tool.service';
import { EditorService } from './../services/editor.service';
import { ContextMenu } from './../types/context-menu.type';
import { MouseOverImageEvent } from './../types/mouse-over-image-event.type';
import * as suffix from "../../../utilities/image-suffixes";
/**
 * This class is for the image gallery.
 * All the images that have been edited, are visualized
 * in this view. The metadata can be checked here.
 * It is also possible to move images back for editing.
 */
@Component({
    templateUrl: 'image-gallery.component.html',
    styleUrls: ['image-gallery.component.scss', '../css/hover-box.scss', '../css/global-app.scss'],
    host: {
        '(window:keypress)': 'onKey($event)'
    }
})
export class ImageGalleryComponent {
    private _contextMenuElementsSubscriptions: Subscription[] = [];
    /**
     * To control  the table with the shortcuts: s,w
     */
    @ViewChild('table') table;
    /**
     * Error message, when something went wrong in the 
     * image service.
     */
    private _errorMessage_imageService: string;
    /**
     * Error message, when something went wrong in the 
     * exif tool service.
     */
    private errorMessage_exifToolService: string;
    /**
     * This variable stores the name of an image that has been fixed.
     */
    private _imageNameClicked: string;
    /**
     * This variable stores the names of all images that 
     * exist in the images_edited folder.
     */
    _imageNames_edited$: Observable<string[]>;
    /**
     * This variable stores the name of the folder, where 
     * the edited images are located.
     */
    public imgDir_edited: string;
    /**
     * This variable stores the metadata of the 
     * actual selected image.
     */
    metadata = {};
    /**
     * This variable stores the metadata keys.
     */
    metadata_keys = [];
    /**
     * This variable stores the image name the mouse is placed.
     */
    private _actual_Image: string;
    /**
     * This file is an explanation of what should be
     * put into the images_edited folder. That file 
     * has to be ignored for the processing of the files
     * as this is not an image.
     */
    private _editedImages_text = "images_edited.txt";
    /**
     * This variable stores the context menu elements
     * that should be shown when there is a right click above an image. 
     */
    private _contextMenuElements: ContextMenu[] = [
        { title: 'transfer for editing', subject: new Subject() },
        { title: 'transfer to complete', subject: new Subject() }
    ];
    suffix = suffix;


    constructor(private _imageService: ImageService, private _exifToolService: ExifToolService, private _editorService: EditorService, private _renderer: Renderer2) { }

    ngOnDestroy(): void {
        this._contextMenuElementsSubscriptions.forEach(subscription => subscription.unsubscribe());

    }
    ngOnInit() {
        this.imgDir_edited = this._imageService.imageDir_edited;
        // Set the variables
        this._imageNames_edited$ = this._editorService._imageNamesInFolder_edited$.pipe(map((images) => {
            return this.removeString(images, this._editedImages_text);
        }, (error) => {
            console.error('Error on getting imageNames in Folder: edited', error);
            this._errorMessage_imageService = <any>error
        }
        ));
        // Subscribe to the subjects of the context elements and assign the contextMenu() to them.
        this._contextMenuElements.forEach(elements => {
            const sub = elements.subject.subscribe(val => this.contextMenu(val))
            this._contextMenuElementsSubscriptions.push(sub);
        });
    }
    /**
     * This method is executed when the mouse is 
     * moving over /clicked on an image.
     */
    onMouseOverImage(event: MouseOverImageEvent) {
        if (event.eventName === 'mouseOver') {
            this._actual_Image = event.imgName;
            // If no image has been fixed then the metadata 
            // of the image the mouse is moving over should be shown.
            if (typeof this._imageNameClicked === 'undefined') {
                this.getMetadata(event.imgName);
            }

        }
        if (event.eventName === 'mouseClicked') {

            if (this._imageNameClicked !== event.imgName) {
                // If that image has not been fixed, then fix that image
                // and show its metadata in the table
                this.getMetadata(event.imgName);
                this._imageNameClicked = event.imgName;
                this._renderer.addClass(event.element, 'clicked');
            } else {
                // If that image has been fixed, then unfix it.
                this._imageNameClicked = undefined;
                this._renderer.removeClass(event.element, 'clicked');
            }
        }
    }
    /**
     * This method requests the metadata of an image.
     */
    async getMetadata(imageName: string) {
        // Update the image name of the actual image in the editor service via an observable.
        this._editorService.updateImageName_edited(imageName);
        // After that update the metadata of that image can be requested at the backend.
        await this._exifToolService.requestMetadata_edited();
        // Get the metadata from the exifToolService.
        this.metadata = this._exifToolService.metadata_edited;
        if (this.metadata) {
            this.metadata_keys = Object.keys(this.metadata);
        } else {
            this.metadata_keys = [];
        }

    }
    /**
     * This method checks if an image has been fixed.
     */
    imageClicked(imgName: string) {
        if (this._imageNameClicked === imgName) {
            return true;
        }
        return false;
    }
    /**
     * This method processes the contextMenu events of the
     * images.
     */
    async contextMenu(val) {
        try {
            switch (val) {
                case this._contextMenuElements[0].title:
                    await this._imageService.moveImageBackForEditing(this._actual_Image);
                    break;
                case this._contextMenuElements[1].title:
                    await this._imageService.moveImageToImagesComplete(this._actual_Image);
                    break;
                default: throw Error("val is not a valid contextMenuElement title: val = " + val);
            }
        } catch (error) {
            console.error(error);
            await this._imageService.updateImageNamesInFolder_edited();
            this.errorMessage_exifToolService = <any>error;
        }

    }
    /**
     * This method removes a specific string from 
     * an array.
     */
    removeString(array: string[], string): string[] {
        for (var i = 0; i < array.length; i++) {
            if (array[i].indexOf(string) > -1) {
                array.splice(i, 1);

            }
        }
        return array;
    }

    /**
     * This method enables key control:
     * 
     * s: scroll the metadata table down.
     * 
     * w: scroll the metadata table up.
     */
    onKey(event) {
        var key = event.key;
        switch (key) {
            case 's':
                this.table.nativeElement.scrollBy([0, -50]);
                break;
            case 'w':
                this.table.nativeElement.scrollBy([0, -50]);
        }
    }
}

