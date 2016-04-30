import {Component, Input} from 'angular2/core';
import {OnChanges, SimpleChange} from 'angular2/core';
import {ExifToolService}  from './../services/exifTool.service';

@Component({
    selector: 'showMetadata',
    templateUrl: 'app/modals/showMetadata.component.html',
    styleUrls: ['app/modals/showMetadata.component.css']
})

export class ShowMetadataComponent implements OnChanges {
    _display = 'none';
    errorMessage_exifToolService: string;
    metadata = {};
    metadata_keys=[];
    @Input() imgNumber:number;
    display(display: string) {
        this._display = display;
    }
    constructor(private _exifToolService: ExifToolService) { }
    closeButton() {
        this._display = this._display !== 'none' ? 'none' : 'block';
    }
    ngOnChanges(changes: { [propKey: string]: SimpleChange }) {

        if (changes['imgNumber']) {
           var imgNumber = changes['imgNumber'].currentValue;
          this.getMetadata(imgNumber);

        }
    }
    getMetadata(imgNumber: number) {
        this._exifToolService.getMetadata(imgNumber.toString()).subscribe(
            data => { this.metadata = data; this.metadata_keys=Object.keys(data);},
            error => this.errorMessage_exifToolService = <any>error
        );
    }
}
