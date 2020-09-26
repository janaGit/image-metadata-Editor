import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { MetadataFromLocationTab } from 'app/types/metadata-from-location-tab.interface';
import { TemplateLocationTab } from 'app/types/template-location-tab.interface';
import { HttpClient } from '@angular/common/http';
import { EditorService } from '../services/editor.service';
import { AppTemplate } from 'app/types/app-template.interface';
import { MetadataFromMetadataTemplateTab } from 'app/types/metadata-from-metadata-template-tab.interface';
import { TemplateCategoriesTab } from 'app/types/template-categories-tab.interface';
import { TemplateExistingMetadata } from 'app/types/template-existing-metadata.interface';
import { MetadataFromImageService } from 'app/services/metadata-from-image.service';
import { MetadataFromMetadataTab } from 'app/types/metadata-from-metadata-tab.interface';

@Injectable({
    providedIn: 'root'
})
export class EditAllMetadataService {


    private _templateName: string;

    private __templateName: BehaviorSubject<string> = new BehaviorSubject<string>(null);

    public templateName$ = this.__templateName.asObservable();



    private _editMetadata: MetadataFromMetadataTab;

    private __editMetadata: BehaviorSubject<MetadataFromMetadataTab> = new BehaviorSubject<MetadataFromMetadataTab>(null);

    public editMetadata$ = this.__editMetadata.asObservable();


    private _categories: TemplateCategoriesTab;

    private __categories: BehaviorSubject<TemplateCategoriesTab> = new BehaviorSubject<TemplateCategoriesTab>(null);

    public categories$ = this.__categories.asObservable();


    private _existingMetadata: TemplateExistingMetadata;

    private __existingMetadata: BehaviorSubject<TemplateExistingMetadata> = new BehaviorSubject<TemplateExistingMetadata>(null);

    public existingMetadata$ = this.__existingMetadata.asObservable();



    private _location: TemplateLocationTab;

    private __location: BehaviorSubject<TemplateLocationTab> = new BehaviorSubject<TemplateLocationTab>(null);

    public location$ = this.__categories.asObservable();




    constructor(private _http: HttpClient, private _editorService: EditorService, private _metadataFromImageService: MetadataFromImageService) {
    }
    get templateName() {
        return this._templateName;
    }

    get editMetadata() {
        return this._editMetadata;
    }

    get categories() {
        return this._categories;
    }

    get existingMetadata() {
        return this._existingMetadata;
    }

    get location() {
        return this._location;
    }

    updateTemplateName(templateName: string) {
        this._templateName = templateName;
        this.__templateName.next(templateName);
    }

    updateEditMetadata(metadata: MetadataFromMetadataTab) {
        this._editMetadata = metadata;
        this.__editMetadata.next(metadata);
    }

    updateCategories(categories: TemplateCategoriesTab) {
        this._categories = categories;
        this.__categories.next(categories);
    }

    updateExistingMetadata(existingMetadata: TemplateExistingMetadata) {
        this._existingMetadata = existingMetadata;
        this.__existingMetadata.next(existingMetadata);
    }

    updateLocation(location: TemplateLocationTab) {
        this._location = location;
        this.__location.next(location);
    }

    resetMetadata() {
        this.updateExistingMetadata(null);
        this.updateEditMetadata(null);
        this.updateCategories(null);
        this.updateLocation(null);
    }


    setTemplate(template: AppTemplate) {
        this.updateTemplateName(template.name);
        this.updateExistingMetadata(template.existingMetadataTab); 
        this.updateEditMetadata(template.metadataTab);
        this.updateCategories(template.categoryTab);
        this.updateLocation(template.locationTab);
    }

    setMetadataFromAppTemplate(template: AppTemplate) {
        this.updateEditMetadata({
            creator: template.metadataTab.isCreatorCopiedFromImage ? this._metadataFromImageService.editMetadata.creator : template.metadataTab.creator,
            contactInfo: template.metadataTab.isContactInfoCopiedFromImage ? this._metadataFromImageService.editMetadata.contactInfo : template.metadataTab.contactInfo,
            license: template.metadataTab.isLicenseCopiedFromImage ? this._metadataFromImageService.editMetadata.license : template.metadataTab.license,
            keywords: template.metadataTab.areKeywordsCopiedFromImage ? [...this._metadataFromImageService.editMetadata.keywords] : [...template.metadataTab.keywords],
            subject: template.metadataTab.isSubjectCopiedFromImage ? this._metadataFromImageService.editMetadata.subject : template.metadataTab.subject,
            description: template.metadataTab.isDescriptionCopiedFromImage ? this._metadataFromImageService.editMetadata.description : template.metadataTab.description
        });

    
    }


}