import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { MetadataFromLocationTab } from 'app/types/metadata-from-location-tab.interface';
import { TemplateLocationTab } from 'app/types/template-location-tab.interface';
import { HttpClient } from '@angular/common/http';
import { EditorService } from '../services/editor.service';
import { AppTemplate } from 'app/types/app-template.interface';
import { TemplateExistingMetadataType } from '../types/template-existing-metadata.type';
import { MetadataFromMetadataTemplateTab } from 'app/types/metadata-from-metadata-template-tab.interface';
import { TemplateCategoriesTab } from 'app/types/template-categories-tab.interface';

@Injectable()
export class EditTemplateService {


    private _templateName: string;

    private __templateName: BehaviorSubject<string> = new BehaviorSubject<string>(null);

    public templateName$ = this.__templateName.asObservable();



    private _editMetadata: MetadataFromMetadataTemplateTab;

    private __editMetadata: BehaviorSubject<MetadataFromMetadataTemplateTab> = new BehaviorSubject<MetadataFromMetadataTemplateTab>(null);

    public editMetadata$ = this.__editMetadata.asObservable();


    private _categories: TemplateCategoriesTab;

    private __categories: BehaviorSubject<TemplateCategoriesTab> = new BehaviorSubject<TemplateCategoriesTab>(null);

    public categories$ = this.__categories.asObservable();


    private _existingMetadata: TemplateExistingMetadataType;

    private __existingMetadata: BehaviorSubject<TemplateExistingMetadataType> = new BehaviorSubject<TemplateExistingMetadataType>(null);

    public existingMetadata$ = this.__existingMetadata.asObservable();



    private _location: TemplateLocationTab;

    private __location: BehaviorSubject<TemplateLocationTab> = new BehaviorSubject<TemplateLocationTab>(null);

    public location$ = this.__categories.asObservable();




    constructor(private _http: HttpClient, private _editorService: EditorService) {
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

    updateEditMetadata(metadata: MetadataFromMetadataTemplateTab) {
        this._editMetadata = metadata;
        this.__editMetadata.next(metadata);
    }

    updateCategories(categories: TemplateCategoriesTab) {
        this._categories = categories;
        this.__categories.next(categories);
    }

    updateExistingMetadata(existingMetadata: TemplateExistingMetadataType) {
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

    returnTemplate(): AppTemplate {
        const appTemplate: AppTemplate = {
            name: this.templateName,
            existingMetadataTab: this.existingMetadata,
            metadataTab: this.editMetadata,
            categoryTab: this.categories,
            locationTab: this.location,
        };

        return appTemplate;
    }

    setTemplate(template: AppTemplate) {
        this.updateTemplateName(template.name);
        this.updateExistingMetadata(template.existingMetadataTab); 
        this.updateEditMetadata(template.metadataTab);
        this.updateCategories(template.categoryTab);
        this.updateLocation(template.locationTab);
    }




}