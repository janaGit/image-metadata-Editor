import {Component, OnInit} from 'angular2/core';
//import {CORE_DIRECTIVES} from 'angular2/common';
import { HTTP_PROVIDERS }    from 'angular2/http';
import {DROPDOWN_DIRECTIVES} from 'ng2-bootstrap/ng2-bootstrap';

import {ImageService}     from './services/image.service';
import {ExifToolService}  from './services/exifTool.service';
import {Edit_MetadataService} from './EditMetadata/services/edit_Metadata.service';
import {EditMetadataComponent} from './EditMetadata/editMetadata.component';
import {ImageGallery} from './ImageGallery/image_Gallery.component';
import {ContextMenuService} from './services/contextMenu.service';

import { RouteConfig, ROUTER_DIRECTIVES, ROUTER_PROVIDERS, Router} from 'angular2/router';
var imageDir = 'images';
var imageDir_edited = 'images_edited';

@Component({
    selector: 'my-app',
    providers: [HTTP_PROVIDERS, ImageService, ExifToolService, Edit_MetadataService, ROUTER_PROVIDERS, ContextMenuService],
    directives: [ROUTER_DIRECTIVES, DROPDOWN_DIRECTIVES],
    templateUrl: 'app/app.component.html',
    styleUrls: ['app/app.component.css'],
    host: {
        '(window:keyup)': 'onKey($event)'
    }
})
@RouteConfig([
    {
        path: '/edit_metadata',
        name: 'EditMetadata',
        component: EditMetadataComponent,
        useAsDefault: true
    },
    {
        path: '/image_gallery',
        name: 'ImageGallery',
        component: ImageGallery,
    }
])

export class AppComponent implements OnInit {
    private button_text = new Map<string, string>();
    private changeView_Text: string;
    private _languages = ['cs', 'de', 'en', 'es', 'fr', 'it', 'ja', 'ko', 'nl', 'pl', 'ru', 'sv', 'tr', 'zh_cn', 'zh_tw'];
    private _lang: string = "de";
    private _lang_select: string = "de";
    private _lang_en: boolean = false;
    constructor(private _imageService: ImageService, private _exifToolService: ExifToolService, private _router: Router) {

    }
    ngOnInit() {
        this._imageService.imageDir = imageDir;
        this._imageService.imageDir_edited = imageDir_edited;
        this.button_text.set('/edit_metadata', 'show edited Images');
        this.button_text.set('/', 'show edited Images');
        this.button_text.set('/image_gallery', 'edit Metadata');
        this.changeView_Text = this.button_text.get(location.pathname);
        this._exifToolService.language = this._lang;
    }
    changeView() {
        if (location.pathname === '/edit_metadata') {
            this._router.navigate(['ImageGallery']).then(
                () => this.changeView_Text = this.button_text.get(location.pathname)
            );
        } else {
            this._router.navigate(['EditMetadata']).then(
                () => this.changeView_Text = this.button_text.get(location.pathname)
            );
        }


    }
    onKey(event) {
        var key = event.key;
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
    select_lang(event) {
        this._lang_select = event.target.text;
        this._lang = this._lang_select;
        this._exifToolService.language = this._lang;
    }
}
