import { Component, OnDestroy } from '@angular/core';
import { FormControl } from '@angular/forms';
import { BsDropdownConfig } from 'ngx-bootstrap/dropdown';
import { EditorService } from 'app/services/editor.service';
import { MetadataService } from '../metadata.service';
import { MetadataFromImageService } from 'app/edit-metadata/metadata-from-image.service';
import { MetadataFromTemplateService } from '../metadata-from-template.service';
import { ExistingMetadataTemplateMethods } from 'app/types/existing-metadata-templete-methods.type';
import { TemplateExistingMetadata } from 'app/types/template-existing-metadata.interface';

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

    templateMetadataKeys: string[];

    selectedKeys: string[] = [];

    constructor(private _editorService: EditorService,
        private _metadataService: MetadataService,
        private _metadataFromImageService: MetadataFromImageService,
        private _metadataFromTemplateService: MetadataFromTemplateService) {

    }

    ngOnDestroy(): void {
        this._metadataService.updateExistingMetadata(this.selectedMetadata);
    }

    async ngOnInit() {
        this.imageMetadata = this._metadataFromImageService.existingMetadata;
        this.selectedMetadata = this._metadataService.existingMetadata;
        this.templateMetadataKeys = this._metadataFromTemplateService.existingMetadata.keys;

        this.imageMetadata.forEach((value, key) => {
            this.metadataControls.set(key, new FormControl(false));
        });
        this.selectedMetadata.forEach((value, key) => {
            this.metadataControls.get(key).setValue(true);
            this.selectedKeys = [...this.selectedKeys, key];
        });



    }



    onChangeSelection(event, key: string) {
        if (event) {
            this.selectedMetadata.set(key, this.imageMetadata.get(key));
            this.selectedKeys = [...this.selectedKeys, key];
        } else {
            this.selectedMetadata.delete(key);
            const index = this.selectedKeys.indexOf(key);
            this.selectedKeys.splice(index, 1);
            this.selectedKeys = [...this.selectedKeys];
        }

    }

    onChangeSelectAll(event) {
        this.selectedMetadata = new Map();
        this.selectedKeys = [];

        this.metadataControls.forEach((formControl, key) => {
            formControl.setValue(event);
        });
    }
    getTemplateSetting() {
        this.onChangeSelectAll(false);
        this.selectAllControl.setValue(false);
        this.templateMetadataKeys.forEach(key => {
            this.metadataControls.get(key).setValue(true);
        })
    }
}
