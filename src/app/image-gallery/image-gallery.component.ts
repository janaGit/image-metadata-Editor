import { Component, OnInit, Renderer, ViewChild } from '@angular/core';
import { Subject } from 'rxjs/Rx';
import { ImageService } from './../services/image.service';
import { ExifToolService } from './../services/exif-tool.service';
import { EditorService } from './../services/editor.service';
import { ContextMenu } from './../types/context-menu.type';
import { MouseOverImageEvent } from './../types/mouse-over-image-event.type';

/**
 * This class is for the image gallery.
 * All the images that have been edited, are visualized
 * in this view. The metadata can be checked here.
 * It is also possible to move images back for editing.
 */
@Component({
    templateUrl: 'image-gallery.component.html',
    styleUrls: ['image-gallery.component.css','../css/hover-box.css'],
    host: {
        '(document:scroll)': 'onScroll($event)',
        '(window:keypress)': 'onKey($event)'
    }
})
export class ImageGalleryComponent {
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
    private _imageNames_edited: string[];
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
     * This variable stores the actual selected image.
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
    private _contextMenuElements:ContextMenu[] = [
        { title: 'transfer for editing', subject: new Subject() }
    ];

    constructor(private _imageService: ImageService, private _exifToolService: ExifToolService, private _editorService: EditorService, private _renderer: Renderer) { }
   
    ngOnInit() {
        // Set the variables
        this.getImageNames();
        this.imgDir_edited = this._imageService.imageDir_edited;
        // Subscribe to the subjects of the context elements and assign the contextMenu() to them.
        this._contextMenuElements.forEach(elements => elements.subject.subscribe(val => this.contextMenu(val)));        
    }
    /**
     * This method is executed when the mouse is 
     * moving over /clicked on an image.
     */
    onMouseOverImage(event:MouseOverImageEvent) {
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
                this._renderer.setElementClass(event.element, 'clicked', true);
            } else {
                // If that image has been fixed, then unfix it.
                this._imageNameClicked = undefined;
                this._renderer.setElementClass(event.element, 'clicked', false);
            }
        }
    }
    /**
     * This method requests the metadata of an image.
     */
    getMetadata(imageName: string) {
        // Update the image name of the actual image in the editor service via an observable.
        this._editorService.updateImageName_edited(imageName);
        // After that update the metadata of that image can be requested at the backend.
        this._exifToolService.requestMetadata_edited().then(() => {
            // Get the metadata from the exifToolService.
            this.metadata = this._exifToolService.metadata_edited;
            this.metadata_keys=Object.keys(this.metadata);
        });
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
    contextMenu(val) {
        if (val === this._contextMenuElements[0].title) {
            this._imageService.moveImageBackForEditing(this._actual_Image).subscribe(
                () => { this.getImageNames(); },
                error => this.errorMessage_exifToolService = <any>error
            );
        }
    }
    /**
     * This method removes a specific string from 
     * an array.
     */
    removeString(array: string[], string):string[] {
        for (var i = 0; i < array.length; i++) {
            if (array[i].indexOf(string) > -1) {
                array.splice(i, 1);

            }
        }
        return array;
    }
    /**
     * This method gets the image names from the images that 
     * are located in the images_edited folder. Therefore the 
     * imageService is used.
     */
    getImageNames() {
        this._imageService.getImageNames_edited().toPromise().then(
            images => {
                images = this.removeString(images, this._editedImages_text);
                this._imageNames_edited = images;
            },
            error => { this._errorMessage_imageService = <any>error }
        );
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
                this._renderer.invokeElementMethod(this.table.nativeElement, 'scrollBy', [0, 50])
                break;
            case 'w':
                this._renderer.invokeElementMethod(this.table.nativeElement, 'scrollBy', [0, -50])
        }
    }
}

