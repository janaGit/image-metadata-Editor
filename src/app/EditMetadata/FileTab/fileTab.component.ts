import { Component, OnInit, Output, EventEmitter, Inject, HostListener } from '@angular/core';
import { Subject } from 'rxjs/Rx';
import { ImageService } from './../../services/image.service';
import { EditorService } from './../../services/editor.service';
import { ExifToolService } from './../../services/exif-tool.service';
import { ContextMenu } from './../../types/contextMenu.type';

/**
 * This class provides the controller for the file-tab in the
 * editor view.
 */
@Component({
    selector: 'FileTab',
    templateUrl: 'fileTab.component.html',
    styleUrls: ['fileTab.component.css']
})
export class FileTabComponent implements OnInit {
    /**
     * Names of the images that can be shwn and edited.
     */
    private imageNames: string[];
    /**
     * If the image-service returns an error, 
     * the error message is stored in this variable.  
     */
    private _errorMessage: string;
    /**
     * The number to get the current selected image
     * in the imageName-Array 
     */
    private imgNumber = 0;
    /**
     * Name of the current selected image.
     */
    private imageName: string;
    /**
     * Path for the current selected image:
     * 
     * imageDir / imageName
     */
    private imgPath: string = this._imageService.imageDir + '/' + this.imageName;
    /**
     * Visibility status of the modal that 
     * shows the metadata of the current image. 
     */
    private _displayMetadataModal = false;
    /**
     * Event emitter that imforms the parent of this class
     * (editMetadata.component) that the editing process 
     * starts for current selected image.
     * 
     * No data are transmitted. 
     *
     */
    @Output() start = new EventEmitter();
    /**
     * Context menu elements for the displayed image in
     * this tab.
     */
    private _contextMenuElements: ContextMenu[] = [
        { title: 'transfer to image gallery', subject: new Subject() }
    ];

    constructor(private _exifToolService: ExifToolService, private _imageService: ImageService, private _editorService: EditorService) { }

    ngOnInit() {
        // Set the method that should be executed when a context menu element
        // has been selected.
        this._contextMenuElements.forEach(elements => elements.subject.subscribe(val => this.contextMenu(val)));
        // Subscribe to the image service to update the name 
        // of the current selected image
        this._editorService.imageName$.subscribe(imgName => {
            this.imageName = imgName;
        });
        // Get the names of the available images. The first name
        // in the list is the current selected image.
        this.refreshImageList(null);
    }

    /**
     * Set a new error message and display it.
     */
    set errorMessage(error) {
        this.errorMessage = error;
        alert(error);
    }
    /**
     * Put the dropped image into the folder for 
     * editable images and refresh the list with the names
     * of the images. 
     */
    addDroppedImage(file: File) {
        this._imageService.sendImage(file).then(fileName => {
            this.refreshImageList(fileName);
        });
    }

