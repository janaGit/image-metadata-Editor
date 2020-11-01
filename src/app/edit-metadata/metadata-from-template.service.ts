import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { MetadataFromMetadataTab } from '../types/metadata-from-metadata-tab.interface';
import { MetadataFromLocationTab } from '../types/metadata-from-location-tab.interface';
import { AppTemplate } from 'app/types/app-template.interface';
import { TemplateCategoriesTab } from 'app/types/template-categories-tab.interface';
import { MetadataFromImageService } from '../services/metadata-from-image.service';
import { deepCopyFunction, returnUniqueItems } from '../../../utilities/utilitiy-methods';
import { EditorService } from 'app/services/editor.service';
import { TemplateLocationTab } from 'app/types/template-location-tab.interface';
import { MetadataFromMetadataTemplateTab } from 'app/types/metadata-from-metadata-template-tab.interface';
import { EMPTY_TEMPLATE, emptyTemplate } from 'app/templates';
import { ExistingMetadataTemplateMethods } from 'app/types/existing-metadata-templete-methods.type';
import { TemplateExistingMetadata } from 'app/types/template-existing-metadata.interface';

@Injectable({
    providedIn: 'root'
})
export class MetadataFromTemplateService {

    private _templateName: string;

    private __templateName: BehaviorSubject<string> = new BehaviorSubject<string>(null);

    public templateName$ = this.__templateName.asObservable();


    private _editMetadata: MetadataFromMetadataTemplateTab;

    private __editMetadata: BehaviorSubject<MetadataFromMetadataTemplateTab> = new BehaviorSubject<MetadataFromMetadataTemplateTab>(null);

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



    private _templateObject: Object;

    private __templateObject: BehaviorSubject<Object> = new BehaviorSubject<Object>(null);

    public templateObject$ = this.__templateObject.asObservable();

    private _deletedOrAddedKeywords: string[] = [];

    constructor(
        private _metadataFromImageService: MetadataFromImageService,
        private _editorService: EditorService) {
    }

    setTemplate(template: AppTemplate) {
        const copyTemplate = deepCopyFunction(template);
        this.updateTemplateName(copyTemplate.name);
        this.updateCategories(copyTemplate.categoryTab);
        this.updateEditMetadata(copyTemplate.metadataTab);
        this.updateExistingMetadata(copyTemplate.existingMetadataTab);
        this.updateLocation(copyTemplate.locationTab);
    }

    resetTemplate() {
        this.setTemplate(emptyTemplate);
    }

