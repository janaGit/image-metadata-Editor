import { Component, OnInit, HostListener } from '@angular/core';
import { Router } from '@angular/router';
import { ImageService } from './services/image.service';
import { ExifToolService } from './services/exifTool.service';

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
@Component({
    selector: 'app',
    templateUrl: '/app.component.html',
    styleUrls: ['/app.component.css'],
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
    private _lang_select: string= this._lang;

    constructor(private _imageService: ImageService, private _exifToolService: ExifToolService, private _router: Router) {

    }
    ngOnInit() {
        //Set the image directiories
        this._imageService.imageDir = imageDir;
        this._imageService.imageDir_edited = imageDir_edited;
        // Set the language for the image metadata 
        this._exifToolService.language = this._lang;
        // Subscribe to router events to update the label of the 'changeView'-button
        this._router.events.subscribe((val) => { this.setChangeViewButtonText(); });
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
}
