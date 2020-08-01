import { Component } from '@angular/core';
import { FormControl } from '@angular/forms';
import { ExifToolService } from 'app/services/exif-tool.service';
import { BsDropdownConfig } from 'ngx-bootstrap/dropdown';
import { EditorService } from 'app/services/editor.service';
import { TemplateMetadataKeys } from 'app/types/template-metadata-keys';

@Component({
    selector: ' more-metadata-tab',
    templateUrl: 'more-metadata-tab.component.html',
    styleUrls: ['more-metadata-tab.component.scss', '../../css/global-app.scss'],
    providers: [{ provide: BsDropdownConfig, useValue: { isAnimated: true, autoClose: true } }]
})
export class MoreMetadataTabComponent {
    /**
     * This variable stores the metadata of an image.
     */
    private metadata = {};

    _templatesMetadataKeys: Map<string, TemplateMetadataKeys>;

    selectAllControl = new FormControl(false);

    selectedTemplateControl = new FormControl("");

    metadataControls: Map<string, FormControl> = new Map();

    selectedTemplate: string;

    /**
     * This variable stores the keys of the metadata.
     */
    metadata_keys = [];

    constructor(private _exifToolService: ExifToolService, private _editorService: EditorService) {

    }
    async ngOnInit() {
        this.requestMetadata();
        this.getTemplates();
    }

    async requestMetadata() {
        try {
            await this._exifToolService.requestMetadata_toEdit();
            let __metadata = this._exifToolService.metadata_to_edit;
            if (__metadata) {
                this.metadata = __metadata;
                const _metadata_keys = Object.keys(this.metadata);

                _metadata_keys.forEach(key => {
                    this.metadataControls.set(key, new FormControl(true))
                });

                this.metadata_keys = _metadata_keys;
            } else {
                alert("showMetadata error:" + this._exifToolService.errorMessage);
            }
        } catch (e) {
            alert("showMetadata error:" + e.errorMessage);
        }
    }

    async getTemplates() {

        this._editorService.templates_more_metadata$.subscribe(templates => {
            this._templatesMetadataKeys = templates;
        });


    }
    onChangeSelection(event, index: number) {

    }

    onChangeSelectAll(event) {
        this.metadataControls.forEach(formControl => {
            formControl.setValue(event);
        });
    }

    onChangeTemplate(event) {
        this.selectedTemplate = this._templatesMetadataKeys.get(event).name;
        const template = this._templatesMetadataKeys.get(this.selectedTemplate);
        const method = template.method;
        if (method === "COPY") {
            this.metadataControls.forEach(control=>{
                control.setValue(false);
            }) 
            template.keys.forEach(key => {
                this.metadataControls.get(key).setValue(true);
            })
        }else{
            this.metadataControls.forEach(control=>{
                control.setValue(true);
            });
            template.keys.forEach(key => {
                this.metadataControls.get(key).setValue(false);
            }); 
        }


    }
}