    getTemplate(): AppTemplate {
        return {
            name: this._templateName,
            categoryTab: this.categories,
            existingMetadataTab: this.existingMetadata,
            locationTab: this.location,
            metadataTab: this.editMetadata
        }
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

    get metadataObject() {
        return this._templateObject;
    }

    updateTemplateName(templateName: string) {
        this._templateName = templateName;
        this.__templateName.next(templateName);
        this.updateTemplateObject();
    }

    updateEditMetadata(metadata: MetadataFromMetadataTemplateTab) {
        this._editMetadata = deepCopyFunction(metadata);
        this._deletedOrAddedKeywords = metadata.keywords;
        this._editMetadata.keywords = this.mergeImageTemplateKeywords();
        this.updateTemplateObject();
    }

    private mergeImageTemplateKeywords(): string[] {
        let keywords = this.editMetadata.keywords;
        if (this._editMetadata.areKeywordsCopiedFromImage) {
            if (this._editMetadata.areKeywordsToDeleteFromImage) {
                keywords = returnUniqueItems([].concat(this._metadataFromImageService.editMetadata.keywords.filter(keywordFromImage => typeof this.editMetadata.keywords.find(keywordFromTemplate => keywordFromImage === keywordFromTemplate) === "undefined")));
            } else {
                keywords = returnUniqueItems([...this._metadataFromImageService.editMetadata.keywords, ...this.editMetadata.keywords]);

            }
        }
        return keywords;
    }

    updateCategories(templateCategories: TemplateCategoriesTab) {
        if (templateCategories === null) {
            this._categories = templateCategories;
            this.__categories.next(templateCategories);
            return;
        }
        const allCategories: string[] = [];
        const categoriesFromImage: string[] = this._metadataFromImageService.categories || [];
        const categoriesFromTree = this.getCategoriesFromTree(templateCategories.categories, this._editorService.categoryTree);
        const supportedCategories = this._editorService.getSupportedCategories();

        if (templateCategories.categories.length > 0) {
            allCategories.push(...templateCategories.categories);
        }
        if (categoriesFromTree.length > 0) {
            allCategories.push(...categoriesFromTree);
        }



        for (let category of categoriesFromImage) {
            if (templateCategories.isSupportedCategoriesToCopy && supportedCategories.includes(category)) {
                allCategories.push(category);
            }
            if (templateCategories.isNotSupportedCategoriesToCopy && !supportedCategories.includes(category)) {
                allCategories.push(category);
            }

        }
        const uniqueCategories = allCategories.filter((item, index) => allCategories.indexOf(item) === index);
        templateCategories.categories = uniqueCategories;

        this._categories = templateCategories;
        this.__categories.next(templateCategories);
        this.updateTemplateObject();
    }

    updateExistingMetadata(existingMetadata: TemplateExistingMetadata) {
        let keys: string[] = [];
        switch (existingMetadata.method) {
            case ExistingMetadataTemplateMethods.COPY_CUSTOM:
                existingMetadata.keys.forEach(key => {
                    if (typeof this._metadataFromImageService.existingMetadata.get(key) !== "undefined") {
                        if (!this._editorService.isEditableKey(key)) {
                            keys.push(key);
                        }
                    }
                });
                break;
            case ExistingMetadataTemplateMethods.DELETE_CUSTOM:
                this._metadataFromImageService.existingMetadata.forEach((value, key) => {
                    if (!this._editorService.isEditableKey(key)) {
                        keys.push(key);
                    }
                });
                existingMetadata.keys.forEach(key => {
                    if (typeof this._metadataFromImageService.existingMetadata.get(key) !== "undefined") {
                        const index = keys.indexOf(key);
                        keys.splice(index, 1);
                    }
                });
                break;
            case ExistingMetadataTemplateMethods.COPY_ALL:
                this._metadataFromImageService.existingMetadata.forEach((value, key) => {
                    if (!this._editorService.isEditableKey(key)) {
                        keys.push(key);
                    }
                });
                break;
            case ExistingMetadataTemplateMethods.DELETE_ALL:

                break;
            default:
                throw Error("method not supported!");
        }
        existingMetadata.keys = keys;
        this._existingMetadata = existingMetadata;
        this.__existingMetadata.next(existingMetadata);
        this.updateTemplateObject();
    }

    updateLocation(location: TemplateLocationTab) {
        this._location = location;
        this.__location.next(location);
        this.updateTemplateObject();
    }

    getCategoriesFromTree(categories: string[], tree: {}): string[] {
        let nodes = [];
        for (let category of Object.keys(categories)) {
            nodes = [...nodes, ...this.getCategories(category, tree, [])];
        }
        return nodes;
    }

    getCategories(category: string, tree: {}, nodes: string[]): string[] {
        if (tree !== null) {
            for (let key of Object.keys(tree)) {
                if (category.toLowerCase().trim() === key.toLowerCase().trim()) {
                    return nodes;
                }
                return this.getCategories(category, tree[key], [...nodes, key]);
            }
        } else {
            return [];
        }

    }


    private updateTemplateObject() {
        const object = this.createTemplateObject();
        this._templateObject = object;
        this.__templateObject.next(object);
    }

    private createTemplateObject(): Object {
        const allMetadata: Object = {};
        if (this.editMetadata) {

            if (this.editMetadata.isCreatorCopiedFromImage) {
                allMetadata["Creator"] = "Copy from Image";
            } else {
                if (this.editMetadata.creator !== "" && typeof this.editMetadata.creator !== "undefined") {
                    allMetadata["Creator"] = this.editMetadata.creator;
                } else {
                    allMetadata["Creator"] = "Delete";
                }
            }



            if (this.editMetadata.isLicenseCopiedFromImage) {
                allMetadata["License"] = "Copy from Image";
            } else {
                if (this.editMetadata.license !== "" && typeof this.editMetadata.license !== "undefined") {
                    allMetadata["License"] = this.editMetadata.license;
                } else {
                    allMetadata["License"] = "Delete";
                }
            }


            if (this.editMetadata.isContactInfoCopiedFromImage) {
                allMetadata["ContactInfo"] = "Copy from Image";
            } else {
                if (this.editMetadata.contactInfo !== "" && typeof this.editMetadata.contactInfo !== "undefined") {
                    allMetadata["ContactInfo"] = this.editMetadata.contactInfo;
                } else {
                    allMetadata["ContactInfo"] = "Delete";
                }
            }


            if (this.editMetadata.areKeywordsCopiedFromImage) {
                allMetadata["Keywords"] = "Copy from Image";
                if (typeof this._deletedOrAddedKeywords!== "undefined" && this._deletedOrAddedKeywords.length > 0) {

                    if (this.editMetadata.areKeywordsToDeleteFromImage) {
                        allMetadata["Keywords"] += "; Delete:";
                        allMetadata["Keywords"] += this._deletedOrAddedKeywords.map(keyword => " " + keyword);
                    } else {
                        allMetadata["Keywords"] += "; Add:";
                        allMetadata["Keywords"] += this._deletedOrAddedKeywords.map(keyword => " " + keyword);
                    }
                }
            } else {
                if (typeof this.editMetadata.keywords !== "undefined" && this.editMetadata.keywords.length > 0) {
                    allMetadata["Keywords"] = this.editMetadata.keywords;
                } else {
                    allMetadata["Keywords"] = "Delete";
                }
            }


            if (this.editMetadata.isSubjectCopiedFromImage) {
                allMetadata["Subject"] = "Copy from Image";
            } else {
                if (this.editMetadata.subject !== "" && typeof this.editMetadata.subject !== "undefined") {
                    allMetadata["Subject"] = this.editMetadata.subject;
                } else {
                    allMetadata["Subject"] = "Delete";
                }
            }


            if (this.editMetadata.isDescriptionCopiedFromImage) {
                allMetadata["Description"] = "Copy from Image";
            } else {
                if (this.editMetadata.description !== "" && typeof this.editMetadata.description !== "undefined") {
                    allMetadata["Description"] = this.editMetadata.description;
                } else {
                    allMetadata["Description"] = "Delete";
                }
            }

        }


        if (this.existingMetadata && this.existingMetadata.method === ExistingMetadataTemplateMethods.COPY_CUSTOM) {
            allMetadata["Existing metadata"] = "Copy: " + this.existingMetadata.keys.join(", ");
        }
        if (this.existingMetadata && this.existingMetadata.method === ExistingMetadataTemplateMethods.DELETE_CUSTOM) {
            allMetadata["Existing metadata"] = "Delete: " + this.existingMetadata.keys.join(", ");
        }
        if (this.existingMetadata && this.existingMetadata.method === ExistingMetadataTemplateMethods.COPY_ALL) {
            allMetadata["Existing metadata"] = "Copy all";
        }
        if (this.existingMetadata && this.existingMetadata.method === ExistingMetadataTemplateMethods.DELETE_ALL) {
            allMetadata["Existing metadata"] = "Delete all";
        }

        if (this.categories && this.categories.categories && this.categories.categories.length > 0) {
            allMetadata["Categories"] = this.categories.categories.toString();
        }
        if (this.categories && this.categories && this.categories.isNotSupportedCategoriesToCopy) {
            allMetadata["Not supported Categories"] = "Copy from Image";
        } else {
            allMetadata["Not supported Categories"] = "Omit";
        }
        if (this.categories && this.categories && this.categories.isSupportedCategoriesToCopy) {
            allMetadata["Supported Categories"] = "Copy from Image";
        } else {
            allMetadata["Supported Categories"] = "Omit";
        }

        if (this.location && this.location.isLocationCopiedFromImage) {
            allMetadata["GPS"] = "Copy from Image";

        } else {
            if (this.location && !this.location.isLocationDisabledByDefault) {
                allMetadata["GPSLatitude"] = this.location.latitude;
                allMetadata["GPSLongitude"] = this.location.longitude;
            } else {
                allMetadata["GPS"] = "Delete";
            }
        }
        if (this.location && this.location.isTimeCopiedFromImage) {
            allMetadata["DateTime"] = "Copy from Image";

        } else {
            if (this.location && !this.location.isTimeDisabledByDefault) {
                allMetadata["DateTimeOriginal"] = this.location.dateAndTime
            } else {
                allMetadata["DateTimeOriginal"] = "Delete";
            }
        }


        return allMetadata;
    }
}
