import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ImageService } from './services/image.service';
import { ExifToolService } from './services/exifTool.service';

const _path_map_button_text = [
    { path: '/edit_metadata', text: 'show edited Images' },
    { path: '/', text: 'show edited Images' },
    { path: '/image_gallery', text: 'edit Metadata' }
];
var imageDir = 'images';
var imageDir_edited = 'images_edited'
@Component({
    selector: 'app',
    templateUrl: '/app.component.html',
    styleUrls: ['/app.component.css'],
    host: {
        '(window:keyup)': 'onKey($event)'
    }
})
export class AppComponent implements OnInit {
    private _button_text = new Map<string, string>(_path_map_button_text.map(x => [x.path, x.text] as [string, string]));
    private _languages = ['cs', 'de', 'en', 'es', 'fr', 'it', 'ja', 'ko', 'nl', 'pl', 'ru', 'sv', 'tr', 'zh_cn', 'zh_tw'];
    private _lang: string = "de";
      private _lang_en: boolean = false;
    private _lang_select: string = "de";

    private changeView_Text: string;
    constructor(private _imageService: ImageService, private _exifToolService: ExifToolService, private _router: Router) {

    }
    ngOnInit() {
        this._imageService.imageDir = imageDir;
        this._imageService.imageDir_edited = imageDir_edited;
        this.changeView_Text = this._button_text.get(location.pathname);
        this._exifToolService.language = this._lang
    }
    select_lang(event) {
        this._lang_select = event.target.text;
        this._lang = this._lang_select;
        this._exifToolService.language = this._lang;
    }
    changeView() {
        if (this._router.url === '/image_gallery') {
            this._router.navigate(['edit_metadata']).then(
                () => this.changeView_Text = this._button_text.get(location.pathname)
            );
        } else {
            this._router.navigate(['image_gallery']).then(
                () => this.changeView_Text = this._button_text.get(location.pathname)
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
}
