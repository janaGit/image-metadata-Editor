import { Component } from '@angular/core';
import { FormControl } from '@angular/forms';
import { ExifToolService } from 'app/services/exif-tool.service';
import { BsDropdownConfig } from 'ngx-bootstrap/dropdown';

@Component({
    selector: ' more-metadata-tab',
    templateUrl: 'more-metadata-tab.component.html',
    styleUrls: ['more-metadata-tab.component.css', '../../css/global-app.css'],
    providers: [{ provide: BsDropdownConfig, useValue: { isAnimated: true, autoClose: true } }]
})
export class MoreMetadataTabComponent {
    /**
     * This variable stores the metadata of an image.
     */
    private metadata = {};

    selectAllControl= new FormControl(false);

    metadataControls: Map<string, FormControl> = new Map();
    /**
     * This variable stores the keys of the metadata.
     */
    metadata_keys = [];

    constructor(private _exifToolService: ExifToolService) {

    }
    async ngOnInit() {
        try {
            await this._exifToolService.requestMetadata_toEdit();
            let __metadata = this._exifToolService.metadata_to_edit;
            if (__metadata) {
                this.metadata = __metadata;
                const _metadata_keys = Object.keys(this.metadata);

                _metadata_keys.forEach(key => {
                  this.metadataControls.set(key,new FormControl(true))
                });

                this.metadata_keys = _metadata_keys;
            } else {
                alert("showMetadata error:" + this._exifToolService.errorMessage);
            }
        } catch (e) {
            alert("showMetadata error:" + e.errorMessage);
        }
    }

    onChangeSelection(event, index: number) {

    }

    onChangeSelectAll(event){
        this.metadataControls.forEach(formControl => {
            formControl.setValue(event);
        });
    }
}
