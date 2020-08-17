import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { MetadataFromMetadataTab } from 'app/types/metadata-from-metadata-tab.interface';
import { MetadataFromLocationTab } from 'app/types/metadata-from-location-tab.interface';
import { MetadataFromCategoriesTab } from 'app/types/metadata-from-categories-tab.interface';
import { map } from 'rxjs/operators';
import { ReturnObject } from 'app/types/return-object.interface';
import { HttpClient } from '@angular/common/http';
import { EditorService } from '../services/editor.service';
import { AppTemplate } from 'app/types/app-template.interface';
import { TemplateMetadataKeys } from 'app/types/template-metadata-keys.interface';
import { TemplateExistingMetadataType } from '../types/template-existing-metadata.type';

@Injectable()
export class EditTemplateService {


    private _templateName: string;

    private __templateName: BehaviorSubject<string> = new BehaviorSubject<string>(null);

    public templateName$ = this.__templateName.asObservable();



    private _editMetadata: MetadataFromMetadataTab;

    private __editMetadata: BehaviorSubject<MetadataFromMetadataTab> = new BehaviorSubject<MetadataFromMetadataTab>(null);

    public editMetadata$ = this.__editMetadata.asObservable();


    private _categories: MetadataFromCategoriesTab;

    private __categories: BehaviorSubject<MetadataFromCategoriesTab> = new BehaviorSubject<MetadataFromCategoriesTab>(null);

    public categories$ = this.__categories.asObservable();


    private _existingMetadata: TemplateExistingMetadataType;

    private __existingMetadata: BehaviorSubject<TemplateExistingMetadataType> = new BehaviorSubject<TemplateExistingMetadataType>(null);

    public existingMetadata$ = this.__existingMetadata.asObservable();



    private _location: MetadataFromLocationTab;

    private __location: BehaviorSubject<MetadataFromLocationTab> = new BehaviorSubject<MetadataFromLocationTab>(null);

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

    updateEditMetadata(metadata: MetadataFromMetadataTab) {
        this._editMetadata = metadata;
        this.__editMetadata.next(metadata);
    }

    updateCategories(categories: MetadataFromCategoriesTab) {
        this._categories = categories;
        this.__categories.next(categories);
    }

    updateExistingMetadata(existingMetadata: TemplateExistingMetadataType) {
        this._existingMetadata = existingMetadata;
        this.__existingMetadata.next(existingMetadata);
    }

    updateLocation(location: MetadataFromLocationTab) {
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
            categoryTab: this.categories,
            existingMetadataTab: this.existingMetadata,
            locationTab: this.location,
            metadataTab: this.editMetadata,
            name: this.templateName
        };

        return appTemplate;
    }

    setTemplate(template: AppTemplate) {
        this.updateCategories(template.categoryTab);
        this.updateEditMetadata(template.metadataTab);
        this.updateExistingMetadata(template.existingMetadataTab);
        this.updateLocation(template.locationTab);
        this.updateTemplateName(template.name);
    }




}