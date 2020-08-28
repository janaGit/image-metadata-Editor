import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { MetadataFromMetadataTab } from '../types/metadata-from-metadata-tab.interface';
import { MetadataFromLocationTab } from '../types/metadata-from-location-tab.interface';
import { AppTemplate } from 'app/types/app-template.interface';
import { TemplateExistingMetadataType } from 'app/types/template-existing-metadata.type';

@Injectable({
    providedIn: 'root'
})
export class MetadataFromTemplateService {

    private _templateName: string;

    private __templateName: BehaviorSubject<string> = new BehaviorSubject<string>(null);

    public templateName$ = this.__templateName.asObservable();


    private _editMetadata: MetadataFromMetadataTab;

    private __editMetadata: BehaviorSubject<MetadataFromMetadataTab> = new BehaviorSubject<MetadataFromMetadataTab>(null);

    public editMetadata$ = this.__editMetadata.asObservable();


    private _categories: string[];

    private __categories: BehaviorSubject<string[]> = new BehaviorSubject<string[]>(["Animal", "Feciduous Forest", "Buildings", "Open Fields", "See", "Test", "Test2"]);

    public categories$ = this.__categories.asObservable();


    private _existingMetadata: TemplateExistingMetadataType;

    private __existingMetadata: BehaviorSubject<TemplateExistingMetadataType> = new BehaviorSubject<TemplateExistingMetadataType>(null);

    public existingMetadata$ = this.__existingMetadata.asObservable();



    private _location: MetadataFromLocationTab;

    private __location: BehaviorSubject<MetadataFromLocationTab> = new BehaviorSubject<MetadataFromLocationTab>(null);

    public location$ = this.__categories.asObservable();




    constructor() {
    }

    setTemplate(template: AppTemplate) {
        this.updateTemplateName(template.name);
        this.updateCategories(template.categoryTab);
        this.updateEditMetadata(template.metadataTab);
        this.updateExistingMetadata(template.existingMetadataTab);
        this.updateLocation(template.locationTab);
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

    updateEditMetadata(metadata) {
        this._editMetadata = metadata;
        this.__editMetadata.next(metadata);
    }

    updateCategories(categories) {
        this._categories = categories;
        this.__categories.next(categories);
    }

    updateExistingMetadata(existingMetadata: TemplateExistingMetadataType) {
        this._existingMetadata = existingMetadata;
        this.__existingMetadata.next(existingMetadata);
    }

    updateLocation(location) {
        this._location = location;
        this.__location.next(location);
    }
}
