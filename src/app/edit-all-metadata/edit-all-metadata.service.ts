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
import { ExistingMetadataTemplateMethods } from 'app/types/existing-metadata-templete-methods.type';
import { ExistingMetadataTemplateTabComponent } from 'app/edit-template/existing-metadata-template-tab/existing-metadata-template-tab.component';

@Injectable({
    providedIn: 'root'
})
export class EditAllMetadataService {


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

    updateEditMetadata(metadata: MetadataFromMetadataTemplateTab) {
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


    setMetadataFromAppTemplate(template: AppTemplate) {
        this.updateTemplateName(template.name);
        this.updateExistingMetadata(template.existingMetadataTab);
        this.updateEditMetadata(template.metadataTab);
        this.updateCategories(template.categoryTab);
        this.updateLocation(template.locationTab);
    }
    getAllMetadata(): Object {
        const allMetadata: Object = {};
        if (this.editMetadata) {

            let key = "creator";[]
            if (this.editMetadata.isCreatorCopiedFromImage) {
                allMetadata["Creator"] = "Copy from Image";
            } else {
                if (this.editMetadata[key] !== "" && typeof this.editMetadata[key] !== "undefined") {
                    allMetadata["Creator"] = this.editMetadata[key];
                } else {
                    allMetadata["Creator"] = "Delete";
                }
            }


            key = "license";
            if (this.editMetadata.isCreatorCopiedFromImage) {
                allMetadata["License"] = "Copy from Image";
            } else {
                if (this.editMetadata[key] !== "" && typeof this.editMetadata[key] !== "undefined") {
                    allMetadata["License"] = this.editMetadata[key];
                } else {
                    allMetadata["License"] = "Delete";
                }
            }

            key = "contactInfo";
            if (this.editMetadata.isCreatorCopiedFromImage) {
                allMetadata["ContactInfo"] = "Copy from Image";
            } else {
                if (this.editMetadata[key] !== "" && typeof this.editMetadata[key] !== "undefined") {
                    allMetadata["ContactInfo"] = this.editMetadata[key];
                } else {
                    allMetadata["ContactInfo"] = "Delete";
                }
            }

            key = "keywords";
            if (this.editMetadata.isCreatorCopiedFromImage) {
                allMetadata["Keywords"] = "Copy from Image";
            } else {
                if (typeof this.editMetadata[key] !== "undefined" && this.editMetadata[key].length > 0) {
                    allMetadata["Keywords"] = this.editMetadata[key];
                } else {
                    allMetadata["Keywords"] = "Delete";
                }
            }

            key = "subject";
            if (this.editMetadata.isCreatorCopiedFromImage) {
                allMetadata["Subject"] = "Copy from Image";
            } else {
                if (this.editMetadata[key] !== "" && typeof this.editMetadata[key] !== "undefined") {
                    allMetadata["Subject"] = this.editMetadata[key];
                } else {
                    allMetadata["Subject"] = "Delete";
                }
            }

            key = "description";
            if (this.editMetadata.isCreatorCopiedFromImage) {
                allMetadata["Description"] = "Copy from Image";
            } else {
                if (this.editMetadata[key] !== "" && typeof this.editMetadata[key] !== "undefined") {
                    allMetadata["Description"] = this.editMetadata[key];
                } else {
                    allMetadata["Description"] = "Delete";
                }
            }

        }


        if (this.existingMetadata.method === ExistingMetadataTemplateMethods.COPY_CUSTOM) {
            allMetadata["Existing metadata"] = "Copy: " + this.existingMetadata.keys.join(", ");
        }
        if (this.existingMetadata.method === ExistingMetadataTemplateMethods.DELETE_CUSTOM) {
            allMetadata["Existing metadata"] = "Delete: " + this.existingMetadata.keys.join(", ");
        }
        if (this.existingMetadata.method === ExistingMetadataTemplateMethods.COPY_ALL) {
            allMetadata["Existing metadata"] = "Copy all";
        }
        if (this.existingMetadata.method === ExistingMetadataTemplateMethods.DELETE_ALL) {
            allMetadata["Existing metadata"] = "Delete all";
        }

        if (this.categories.categories && this.categories.categories.length > 0) {
            allMetadata["Categories"] = this.categories.categories.toString();
        }
        if (this.categories && this.categories.isNotSupportedCategoriesToCopy) {
            allMetadata["Not supported Categories"] = "Copy from Image";
        } else {
            allMetadata["Not supported Categories"] = "Omit";
        }
        if (this.categories && this.categories.isSupportedCategoriesToCopy) {
            allMetadata["Supported Categories"] = "Copy from Image";
        } else {
            allMetadata["Supported Categories"] = "Omit";
        }

        if (this.location.isLocationCopiedFromImage) {
            allMetadata["GPS"] = "Copy from Image";

        } else {
            if (!this.location.isLocationDisabledByDefault) {
                allMetadata["GPSLatitude"] = this.location.latitude;
                allMetadata["GPSLongitude"] = this.location.longitude;
            } else {
                allMetadata["GPS"] = "Delete";
            }
        }
        if (this.location.isTimeCopiedFromImage) {
            allMetadata["DateTime"] = "Copy from Image";

        } else {
            if (!this.location.isTimeDisabledByDefault) {
                allMetadata["DateTimeOriginal"] = this.location.dateAndTime
            } else {
                allMetadata["DateTimeOriginal"] = "Delete";
            }
        }


        return allMetadata;
    }

}