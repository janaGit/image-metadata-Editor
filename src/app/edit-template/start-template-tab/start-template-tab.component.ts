import { Component, OnInit, Output, EventEmitter, ChangeDetectorRef } from '@angular/core';
import { ImageService } from './../../services/image.service';
import { EditorService } from './../../services/editor.service';
import { ExifToolService } from './../../services/exif-tool.service';
import { FormControl, ValidatorFn, AbstractControl, Validators } from '@angular/forms';
import { AppTemplate } from 'app/types/app-template.interface';
import { EditTemplateService } from '../edit-template.service';
import { deepCopyFunction } from '../../../../utilities/utilitiy-methods';

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
    templateName = new FormControl("", [Validators.required, this.templateNameValidator(new RegExp(NEW_TEMPLATE))]);
    selectTemplate = new FormControl("");
    copyTemplate = new FormControl("");

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

    constructor(private _exifToolService: ExifToolService, private _editorService: EditorService, private _editTemplateService: EditTemplateService) { }

    ngOnInit() {
        this.templates = new Map(this._editorService.templates);
        this.templates.set(newTemplate.name, deepCopyFunction(newTemplate));
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
        let template: AppTemplate;
        if (this.selectTemplate.value === NEW_TEMPLATE) {
        
            if (this.copyTemplate.value !== "") {
                template = this.copyTemplates.get(this.copyTemplate.value);
            } else {
                template = this.templates.get(NEW_TEMPLATE);
            }
            template.name = this.templateName.value;
        } else {
            template = this.copyTemplates.get(this.selectTemplate.value);
        }
        this._editTemplateService.setTemplate(template);
        this.start.emit();
    }

    onChangeSelectTemplate(event) {
        if (event === NEW_TEMPLATE) {
            this.isNewTemplateShown = true;
        } else {
            this.isNewTemplateShown = false;
        }
    }


    templateNameValidator(nameRe: RegExp): ValidatorFn {
        return (control: AbstractControl): { [key: string]: any } | null => {
            const forbidden = nameRe.test(control.value);
            return forbidden ? { forbiddenName: { value: control.value } } : null;
        };
    }



}