    /**
     * Refreshes the imageNames-Array with the names of the available
     * images and updates the name of current selected image.
     * 
     * @param value Change the selected image
     *  
     *              [number]: Array index of the current 
     *                        selected image + {value} .
     *                        Possible values: 0,1,-1.
     *              [string]: {value} is the name of the new 
     *                        selected image. Then the Array 
     *                        index will be updated.
     *              [null]:   Array index = 0. 
     */
    refreshImageList(value: number | string) {
        this._imageService.getImageNames()
            .subscribe(
            images => {
                this.imageNames = images
                this.setCurrentImageName(value);
            },
            error => this.errorMessage = error
            );
    }
    /**
     * Get the index of the image name in the imageName-array.
     * 
     * Return -1: {name} is undefined or image name was not 
     *     found in imageName-array.
     */
    getImageNumber(name: string) {
        if (typeof name === 'undefined') {
            return -1;
        }
        let index = this.imageNames.findIndex(
            element => {
                if (name == element) {
                    return true;
                }
                return false;
            }
        );
        if (index == -1) {
            console.info('Image name not found in list!')
        }
        return index;
    }
    /**
     * The successor of the current image name in the imageName-array
     * will be the new current image name. 
     * 
     * This method is executed when the '>' 
     * button was clicked. 
     */
    nextImage() {
        this.setCurrentImageName(1);
    }
    /**
     * The predeccessor of the current image name in the imageName-array
     * will be the new current image name. 
     * 
     * This method is executed when the '<' 
     * button was clicked. 
     */
    previousImage() {
        this.setCurrentImageName(-1);
    }
    /**
     * A new image name can be updated on different ways:
     * 
     * 1. If {value} = null, then the first image name in the 
     *    imageName-array is selected.
     * 
     * 2. The name of the image can be specified. Then the index
     *    of the image name in the imageName-array is searched and actualized.
     * 
     * 3. {value} = 0 | 1 | -1 , then the image name not changes (0),
     *    the predeccessor (-1), or the successor (1) 
     *    of the current image name in the 
     *    imageName-array is choosen.
     * 
     * The new image name is then communicated to the ImageService.
     */
    setCurrentImageName(value: any) {
        switch (typeof value) {
            case 'object':
                this.imgNumber = 0;
                break;
            case 'string':
                let index = this.getImageNumber(value);
                if (index != -1) {
                    this.imgNumber = index;
                }
                break;
            case 'number':
                if (Math.abs(value) > 1) {
                    throw new Error('{value} is a number but it is not: 0 or 1 or -1');
                }
                this.imgNumber = this.imgNumber + value;
                if (this.imgNumber == this.imageNames.length) {
                    this.imgNumber = 0;
                } else {
                    if (this.imgNumber < 0) {
                        this.imgNumber = this.imageNames.length - 1;
                    }
                }
        }
        this.imageName = this.imageNames[this.imgNumber];
        this._editorService.updateImageName(this.imageName);
        this.imgPath = this._imageService.imageDir + '/' + this.imageName;
    }
    /**
     * Deletes the current selected image and refreshes the list with 
     * the names of the available images.
     * 
     * This method is executed when the 'Delete File' 
     * button was clicked.
     */
    deleteImage() {
        this._imageService.deleteImage(this.imageName).subscribe(
            data => this.refreshImageList(0),
            error => this.errorMessage = error
        );
    }
    /**
     * Tests if metadata are available for the current image.
     * If not, then an error message is displayed, else
     * the start-EventEmitter emits to start a 
     * new editing process. 
     * 
     * This method is executed when the 'Start Editing' 
     * button was clicked.
     */
    startEditing() {
        this._exifToolService.requestMetadata().then(
            resolve => {
                if (this._exifToolService.metadata) {
                    this.start.emit();
                } else {
                    alert(this._exifToolService.errorMessage);
                }
            });
    }
    /**
     * Shortcuts for the file tab:
     * 
     * a : Show previous image
     * 
     * d : Show next image
     * 
     * w : Display modal with metadata of the current image  
     */
    @HostListener('window.keyup', ['$event.key'])
    onKey(key) {
        switch (key) {
            case 'a':
                this.previousImage();
                break;
            case 'd':
                this.nextImage();
                break;
            case 'w':
                this.displayMetadataModal();

        }
    }
    /**
     * Toogle the visibility of the modal for the metadata 
     * of the current image.
     * 
     * Used for the shortcut 'w' and for the click-event of the image.
     */
    displayMetadataModal() {
        this._displayMetadataModal = !this._displayMetadataModal;
    }
    /**
     * Method is executed if an element of the conext menu was
     * selected. 
     * 
     * Menu elements:
     * 
     * 1. 'transfer to image gallery' : Moves the current image to 
     *    the folder for the images of the image gallery. Then it 
     *    updates the list with the names of the available images
     *    in the editor view (file tab).
     */
    contextMenu(val) {
        if (val === this._contextMenuElements[0].title) {
            this._imageService.moveImageToImageGallery(this.imageName).subscribe(
                data => { this.refreshImageList(0); },
                error => this.errorMessage = error
            );
        }
    }

    /**
     * Deletes the metadata of the current image.
     */
    deleteMetadata() {
        this._exifToolService.deleteAllMetadata(this.imageName).subscribe(
            () => { this.refreshImageList(0); },
            error => { this.errorMessage = error }
        );
    }
}