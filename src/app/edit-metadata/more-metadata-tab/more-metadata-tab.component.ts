import { Component, OnDestroy } from '@angular/core';
import { FormControl } from '@angular/forms';
import { BsDropdownConfig } from 'ngx-bootstrap/dropdown';
import { EditorService } from 'app/services/editor.service';
import { MetadataService } from 'app/services/metadata.service';
import { MetadataFromImageService } from 'app/services/metadata-from-image.service';

@Component({
    selector: ' more-metadata-tab',
    templateUrl: 'more-metadata-tab.component.html',
    styleUrls: ['more-metadata-tab.component.scss', '../../css/global-app.scss'],
    providers: [{ provide: BsDropdownConfig, useValue: { isAnimated: true, autoClose: true } }]
})
export class MoreMetadataTabComponent implements OnDestroy {
    /**
     * This variable stores the metadata of an image.
     */
    imageMetadata = new Map<string, string>();

    selectedMetadata = new Map<string, string>();

    selectAllControl = new FormControl(false);

    metadataControls: Map<string, FormControl> = new Map();


    constructor(private _editorService: EditorService, private _metadataService: MetadataService, private _metadataFromImageService: MetadataFromImageService) {

    }

    ngOnDestroy(): void {
        this._metadataService.updateExistingMetadata(this.selectedMetadata);
    }

    async ngOnInit() {
        this.imageMetadata = this._metadataFromImageService.existingMetadata;
        this.selectedMetadata = this._metadataService.existingMetadata;
        this.imageMetadata.forEach((value, key) => {
            this.metadataControls.set(key, new FormControl(false));
        });
        this.selectedMetadata.forEach((value, key) => {
            this.metadataControls.get(key).setValue(true);
        });

    }



    onChangeSelection(event, key: string) {
        if (event) {
            this.selectedMetadata.set(key, this.imageMetadata.get(key));
        } else {
            this.selectedMetadata.delete(key);
        }

    }

    onChangeSelectAll(event) {
        this.selectedMetadata = new Map();
        this.metadataControls.forEach((formControl, key) => {
            formControl.setValue(event);
            if (event) {
                this.selectedMetadata.set(key, this.imageMetadata.get(key));
            }
        });


    }
}
