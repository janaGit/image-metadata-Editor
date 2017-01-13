import { Component, OnInit } from '@angular/core';

const _path_map_button_text = [
    { path: '/edit_metadata', text: 'show edited Images' },
    { path: '/', text: 'show edited Images' },
    { path: '/image_gallery', text: 'edit Metadata' }
];

@Component({
    selector: 'app',
    templateUrl: '/app.component.html',
    styleUrls: ['/app.component.css']
})
export class AppComponent implements OnInit {

    private _button_text = new Map<string, string>(_path_map_button_text.map(x => [x.path, x.text] as [string, string]));
    private _languages = ['cs', 'de', 'en', 'es', 'fr', 'it', 'ja', 'ko', 'nl', 'pl', 'ru', 'sv', 'tr', 'zh_cn', 'zh_tw'];
    private _lang: string = "de";
    private _lang_select: string = "de";

    private changeView_Text: string;

    ngOnInit() {
        this.changeView_Text = this._button_text.get(location.pathname);
    }
    select_lang(event) {
        this._lang_select = event.target.text;
        this._lang = this._lang_select;
        //this._exifToolService.language = this._lang;
    }
    changeView() {

    }
}
