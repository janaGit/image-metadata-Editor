import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { AppTemplate } from 'app/types/app-template.interface';
import { TemplateCategoriesTab } from 'app/types/template-categories-tab.interface';
import { MetadataFromImageService } from 'app/services/metadata-from-image.service';
import { deepCopyFunction } from '../../../utilities/utilitiy-methods';
import { EditorService } from 'app/services/editor.service';
import { TemplateLocationTab } from 'app/types/template-location-tab.interface';
import { MetadataFromMetadataTemplateTab } from 'app/types/metadata-from-metadata-template-tab.interface';
import { EMPTY_TEMPLATE, emptyTemplate } from 'app/templates';
import { ExistingMetadataTemplateMethods } from 'app/types/existing-metadata-templete-methods.type';
import { TemplateExistingMetadata } from 'app/types/template-existing-metadata.interface';

@Injectable({
    providedIn: 'root'
})
export class EditAllMetadataFromTemplateService {

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


    updateTemplateName(templateName: string) {
        this._templateName = templateName;
        this.__templateName.next(templateName);
    }

    updateEditMetadata(metadata: MetadataFromMetadataTemplateTab) {
        this._editMetadata = metadata;
        this.__editMetadata.next(metadata);
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
    }

    updateExistingMetadata(existingMetadata: TemplateExistingMetadata) {
        let keys: string[] = [];
        switch (existingMetadata.method) {
            case ExistingMetadataTemplateMethods.COPY_CUSTOM:
                existingMetadata.keys.forEach(key => {
                        if (!this._editorService.isEditableKey(key)) {
                            keys.push(key);
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
                        const index = keys.indexOf(key);
                        keys.splice(index, 1);
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
    }

    updateLocation(location: TemplateLocationTab) {
        this._location = location;
        this.__location.next(location);
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
}
