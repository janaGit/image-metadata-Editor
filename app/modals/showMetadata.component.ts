import { Component, Input, Output, ChangeDetectorRef, Inject, EventEmitter } from '@angular/core';
import { SimpleChange } from '@angular/core';
import { ExifToolService } from './../services/exifTool.service';

@Component({
    selector: 'showMetadata',
    templateUrl: 'showMetadata.component.html',
    styleUrls: ['showMetadata.component.css']
})

export class ShowMetadataComponent {
    _display_css = 'none';
    metadata = {};
    metadata_keys = [];
    _display: boolean;
    @Input() get display() {
        return this._display;
    }

    @Output() displayChange = new EventEmitter<boolean>();

    set display(_display) {
        this._display = _display;
        this.displayChange.emit(this._display);
        this.display_Show_Hide();
    }
    constructor(private _exifToolService: ExifToolService) { }
    toogle_Show_Hide() {
        if (this._display_css !== 'none') {
            this._display_css = 'none';
            this.display = false;
        } else {
            this.showMetadata();
            this.display = true;
        }
    }
    display_Show_Hide() {
        if (this._display == false) {
            this._display_css = 'none';
        } else {
            this.showMetadata();
        }
    }
    showMetadata() {
        let __metadata = this._exifToolService.metadata;
        if (__metadata) {
            this.metadata = __metadata;
            this.metadata_keys = Object.keys(this.metadata);
            this._display_css = 'block';
        } else {
            alert(this._exifToolService.errorMessage);
        }
    }
}
