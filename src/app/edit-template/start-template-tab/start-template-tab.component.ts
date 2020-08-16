import { Component, OnInit, Output, EventEmitter, ChangeDetectorRef } from '@angular/core';
import { ImageService } from './../../services/image.service';
import { EditorService } from './../../services/editor.service';
import { ExifToolService } from './../../services/exif-tool.service';
import { FormControl } from '@angular/forms';
import { AppTemplate } from 'app/types/app-template.interface';

const NEW_TEMPLATE = "New Template";
const newTemplate: AppTemplate = {
    name: NEW_TEMPLATE,
    categoryTab: {
        areNotSupportedCategoriesSelected: false,
        categories: []
    },
    existingMetadataTab: {
        keys: [],
        method: "COPY",
    },
    locationTab: {
        dateAndTime: undefined,
        isLocationDisabled: false,
        isTimeDisabled: false,
        latitude: undefined,
        longitude: undefined
    },
    metadataTab: {
        contactInfo: "",
        creator: "",
        description: "",
        keywords: [],
        license: "",
        subject: ""
    }
}

@Component({
    selector: 'app-start-template-tab',
    templateUrl: './start-template-tab.component.html',
    styleUrls: ['./start-template-tab.component.scss', '../../css/global-app.scss']
})
export class StartTemplateTabComponent implements OnInit {

    templates: Map<string, AppTemplate>;
    copyTemplates: Map<string, AppTemplate>;

    templateKeys: string[];
    copyTemplateKeys: string[];
    templateName = new FormControl("");
    selectTemplate = new FormControl("");

    isNewTemplateShown = false;

    /**
     * Event emitter that imforms the parent of this class
     * (editMetadata.component) that the editing process 
     * starts for current selected image.
     * 
     * No data are transmitted. 
     *
     */
    @Output() start = new EventEmitter();

    constructor(private _exifToolService: ExifToolService, private _editorService: EditorService) { }

    ngOnInit() {
        this.templates = new Map(this._editorService.templates);
        this.templates.set(newTemplate.name, newTemplate);
        this.templateKeys = [...this.templates.keys()];
        this.copyTemplates = new Map(this._editorService.templates);
        this.copyTemplateKeys = [...this.copyTemplates.keys()];
        this.selectTemplate.setValue(NEW_TEMPLATE);
        this.isNewTemplateShown = true;
    }

    set errorMessage(error) {
        alert("errorMessage" + error);
    }


    async startEditing() {
        try {
            // await this._exifToolService.requestMetadata();
            // this._exifToolService.requestMetadata_toEdit();
            if (this._exifToolService.metadata) {
                this.start.emit();
            } else {
                alert("startEditing error:" + this._exifToolService.errorMessage);
            }
        } catch (e) {
            alert("startEditing error:" + this._exifToolService.errorMessage);
        }

    }

    onChangeSelectTemplate(event) {
        if (event === NEW_TEMPLATE) {
            this.isNewTemplateShown = true;
        } else {
            this.isNewTemplateShown = false;
        }
    }

    onChangeCopyTemplate(event) {
        console.log(event)
    }





}
