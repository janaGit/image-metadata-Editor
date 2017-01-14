import {Component, Input} from '@angular/core';
import {OnChanges, SimpleChange, OnInit} from '@angular/core';
import {ExifToolService}  from './../services/exifTool.service';

@Component({
    selector: 'showMetadata',
    templateUrl: 'showMetadata.component.html',
    styleUrls: ['showMetadata.component.css']
})

export class ShowMetadataComponent implements OnChanges, OnInit {
    _display = 'none';
    errorMessage_exifToolService: string;
    metadata = {};
    metadata_keys = [];
    @Input() imageName: string;
    @Input() display: boolean;
    @Input() display_start: boolean;
   // constructor(private _exifToolService: ExifToolService) { }
    toogle_Show_Hide() {
        this._display = this._display !== 'none' ? 'none' : 'block';
    }

    ngOnChanges(changes: { [propKey: string]: SimpleChange }) {

        if (changes['imageName']) {
            this.imageName = changes['imageName'].currentValue;
           // this._exifToolService.imageName = this.imageName;
            this.getMetadata();

        }
        if (changes['display']) {
            this.toogle_Show_Hide();
        }
    }
    ngOnInit() {
        if (!this.display_start) {
            this.toogle_Show_Hide();
        }
    }
    getMetadata() {
      /*  this._exifToolService.metadata$.subscribe(
            data => { this.metadata = data; this.metadata_keys = Object.keys(data); },
            error => this.errorMessage_exifToolService = <any>error
        );*/
    }
}
