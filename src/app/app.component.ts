import { Component, OnInit, HostListener } from '@angular/core';
import { Router } from '@angular/router';
import { ImageService } from './services/image.service';
import { ExifToolService } from './services/exif-tool.service';
import { EditorService } from './services/editor.service';
import { ContextMenu } from './types/context-menu.type';
import { Subject } from 'rxjs/Rx';
import { MouseOverImageEvent } from './types/mouse-over-image-event.type';

/**
 * Storage of labels for the change view button. 
 * Depending on the url of the actual view (Editor / Image Gallery),
 * the label of the button changes.
 */
const _changeView_button_map_items = [
    { path: '/edit_metadata', text: 'Image Gallery' },
    { path: '/', text: 'Image Gallery' },
    { path: '/image_gallery', text: 'Editor' }
];
var imageDir = 'images';
var imageDir_edited = 'images_edited'
var imageDir_original = 'images_original'
var prefix = 'edited_'

@Component({
    selector: 'app',
    templateUrl: '/app.component.html',
    styleUrls: ['/app.component.css', '/css/hover-box.css']
})
export class AppComponent implements OnInit {
    /**
     * Map for an easily access to the labels for the 'changeView'-button.
     */
    private _changeView_button_map = new Map<string, string>(_changeView_button_map_items.map(x => [x.path, x.text] as [string, string]));
    /**
     * Actual label for the 'changeView'-button.
     */
    private _changeView_button_text: string;

    /**
     * Possible languages that can be selected for the image metadata.
     */
    private _languages = ['cs', 'de', 'en', 'es', 'fr', 'it', 'ja', 'ko', 'nl', 'pl', 'ru', 'sv', 'tr', 'zh_cn', 'zh_tw'];
    /**
     * Actual language for the image metadata. 
     * 
     * Default: 'de'
     */
    private _lang: string = "de";
    /**
     * Chache for the short cut: '1', 
     * that can switch between English and the last selected language.
     * 
     * Stores the information if the actual state is English.  
     */
    private _lang_en: boolean = false;
    /**
     * Chache for the short cut: '1', 
     * that can switch between English and the last selected language.
     * 
     * Stores the last selected language.  
     */
    private _lang_select: string = this._lang;
    /**
     * Images names of the images in the images_original folder
     */
    private _imageNames_original: string[];
    /**
    * Images names of the images for the editing view (images).
    */
    private _imageNames: string[];
    /**
    * Images names of the images for the image gallery (images_edited).
    */
    private _imageNames_edited: string[];
    /**
     * This variable stores an error message that was returned
     * by the image service.
     */
    private _errorMessage_imageService: string;

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
     * This variable stores the image name the mouse is placed.
     * For the bottom bar images (original images).
     */
    private _actualImage: string;

    constructor(private _editorService: EditorService, private _imageService: ImageService, private _exifToolService: ExifToolService, private _router: Router) {

    }
    ngOnInit() {
        //Set the image directiories
        this._imageService.imageDir = imageDir;
        this._imageService.imageDir_edited = imageDir_edited;
        this._imageService.imageDir_original = imageDir_original;
        // Set the language for the image metadata 
        this._exifToolService.language = this._lang;
        // Subscribe to router events to update the label of the 'changeView'-button
        this._router.events.subscribe((val) => { this.setChangeViewButtonText(); });
        this._contextMenuElements.forEach(element => element.subject.subscribe(title => this.contextMenuBottomBar(title)));
        this.getImageNamesOriginal();
        this.getImageNames();
        this.getImageNamesEdited();
    }

    /**
     * Change the label of the 'changeView'-button depending 
     * on the actual view (Editor/Image Gallery).
     */
    setChangeViewButtonText() {
        this._changeView_button_text = this._changeView_button_map.get(this._router.url);
    }

    /**
     * The method changes the actual image metadata language.
     * 
     * The drop-down menu uses this method.
     */
    select_lang(event) {
        this._lang_select = event.target.text;
        this._lang = this._lang_select;
        this._exifToolService.language = this._lang;
    }
    /**
     * Method to switch the views: Editing <-> Image Gallery
     * 
     * Uses the Router to navigate. 
     */
    changeView() {
        if (this._router.url === '/image_gallery') {
            this._router.navigate(['edit_metadata']).then(
                () => this.setChangeViewButtonText()

            );
        } else {
            this._editorService.fileTabOpen = false;
            this._router.navigate(['image_gallery']).then(
                () => this.setChangeViewButtonText()
            );
        }
    }

    /** 
    * Short cuts for the whole editor.
    *
    * Tab: Change the view. Editing <-> Image Gallery
    *
    * 1: Switch between English and the last selected language 
    *    for the image metadata.
    **/
    @HostListener('window:keyup', ['$event.key'])
    onKey(key) {
        switch (key) {
            case 'Tab':
                this.changeView();
                break;
            case '1':
                if (this._lang_en) {
                    this._lang = this._lang_select;
                    this._exifToolService.language = this._lang_select;
                } else {
                    this._lang = 'en';
                    this._exifToolService.language = 'en';
                }
                this._lang_en = !this._lang_en;
        }
    }
    /**
     * Get the image names of the original images folder (images_original).
     */
    getImageNamesOriginal() {
        this._editorService._imageNamesInFolder_original$.subscribe(
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
        this._editorService._imageNamesInFolder$.subscribe(
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
        this._editorService._imageNamesInFolder_edited$.subscribe(
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
            let imageFolder = this._imageNames.find(imgName => {
                return imgName == prefix + imageName;
            })
            let image_editedFolder = this._imageNames_edited.find(imgName => {
                return imgName == prefix + imageName;
            })
            if (imageFolder || image_editedFolder) {
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
        // For copying an image to the editing view (images folder)
        if (title === this._contextMenuElements[0].title) {
            if (!this.isInEditingModus(this._actualImage)) {
                this._imageService.copyImageForEditing(this._actualImage).toPromise().catch(
                    error => { this._errorMessage_imageService = <any>error }
                );
            }
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
            let found_edited = this._imageNames_edited.find((imgName) => { return imageName === imgName });
            let found = this._imageNames.find((imgName) => { return imageName === imgName });
            return !(found || found_edited);
        })
        this._imageService.copyImagesForEditing(imageNames);
    }
}
