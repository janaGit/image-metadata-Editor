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
    @Input() imageName:string;
    display(display: string) {
        this._display = display;
    }
    constructor(private _exifToolService: ExifToolService) { }
    closeButton() {
        this._display = this._display !== 'none' ? 'none' : 'block';
    }
    ngOnChanges(changes: { [propKey: string]: SimpleChange }) {

        if (changes['imageName']) {
          this.imageName = changes['imageName'].currentValue;
          this.getMetadata(this.imageName);

        }
    }
    getMetadata(imageName: string) {
        this._exifToolService.getMetadata(imageName).subscribe(
            data => { this.metadata = data; this.metadata_keys=Object.keys(data);},
            error => this.errorMessage_exifToolService = <any>error
        );
    }
}
