import { Component, OnInit, Output, EventEmitter, ChangeDetectorRef, OnDestroy } from '@angular/core';
import { ImageService } from './../../services/image.service';
import { EditorService } from './../../services/editor.service';
import { ExifToolService } from './../../services/exif-tool.service';
import { FormControl, ValidatorFn, AbstractControl, Validators } from '@angular/forms';
import { AppTemplate } from 'app/types/app-template.interface';
import { EditTemplateService } from '../edit-template.service';
import { deepCopyFunction } from '../../../../utilities/utilitiy-methods';
import { ExistingMetadataTemplateMethods } from 'app/types/existing-metadata-templete-methods.type';
import { Subscription } from 'rxjs';

const NEW_TEMPLATE = "New Template";
const newTemplate: AppTemplate = {
    name: NEW_TEMPLATE,
    categoryTab: {
        isNotSupportedCategoriesToCopy: false,
        isSupportedCategoriesToCopy: false,
        categories: []
    },
    existingMetadataTab: {
        method: ExistingMetadataTemplateMethods.COPY_ALL,
    },
    locationTab: {
        dateAndTime: undefined,
        isLocationDisabledByDefault: false,
        isTimeDisabledByDefault: false,
        latitude: undefined,
        longitude: undefined,
        isLocationCopiedFromImage: false,
        isTimeCopiedFromImage: false
    },
    metadataTab: {
        contactInfo: "",
        isContactInfoCopiedFromImage: false,
        creator: "",
        isCreatorCopiedFromImage: false,
        description: "",
        isDescriptionCopiedFromImage: false,
        keywords: [],
        areKeywordsCopiedFromImage: false,
        license: "",
        isLicenseCopiedFromImage: false,
        subject: "",
        isSubjectCopiedFromImage: false
    }
}

@Component({
    selector: 'app-start-template-tab',
    templateUrl: './start-template-tab.component.html',
    styleUrls: ['./start-template-tab.component.scss', '../../css/global-app.scss']
})
export class StartTemplateTabComponent implements OnInit, OnDestroy {

    templates: Map<string, AppTemplate> = new Map();
    copyTemplates: Map<string, AppTemplate> = new Map();

    templateKeys: string[];
    copyTemplateKeys: string[];
    templateName = new FormControl("", [Validators.required, this.templateNameValidator(new RegExp(NEW_TEMPLATE))]);
    selectTemplate = new FormControl("");
    copyTemplate = new FormControl("");

    isNewTemplateShown = false;
    isStartDisabled = false;
    templateSubscription: Subscription;

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

        this.templateSubscription = this._editorService.templates$.subscribe(templates=>{
        this.templates = new Map(templates);
        this.templates.set(newTemplate.name, deepCopyFunction(newTemplate));
        this.templateKeys = [...this.templates.keys()];


        this.copyTemplates = new Map(templates);
        this.copyTemplateKeys = [...this.copyTemplates.keys()];
        this.selectTemplate.setValue(NEW_TEMPLATE);

        })



        this.isNewTemplateShown = true;
        if(this.templateName.errors && this.isNewTemplateShown){
            this.isStartDisabled= true;
        }
    }
    ngOnDestroy(){
        this.templateSubscription.unsubscribe();
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
            if (this.templateName.errors) {
                this.isStartDisabled = true;
            }
        } else {
            this.isNewTemplateShown = false;
            this.isStartDisabled = false;
        }
    }


    templateNameValidator(nameRe: RegExp): ValidatorFn {
        return (control: AbstractControl): { [key: string]: any } | null => {
            const forbidden = nameRe.test(control.value);
            if (forbidden) {
                return { forbiddenName: { value: control.value } };
            }
            if (typeof this.copyTemplates.get(control.value) !== "undefined") {
                return { exists: { value: control.value } };
            }
            return null;
        };
    }

    onChangeTemplateName(name: string) {
        if (this.templateName.errors) {
            this.isStartDisabled = true;
        } else {
            this.isStartDisabled = false;
        }
    }


}
